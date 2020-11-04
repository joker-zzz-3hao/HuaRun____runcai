<template>
  <div class="list-view">
    <template v-if="processObj.processId">
      <el-tabs
        v-model="tabName"
        @tab-click="selectTab(tabName)"
        class="tl-tabs"
      >
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane
          :label="step.stepName"
          :name="step.stepId"
          v-for="step in stepList"
          :key="step.stepId"
        ></el-tab-pane>
      </el-tabs>
      <crcloud-table
        :total="total"
        :pageSize.sync="pageSize"
        :currentPage.sync="currentPage"
        @searchList="searchList"
      >
        <div slot="tableContainer">
          <el-table
            ref="taskTable"
            v-loading="loading"
            :data="tableData"
            class="tl-table"
            :class="{ 'no-data': tableData.length === 0 }"
          >
            <el-table-column align="left" prop="taskTitle" label="任务">
              <template slot-scope="scope">
                <a @click="openEdit(scope.row)">{{ scope.row.taskTitle }}</a>
              </template>
            </el-table-column>
            <el-table-column
              min-width="120px"
              align="left"
              prop="userName"
              label="创建信息"
            >
              <template slot-scope="scope">
                <div>
                  <p>
                    <i class="el-icon-user"></i>
                    <span>{{ scope.row.createByUserName }}</span>
                  </p>
                  <p>
                    <i class="el-icon-date"></i>
                    <span>{{ scope.row.createTime }}</span>
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="所属分类" prop="typeName">
              <template slot-scope="scope">
                <div v-if="canEdit(scope.row)">--</div>
                <div v-else>
                  <em>{{ scope.row.typeName || "暂无分类" }}</em>
                  <el-dropdown class="tl-dropdown" trigger="click">
                    <div class="el-dropdown-link">
                      <i class="el-icon-edit"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-if="processClassifyList.length == 0"
                        >暂无分类</el-dropdown-item
                      >
                      <el-dropdown-item
                        @click.native="changeClassify(scope.row, calssify)"
                        v-for="calssify in processClassifyList"
                        :index="calssify.typeId"
                        :key="calssify.typeId"
                      >
                        <em
                          :class="{
                            'high-light': scope.row.typeId == calssify.typeId,
                          }"
                          >{{ calssify.typeName }}</em
                        >
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              min-width="100px"
              align="left"
              prop="taskProgress"
              label="进度"
            >
              <template slot-scope="scope">
                <div>
                  <tl-process
                    :data="parseInt(scope.row.taskProgress, 10)"
                  ></tl-process>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="140" align="left" label="执行信息">
              <template slot-scope="scope">
                <div>
                  <p>
                    <i class="el-icon-user"></i>
                    <span>{{ scope.row.userName || "无执行人" }}</span>
                  </p>
                  <p>
                    <i class="el-icon-date"></i>
                    <span v-if="scope.row.taskBegDate"
                      >{{
                        dateFormat(
                          "YYYY-mm-dd",
                          new Date(scope.row.taskBegDate)
                        )
                      }}~{{
                        dateFormat(
                          "YYYY-mm-dd",
                          new Date(scope.row.taskEndDate)
                        )
                      }}</span
                    >
                    <span v-else>未设置起止时间</span>
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="170" label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button
                  :disabled="canEdit(scope.row)"
                  plain
                  class="tl-btn btn-lineheight btn-small"
                  @click="openEdit(scope.row)"
                  >编辑</el-button
                >
                <el-dropdown class="tl-dropdown">
                  <div class="el-dropdown-link">
                    <el-button plain class="tl-btn btn-lineheight btn-small"
                      >移动</el-button
                    >
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="changeStep(scope.row, step)"
                      v-for="step in stepList"
                      :index="step.stepId"
                      :key="step.stepId"
                    >
                      <em>{{ step.stepName }}</em>

                      <span v-if="scope.row.stepId == step.stepId"
                        >（当前节点）</span
                      >
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown trigger="click" class="tl-dropdown">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="finish(scope.row)"
                      >任务归档</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcloud-table>
    </template>
    <tl-edittask
      ref="editTask"
      v-if="existEditTask"
      :existEditTask.sync="existEditTask"
      :server="server"
      @success="init()"
    ></tl-edittask>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import process from '@/components/process';
import editTask from './editTask';
import Server from '../server';

const server = new Server();

export default {
  name: '',
  components: {
    'tl-edittask': editTask,
    'tl-process': process,
  },
  props: {
    stepList: {
      type: Array,
      default() {
        return [];
      },
    },
    processClassifyList: {
      type: Array,
      default() {
        return [];
      },
    },
    processObj: {
      type: Object,
      default() {
        return {};
      },
    },
    searchParams: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      server,
      rootData: [],
      allStepTaskList: [],
      loading: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tabName: 'all',
      userList: [],
      task: {},
      existEditTask: false,
      taskUserId: '',
      stepId: '',
    };
  },
  created() {
    this.init();
    // this.remoteMethod();
  },
  mounted() {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    canEdit(row) {
      return (row.taskStatus == 20
                      && row.taskUserId != this.userInfo.userId)
                      || (row.taskStatus == 10
                      && row.createBy != this.userInfo.userId);
    },
    init(typeId) {
      this.rootData = [];
      // 切换分类时
      if (typeId) {
        this.tabName = 'all';
        this.stepId = '';
        // this.searchParams.typeId = typeId;
      }
      this.searchList();
    },
    openEdit(row) {
      this.existEditTask = true;
      this.$nextTick(() => {
        this.$refs.editTask.show(row.taskId, false);
      });
    },
    searchList(params = { currentPage: 1 }) {
      this.currentPage = params.currentPage;
      const self = this;
      self.rootData = [];
      params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        processId: self.processObj.processId,
        typeId: this.searchParams.typeId,
        stepId: this.stepId,
        taskTitle: this.searchParams.taskTitle || '',
        taskUserIds: this.searchParams.searchExecutor.toString(),
        createByIds: this.searchParams.searchCreator.toString(),
      };
      if (self.processObj.processId) {
        self.server.queryTaskTableList(params).then((res) => {
          if (res.code == 200) {
            this.currentPage = res.data.currentPage;
            this.pageSize = res.data.pageSize;
            this.total = res.data.total;
            this.tableData = res.data.content;
            this.tableData.forEach((task) => {
              this.$set(task, 'showChangeUser', false);
            });
          }
        });
      }
    },
    // 切换步骤
    selectTab(tab) {
      this.stepId = tab == 'all' ? '' : tab;
      this.init();
    },
    handleSelect() {

    },
    // 移动步骤
    changeStep(task, step) {
      this.server.move({
        taskId: task.taskId,
        stepIdAfter: step.stepId,
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success('移动成功');
          this.init();
        }
      });
    },
    // 切换分类
    changeClassify(task, classify) {
      this.server.changeClassify({
        taskId: task.taskId,
        typeId: classify.typeId,
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success(`已移动到「${classify.typeName}」`);
          this.init();
        }
      });
    },
    finish(task) {
      if (task.taskProgress == 100) {
        this.server.finishTask({ taskId: task.taskId }).then((res) => {
          if (res.code == 200) {
            this.$message.success('任务归档成功');
            this.init();
          }
        });
      } else {
        this.$message.warning('未完成的任务，暂时无法归档');
      }
    },
    deleteTask(task) {
      this.$xconfirm({
        title: '删除任务',
        content: '确认要删除这个任务么？',
      }).then(() => {
        // 提交确认弹窗
        this.server.deleteTask({ taskId: task.taskId }).then((res) => {
          if (res.code == 200) {
            console.log(res);
          }
        });
      }).catch(() => {});
    },
    errorHandler() {
      return true;
    },
    showSelectPeople(task) {
      task.showChangeUser = true;
      this.task = task;
      this.$nextTick(() => {
        this.$refs.taskSelect.focus();
      });
    },
    remoteMethod(name) {
      this.server.getUserListByOrgId({
        currentPage: 1,
        pageSize: 20,
        userName: name ? name.trim() : '',
        orgFullId: this.userInfo.orgList[0].orgFullId,
      }).then((res) => {
        if (res.code == 200) {
          this.userList = res.data.content || [];
        }
      });
    },
    visibleChange(name) {
      if (!name) {
        this.remoteMethod();
      }
    },
    userChange(userId) {
      if (userId) {
        this.userList.forEach((user) => {
          if (user.userId == userId) {
            console.log('userchange', user, userId);
            this.server.changeUser({
              taskId: this.task.taskId,
              userId,
              userName: user.userName,
            }).then((res) => {
              if (res.code == 200) {
                this.init();
              }
            });
          }
        });
      }
    },
    selectBlur(task) {
      task.showChangeUser = false;
    },

  },
  watch: {
    processObj: {
      handler() {
        this.tabName = 'all';
        this.stepId = '';
      },
      deep: true,
    },

  },
  updated() {},
  beforeDestroy() {},
};
</script>