<template>
  <div class="home">
    <tl-crcloud-table
      :total="totalpage"
      :currentPage.sync="currentPage"
      :pageSize.sync="pageSize"
      @searchList="getTableList"
    >
      <div slot="tableContainer" class="table-container">
        <el-table :data="tableData" class="tl-table">
          <el-table-column
            min-width="100px"
            align="left"
            prop="taskTitle"
            label="内容"
          >
            <template slot-scope="scope">
              <a @click="openEdit(scope.row.taskId)">{{
                scope.row.taskTitle
              }}</a>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="createByUserName"
            label="创建人"
          ></el-table-column>
          <el-table-column
            min-width="100px"
            align="left"
            prop="createTime"
            label="时长统计"
          ></el-table-column>
          <el-table-column align="left" prop="taskStatus" label="当前状态">
            <template slot-scope="scope">
              <span>{{ scope.row.processName }} -</span>
              <span>{{ CONST.TASK_STATUS_MAP[scope.row.taskStatus] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" prop="userName" label="进度">
            <template slot-scope="scope">
              <tl-process
                :data="parseInt(scope.row.taskProgress, 10)"
              ></tl-process>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </tl-crcloud-table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import crcloudTable from '@/components/crcloudTable';
import process from '@/components/process';
import CONST from '../const';
import Server from '../server';

const server = new Server();

export default {
  name: 'weeklySum',
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-process': process,
  },
  data() {
    return {
      CONST,
      server,
      pageSize: 10,
      currentPage: 1,
      totalpage: 0,
      tableData: [],
      owntableData: [],
      assigntableData: [],
    };
  },
  created() {
    this.getTableList();
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    getTableList() {
      const params = {
        weekBegin: '2020-09-20',
        weekEnd: '2020-09-28',
      };
      this.server.selectTaskForWeek(params).then((res) => {
        this.tableData = res.data.content;
        this.totalpage = res.data.total;
        this.currentPage = res.data.currentPage;
        this.pageSize = res.data.pageSize;
      });
    },
  },
};
</script>

<style>
</style>