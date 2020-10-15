<template>
  <el-drawer
    :wrapperClosable="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    title="任务"
    :visible.sync="visible"
    @closed="closed"
    :before-close="close"
    custom-class="custom-drawer create-task create-okr"
    class="tl-drawer"
  >
    <el-scrollbar>
      <div class="task-fenlan">
        <el-form ref="dataForm" :model="formData" class="tl-form">
          <dl>
            <dt>
              <el-form-item
                prop="taskTitle"
                :rules="[
                  {
                    required: true,
                    trigger: 'blur',
                    message: '请输入任务标题',
                  },
                ]"
              >
                <el-input
                  :disabled="canEdit"
                  type="text"
                  placeholder="请输入任务标题"
                  v-model.trim="formData.taskTitle"
                  maxlength="100"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <div>
                <span>创建时间：</span>
                <em>{{ formData.createTime }}</em>
              </div>
              <!-- 更多操作 -->
              <div>
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="deleteTask"
                      :disabled="formData.taskStatus !== 0"
                      >删除</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click.native="filedTask"
                      :disabled="formData.taskProgress != 100"
                      >任务归档</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </dt>
            <dd>
              <el-form-item label="设置执行人">
                <el-select
                  :disabled="canEdit"
                  v-model.trim="formData.taskUserId"
                  placeholder="无执行人"
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
                  :disabled="canEdit"
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
                  :disabled="canEdit"
                  v-model.trim="formData.taskLevel"
                  placeholder="请选择优先级"
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
            </dd>
            <dd>
              <el-form-item label="归属项目" prop="projectVal">
                <el-select
                  v-model.trim="formData.projectId"
                  placeholder="请选择关联项目"
                  @change="projectChange(scope.row)"
                  class="tl-select"
                >
                  <el-option
                    v-for="item in projectList"
                    :key="item.projectId"
                    :label="item.projectNameCn"
                    :value="item.projectId"
                  >
                  </el-option>
                </el-select>
                <!-- <el-input
                  :disabled="canEdit"
                  v-model.trim="formData.projectName"
                  placeholder="请选择归属项目"
                  maxlength="0"
                  @focus="projectInputFocus()"
                ></el-input> -->
              </el-form-item>
              <el-form-item label="归属OKR" prop="okrDetailId">
                <el-select
                  :disabled="canEdit"
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
                  :disabled="canEdit"
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
              <el-form-item label="时长统计">
                <span>{{ formData.timeSum }}</span>
              </el-form-item>
              <el-form-item label="当前进度">
                <div class="tl-progress-group">
                  <tl-process
                    :data="parseInt(formData.taskProgress, 10)"
                    :showNumber="false"
                    :width="64"
                    :marginLeft="6"
                  ></tl-process>
                  <el-slider
                    :disabled="canEdit"
                    v-model.trim="formData.taskProgress"
                    :step="1"
                    tooltip-class="slider-tooltip"
                    @change="showRemark = true"
                  ></el-slider>
                  <el-input-number
                    :disabled="canEdit"
                    v-model.trim="formData.taskProgress"
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
              </el-form-item>
              <el-form-item
                v-if="showRemark"
                label="进度更新原因说明"
                prop="taskProgressRemark"
              >
                <el-input
                  :disabled="canEdit"
                  type="textarea"
                  :rows="3"
                  maxlength="220"
                  placeholder="请输入进度更新原因"
                  v-model="formData.taskProgressRemark"
                  show-word-limit
                  resize="none"
                ></el-input>
              </el-form-item>
              <el-form-item label="添加描述" prop="taskDesc">
                <el-input
                  :disabled="canEdit"
                  type="textarea"
                  :rows="5"
                  maxlength="800"
                  show-word-limit
                  v-model="formData.taskDesc"
                  resize="none"
                ></el-input>
              </el-form-item>
              <el-form-item label="附件">
                <ul>
                  <li
                    v-for="(file, index) in formData.attachmentList"
                    :key="file.resourceId"
                  >
                    <em>{{ file.resourceName }}</em>
                    <span @click="openFile(file)">下载</span>
                    <span @click="openFile(file)">预览</span>
                    <span @click="deleteFile(index)">删除</span>
                  </li>
                </ul>
                <file-upload
                  :disabled="canEdit"
                  ref="fileUpload"
                  :fileList="formData.fileList"
                  :limit="5"
                  @change="fileChange"
                ></file-upload>
              </el-form-item>
            </dd>
          </dl>
        </el-form>
        <!-- 右侧 -->
        <div class="task-tab">
          <tl-tabs :current.sync="currentIndex" :tabMenuList="tabMenuList">
            <template slot="tab-cont">
              <div class="tab-cont" v-if="currentIndex === 0">
                <el-scrollbar>
                  <div class="tl-custom-timeline">
                    <dl class="timeline-list">
                      <dd v-for="item in historyList" :key="item.operationId">
                        <div class="list-info">
                          <div class="list-title">{{ item.createTime }}</div>
                          <div class="list-cont">
                            <div class="operate-type">
                              <em>{{ item.userName }}</em>
                              <span v-if="item.contents.operate == 'ADD'"
                                >添加了</span
                              >
                              <span v-else-if="item.contents.operate == 'SET'"
                                >设置了</span
                              >
                              <span>{{
                                CONST.FIEID_MAP[item.contents.field]
                              }}</span>
                            </div>
                            <div class="operate-kind">
                              <span
                                v-if="item.contents.field == 'taskProgress'"
                              >
                                {{ item.contents.value }}%</span
                              >
                              <span
                                v-else-if="item.contents.field == 'taskLevel'"
                              >
                                {{
                                  CONST.PRIORITY_MAP[item.contents.value]
                                }}</span
                              >
                              <span v-else>{{ item.contents.value }}</span>
                            </div>
                          </div>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </el-scrollbar>
              </div>
              <div class="tab-cont" v-else>
                <div class="tl-custom-timeline">
                  <dl class="timeline-list">
                    <dd v-for="item in updateList" :key="item.operationId">
                      <div class="list-info">
                        <div class="list-title">{{ item.createTime }}</div>
                        <div class="list-cont">
                          <div class="operate-type">
                            <span>操作人：</span>
                            <em>{{ item.userName }}</em>
                          </div>
                          <div class="operate-kind">
                            <span>更新进度为：</span>
                            <em>{{ item.contents.value }}%</em>
                          </div>
                          <div class="operate-kind">
                            <span>进度更新进度说明：</span>
                            <em>{{ item.contents.explain || "暂无" }}</em>
                          </div>
                        </div>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </template>
          </tl-tabs>
        </div>
      </div>
    </el-scrollbar>
    <div class="operating-box">
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
      <el-button
        v-if="formData.taskStatus == 0"
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="save"
        >暂存</el-button
      >
      <el-button
        v-if="formData.taskStatus == 0"
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="summitAssign"
        >指派</el-button
      >
      <el-button
        v-else-if="formData.taskStatus != 0 && !canEdit"
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="save"
      >
        <span>确认</span>
      </el-button>
      <el-button
        v-if="formData.taskStatus == 10 && taskUserId == userInfo.userId"
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="acceptTask"
        >确认接收</el-button
      >
    </div>
    <tl-selectproject
      ref="selectProject"
      :showProjectDialog.sync="showProjectDialog"
      v-if="showProjectDialog"
      :server="server"
      @closeProjectDia="closeProjectDia"
    ></tl-selectproject>
    <img-dialog ref="imgDialog" width="75%" top="5vh"></img-dialog>
  </el-drawer>
</template>

<script>
import { mapState } from 'vuex';
import fileUpload from '@/components/fileUpload/index';
import process from '@/components/process';
import tabs from '@/components/tabs';
import imgDialog from '@/components/imgDialog';
import levelblock from '@/components/levelblock';
import selectProject from './selectProject';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'editTask',
  components: {
    'tl-selectproject': selectProject,
    'tl-process': process,
    'tl-tabs': tabs,
    'file-upload': fileUpload,
    'img-dialog': imgDialog,
    'tl-levelblock': levelblock,
  },
  data() {
    return {
      CONST,
      server,
      formData: {
        taskTitle: '',
        timeVal: '',
        taskLevel: 10,
        projectVal: {},
        taskProgressRemark: '',
        taskProgress: 0,
        timeSum: '当前已用时长 0天 0小时 0分',
      },
      taskUserId: '', // 原执行人
      okrList: [], // 归属okr列表
      projectList: [], // 项目列表
      userList: [], // 执行人列表
      processList: [], // 过程列表
      showRemark: false,
      historyList: [],
      updateList: [],
      fileList: [],
      visible: false,
      showProjectDialog: false,
      canEdit: true, // 是否能编辑
      // tab
      currentIndex: 0,
      tabMenuList: [{
        menuName: '操作历史',
      },
      {
        menuName: '进度更新说明',
      }],
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
    this.freshTime();
  },
  methods: {
    show(id, canedit) {
      this.visible = true;
      this.canEdit = canedit;
      this.getUserList();
      this.queryOkr();
      this.getProcess();
      this.getProjectList();
      if (id) {
        this.server.queryTaskDetail({ taskId: id }).then((res) => {
          if (res.code == 200 && res.data) {
            console.log(res.data);
            this.formData = res.data;
            this.taskUserId = this.formData.taskUserId;
            if (res.data.taskBegDate) {
              let taskBegDate = '';
              let taskEndDate = '';
              taskBegDate = res.data.taskBegDate.split(' ')[0] || '';
              taskEndDate = res.data.taskEndDate.split(' ')[0] || '';
              this.formData.timeVal = [taskBegDate, taskEndDate];
            }
            if (this.formData.createTime) {
              const yearNum = this.dateFormat('YYYY', new Date()) - this.dateFormat('YYYY', new Date(this.formData.createTime));
              const mouthNum = this.dateFormat('mm', new Date()) - this.dateFormat('mm', new Date(this.formData.createTime));
              let dayNum = this.dateFormat('dd', new Date()) - this.dateFormat('dd', new Date(this.formData.createTime));
              let hourNum = this.dateFormat('HH', new Date()) - this.dateFormat('HH', new Date(this.formData.createTime));
              let minuteNum = this.dateFormat('MM', new Date()) - this.dateFormat('MM', new Date(this.formData.createTime));
              if (dayNum >= 0 && hourNum < 0) {
                hourNum = 1 * 24 + hourNum;
                dayNum -= 1;
              }
              if (hourNum >= 0 && minuteNum < 0) {
                minuteNum = 1 * 60 + minuteNum;
                hourNum -= 1;
              }
              const dateNum = yearNum * 365 + mouthNum * 30 + dayNum;
              this.formData.timeSum = `当前已用时长 ${dateNum}天 ${hourNum}小时 ${minuteNum}分`;
            }
            this.historyList = res.data.operationList || [];
            this.updateList = [];
            this.historyList.forEach((item) => {
              // 操作历史
              item.contents = JSON.parse(item.remark);
              // 进度更新
              if (item.operationType == 'taskProgress') {
                this.updateList.push(item);
              }
            });
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
    // 查询okr
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
    // 查询执行人
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
    // 查询过程
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
    // 查询项目
    getProjectList() {
      this.server.queryOrgProject().then((res) => {
        if (res.code == 200) {
          this.projectList = res.data || [];
        }
      });
    },
    // 时长统计
    freshTime() {
      this.timedInterval = setInterval(() => {
        this.timeSum();
      }, 30 * 1000);
    },
    timeSum() {
      if (this.formData.createTime) {
        const yearNum = this.dateFormat('YYYY', new Date()) - this.dateFormat('YYYY', new Date(this.formData.createTime));
        const mouthNum = this.dateFormat('mm', new Date()) - this.dateFormat('mm', new Date(this.formData.createTime));
        let dayNum = this.dateFormat('dd', new Date()) - this.dateFormat('dd', new Date(this.formData.createTime));
        let hourNum = this.dateFormat('HH', new Date()) - this.dateFormat('HH', new Date(this.formData.createTime));
        let minuteNum = this.dateFormat('MM', new Date()) - this.dateFormat('MM', new Date(this.formData.createTime));
        if (dayNum >= 0 && hourNum < 0) {
          hourNum = 1 * 24 + hourNum;
          dayNum -= 1;
        }
        if (hourNum >= 0 && minuteNum < 0) {
          minuteNum = 1 * 60 + minuteNum;
          hourNum -= 1;
        }
        const dateNum = yearNum * 365 + mouthNum * 30 + dayNum;
        this.formData.timeSum = `当前已用时长 ${dateNum}天 ${hourNum}小时 ${minuteNum}分`;
        this.$forceUpdate();
        console.log(this.formData.timeSum);
      } else {
        this.formData.timeSum = '当前已用时长 0天 0小时 0分';
      }
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
      this.formData.projectName = data.project.projectNameCn;
    },
    errorHandler() {
      return true;
    },
    // 文件
    fileChange(data) {
      this.fileList = data.list;
      console.log(this.fileList);
    },
    // 下载or预览
    openFile(fileObj) {
      const images = {
        jpg: true,
        jpeg: true,
        png: true,
        bmp: true,
        gif: true,
      };
      if (images[fileObj.resourceType]) {
        this.$refs.imgDialog.show(fileObj.resourceUrl);
      } else {
        window.open(fileObj.resourceUrl);
      }
    },
    deleteFile(index) {
      if (this.formData.attachmentList.length > 0) {
        this.formData.attachmentList.splice(index, 1);
      }
    },
    // 保存任务
    save() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const okrVal = this.okrList.filter((item) => item.okrDetailId == this.formData.okrDetailId)[0] || {};
          const userVal = this.userList.filter((item) => item.userId == this.formData.taskUserId)[0] || {};
          const projectVal = this.projectList.filter((item) => item.projectId == this.formData.projectId)[0] || {};
          this.formData.okrDetailName = okrVal.okrDetailObjectKr;
          this.formData.userName = userVal.userName;
          if (projectVal) {
            this.formData.projectId = projectVal.projectId;
            this.formData.projectName = projectVal.projectNameCn;
          }

          if (this.formData.timeVal) {
            this.formData.taskBegDate = `${this.formData.timeVal[0]}  00:00:00` || null;
            this.formData.taskEndDate = `${this.formData.timeVal[1]}  23:59:59` || null;
          }
          if (this.fileList.length > 0) {
            this.formData.attachmentList.push(...this.fileList);
          }
          this.server.saveTask(this.formData).then((res) => {
            if (res.code == 200) {
              this.$message.success('保存成功');
              this.close();
              this.$emit('success');
            }
          });
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
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$xconfirm({
            content: '',
            title: '确定要将该任务归档吗？',
          }).then(() => {
            this.server.filedTask({ taskId: this.formData.taskId }).then((res) => {
              if (res.code == 200) {
                this.$message.success('归档成功');
                this.close();
                this.$emit('success');
              }
            });
          }).catch(() => {});
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
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (!this.formData.taskUserId) {
            this.$message.error('请选择执行人');
            return;
          }
          const okrVal = this.okrList.filter((item) => item.okrDetailId == this.formData.okrDetailId)[0] || {};
          const userVal = this.userList.filter((item) => item.userId == this.formData.taskUserId)[0] || {};
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
          if (this.fileList.length > 0) {
            this.formData.attachmentList.push(...this.fileList);
          }
          this.server.appointSave(this.formData).then((res) => {
            if (res.code == 200) {
              this.$message.success('指派成功');
              this.$emit('success');
              this.close();
            }
          });
        }
      });
    },
  },
  beforeDestroy() {
    clearInterval(this.timedInterval);
  },
};
</script>

<style>
</style>