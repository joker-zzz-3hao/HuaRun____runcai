<!--与原型不一致的地方
1、进度条，直接显示进度条，且可滑动
2、关联项目直接使用下拉框
3、

-->
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
        <el-table-column label="工作项" prop="workContent">
          <template slot-scope="scope">
            <el-input
              v-model.trim="scope.row.workContent"
              maxlength="50"
              clearable
              placeholder="请用一句话概括某项工作，不超过100个字符"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="内容" prop="workDesc">
          <template slot-scope="scope">
            <el-input
              type="textarea"
              v-model.trim="scope.row.workDesc"
              maxlength="50"
              clearable
              placeholder="请描述具体工作内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="进度" prop="workProgress">
          <template slot-scope="scope">
            <el-slider v-model="scope.row.workProgress" :step="1"></el-slider>
            <span>{{scope.row.workProgress}}%</span>
          </template>
        </el-table-column>
        <el-table-column label="推进工时" prop="workTime">
          <template slot-scope="scope">
            <el-input-number
              v-model.trim="scope.row.workTime"
              controls-position="right"
              :min="1"
              :max="1000"
            ></el-input-number>h
          </template>
        </el-table-column>
        <el-table-column label="关联项目" prop="projectId">
          <template slot-scope="scope">
            <el-select v-model="scope.row.projectId" filterable placeholder="请选择">
              <el-option
                v-for="item in projectList"
                :key="item.calendarId"
                :label="item.calendarYear"
                :value="item.calendarId"
              ></el-option>
            </el-select>
            <a style="cursor:pointer" @click="selectTempPro">临时项目</a>
            <el-tooltip
              class="item"
              effect="dark"
              content="若您此项工作所属项目暂时没有进入OA，则可以选择该“临时项目”"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
            <div></div>
          </template>
        </el-table-column>
        <el-table-column label="支持OKR/价值观" prop="okrCultureValueIds">
          <!-- okrIds -->
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.workContent" clearable placeholder="请用选择所支持OKR/价值观"></el-input>
            <div>
              <span class="okr-selected" v-for="item in selectedOkr" :key="item.id">
                {{item.name}}
                <i @click="deleteOkr" style="cursor:pointer" class="el-icon-close"></i>
              </span>
            </div>
            <i style="cursor:pointer" @click="addOkr" class="el-icon-plus"></i>
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
      showOkrData: false,
      monthDate: this.dateFormat('YYYY-mm-dd', new Date()),
      tableData: [],
      projectList: [],
      weekList: [{}],
      selectedOkr: [
        {
          id: 111,
          code: 111,
          name: '公司上市',
        },
        {
          id: 222,
          code: 222,
          name: '公司盈利',
        },
      ],
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
      // 获取项目列表
      this.getProjectList();
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
    getProjectList() {
      this.server.getCalendar({ }).then((res) => {
        if (res.code == 200) {
          this.projectList = res.data;
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
    selectTempPro() {

    },
    showProList() {
    },
    addOkr() {
      // this.$refs.showOkrData
      this.showOkrData = true;
    },
    deleteOkr() {},
  },
};
</script>
<style lang="css">
.btn-selected {
  background: rgb(2, 2, 2);
}
.okr-selected {
  background: grey;
  margin-left: 2px;
}
</style>