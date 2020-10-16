<template>
  <div class="task-sum">
    <div>
      <span>当前任务汇报时间：</span>
      <em>{{ weekName }}</em>
      <em>{{ weekBegin }}</em>
      <span>~</span>
      <em>{{ weekEnd }}</em>
    </div>
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
      >
        <template slot-scope="scope">
          <div>{{ computedTime(scope.row.createTime) }}</div>
        </template>
      </el-table-column>
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
      >
        <template slot-scope="scope">
          <div>{{ computedTime(scope.row.createTime) }}</div>
        </template></el-table-column
      >
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
    <el-button type="primary" @click="submit" class="tl-btn amt-bg-slip"
      >当前周报汇总提交</el-button
    >
  </div>
</template>

<script>
import { mapState } from 'vuex';
import process from '@/components/process';
import CONST from '../const';
import Server from '../server';

const server = new Server();

export default {
  name: 'taskSum',
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
      monthDate: this.dateFormat('YYYY-mm-dd', new Date()), // 初始化日期
      weekBegin: '',
      weekEnd: '',
      weekName: '',
    };
  },
  created() {
    this.getWeek();
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    getWeek() {
      this.server.getCalendar({ date: this.monthDate }).then((res) => {
        if (res.code == 200) {
          this.weekList = res.data;
          const current = new Date();
          this.weekList.forEach((item, index) => {
            // 由于精确到日的日期格式化之后是上午八点，所以beg应该减去8小时，end加上16小时
            let beg = new Date(item.weekBegin);
            let end = new Date(item.weekEnd);
            beg = beg.setHours(beg.getHours() - 8);
            end = end.setHours(end.getHours() + 16);
            if (current >= beg && current <= end) {
              this.weekBegin = item.weekBegin;
              this.weekEnd = item.weekEnd;
              this.weekName = `${this.dateFormat('mm', new Date())}月第${index + 1}周`;
              this.getTableList();
            }
          });
        }
      });
    },
    getTableList() {
      const params = {
        weekBegin: this.weekBegin,
        weekEnd: this.weekEnd,
      };
      this.server.selectTaskForWeek(params).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data || [];
          this.owntableData = [];
          this.assigntableData = [];
          this.tableData.forEach((item) => {
            if (item.taskUserId == this.userInfo.userId) {
              this.owntableData.push(item);
            }
            if (item.createBy == this.userInfo.userId) {
              this.assigntableData.push(item);
            }
          });
        }
      });
    },
    computedTime(row) {
      if (row) {
        const yearNum = this.dateFormat('YYYY', new Date()) - this.dateFormat('YYYY', new Date(row));
        const mouthNum = this.dateFormat('mm', new Date()) - this.dateFormat('mm', new Date(row));
        let dayNum = this.dateFormat('dd', new Date()) - this.dateFormat('dd', new Date(row));
        let hourNum = this.dateFormat('HH', new Date()) - this.dateFormat('HH', new Date(row));
        let minuteNum = this.dateFormat('MM', new Date()) - this.dateFormat('MM', new Date(row));
        if (dayNum >= 0 && hourNum < 0) {
          hourNum = 1 * 24 + hourNum;
          dayNum -= 1;
        }
        if (hourNum >= 0 && minuteNum < 0) {
          minuteNum = 1 * 60 + minuteNum;
          hourNum -= 1;
        }
        const dateNum = yearNum * 365 + mouthNum * 30 + dayNum;
        return `当前已用时长 ${dateNum}天 ${hourNum}小时 ${minuteNum}分`;
      }
      return '当前已用时长 0天 0小时 0分';
    },
    submit() {
      this.go('myWeekly', { params: { weeklySumParams: this.tableData } });
    },
  },
};
</script>

<style>
</style>