<!--
  功能：
  作者：王志任
  时间：2020年09月23日 16:51:30
  备注：
-->
<template>
  <div>
    <div>
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
    </div>
    <div>
      <crcloud-table
        :total="total"
        :pageSize.sync="pageSize"
        :currentPage.sync="currentPage"
        @searchList="searchList"
      >
        <div slot="tableContainer">
          <el-table ref="taskTable" v-loading="loading" :data="tableData">
            <el-table-column
              min-width="100px"
              align="left"
              prop="taskTitle"
              label="任务"
            >
              <template slot-scope="scope">
                <a @click="openEdit(scope.row)">{{ scope.row.taskTitle }}</a>
              </template>
            </el-table-column>
            <el-table-column
              min-width="100px"
              align="left"
              prop="userName"
              label="创建人"
            >
              <template slot-scope="scope">
                <div>
                  <p>
                    <i class="el-icon-user"></i>
                    <span>{{ scope.row.userName }}</span>
                  </p>
                  <p>
                    <i class="el-icon-date"></i>
                    <span>{{ scope.row.createTime }}</span>
                  </p>
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
            <el-table-column min-width="100px" align="left" label="执行人">
              <template slot-scope="scope">
                <div style="cursor: pointer">
                  <span>
                    <el-avatar
                      :size="30"
                      :src="scope.row.headerUrl"
                      @error="errorHandler"
                    >
                      <div v-if="scope.row.userName" class="user-name">
                        <em>
                          {{
                            scope.row.userName.substring(
                              scope.row.userName.length - 2
                            )
                          }}
                        </em>
                      </div>
                    </el-avatar>
                  </span>
                  <span>{{ scope.row.userName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              min-width="200px"
              align="left"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button class="tl-btn" @click="openEdit(scope.row)"
                  >编辑</el-button
                >
                <el-dropdown class="tl-dropdown">
                  <div class="el-dropdown-link">
                    <el-button class="tl-btn">移动</el-button>
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
                <el-menu
                  :default-active="'1'"
                  mode="horizontal"
                  @select="handleSelect"
                >
                  <el-submenu index="1">
                    <template slot="title">
                      <i class="el-icon-more el-icon--right"></i>
                    </template>
                    <el-menu-item @click.native="finish(scope.row)"
                      >任务归档</el-menu-item
                    >
                    <!-- <el-menu-item @click.native="deleteTask(scope.row)"
                      >删除任务</el-menu-item
                    > -->

                    <el-submenu index="1-2">
                      <template slot="title">移动分类</template>
                      <el-menu-item v-if="processClassifyList.length == 0"
                        >暂无分类</el-menu-item
                      >
                      <el-menu-item
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
                      </el-menu-item>
                    </el-submenu>
                  </el-submenu>
                </el-menu>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcloud-table>
    </div>
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
    this.remoteMethod();
  },
  mounted() {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    init(typeId) {
      const self = this;
      self.rootData = [];
      // 切换分类时
      if (typeId) {
        self.tabName = 'all';
        self.stepId = '';
      }
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        processId: self.processObj.processId,
        typeId: typeId || this.searchParams.typeId,
        stepId: this.stepId,
        taskTitle: this.searchParams.taskTitle || '',
        taskUserIds: this.searchParams.searchCreator.toString(),
        createByIds: this.searchParams.searchExecutor.toString(),
      };
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
    },
    openEdit(row) {
      this.existEditTask = true;
      this.$nextTick(() => {
        this.$refs.editTask.show(row.taskId, false);
      });
    },
    searchList() {
      this.init();
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