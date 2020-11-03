<!--
  功能：
  作者：王志任
  时间：2020年10月03日 17:18:59
  备注：
-->
<template>
  <div>
    <div class="operating-area">
      <div class="page-title">已归档任务</div>
      <el-button @click="goback" plain class="tl-btn amt-border-slip"
        >返回<span class="lines"></span
      ></el-button>
      <div class="operating-box">
        <el-input
          placeholder="输入任务标题"
          style="width: 200px"
          class="tl-input-search"
          v-model="searchParams.taskTitle"
          clearable
          @clear="searchList"
          @keyup.enter.native="searchList"
        >
          <i
            class="el-icon-search el-input__icon"
            slot="prefix"
            @click="searchList"
          ></i>
        </el-input>
        <el-select
          v-show="processList.length > 0"
          v-model="searchParams.processId"
          placeholder="请选择任务过程"
          clearable
          class="tl-select"
          :popper-append-to-body="false"
          popper-class="tl-select-dropdown"
          @change="searchList()"
        >
          <el-option
            v-for="item in processList"
            :key="item.processId"
            :value="item.processId"
            :label="item.processName"
          ></el-option>
        </el-select>
        <tl-personmultiple
          title="请选择执行人"
          :userList="userList"
          :userMap="userMap"
          v-model="searchParams.searchExecutor"
          @change="searchList"
        ></tl-personmultiple>
        <tl-personmultiple
          title="请选择创建人"
          :userList="userList"
          :userMap="userMap"
          v-model="searchParams.searchCreator"
          @change="searchList"
        ></tl-personmultiple>
      </div>
    </div>
    <div class="cont-area">
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
              </template></el-table-column
            >
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
            <el-table-column align="left" prop="processName" label="过程">
            </el-table-column>
            <el-table-column min-width="100px" align="left" label="执行人">
              <template slot-scope="scope">
                <span>
                  <el-avatar :size="30" :src="scope.row.headerUrl">
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
    ></tl-edittask>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import process from '@/components/process';
import personMultiple from '@/components/personMultiple';
import editTask from './editTask';
import Server from '../server';

const server = new Server();
export default {
  name: '',
  components: {
    'tl-personmultiple': personMultiple,
    'tl-process': process,
    'tl-edittask': editTask,
  },
  props: {},
  data() {
    return {
      server,
      loading: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchParams: {
        taskTitle: '',
        searchCreator: [],
        searchExecutor: [],
        typeId: '',
        processId: '',
      },
      userList: [],
      userMap: {},
      existEditTask: false,
      processList: [],
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      orgFullId: (state) => state.orgFullId,
    }),
  },
  methods: {
    init() {
      this.searchParams.processId = this.$route.query.processId;
      this.searchList();
      this.queryUser();
      this.queryProcessList();
    },
    queryProcessList() {
      // 搜索任务过程
      this.server.queryTaskProcessList({
        currentPage: 1,
        pageSize: 1000,
        processType: '',
        enable: 1,
      }).then((res) => {
        if (res.code == 200) {
          this.processList = res.data.content || [];
        }
      });
    },
    searchList() {
      const self = this;
      self.rootData = [];
      const params = {
        currentPage: self.currentPage,
        pageSize: self.pageSize,
        processId: self.searchParams.processId,
        taskTitle: self.searchParams.taskTitle || '',
        taskUserIds: self.searchParams.searchCreator.toString(),
        createByIds: self.searchParams.searchExecutor.toString(),
      };
      self.loading = true;
      self.server.queryFiledList(params).then((res) => {
        self.loading = false;
        if (res.code == 200) {
          self.currentPage = res.data.currentPage;
          self.pageSize = res.data.pageSize;
          self.total = res.data.total;
          self.tableData = res.data.content;
          self.tableData.forEach((task) => {
            self.$set(task, 'showChangeUser', false);
          });
        }
      });
    },
    queryUser() {
      this.server.listOrgUserPage({ orgFullId: this.orgFullId }).then((res) => {
        if (res.code == 200) {
          this.userList = res.data || [];
        }
      });
    },
    openEdit(row) {
      this.existEditTask = true;
      this.$nextTick(() => {
        this.$refs.editTask.show(row.taskId, true);
      });
    },
    goback() {
      this.$router.go('-1');
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
