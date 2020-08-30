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
          :checked="isChecked(item.weeklyId)"
          :label="item.weeklyId ? '已提交' : '未提交'"
          disabled
        ></el-checkbox>
      </el-button>
    </div>
    <div>
      <el-form :rules="formData.rules" :model="formData" ref="formDomPlan">
        <el-table ref="workTable" v-loading="tableLoading" :data="formData.weeklyWorkVoSaveList">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="工作项" prop="workContent">
            <template slot-scope="scope">
              <el-form-item
                :prop="'weeklyWorkVoSaveList.' + scope.$index + '.workContent'"
                :rules="formData.rules.workContent"
              >
                <el-input
                  v-model.trim="scope.row.workContent"
                  maxlength="100"
                  clearable
                  placeholder="请用一句话概括某项工作，不超过100个字符"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>-
          <el-table-column label="内容" prop="workDesc">
            <template slot-scope="scope">
              <el-form-item
                :prop="'weeklyWorkVoSaveList.' + scope.$index + '.workDesc'"
                :rules="formData.rules.workDesc"
              >
                <el-input
                  type="textarea"
                  v-model.trim="scope.row.workDesc"
                  maxlength="50"
                  clearable
                  placeholder="请描述具体工作内容"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="进度" prop="workProgress">
            <template slot-scope="scope">
              <el-slider v-model="scope.row.workProgress" :step="1" show-input></el-slider>
              <!-- <span>{{scope.row.workProgress}}%</span> -->
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
              <el-form-item
                :prop="'weeklyWorkVoSaveList.' + scope.$index + '.validateProjectId'"
                :rules="formData.rules.validateProjectId"
              >
                <el-select
                  v-model="scope.row.validateProjectId"
                  filterable
                  placeholder="请选择项目"
                  :remote-method="remoteMethod"
                  @change="projectChange(scope.row)"
                >
                  <el-option
                    v-for="item in projectList"
                    :key="item.projectId"
                    :label="item.projectNameCn"
                    :value="item.projectId"
                  ></el-option>
                </el-select>
              </el-form-item>
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
          <el-table-column label="支持OKR/价值观" prop="valueOrOkrIds">
            <!-- okrIds -->
            <template slot-scope="scope">
              <el-form-item
                :prop="'weeklyWorkVoSaveList.' + scope.$index + '.valueOrOkrIds'"
                :rules="formData.rules.valueOrOkrIds"
              >
                <el-input
                  @focus="addSupportOkr(scope.row)"
                  v-model.trim="scope.row.valueOrOkrIds"
                  placeholder="请选择所支持OKR/价值观"
                  maxlength="0"
                  v-show="scope.row.selectedOkr.length < 1"
                ></el-input>

                <div v-if="scope.row.selectedOkr.length > 0">
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
                  @click="addSupportOkr(scope.row)"
                  class="el-icon-plus"
                ></i>
              </el-form-item>
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
      </el-form>
      <el-button @click="addItem" style>新增</el-button>
    </div>
    <!-- 本周感想、建议、收获 -->
    <div style="marginTop:50px">
      <h1>本周感想、建议、收获</h1>
      <el-form ref="formDomThought" :rules="formData.rules" :model="formData">
        <el-table :data="formData.weeklyThoughtSaveList">
          <el-table-column prop="workContent">
            <template slot-scope="scope">
              <el-form-item
                :prop="'weeklyThoughtSaveList.' + scope.$index + '.thoughtContent'"
                :rules="formData.rules.workContent"
              >
                <span>
                  <el-button
                    @click="thoughtTypeChange(scope.row,0)"
                    :class="{'is-thoughts': scope.row.thoughtType == 0}"
                  >感想</el-button>
                  <el-button
                    @click="thoughtTypeChange(scope.row,1)"
                    :class="{'is-suggest': scope.row.thoughtType == 1}"
                  >建议</el-button>
                  <el-button
                    @click="thoughtTypeChange(scope.row,2)"
                    :class="{'is-harvest': scope.row.thoughtType == 2}"
                  >收获</el-button>
                  <el-input
                    v-model.trim="scope.row.thoughtContent"
                    style="width:60%"
                    type="textarea"
                  ></el-input>
                  <i
                    style="cursor:pointer"
                    class="el-icon-minus"
                    @click="deleteThoughts(scope.row.randomId)"
                  ></i>
                  <i
                    style="cursor:pointer"
                    v-if="scope.row.randomId == formData.weeklyThoughtSaveList[
                    formData.weeklyThoughtSaveList.length-1
                    ].randomId"
                    class="el-icon-plus"
                    @click="addThisWeekWork"
                  ></i>
                </span>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <!-- 下周计划 -->
      <div style="marginTop:50px">
        <h1>下周计划</h1>
        <el-form :rules="formData.rules" :model="formData" ref="formDom">
          <el-table ref="dicTable" v-loading="tableLoading" :data="formData.weeklyPlanSaveList">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="工作项" prop="planContent">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'weeklyPlanSaveList.' + scope.$index + '.planContent'"
                  :rules="formData.rules.workContent"
                >
                  <el-input
                    v-model.trim="scope.row.planContent"
                    maxlength="100"
                    clearable
                    placeholder="请用一句话概括某项工作，不超过100个字符"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="code">
              <template slot-scope="scope">
                <el-dropdown @command="deletePlanItem(scope.row)">
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
        </el-form>
        <el-button @click="addPlanItem" style>添加</el-button>
      </div>
    </div>
    <!-- 个人OKR完成度 -->
    <div style="marginTop:50px" v-if="weeklyOkrSaveList.length > 0">
      <h1>个人OKR完成度</h1>
      <div v-for="item in weeklyOkrSaveList" :key="item.o.okrdetailId">
        <!-- 目标+KR -->
        <div v-if="item.kr">
          <div>
            <span>目标</span>
            <span style="marginLeft:15px">{{item.o.okrDetailObjectKr}}</span>
          </div>
          <div>
            <span>KR</span>
            <span style="marginLeft:15px">{{item.kr.okrDetailObjectKr}}</span>
            <span style="marginLeft:15px">
              风险状态
              <el-button :class="{'no-risk':item.confidenceAfter == 1}"></el-button>
              <el-button :class="{'risk-is-controlled':item.confidenceAfter == 2}"></el-button>
              <el-button :class="{'risk-cannot-be-controlled':item.confidenceAfter == 3}"></el-button>
              <el-select v-model="item.confidenceAfter" placeholder="请选择">
                <el-option
                  v-for="item in riskList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </span>
            <span style="marginLeft:15px">
              当前进度
              <el-slider v-model="item.progressAfter" :step="1" show-input style="width:20%"></el-slider>
            </span>
            <span style="marginLeft:15px">
              本周变化
              <span>{{item.progressAfter-item.progressBefor}}%</span>
            </span>
          </div>
        </div>
        <!-- 目标 -->
        <div v-else>
          <div>
            目标
            <span style="marginLeft:15px">{{item.o.okrDetailObjectKr}}</span>
            <span style="marginLeft:15px">
              当前进度
              <el-slider v-model="item.progressAfter" :step="1" show-input style="width:20%"></el-slider>
            </span>
            <span style="marginLeft:15px">
              本周变化
              <span>{{item.progressAfter-item.progressBefor}}%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 本周心情 -->
    <div style="marginTop:50px">
      <span>
        请选择本周心情
        <el-button @click="happy">开心</el-button>
        <span :class="{'text-color-red': weeklyEmotion==0}">开心</span>
        <el-button @click="common">平常</el-button>
        <span :class="{'text-color-red': weeklyEmotion==50}">平常</span>
        <el-button @click="sad">沮丧</el-button>
        <span :class="{'text-color-red': weeklyEmotion==100}">沮丧</span>
      </span>
      <el-button style="marginLeft:65px" @click="commitWeekly">提交</el-button>
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
      calendarId: '',
      weeklyEmotion: '0',
      weeklyType: '0',
      weeklyId: '',
      tableLoading: false,
      currenItemrandomId: '',
      showAddOkr: false,
      monthDate: this.dateFormat('YYYY-mm-dd', new Date()),
      formData: {
        rules: {
          workContent: {
            type: 'string',
            required: true,
            message: '请填写任务项',
            trigger: 'blur',
          },
          workDesc: {
            type: 'string',
            required: true,
            message: '请填写任务描述',
            trigger: 'blur',
          },

          validateProjectId: {
            type: 'string',
            required: true,
            message: '请选择关联项目',
            trigger: 'change',
          },
          valueOrOkrIds: {
            type: 'string',
            required: true,
            message: '请选择支撑项',
            trigger: 'change',
          },
        },
        weeklyWorkVoSaveList: [],
        weeklyPlanSaveList: [],
        weeklyThoughtSaveList: [],
      },
      projectList: [],
      weekList: [{}],
      selectedOkr: [],

      tempResult: [],
      weeklyOkrSaveList: [],
      valueIdList: [], // 被选中的价值观
      okrIdList: [], // 备选整的
      riskList: [
        {
          value: 1,
          label: '无风险',
        },
        {
          value: 2,
          label: '风险可控',
        },
        {
          value: 3,
          label: '失控',
        },
      ],
      timer: null,
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
    isChecked() {
      return (weeklyId) => {
        if (weeklyId) {
          return true;
        }
        return false;
      };
    },
  },
  methods: {
    init() {
      // 获取每月日历
      this.getWeek();
      // 获取项目列表
      this.getProjectList();
      // 本周任务初始化数据
      this.addWork();

      // 下周计划初始化数据
      this.addNextWeekWork();

      // 本周感想初始化数据
      this.addThought();
      // 五分钟自动提交页面，不要校验
      this.timer = setInterval(() => {
        const params = {
          calendarId: this.calendarId,
          weeklyEmotion: this.weeklyEmotion,
          weeklyId: this.weeklyId,
          weeklyType: this.weeklyType,
          weeklyOkrSaveList: this.weeklyOkrSaveList,
          weeklyPlanSaveList: this.formData.weeklyPlanSaveList,
          weeklyThoughtSaveList: this.formData.weeklyThoughtSaveList,
          weeklyWorkVoSaveList: this.formData.weeklyWorkVoSaveList,
        };
        console.log(params);
        // this.server.commitWeekly(params).then((res) => {
        //   if (res.code == 200) {
        //     this.$message.success('提交成功');
        //   }
        // });
      }, 5 * 60 * 1000);
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
    getProjectList(projectName) {
      this.server.getProjectList({
        pageSize: 10,
        currentPage: 1,
        projectName: projectName || '',
      }).then((res) => {
        if (res.code == 200) {
          this.projectList = res.data.content;
        }
      });
    },
    remoteMethod(query) {
      if (query !== '') {
        this.server.getProjectList(query);
      }
    },
    selectCurrentWeek() {
      // 先定位本周是第几周，然后选中本周的按钮
      const current = new Date();
      for (const item of this.weekList) {
        // 由于精确到日的日期格式化之后是上午八点，所以beg应该减去8小时，end加上16小时
        let beg = new Date(item.weekBegin);
        let end = new Date(item.weekEnd);
        beg = beg.setHours(beg.getHours() - 8);
        end = end.setHours(end.getHours() + 16);
        if (current >= beg && current <= end) {
          // 选种本周按钮
          item.btnType = 'success';
          this.calendarId = item.calendarId;
          // 是否要初始化页面
          if (item.weeklyId) {
            this.getWeeklyById(item.weeklyId);
          }
        }
        this.$forceUpdate();
      }
    },
    getWeeklyById(weeklyId) {
      this.server.queryWeekly({ weeklyId }).then((res) => {
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
      this.calendarId = item.calendarId;
      this.weekList.forEach((week) => {
        week.btnType = '';
      });
      item.btnType = 'success';
      this.$forceUpdate();
      if (item.weeklyId) {
        this.queryWeekly(item);
      }
    },
    queryWeekly(weekly) {
      this.server.queryWeekly({ weeklyId: weekly.weeklyId });
    },
    addItem() { // 添加本地数据
      this.addWork();
    },
    addWork() {
      this.formData.weeklyWorkVoSaveList.push({
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
        selectedOkr: [],
        randomId: Math.random().toString(36).substr(3), // 添加随机id，用于删除环节
        validateProjectId: '', // 用于校验项目是否选中
      });
    },
    addNextWeekWork() {
      this.formData.weeklyPlanSaveList.push({
        planContent: '',
        planId: '',
        weeklyId: '',
        randomId: Math.random().toString(36).substr(3),
      });
    },
    addThought() {
      this.formData.weeklyThoughtSaveList.push({
        thoughtContent: '',
        thoughtId: '',
        thoughtType: 0,
        weeklyId: '',
        randomId: Math.random().toString(36).substr(3),
      });
    },
    projectChange(week) {
      week.projectId = week.validateProjectId;
    },
    addPlanItem() { // 添加下周任务
      this.addNextWeekWork();
    },
    deleteItem(item) {
      // 本地数据
      this.formData.weeklyWorkVoSaveList = this.formData.weeklyWorkVoSaveList.filter(
        (thisWeek) => thisWeek.randomId != item.randomId,
      );
    },
    deletePlanItem(item) {
      // 本地数据
      this.formData.weeklyPlanSaveList = this.formData.weeklyPlanSaveList.filter(
        (nextWeek) => nextWeek.randomId != item.randomId,
      );
    },
    selectTempPro(data) {
      data.projectId = '';
      data.validateProjectId = '默认项目';//
    },
    addSupportOkr(data) {
      this.currenItemrandomId = data.randomId;
      this.selectedOkr = data.selectedOkr;
      this.showAddOkr = true;
      this.$nextTick(() => {
        this.$refs.addOkr.show();
      });
    },
    deleteOkr(okr, randomId) {
      // 删除已选择的价值观、okr
      for (const item of this.formData.weeklyWorkVoSaveList) {
        if (item.randomId == randomId) {
          item.selectedOkr = item.selectedOkr.filter((element) => element.okrDetailId != okr.okrDetailId);
          // 删除对应okr、价值观id
          this.valueIdList = this.valueIdList.filter((id) => okr.okrDetailId != id);
          this.okrIdList = this.okrIdList.filter((id) => okr.okrDetailId != id);
          item.okrCultureValueIds = this.valueIdList.join(',');
          item.okrIds = this.okrIdList.join(',');
          // 添加该字段用于校验支撑项
          this.$set(item, 'valueOrOkrIds', item.okrCultureValueIds + item.okrIds);
          // 删掉对应的支撑项
          delete item.supportMyOkrObj;
        }
      }
    },

    closeOkrDialog(selectedData) {
      for (const item of this.formData.weeklyWorkVoSaveList) {
        if (item.randomId == selectedData.currenItemrandomId) {
          // 给列表赋值，价值观、任务项，用于提交
          this.valueIdList = [];
          this.okrIdList = [];
          selectedData.selectedCulture.forEach((value) => {
            this.valueIdList.push(value.okrDetailId);
          });
          selectedData.selectedOkr.forEach((okr) => {
            this.okrIdList.push(okr.okrDetailId);
          });
          item.okrCultureValueIds = this.valueIdList.join(',');
          item.okrIds = this.okrIdList.join(',');
          // 添加该字段用于校验支撑项
          this.$set(item, 'valueOrOkrIds', item.okrCultureValueIds + item.okrIds);
          // 给列表赋值，价值观、任务项，用于展示
          item.selectedOkr = selectedData.selectedOkrAndCulture;
          item.supportMyOkrObj = selectedData.supportMyOkrObj;
        }
      }

      this.showAddOkr = false;
      this.$forceUpdate();
    },
    addThisWeekWork() {
      this.addThought();
    },
    deleteThoughts(randomId) {
      for (const item of this.formData.weeklyThoughtSaveList) {
        if (item.randomId == randomId) {
          this.formData.weeklyThoughtSaveList = this.formData.weeklyThoughtSaveList.filter(
            (element) => element.randomId != randomId,
          );
        }
      }
    },
    thoughtTypeChange(thoughts, type) {
      thoughts.thoughtType = type;
      this.$forceUpdate();
    },
    commitWeekly() {
      // 表单校验
      const params = {
        calendarId: this.calendarId,
        weeklyEmotion: this.weeklyEmotion,
        weeklyId: this.weeklyId,
        weeklyType: this.weeklyType,
        weeklyOkrSaveList: this.weeklyOkrSaveList,
        weeklyPlanSaveList: this.formData.weeklyPlanSaveList,
        weeklyThoughtSaveList: this.formData.weeklyThoughtSaveList,
        weeklyWorkVoSaveList: this.formData.weeklyWorkVoSaveList,
      };
      const v1 = new Promise((resolve) => {
        this.$refs.formDom.validate((valid) => {
          if (valid) resolve();
        });
      });
      const v2 = new Promise((resolve) => {
        this.$refs.formDomPlan.validate((valid) => {
          if (valid) resolve();
        });
      });
      const v3 = new Promise((resolve) => {
        this.$refs.formDomThought.validate((valid) => {
          if (valid) resolve();
        });
      });
      Promise.all([v1, v2, v3]).then(() => {
        console.log('验证表但通过');
        this.server.commitWeekly(params).then((res) => {
          if (res.code == 200) {
            this.$message.success('提交成功');
          }
        });
      });
    },
    happy() {
      this.weeklyEmotion = 0;
    },
    common() {
      this.weeklyEmotion = 50;
    },
    sad() {
      this.weeklyEmotion = 100;
    },
  },
  watch: {
    'formData.weeklyWorkVoSaveList': {
      handler(tableData) {
        // *****************将本周未完成任务自动同步至下周计划*************
        // 先清空本周未完成任务同步至下周任务数据
        for (const data of this.tempResult) {
          this.formData.weeklyPlanSaveList = this.formData.weeklyPlanSaveList.filter(
            (element) => element.randomId != data.randomId,
          );
        }
        // 清空临时数据
        this.tempResult = [];
        for (const item of tableData) {
          // 将未完成的任务自动同步至下周
          if (item.workProgress < 100 && item.workContent) {
            this.tempResult.push({
              planContent: item.workContent,
              planId: '',
              weeklyId: '',
              randomId: item.randomId,
            });
          }
        }
        // 合并数组;
        this.formData.weeklyPlanSaveList = [...this.tempResult, ...this.formData.weeklyPlanSaveList];
        // *****************将本周关联的个人目标、okr同步至个人okr完成度*************
        // 将weeklyWorkVoSaveList中的支撑项读出来,放入个人okr完成度中
        this.weeklyOkrSaveList = [];
        for (const data of tableData) {
          if (data.supportMyOkrObj && data.supportMyOkrObj.o) {
            if (data.supportMyOkrObj.kr) { // kr
              this.$set(data.supportMyOkrObj, 'confidenceAfter', data.supportMyOkrObj.kr.okrDetailConfidence);
              this.$set(data.supportMyOkrObj, 'confidenceBefor', data.supportMyOkrObj.kr.okrDetailConfidence);
              this.$set(data.supportMyOkrObj, 'okrDetailId', data.supportMyOkrObj.kr.okrDetailId);
              this.$set(data.supportMyOkrObj, 'progressAfter', data.supportMyOkrObj.kr.okrDetailProgress);
              this.$set(data.supportMyOkrObj, 'progressBefor', data.supportMyOkrObj.kr.okrDetailProgress);
            } else { // o
              this.$set(data.supportMyOkrObj, 'confidenceAfter', data.supportMyOkrObj.o.okrDetailConfidence);
              this.$set(data.supportMyOkrObj, 'confidenceBefor', data.supportMyOkrObj.o.okrDetailConfidence);
              this.$set(data.supportMyOkrObj, 'okrDetailId', data.supportMyOkrObj.o.okrDetailId);
              this.$set(data.supportMyOkrObj, 'progressAfter', data.supportMyOkrObj.o.okrDetailProgress);
              this.$set(data.supportMyOkrObj, 'progressBefor', data.supportMyOkrObj.o.okrDetailProgress);
            }
            this.weeklyOkrSaveList.push({ ...data.supportMyOkrObj });
          }
        }
      },
      deep: true,
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
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
.text-color-red {
  color: brown;
}
.no-risk {
  background: green;
}
.risk-is-controlled {
  background: yellow;
}
.risk-cannot-be-controlled {
  background: red;
}
</style>