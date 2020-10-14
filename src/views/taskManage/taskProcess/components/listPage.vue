<!--
  功能：
  作者：王志任
  时间：2020年09月23日 16:51:30
  备注：
-->
<template>
  <div>
    <div>
      <el-tabs v-model="tabName" @tab-click="selectTab(tabName)">
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
            ></el-table-column>
            <el-table-column min-width="100px" align="left" prop="taskTitle">
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
            <el-table-column min-width="100px" align="left" prop="taskProgress">
              <template slot-scope="scope">
                <div>
                  <el-slider
                    disabled
                    v-model="scope.row.taskProgress"
                    :step="1"
                  ></el-slider>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="100px" align="left">
              <template slot-scope="scope">
                <div
                  v-if="!scope.row.showChangeUser"
                  @click="showSelectPeople(scope.row)"
                  style="cursor: pointer"
                >
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
                <div v-else>
                  <el-select
                    ref="taskSelect"
                    filterable
                    placeholder="请输入成员姓名"
                    remote
                    :remote-method="remoteMethod"
                    @visible-change="visibleChange"
                    @blur="selectBlur(scope.row)"
                    @change="userChange"
                    clearable
                  >
                    <el-option
                      v-for="item in userList"
                      :key="item.userId"
                      :label="item.userName"
                      :value="item.userId"
                    >
                      <span style="float: left">
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
                      </span>
                      <span style="float: left; marginleft: 5px">{{
                        item.userName
                      }}</span>
                    </el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" min-width="130px" align="left">
              <template slot-scope="scope">
                <el-menu
                  :default-active="'1'"
                  class="el-menu-demo"
                  mode="horizontal"
                  @select="handleSelect"
                >
                  <el-submenu index="1">
                    <template slot="title">操作</template>
                    <el-menu-item @click.native="finish(scope.row)"
                      >任务归档</el-menu-item
                    >
                    <el-menu-item @click.native="deleteTask(scope.row)"
                      >删除任务</el-menu-item
                    >
                    <el-submenu index="1-1">
                      <template slot="title">移动过程节点</template>
                      <el-menu-item
                        @click.native="changeStep(scope.row, step)"
                        v-for="step in stepList"
                        :index="step.stepId"
                        :key="step.stepId"
                        >{{ step.stepName }}</el-menu-item
                      >
                    </el-submenu>
                    <el-submenu index="1-2">
                      <template slot="title">移动分类</template>
                      <el-menu-item
                        @click.native="changeClassify(scope.row, calssify)"
                        v-for="calssify in processClassifyList"
                        :index="calssify.typeId"
                        :key="calssify.typeId"
                        >{{ calssify.typeName }}</el-menu-item
                      >
                    </el-submenu>
                  </el-submenu>
                </el-menu>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcloud-table>
    </div>
    <tl-move-task ref="moveTask" v-if="showMove"></tl-move-task>
    <tl-move-classify ref="moveTask" v-if="showMove"></tl-move-classify>
  </div>
</template>

<script>
import tlMoveTask from './moveTask';
import tlMoveClassify from './moveClassify';
import Server from '../server';

const server = new Server();

export default {
  name: '',
  components: {
    tlMoveTask,
    tlMoveClassify,
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
      showMove: false,
      loading: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tabName: 'all',
      userList: [],
      task: {},
    };
  },
  created() {
    this.init();
    this.remoteMethod();
  },
  mounted() {},
  computed: {},
  methods: {
    init(typeId) {
      const self = this;
      self.rootData = [];
      const params = {
        currentPage: 1,
        pageSize: 10,
        processId: self.processObj.processId,
        typeId: typeId || '',
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
    moveStep(task) {
      console.log(task);
      this.showMove = true;
      this.$nextTick(() => {
        this.$refs.moveTask.show();
      });
    },
    searchList() {},
    selectTab(tab) {
      this.stepId = tab == 'all' ? '' : tab;
      this.init();
    },
    moveClassify(task) {
      console.log(task);
    },
    taskFiling(task) {
      // 任务进度是否为100%，不是的话，不能归档
      console.log(task);
    },
    handleSelect() {

    },
    changeStep(task, step) {
      this.server.move({
        taskId: task.taskId,
        stepIdAfter: step.stepId,
      });
    },
    changeClassify(task, classify) {
      this.server.changeClassify({
        taskId: task.taskId,
        typeId: classify.typeId,
      });
    },
    finish(task) {
      if (task.taskProgress == 100) {
        this.server.finishTask({ taskId: task.taskId });
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
        this.$refs.taskSelect.input.focus();
      });
    },
    remoteMethod(name) {
      this.server.getUserListByOrgId({
        currentPage: 1,
        pageSize: 20,
        userName: name ? name.trim() : '',
      }).then((res) => {
        if (res.code == 200) {
          this.userList = res.data.content;
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
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>