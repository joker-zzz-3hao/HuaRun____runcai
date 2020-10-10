<template>
  <el-drawer
    :wrapperClosable="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    :visible.sync="visible"
    @closed="closed"
    :before-close="close"
    custom-class="custom-drawer create-task"
    class="tl-drawer"
  >
    <div slot="title" class="flex-sb">
      <div class="drawer-title">添加任务</div>
    </div>
    <el-scrollbar>
      <el-form ref="dataForm" :model="formData" class="tl-form">
        <el-form-item
          prop="taskTitle"
          label="任务标题"
          :rules="[
            { required: true, trigger: 'blur', message: '请输入任务标题' },
          ]"
        >
          <el-input
            type="text"
            placeholder="请输入任务标题"
            v-model.trim="formData.taskTitle"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="设置执行人" prop="taskUserId">
          <el-select
            v-model.trim="formData.taskUserId"
            placeholder="添加执行人"
            filterable
            remote
            :remote-method="getUserList"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            >
              <el-avatar :size="30" :src="item.headUrl" @error="errorHandler">
                <div v-if="item.userName" class="user-name">
                  <em>{{
                    item.userName.substring(item.userName.length - 2)
                  }}</em>
                </div>
              </el-avatar>
              <span>{{ item.userName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设置时间" prop="timeVal">
          <el-date-picker
            v-model.trim="formData.timeVal"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
            ></el-date-picker
          >
        </el-form-item>
        <el-form-item label="优先级" prop="taskLevel">
          <el-select
            v-model.trim="formData.taskLevel"
            placeholder="请选择优先级"
          >
            <el-option
              v-for="item in CONST.PRIORITY_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属项目" prop="projectVal">
          <el-input
            v-model.trim="formData.projectVal.projectNameCn"
            placeholder="请选择归属项目"
            maxlength="0"
            @focus="projectInputFocus()"
          ></el-input>
        </el-form-item>
        <el-form-item label="归属OKR" prop="okrDetailId">
          <el-select
            v-model.trim="formData.okrDetailId"
            placeholder="请选择归属OKR"
          >
            <el-option
              v-for="item in okrList"
              :key="item.okrDetailId"
              :label="item.okrDetailObjectKr"
              :value="item.okrDetailId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属任务过程" prop="processId">
          <el-select
            v-model.trim="formData.processId"
            placeholder="请选择任务过程"
          >
            <el-option
              v-for="item in processList"
              :key="item.processId"
              :label="item.processName"
              :value="item.processId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加描述" prop="taskDesc">
          <el-input
            type="textarea"
            :rows="5"
            maxlength="800"
            show-word-limit
            v-model="formData.taskDesc"
            resize="none"
          ></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            class="upload-demo"
            :action="action"
            :accept="acceptType"
            :before-upload="beforeUpload"
            :headers="headers"
            multiple
            :limit="10"
            :file-list="formData.fileList"
            :data="dataParams"
          >
            <el-button size="small" type="primary">添加附件</el-button>
            <div slot="tip" class="el-upload__tip">
              最多上传10个文件，单个文件不超过30M
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div class="operating-box">
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
      <el-button plain class="tl-btn amt-border-fadeout" @click="save"
        >暂存</el-button
      >
      <el-button type="primary" class="tl-btn amt-bg-slip" @click="summitAssign"
        >确认指派</el-button
      >
    </div>
    <tl-selectproject
      ref="selectProject"
      :showProjectDialog.sync="showProjectDialog"
      v-if="showProjectDialog"
      :server="server"
      @closeProjectDia="closeProjectDia"
    ></tl-selectproject>
  </el-drawer>
</template>

<script>
import { mapState } from 'vuex';
import selectProject from './selectProject';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'createTask',
  data() {
    return {
      CONST,
      server,
      formData: {
        taskTitle: null,
        timeVal: '',
        taskLevel: 10,
        projectVal: {},
        okrDetailId: null,
        processId: null,
        processNum: 0,
        taskDesc: null,
        taskUserId: null,
        fileList: [], // 文件列表
      },
      okrList: [], // 归属okr列表
      projectList: [], // 项目列表
      userList: [], // 执行人列表
      processList: [], // 过程列表
      historyList: [{
        name: '张三', title: '关于润才平台产品市场竞品调研', reason: '因11111任务属于错误输入的任务', time: '1小时前',
      }],
      updateList: [{
        name: '李四', reason: '因11111任务属于错误输入的任务', process: 20,
      }],
      visible: false,
      // 富文本编辑器
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'image'], // toggled buttons
              [{ header: 1 }, { header: 2 }],
              [{ color: [] }],
            ], // 工具栏
          },
        },
      },
      showProjectDialog: false,
      // 文件
      acceptType: '.jpeg, .jpg, .png, .bmp, .gif, .tif, .word, .excel, .txt, .ppt, .pptx',
      dataParams: { validateCode: '', ...this.params },
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
    action() {
      const origin = window.location.origin
        ? window.location.origin
        : window.location.href.split('/#')[0];
      return `${origin}/gateway/system-service/sys/attachment/upload`;
    },
    headers() {
      return { token: localStorage.token };
    },
  },
  components: {
    'tl-selectproject': selectProject,
  },
  created() {

  },
  methods: {
    show() {
      this.queryOkr();
      this.getUserList();
      this.getProcess();
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    closed() {
      this.$emit('update:existCreatetask', false);
    },
    queryOkr() {
      const params = {
        myOrOrg: 'org',
        status: '1',
        orgId: this.userInfo.orgId,
      };
      this.server.queryOkr(params).then((res) => {
        if (res.code == 200) {
          this.okrList = res.data.okrDetails;
          console.log(res.data);
        }
      });
    },
    getUserList(name = '') {
      const params = {
        currentPage: 1,
        pageSize: 20,
        orgFullId: this.userInfo.orgList[0].orgFullId,
        userName: name.trim(),
      };
      this.server.getUserListByOrgId(params).then((res) => {
        if (res.code == 200) {
          this.userList = res.data.content;
        }
      });
    },
    getProcess() {
      this.server.queryProcess({
        currentPage: 1,
        pageSize: 1000,
      }).then((res) => {
        if (res.code == 200) {
          this.processList = res.data.content || [];
        }
      });
    },
    // lengthChange(data) {
    //   const str = data.html.replace(/<[^>]+>/g, '');
    //   this.amount = str.length;
    //   this.$refs.dataForm.validateField('taskDesc');
    //   if (str.length > 500) {
    //     this.$refs.dataForm.validateField('taskDesc');
    //     // this.$Message.error({ content: '内容长度最大为500', duration: 3 });
    //   }
    // },
    projectInputFocus() {
      this.showProjectDialog = true;
      this.$nextTick(() => {
        this.$refs.selectProject.show();
      });
    },
    closeProjectDia(data) {
      this.formData.projectVal = data.project;
    },
    errorHandler() {
      return true;
    },
    beforeUpload(file) {
      console.log(file.type);
      const self = this;
      const maxLength = file.size / 1024 / 1024;
      if (maxLength > 30) {
        self.$message.error(
          '上传文件大小不能超过30MB',
        );
        return false;
      }
    },
    handlerData() {
      const okrVal = this.okrList.filter((item) => item.okrDetailId == this.formData.okrDetailId)[0] || {};
      const userVal = this.userList.filter((item) => item.userId == this.formData.taskUserId)[0] || {};
      let taskBegDate = null;
      let taskEndDate = null;
      if (this.formData.timeVal) {
        taskBegDate = `${this.formData.timeVal[0]}  00:00:00` || null;
        taskEndDate = `${this.formData.timeVal[1]}  23:59:59` || null;
      }
      const params = {
        attachmentList: [], // TODO: 附件
        // headerHrl: '',
        okrDetailId: this.formData.okrDetailId,
        okrDetailName: okrVal.okrDetailObjectKr,
        processId: this.formData.processId,
        projectId: this.formData.projectVal.projectId,
        projectName: this.formData.projectVal.projectNameCn,
        taskDesc: this.formData.taskDesc,
        taskBegDate,
        taskEndDate,
        taskLevel: this.formData.taskLevel,
        taskProgress: 0,
        taskTitle: this.formData.taskTitle,
        taskUserId: this.formData.taskUserId,
        userName: userVal.userName,
      };
      return params;
    },
    save() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const params = this.handlerData();
          console.log(this.handlerData());
          this.server.saveTask(params).then((res) => {
            if (res.code == 200) {
              this.$message.success('保存成功');
              this.$emit('success');
              this.close();
            }
          });
        }
      });
    },
    summitAssign() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const params = this.handlerData();
          this.server.appointSave(params).then((res) => {
            if (res.code == 200) {
              this.$message.success('提交成功');
              this.$emit('success');
              this.close();
            }
          });
        }
      });
    },
  },
};
</script>

<style>
</style>