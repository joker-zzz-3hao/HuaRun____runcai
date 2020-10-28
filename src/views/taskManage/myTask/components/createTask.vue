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
      <div class="drawer-title">创建任务</div>
    </div>
    <el-scrollbar>
      <div class="cont-box">
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
              class="tl-input"
            ></el-input>
          </el-form-item>
          <div class="item-flex">
            <el-form-item label="指派给" prop="taskUserId">
              <el-select
                v-model.trim="formData.taskUserId"
                placeholder="添加执行人"
                popper-class="tl-select-dropdown set-manage"
                class="tl-select"
                filterable
              >
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                >
                  <dl>
                    <dd>
                      <em>{{ item.userName }}</em>
                      <em v-if="item.userAccount">{{
                        `(${item.userAccount})`
                      }}</em>
                      <el-checkbox
                        v-model="item.checkStatus"
                        class="tl-checkbox"
                      ></el-checkbox>
                    </dd>
                  </dl>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="优先级" prop="taskLevel">
              <el-select
                v-model.trim="formData.taskLevel"
                placeholder="请选择优先级"
                popper-class="tl-select-dropdown"
                class="tl-select"
              >
                <el-option
                  v-for="item in CONST.PRIORITY_LIST"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <tl-levelblock :value="item.value"></tl-levelblock>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="任务时间" prop="timeVal">
            <el-date-picker
              v-model.trim="formData.timeVal"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              popper-class="tl-range-popper"
              class="tl-range-editor"
            >
              ></el-date-picker
            >
          </el-form-item>
          <el-form-item label="任务描述" prop="taskDesc">
            <el-input
              placeholder="请输入任务描述"
              type="textarea"
              :rows="5"
              maxlength="800"
              show-word-limit
              v-model="formData.taskDesc"
              resize="none"
              class="tl-textarea"
            ></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <file-upload
              ref="fileUpload"
              :fileList="fileList"
              :limit="10"
              @change="fileChange"
            ></file-upload>

            <!-- <el-upload
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
          </el-upload> -->
          </el-form-item>
        </el-form>
      </div>
    </el-scrollbar>
    <div class="operating-box">
      <div class="flex-auto">
        <el-button
          plain
          class="tl-btn amt-border-fadeout"
          @click="save"
          :loading="loading"
          >暂存</el-button
        >
      </div>
      <el-button
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="summitAssign"
        :loading="loading"
        >指派</el-button
      >
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
  </el-drawer>
</template>

<script>
import { mapState } from 'vuex';
import fileUpload from '@/components/fileUpload/index';
import levelblock from '@/components/levelblock';
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
      // 文件
      acceptType: '.jpeg, .jpg, .png, .bmp, .gif, .tif, .word, .excel, .txt, .ppt, .pptx',
      dataParams: { validateCode: '', ...this.params },
      fileList: [], // 文件列表
      loading: false,
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      orgFullId: (state) => state.orgFullId,
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
    'file-upload': fileUpload,
    'tl-levelblock': levelblock,
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
          this.okrList = res.data.okrDetails || [];
          console.log(res.data);
        }
      });
    },
    getUserList() {
      this.server.listOrgUserPage({ orgFullId: this.orgFullId }).then((res) => {
        if (res.code == 200) {
          this.userList = res.data;
        }
      });
    },
    getProcess() {
      this.server.queryProcess({
        currentPage: 1,
        pageSize: 1000,
        enable: 1,
      }).then((res) => {
        if (res.code == 200) {
          this.processList = res.data.content || [];
        }
      });
    },
    // 文件
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
    fileChange(data) {
      this.fileList = data.list;
      console.log(this.fileList);
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
        attachmentList: this.fileList, // TODO: 附件
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
        innerType: 0, // 用户创建
      };
      return params;
    },
    save() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const params = this.handlerData();
          this.loading = true;
          this.server.saveTask(params).then((res) => {
            if (res.code == 200) {
              this.$message.success('保存成功');
              this.$emit('success');
              this.close();
            }
            this.loading = false;
          });
        }
      });
    },
    summitAssign() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const params = this.handlerData();
          if (!this.formData.taskUserId) {
            this.$message.error('请选择执行人');
            return;
          }
          this.loading = true;
          this.server.appointSave(params).then((res) => {
            if (res.code == 200) {
              this.$message.success('提交成功');
              this.$emit('success');
              this.close();
            }
            this.loading = false;
          });
        }
      });
    },
  },
  watch: {
    'formData.taskUserId': {
      handler(newVal) {
        if (newVal) {
          this.userList.forEach((item) => {
            if (newVal == item.userId) {
              item.checkStatus = true;
            } else {
              item.checkStatus = false;
            }
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style>
</style>