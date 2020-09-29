<template>
  <el-drawer
    :wrapperClosable="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    title="编辑任务"
    :visible.sync="visible"
    @closed="closed"
    :before-close="close"
    custom-class="custom-drawer create-task create-okr"
    class="tl-drawer"
  >
    <el-scrollbar>
      <div class="task-fenlan">
        <el-form :model="formData" class="tl-form">
          <dl>
            <dt>
              <el-form-item prop="title">
                <el-input
                  type="text"
                  placeholder="请输入任务标题"
                  v-model="formData.taskTitle"
                  maxlength="100"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <!-- 更多操作 -->
              <div>
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click="deleteTask"
                      >删除</el-dropdown-item
                    >
                    <el-dropdown-item @click="filedTask"
                      >任务归档</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </dt>
            <dd>
              <el-form-item label="设置执行人" prop="executor">
                <el-select
                  v-model="formData.taskUserId"
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
                    <el-avatar
                      :size="30"
                      :src="item.headUrl"
                      @error="errorHandler"
                    >
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
                  v-model="formData.taskLevel"
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
            </dd>
            <dd>
              <el-form-item label="归属项目" prop="projectVal">
                <el-input
                  v-model.trim="formData.projectName"
                  placeholder="请选择归属项目"
                  maxlength="0"
                  @focus="projectInputFocus()"
                ></el-input>
              </el-form-item>
              <el-form-item label="归属OKR" prop="okrDetailId">
                <el-select
                  v-model="formData.okrDetailId"
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
                  v-model="formData.processId"
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
              <el-form-item label="时长统计">
                <span>当前已用时长 0天 0小时 0分</span>
              </el-form-item>
              <div class="tl-progress-group">
                <tl-process
                  :data="parseInt(formData.taskProgress, 10)"
                  :showNumber="false"
                  :width="64"
                  :marginLeft="6"
                ></tl-process>
                <el-slider
                  v-model="formData.taskProgress"
                  :step="1"
                  tooltip-class="slider-tooltip"
                ></el-slider>
                <el-input-number
                  v-model="formData.taskProgress"
                  controls-position="right"
                  :min="0"
                  :max="100"
                  :step="1"
                  :precision="0"
                  class="tl-input-number"
                  @focus="showRemark = true"
                ></el-input-number>
                <span>%</span>
              </div>
              <el-form-item
                v-if="showRemark"
                label="进度更新原因说明"
                prop="taskProgressRemark"
                :rules="[
                  {
                    required: true,
                    trigger: 'blur',
                    message: '请输入更新原因',
                  },
                ]"
              >
                <el-input
                  type="textarea"
                  :rows="3"
                  maxlength="220"
                  placeholder="请输入进度更新原因"
                  v-model="formData.taskProgressRemark"
                ></el-input>
              </el-form-item>
              <el-form-item label="添加描述" prop="taskDesc">
                <quill-editor
                  v-model.trim="formData.taskDesc"
                  ref="myQuillEditor"
                  :options="editorOption"
                ></quill-editor>
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
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">
                    最多上传10个文件，单个文件不超过30M
                  </div>
                </el-upload>
              </el-form-item>
            </dd>
          </dl>
        </el-form>
        <!-- 右侧 -->
        <div class="task-tab">
          <el-tabs v-model="selectTab">
            <el-tab-pane
              label="操作历史"
              name="history"
              class="tl-custom-timeline"
            >
              <dl class="timeline-list">
                <dd v-for="item in historyList" :key="item.operationId">
                  <div class="list-info">
                    <div class="list-title">{{ item.createTime }}</div>
                    <div class="list-cont">
                      {{ item.userName }}{{ item.remark }}
                    </div>
                  </div>
                </dd>
              </dl>
            </el-tab-pane>
            <el-tab-pane label="进度更新说明" name="update">
              <ul>
                <li v-for="item in updateList" :key="item.id">
                  <span>进度更新为：{{ item.process }}%</span>
                  <span>进度更新说明：{{ item.reason }}</span>
                  <span>操作人：{{ item.name }}</span>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-scrollbar>
    <div class="operating-box">
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
      <el-button
        v-if="formData.taskStatus == 0"
        plain
        class="tl-btn amt-border-fadeout"
        @click="save"
        >暂存</el-button
      >
      <el-button
        v-if="
          formData.taskStatus == 10 && formData.taskUserId == userInfo.userId
        "
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="acceptTask"
        >确认接收</el-button
      >
      <el-button
        v-else
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="summitAssign"
      >
        <span v-if="formData.taskStatus == 0">确认指派</span>
        <span v-else>确认</span>
      </el-button>
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
import { quillEditor } from 'vue-quill-editor';// 引入ue富文本组件vue-quill-editor
import process from '@/components/process';
import selectProject from './selectProject';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'editTask',
  components: {
    'quill-editor': quillEditor,
    'tl-selectproject': selectProject,
    'tl-process': process,
  },
  data() {
    return {
      CONST,
      server,
      formData: {
        title: '',
        timeVal: [new Date(2020, 8, 1, 10, 10), new Date(2020, 9, 11, 10, 10)],
        taskLevel: 1,
        projectVal: '',
        okrVal: '',
        processVal: '',
        processNum: 0,
      },
      okrList: [], // 归属okr列表
      projectList: [], // 项目列表
      userList: [], // 执行人列表
      processList: [], // 过程列表
      showRemark: false,
      selectTab: 'history',
      historyList: [{
        name: '张三', title: '关于润才平台产品市场竞品调研', reason: '因11111任务属于错误输入的任务', time: '1小时前',
      }],
      updateList: [{
        name: '李四', reason: '因11111任务属于错误输入的任务', process: 20,
      }],
      fileList: [],
      visible: false,
      showProjectDialog: false,
      // 文件
      acceptType: '.jpeg, .jpg, .png, .bmp, .gif, .tif, .word, .excel, .txt, .ppt, .pptx',
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

  created() {

  },
  methods: {
    show(id) {
      this.visible = true;
      this.getUserList();
      this.queryOkr();
      this.getProcess();
      if (id) {
        this.server.queryTaskDetail({ taskId: id }).then((res) => {
          if (res.code == 200 && res.data) {
            console.log(res.data);
            this.formData = res.data;
            if (res.data.taskBegDate) {
              let taskBegDate = '';
              let taskEndDate = '';
              taskBegDate = res.data.taskBegDate.split(' ')[0] || '';
              taskEndDate = res.data.taskEndDate.split(' ')[0] || '';
              this.formData.timeVal = [taskBegDate, taskEndDate];
            }
            this.historyList = res.data.operationList;
          }
        });
      }
    },
    close() {
      this.visible = false;
    },
    closed() {
      this.$emit('update:existEditTask', false);
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
      this.server.queryProcess().then((res) => {
        if (res.code == 200) {
          this.processList = res.data;
        }
      });
    },
    // 选择项目
    projectInputFocus() {
      this.showProjectDialog = true;
      this.$nextTick(() => {
        this.$refs.selectProject.show();
      });
    },
    closeProjectDia(data) {
      this.formData.projectVal = data.project;
    },
    // 文件
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

    save() {
      const okrVal = this.okrList.filter((item) => item.okrDetailId == this.formData.okrDetailId)[0] || {};
      const userVal = this.userList.filter((item) => item.userId == this.formData.executor)[0] || {};
      this.formData.okrDetailName = okrVal.okrDetailObjectKr;
      this.formData.userName = userVal.userName;
      if (this.formData.projectVal) {
        this.formData.projectId = this.formData.projectVal.projectId;
        this.formData.projectName = this.formData.projectVal.projectNameCn;
      }

      if (this.formData.timeVal) {
        this.formData.taskBegDate = `${this.formData.timeVal[0]}  00:00:00` || null;
        this.formData.taskEndDate = `${this.formData.timeVal[1]}  23:59:59` || null;
      }
      this.server.saveTask(this.formData).then((res) => {
        if (res.code == 200) {
          this.$message.success('保存成功');
          this.close();
          this.$emit('success');
        }
      });
    },
    deleteTask() {
      this.$xconfirm({
        content: '确定要删除这个任务吗？',
        title: '删除任务',
      }).then(() => {
        // 提交确认弹窗
        this.server.deleteTask({ taskId: this.formData.taskId }).then((res) => {
          if (res.code == 200) {
            this.$message.success('删除成功');
            this.close();
            this.$emit('success');
          }
        });
      }).catch(() => {});
    },
    filedTask() {
      this.server.filedTask({ taskId: this.formData.taskId }).then((res) => {
        if (res.code == 200) {
          this.$message.success('归档成功');
          this.close();
          this.$emit('success');
        }
      });
    },
    acceptTask() {
      this.server.acceptTask({ taskId: this.formData.taskId }).then((res) => {
        if (res.code == 200) {
          this.$message.success('接收成功');
          this.close();
          this.$emit('success');
        }
      });
    },
    summitAssign() {
      const okrVal = this.okrList.filter((item) => item.okrDetailId == this.formData.okrDetailId)[0] || {};
      const userVal = this.userList.filter((item) => item.userId == this.formData.executor)[0] || {};
      this.formData.okrDetailName = okrVal.okrDetailObjectKr;
      this.formData.userName = userVal.userName;
      if (this.formData.projectVal) {
        this.formData.projectId = this.formData.projectVal.projectId;
        this.formData.projectName = this.formData.projectVal.projectNameCn;
      }

      if (this.formData.timeVal) {
        this.formData.taskBegDate = `${this.formData.timeVal[0]}  00:00:00` || null;
        this.formData.taskEndDate = `${this.formData.timeVal[1]}  23:59:59` || null;
      }
      this.server.appointSave(this.formData).then((res) => {
        if (res.code == 200) {
          this.$message.success('指派成功');
          this.$emit('success');
          this.close();
        }
      });
    },

  },
};
</script>

<style>
</style>