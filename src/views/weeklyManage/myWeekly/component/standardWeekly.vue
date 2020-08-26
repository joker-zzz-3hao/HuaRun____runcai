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
        <el-table-column width="220" label="推进工时" prop="workTime">
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
            <el-select
              v-model="scope.row.projectId"
              filterable
              :placeholder="scope.row.projectPlaceholder"
            >
              <el-option
                v-for="item in projectList"
                :key="item.calendarId"
                :label="item.calendarYear"
                :value="item.calendarId"
              ></el-option>
            </el-select>
            <a style="cursor:pointer" @click="selectTempPro(scope.row)">临时项目</a>
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
            <el-input
              v-if="scope.row.selectedOkr.length < 1"
              @focus="addOkr(scope.row)"
              v-model.trim="scope.row.workContent"
              clearable
              placeholder="请用选择所支持OKR/价值观"
            ></el-input>
            <div>
              <span
                class="okr-selected"
                v-for="item in scope.row.selectedOkr"
                :key="item.okrDetailId"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.okrDetailObjectKr"
                  placement="top-end"
                >
                  <span>
                    {{setOkrStyle(item.okrDetailObjectKr)}}
                    <i
                      @click="deleteOkr(item,scope.row.randomId)"
                      style="cursor:pointer"
                      class="el-icon-close"
                    ></i>
                  </span>
                </el-tooltip>
              </span>
            </div>
            <i
              v-show="scope.row.selectedOkr.length > 0"
              style="cursor:pointer"
              @click="addOkr(scope.row)"
              class="el-icon-plus"
            ></i>
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
    <!-- 本周感想、建议、收获 -->
    <div style="marginTop:50px">
      <h1>本周感想、建议、收获</h1>
      <div v-for="thoughts in thoughtsList" :key="thoughts.randomId">
        <span>
          <el-button
            @click="thoughtTypeChange(thoughts,0)"
            :class="{'is-thoughts': thoughts.thoughtType == 0}"
          >感想</el-button>
          <el-button
            @click="thoughtTypeChange(thoughts,1)"
            :class="{'is-suggest': thoughts.thoughtType == 1}"
          >建议</el-button>
          <el-button
            @click="thoughtTypeChange(thoughts,2)"
            :class="{'is-harvest': thoughts.thoughtType == 2}"
          >收获</el-button>
          <el-input v-model.trim="thoughts.thoughtContent" style="width:60%" type="textarea"></el-input>
          <i
            style="cursor:pointer"
            class="el-icon-minus"
            @click="deleteThoughts(thoughts.randomId)"
          ></i>
          <i
            style="cursor:pointer"
            v-if="thoughts.randomId == thoughtsList[thoughtsList.length-1].randomId"
            class="el-icon-plus"
            @click="addThoughts"
          ></i>
        </span>
      </div>
      <!-- 下周计划 -->
      <div style="marginTop:50px">
        <h1>下周计划</h1>
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
      </div>
    </div>

    <!-- 添加支撑项 -->
    <add-okr
      ref="addOkr"
      v-if="showAddOkr"
      :currenItemrandomId="currenItemrandomId"
      :selectedOkr="selectedOkr"
      :server="server"
      @closeOkrDialog="closeOkrDialog"
    ></add-okr>
  </div>
</template>

<script>

import Server from '../server';
import addOkr from './addOkr';

const server = new Server();
export default {
  name: 'standardWeekly',
  components: {
    'add-okr': addOkr,
  },
  data() {
    return {
      server,
      tableLoading: false,
      currenItemrandomId: '',
      showAddOkr: false,
      monthDate: this.dateFormat('YYYY-mm-dd', new Date()),
      tableData: [],
      projectList: [],
      weekList: [{}],
      selectedOkr: [],
      thoughtsList: [],
    };
  },

  created() {
    this.init();
  },
  computed: {
    setOkrStyle() {
      return (okr) => {
        if (okr && okr.length > 5) {
          return `${okr.slice(0, 5)}...`;
        }
        return okr;
      };
    },
  },
  methods: {
    init() {
      // 获取每月日历
      this.getWeek();
      // 获取项目列表
      this.getProjectList();
      const randomId = Math.random().toString(36).substr(3);
      this.thoughtsList.push({
        thoughtContent: '好开心',
        thoughtId: 'thoughtId',
        thoughtType: 0,
        weeklyId: 'weeklyId',
        randomId,

      });
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
        selectedOkr: [],
        projectPlaceholder: '请选择项目',
      });
    },
    deleteItem(item) {
      console.log(item);
      // 本地数据
      this.tableData = this.tableData.filter((dicItem) => dicItem.randomId != item.randomId);
    },
    selectTempPro(data) {
      data.projectPlaceholder = '临时项目';
      data.projectId = '';
    },
    showProList() {
    },
    addOkr(data) {
      this.currenItemrandomId = data.randomId;
      this.selectedOkr = data.selectedOkr;
      this.showAddOkr = true;
      this.$nextTick(() => {
        this.$refs.addOkr.show();
      });
    },
    deleteOkr(okr, randomId) {
      for (const item of this.tableData) {
        if (item.randomId == randomId) {
          item.selectedOkr = item.selectedOkr.filter((element) => element.okrDetailId != okr.okrDetailId);
        }
      }
    },

    closeOkrDialog(selectedData) {
      for (const item of this.tableData) {
        if (item.randomId == selectedData.currenItemrandomId) {
          item.selectedOkr = selectedData.selectedOkrAndCulture;
        }
      }
      this.showAddOkr = false;
      this.$forceUpdate();
    },
    addThoughts() {
      const randomId = Math.random().toString(36).substr(3);
      this.thoughtsList.push({
        thoughtContent: '好开心',
        thoughtId: 'thoughtId',
        thoughtType: 0,
        weeklyId: 'weeklyId',
        randomId,

      });
    },
    deleteThoughts(randomId) {
      for (const item of this.thoughtsList) {
        if (item.randomId == randomId) {
          this.thoughtsList = this.thoughtsList.filter((element) => element.randomId != randomId);
        }
      }
    },
    thoughtTypeChange(thoughts, type) {
      thoughts.thoughtType = type;
      this.$forceUpdate();
    },
  },
};
</script>
<style lang="css">
.btn-selected {
  background: rgb(2, 2, 2);
}
.okr-selected {
  background: rgb(204, 198, 198);
  margin-left: 2px;
}
.is-thoughts {
  background: rgb(123, 243, 197);
}
.is-suggest {
  background: rgb(228, 241, 151);
}
.is-harvest {
  background: rgb(95, 138, 218);
}
</style>