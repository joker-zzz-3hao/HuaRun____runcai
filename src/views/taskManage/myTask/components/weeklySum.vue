<template>
  <div class="home">
    <!-- 我负责的 -->
    <el-table :data="owntableData" class="tl-table">
      <el-table-column
        min-width="100px"
        align="left"
        prop="taskTitle"
        label="我负责的"
      >
        <template slot-scope="scope">
          <a @click="openEdit(scope.row.taskId)">{{ scope.row.taskTitle }}</a>
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
          <span v-if="scope.row.processName"
            >{{ scope.row.processName }} -</span
          >
          <span>{{ CONST.TASK_STATUS_MAP[scope.row.taskStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="userName" label="进度">
        <template slot-scope="scope">
          <tl-process :data="parseInt(scope.row.taskProgress, 10)"></tl-process>
        </template>
      </el-table-column>
    </el-table>
    <!-- 我指派的 -->
    <el-table :data="assigntableData" class="tl-table">
      <el-table-column
        min-width="100px"
        align="left"
        prop="taskTitle"
        label="我指派的"
      >
        <template slot-scope="scope">
          <a @click="openEdit(scope.row.taskId)">{{ scope.row.taskTitle }}</a>
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
          <span v-if="scope.row.processName"
            >{{ scope.row.processName }} -</span
          >
          <span>{{ CONST.TASK_STATUS_MAP[scope.row.taskStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="userName" label="进度">
        <template slot-scope="scope">
          <tl-process :data="parseInt(scope.row.taskProgress, 10)"></tl-process>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import process from '@/components/process';
import CONST from '../const';
import Server from '../server';

const server = new Server();

export default {
  name: 'weeklySum',
  components: {
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
        if (res.code == 200) {
          this.tableData = res.data || [];
          this.tableData.forEach((item) => {
            if (item.taskUserId == this.userInfo.userId) {
              this.owntableData.push(item);
            }
            if (item.updateBy == this.userInfo.userId) {
              this.assigntableData.push(item);
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