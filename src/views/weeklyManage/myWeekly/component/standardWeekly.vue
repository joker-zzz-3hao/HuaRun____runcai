<template>
  <div class="home">
    <div style="display: inline; list-style-type:none;padding: 5px 5px;">
      <el-date-picker
        v-model="monthDate"
        type="month"
        placeholder="选择月"
        value-format="yyyy-MM-dd"
        @change="getWeek"
      ></el-date-picker>
    </div>
    <!-- 选择周 -->
    <div
      v-if="weekList.length > 0 "
      style="display: inline; list-style-type:none;padding: 5px 5px;"
    >
      <el-button
        style="display: inline; list-style-type:none;padding: 5px 5px;"
        v-for="(item,index) in weekList"
        :key="index"
        @click="seclectBtn(item)"
        :type="item.btnType"
      >
        {{getWeekItem(item,index)}}
        <el-checkbox
          type="success"
          :checked="item.weklyId"
          :label="item.weeklyId ? '已提交' : '未提交'"
          disabled
        ></el-checkbox>
      </el-button>
    </div>
    <div>
      <el-table ref="dicTable" v-loading="tableLoading" :data="tableData">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="工作项" prop="value">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.value" maxlength="50" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="内容" prop="meaning">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.meaning" maxlength="50" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="进度" prop="orderSeq">
          <template slot-scope="scope">
            <el-input-number
              v-model.trim="scope.row.orderSeq"
              controls-position="right"
              :min="1"
              :max="1000"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="推进工时" prop="enabledFlag">
          <template slot-scope="scope">
            <div @click.capture.stop="dataChange(scope.row)">
              <el-switch
                active-value="Y"
                inactive-value="N"
                v-model="scope.row.enabledFlag"
                active-color="#13ce66"
              ></el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="关联项目" prop="description">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.description" maxlength="50" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="支持OKR/价值观" prop="createTime">
          <template slot-scope="scope">
            <span>{{scope.row.createTime ?scope.row.createTime :'--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="code">
          <template slot-scope="scope">
            <el-dropdown @command="deleteItem(scope.row)">
              <span class="el-dropdown-link">
                <i class="el-icon-more el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="addItem" style>新增</el-button>
    </div>
  </div>
</template>

<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'standardWeekly',
  data() {
    return {
      server,
      tableLoading: false,
      monthDate: this.dateFormat('YYYY-mm-dd', new Date()),
      tableData: [],
      weekList: [{}],
    };
  },
  components: {

  },
  created() {
    this.init();
  },
  computed: {

  },
  methods: {
    init() {
      // 获取每月日历
      this.getWeek();
    },
    getWeek(val) {
      if (val) {
        this.monthDate = val;
      }
      this.server.getCalendar({ date: this.monthDate }).then((res) => {
        if (res.code == 200) {
          this.weekList = res.data;
          this.weekList.forEach((week) => {
            week.btnType = '';
          });
          // 初始化页面时，自动定位到本周,如果周报写过了，则需要查询本周周报详情
          this.selectCurrentWeek();
        }
      });
    },
    selectCurrentWeek() {
      // 先定位本周是第几周，然后选中本周的按钮
      const current = new Date();
      for (const item of this.weekList) {
        const beg = new Date(item.weekBegin);
        const end = new Date(item.weekEnd);
        if (current >= beg && current <= end) {
          // 选种本周按钮
          item.btnType = 'success';
          // 是否要初始化页面
          if (item.weeklyId) {
            this.getWeeklyById(item.weeklyId);
          }
        }
        this.$forceUpdate();
      }
    },
    getWeeklyById(weekly) {
      this.server.queryWeekly().then({ weeklyId: weekly.weeklyId }).then((res) => {
        if (res.code == 200) {
          console.log(res);
        }
      });
    },
    getWeekItem(item, index) {
      if (item.calendarId) {
        const beg = item.weekBegin.split('-').splice(1, 2).join('/');
        const end = item.weekEnd.split('-').splice(1, 2).join('/');
        return `第${index + 1}周(${beg}-${end})`;
      }
    },
    seclectBtn(item) {
      this.weekList.forEach((week) => {
        week.btnType = '';
      });
      item.btnType = 'success';
      this.$forceUpdate();
      this.queryWeekly(item);
    },
    queryWeekly(weekly) {
      this.server.queryWeekly({ weeklyId: weekly.weeklyId });
    },
    addItem() { // 添加本地数据
      const randomId = Math.random().toString(36).substr(3);
      this.tableData.push({
        okrCultureValueIds: '',
        okrIds: '',
        projectId: '',
        weeklyId: '',
        workContent: '',
        workDesc: '',
        workId: '',
        workIndex: 0,
        workProgress: 0,
        workTime: 0,
        randomId, // 添加随机id，用于删除环节
      });
    },
    deleteItem(item) {
      console.log(item);
      // 本地数据
      this.tableData = this.tableData.filter((dicItem) => dicItem.randomId != item.randomId);
    },
  },
};
</script>
<style lang="css">
.btn-selected {
  background: rgb(2, 2, 2);
}
</style>