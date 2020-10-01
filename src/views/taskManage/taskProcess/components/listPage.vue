<!--
  功能：
  作者：王志任
  时间：2020年09月23日 16:51:30
  备注：
-->
<template>
  <div>
    <div>
      <!-- <el-button>全部</el-button>
      <el-button>待处理</el-button>
      <el-button>处理中</el-button>
      <el-button>已完成</el-button>-->
      <el-tabs v-model="tabName" @tab-click="selectTab(tabName)">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane
          :label="step.stepName"
          :name="step.stepId"
          v-for="step in stepList"
          :key="step.stepId"
        ></el-tab-pane>

        <!-- <el-tab-pane label="待处理" name="pending"></el-tab-pane>
        <el-tab-pane label="处理中" name="running"></el-tab-pane>
        <el-tab-pane label="已完成" name="finished"></el-tab-pane>-->
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
            <el-table-column min-width="100px" align="left" prop="taskTitle"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="taskTitle">
              <template slot-scope="scope">
                <div>
                  <p>
                    <i class="el-icon-user"></i>
                    <span>{{scope.row.userName}}</span>
                  </p>
                  <p>
                    <i class="el-icon-date"></i>
                    <span>{{scope.row.createTime}}</span>
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="100px" align="left" prop="taskTitle"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="taskTitle"></el-table-column>
            <el-table-column fixed="right" min-width="130px" align="left">
              <template slot-scope="scope">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <i class="el-icon-more el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="moveStep(scope.row)">移动步骤</el-dropdown-item>
                    <el-dropdown-item @click.native="moveClassify(scope.row)">移动分类</el-dropdown-item>
                    <el-dropdown-item @click.native="taskFiling(scope.row)">任务归档</el-dropdown-item>
                    <el-dropdown-item @click.native="deleteTask(data)">删除任务</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
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
    processObj: {
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
    };
  },
  created() { this.init(); },
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
      };
      self.server.queryTaskTableList(params).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data.content;
          this.currentPage = res.data.currentPage;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
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
    deleteTask(task) {
      console.log(task);
    },

  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>