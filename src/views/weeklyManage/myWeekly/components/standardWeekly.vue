<!--与原型不一致的地方
1、进度条，直接显示进度条，且可滑动
2、关联项目直接使用下拉框
3、

-->
<template>
  <div class="home">
    <div>
      <el-form :rules="formData.rules" :model="formData" ref="formDom">
        <el-table ref="workTable" v-loading="tableLoading" :data="formData.weeklyWorkVoSaveList">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="工作项" prop="workContent" :render-header="renderHeader">
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
          <el-table-column label="内容" prop="workDesc" :render-header="renderHeader">
            <template slot-scope="scope">
              <el-form-item
                :prop="'weeklyWorkVoSaveList.' + scope.$index + '.workDesc'"
                :rules="formData.rules.workDesc"
              >
                <el-input
                  type="textarea"
                  v-model.trim="scope.row.workDesc"
                  maxlength="1000"
                  clearable
                  placeholder="请描述具体工作内容"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="进度" prop="workProgress" :render-header="renderHeader">
            <template slot-scope="scope">
              <el-slider
                v-model="scope.row.workProgress"
                @change="tableProcessChange(scope.row)"
                :step="1"
                show-input
              ></el-slider>
            </template>
          </el-table-column>
          <el-table-column width="220" label="投入工时" prop="workTime" :render-header="renderHeader">
            <template slot-scope="scope">
              <el-input-number
                controls-position="right"
                v-model.trim="scope.row.workTime"
                :precision="0"
                :step="1"
                :min="1"
                :max="80"
              ></el-input-number>h
            </template>
          </el-table-column>
          <el-table-column label="关联项目" prop="projectId" :render-header="renderHeader">
            <template slot-scope="scope">
              <el-form-item
                :prop="'weeklyWorkVoSaveList.' + scope.$index + '.validateProjectId'"
                :rules="formData.rules.validateProjectId"
              >
                <el-select
                  v-model="scope.row.validateProjectId"
                  filterable
                  placeholder="请选择项目"
                  remote
                  :remote-method="remoteMethod"
                  @change="projectChange(scope.row)"
                >
                  <el-option
                    v-for="item in thisPageProjectList"
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
                content="若您此项工作所属项目暂时没有进入OA，则可以选择该“临时项目”，支撑OKR可不填"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
              <div></div>
            </template>
          </el-table-column>
          <el-table-column label="支撑OKR/价值观" prop="valueOrOkrIds" :render-header="renderHeader">
            <!-- okrIds -->
            <template slot-scope="scope">
              <!-- 临时项目可不选择支撑项 -->
              <el-form-item
                :prop="'weeklyWorkVoSaveList.' + scope.$index + '.valueOrOkrIds'"
                :rules="scope.row.projectId ? formData.rules.valueOrOkrIds:''"
              >
                <el-input
                  @focus="addSupportOkr(scope.row)"
                  v-model.trim="scope.row.valueOrOkrIds"
                  placeholder="请选择所支撑OKR/价值观"
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
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown
                @command="deleteItem(scope.row)"
                v-if="formData.weeklyWorkVoSaveList.length > 1"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-more el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <el-button @click="addItem" style>新增</el-button>
    </div>
    <!-- 本周感想、建议、收获 -->
    <div style="marginTop:50px">
      <h1>本周感想、建议、收获</h1>
      <el-form ref="formDomThought" :model="formData">
        <el-table :data="formData.weeklyThoughtSaveList">
          <el-table-column prop="workContent">
            <template slot-scope="scope">
              <el-form-item>
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
                    maxlength="100"
                    placeholder="请简单说一下你的感想，不超过100个字"
                  ></el-input>
                  <i
                    style="cursor:pointer"
                    class="el-icon-minus"
                    v-if="formData.weeklyThoughtSaveList.length > 1"
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
    </div>
    <!-- 下周计划 -->
    <div style="marginTop:50px">
      <h1>下周计划</h1>
      <el-form :model="formData">
        <el-table ref="dicTable" v-loading="tableLoading" :data="formData.weeklyPlanSaveList">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="工作项" prop="planContent">
            <template slot-scope="scope">
              <el-form-item>
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
            <span style="marginLeft:15px">被工作项{{itemIndex(item.kr)}}支撑</span>
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
              <el-slider
                v-model="item.progressAfter"
                @change="processChange(item)"
                :step="1"
                show-input
                style="width:20%"
              ></el-slider>
            </span>
            <span style="marginLeft:15px">
              本周变化
              <span
                v-show="item.progressAfter != item.progressBefor"
              >{{item.progressAfter-item.progressBefor > 0 ? "+" : ""}}</span>
              <span>{{item.progressAfter-item.progressBefor}}%</span>
            </span>
          </div>
        </div>
        <!-- 目标 -->
        <div v-else>
          <div>
            目标
            <span style="marginLeft:15px">{{item.o.okrDetailObjectKr}}</span>
            <span style="marginLeft:15px">被工作项{{itemIndex(item.o)}}支撑</span>
            <span style="marginLeft:15px">
              当前进度
              <el-slider
                v-model="item.progressAfter"
                @change="processChange(item)"
                :step="1"
                show-input
                style="width:20%"
              ></el-slider>
            </span>
            <span style="marginLeft:15px">
              本周变化
              <span
                v-show="item.progressAfter != item.progressBefor"
              >{{item.progressAfter-item.progressBefor > 0 ? "+" : ""}}</span>
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
        <span :class="{'text-color-red': weeklyEmotion==100}">开心</span>
        <el-button @click="common">平常</el-button>
        <span :class="{'text-color-red': weeklyEmotion==50}">平常</span>
        <el-button @click="sad">沮丧</el-button>
        <span :class="{'text-color-red': weeklyEmotion==0}">沮丧</span>
      </span>
      <el-button style="marginLeft:65px" :disabled="!canEdit" @click="commitWeekly">提交</el-button>
    </div>
    <!-- 添加支撑项 -->
    <add-okr
      ref="addOkr"
      v-if="showAddOkr"
      :showAddOkr.sync="showAddOkr"
      :currenItemrandomId="currenItemrandomId"
      :selectedOkr="selectedOkr"
      :server="server"
      :myOkrList="myOkrList"
      :orgOkrList="orgOkrList"
      :originalMyOkrList="originalMyOkrList"
      :originalOrgOkrList="originalOrgOkrList"
      :cultureList="cultureList"
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
  props: {
    calendarId: {
      type: String,
      default() {
        return '';
      },
    },
    weeklyType: {
      type: String,
      default() {
        return '';
      },
    },
    weeklyData: {
      type: Object,
      default() {
        return {};
      },
    },
    myOkrList: {
      type: Array,
      default() {
        return [];
      },
    },
    orgOkrList: {
      type: Array,
      default() {
        return [];
      },
    },
    originalMyOkrList: {
      type: Array,
      default() {
        return [];
      },
    },
    originalOrgOkrList: {
      type: Array,
      default() {
        return [];
      },
    },
    // projectList: {
    //   type: Array,
    //   default() {
    //     return [];
    //   },
    // },
    cultureList: {
      type: Array,
      default() {
        return [];
      },
    },
    canEdit: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  data() {
    return {
      server,
      weeklyEmotion: '100',
      weeklyId: this.weeklyData.weeklyId ? this.weeklyData.weeklyId : '',
      tableLoading: false,
      currenItemrandomId: '',
      showAddOkr: false,
      thisPageProjectList: [],
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
      selectedOkr: [],
      tempResult: [],
      weeklyOkrSaveList: [],
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
    itemIndex() {
      return (okr) => {
        const result = [];
        this.formData.weeklyWorkVoSaveList.forEach((item) => {
          item.selectedOkr.forEach((element) => {
            if (okr.okrDetailId == element.okrDetailId) {
              result.push(this.formData.weeklyWorkVoSaveList.indexOf(item) + 1);
            }
          });
        });
        return result.join('、');
      };
    },
  },
  methods: {
    init() {
      // 本周任务初始化数据
      this.addWork();
      // 下周计划初始化数据
      this.addNextWeekWork();
      // 本周感想初始化数据
      this.addThought();
      // 如果是已提交过的数据，初始化数据
      this.initPage();
      // this.thisPageProjectList = [...this.projectList];
      this.remoteMethod();
    },
    initPage() {
      if (this.weeklyData.weeklyId) {
        this.formData.weeklyWorkVoSaveList = this.weeklyData.weeklyWorkVoList;// 列表数据

        // 反显个人OKR进度,判断支撑okr中是否有个人okr，如果有则现在是个人okr进度（O、KR）
        this.setOkrProcess(this.weeklyData.weeklyOkrVoList);
        // 反显周报列表数据
        this.setWorkTableData();
        // 反显本周感想
        this.setThoughts();
        // 反显下周计划
        this.setNextWeekPlan();
      }
    },
    setOkrProcess(weeklyOkrVoList) {
      // 将上次保存的o、kr找出来，多行支撑项
      const supportList = [];
      for (const okr of weeklyOkrVoList) {
        let supportObj = {};
        for (const o of this.originalMyOkrList) {
          if (okr.okrDetailId == o.okrDetailId) {
            o.id = okr.id;
            o.weeklyId = okr.weeklyId;
            supportObj = { o };
          }
          for (const kr of o.krList) {
            if (kr.okrDetailId == okr.okrDetailId) {
              kr.id = okr.id;
              kr.weeklyId = okr.weeklyId;
              supportObj = { o, kr };
            }
          }
        }
        // 每行数据的支撑项整理好了
        supportList.push(supportObj);
      }
      // 将支撑项塞到列表对应行中，监听到到表格数据变化侯，会将个人okr进度反显出来
      for (const tableItem of this.formData.weeklyWorkVoSaveList) {
        // 遍历整理好的数据
        for (const supportItem of supportList) {
          // 如果仅仅是个人目标
          if (tableItem.workOkrList.length > 0 && tableItem.workOkrList[0].okrDetailId == supportItem.o.okrDetailId) {
            this.$set(tableItem, 'supportMyOkrObj', supportItem);
          }
          // 如果是个人KR
          if (
            supportItem.kr
            && tableItem.workOkrList.length > 0
            && tableItem.workOkrList[0].okrDetailId == supportItem.kr.okrDetailId) {
            this.$set(tableItem, 'supportMyOkrObj', supportItem);
          }
        }
      }
    },
    setWorkTableData() {
      this.weeklyEmotion = this.weeklyData.weeklyEmotion;// 心情
      this.formData.weeklyWorkVoSaveList.forEach((element) => {
        this.$set(element, 'randomId', Math.random().toString(36).substr(3));
        const valueIdList = [];
        const okrIdList = [];
        element.okrCultureValueList.forEach((item) => { // 将价值观数据添加与okr一样的字段
          item.okrDetailId = item.id;
          item.okrDetailObjectKr = item.cultureName;
          this.$set(item, 'randomId', Math.random().toString(36).substr(3));
          valueIdList.push(item.id);
        });
        element.workOkrList.forEach((item) => {
          this.$set(item, 'randomId', Math.random().toString(36).substr(3));
          okrIdList.push(item.okrDetailId);
        });
        this.$set(element, 'okrIdList', okrIdList);// 将已选okr设置在行数据中
        this.$set(element, 'valueIdList', valueIdList);// 将已选价值观设置在行数据中
        this.$set(element, 'selectedOkr', [...element.okrCultureValueList, ...element.workOkrList]);// 反显已勾选的价值观、okr
        this.$set(element, 'validateProjectId', element.projectId);// 校验项目
        this.$set(element, 'valueOrOkrIds', valueIdList.join(',') + okrIdList.join(','));// 校验支撑项
        this.$set(element, 'okrCultureValueIds', valueIdList.join(','));// 存到后端的价值观
        this.$set(element, 'okrIds', okrIdList.join(','));// 存到后端的okr
      });
    },
    setThoughts() {
      this.formData.weeklyThoughtSaveList = this.weeklyData.weeklyThoughtList;
      this.formData.weeklyThoughtSaveList.forEach((thought) => {
        thought.randomId = Math.random().toString(36).substr(3);
      });
    },
    setNextWeekPlan() {
      this.formData.weeklyPlanSaveList = this.weeklyData.weeklyPlanList;
      this.formData.weeklyPlanSaveList.forEach((plan) => {
        plan.randomId = Math.random().toString(36).substr(3);
      });
    },
    remoteMethod(query) {
      // if (query !== '') {
      this.server.getProjectList({
        pageSize: 20,
        currentPage: 1,
        projectName: query,
      }).then((res) => {
        if (res.code == 200) {
          this.thisPageProjectList = res.data.content;
        }
      });
      // }
    },
    addItem() { // 添加本地数据
      this.addWork();
    },
    addWork() {
      let defaultProjectId = '';
      if (this.formData.weeklyWorkVoSaveList.length > 0) {
        defaultProjectId = this.formData.weeklyWorkVoSaveList[this.formData.weeklyWorkVoSaveList.length - 1].projectId;
      }
      this.formData.weeklyWorkVoSaveList.push({
        okrCultureValueIds: '',
        okrIds: '',
        projectId: defaultProjectId,
        weeklyId: '',
        workContent: '',
        workDesc: '',
        workId: '',
        workIndex: 0,
        workProgress: 0,
        workTime: 0,
        selectedOkr: [],
        randomId: Math.random().toString(36).substr(3), // 添加随机id，用于删除环节
        validateProjectId: defaultProjectId, // 用于校验项目是否选中
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
      data.validateProjectId = '临时项目';//
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
          let valueIdList = [];
          let okrIdList = [];
          // 删除对应okr、价值观id
          valueIdList = item.valueIdList.filter((id) => okr.okrDetailId != id);
          okrIdList = item.okrIdList.filter((id) => okr.okrDetailId != id);
          item.okrCultureValueIds = valueIdList.join(',');
          item.okrIds = okrIdList.join(',');
          this.$set(item, 'okrIdList', okrIdList);
          this.$set(item, 'valueIdList', valueIdList);

          // 添加该字段用于校验支撑项
          this.$set(item, 'valueOrOkrIds', item.okrCultureValueIds + item.okrIds);
          // 删掉对应的支撑项
          // item.selectedOkr = selectedData.selectedOkrAndCulture;
          delete item.supportMyOkrObj;
        }
      }
    },

    closeOkrDialog(selectedData) {
      for (const item of this.formData.weeklyWorkVoSaveList) {
        const valueIdList = [];
        const okrIdList = [];
        if (item.randomId == selectedData.currenItemrandomId) {
          // 给列表赋值，价值观、任务项，用于提交
          selectedData.selectedCulture.forEach((value) => {
            valueIdList.push(value.okrDetailId);
          });
          selectedData.selectedOkr.forEach((okr) => {
            okrIdList.push(okr.okrDetailId);
          });
          item.okrCultureValueIds = valueIdList.join(',');
          item.okrIds = okrIdList.join(',');
          this.$set(item, 'valueIdList', valueIdList);
          this.$set(item, 'okrIdList', okrIdList);
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
      // 将下周计划、感想有未填写的内容的数据删除
      this.formData.weeklyThoughtSaveList = this.formData.weeklyThoughtSaveList.filter(
        (thought) => !!thought.thoughtContent,
      );
      this.formData.weeklyPlanSaveList = this.formData.weeklyPlanSaveList.filter(
        (plan) => !!plan.planContent,
      );
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
      // const v2 = new Promise((resolve) => {
      //   this.$refs.formDomPlan.validate((valid) => {
      //     if (valid) resolve();
      //   });
      // });
      // const v3 = new Promise((resolve) => {
      //   this.$refs.formDomThought.validate((valid) => {
      //     if (valid) resolve();
      //   });
      // });
      // Promise.all([v1, v2, v3]).then(() => {
      Promise.all([v1]).then(() => {
        this.server.commitWeekly(params).then((res) => {
          if (res.code == 200) {
            this.$message.success('提交成功');
            // 刷新日历数据
            this.$busEmit('refreshCalendar');
            // 更新个人okr数据
            this.$emit('refreshMyOkr');
          }
        });
      });
    },
    happy() {
      this.weeklyEmotion = 100;
    },
    common() {
      this.weeklyEmotion = 50;
    },
    sad() {
      this.weeklyEmotion = 0;
    },
    renderHeader(h, { column }) {
      // 这里在最外层插入一个div标签
      return h('div', [// h即为cerateElement的简写
        h('span', { style: { color: 'red' } }, '*'),
        // 在div里面插入span
        h('span', {
          // 表示内容
          domProps: {
            innerHTML: column.label,
          },
        }),

      ]);
    },
    processChange(item) {
      item.progressAfter = Math.round(item.progressAfter);
    },
    tableProcessChange(item) {
      item.workProgress = Math.round(item.workProgress);
    },
  },
  watch: {
    'formData.weeklyWorkVoSaveList': {
      handler(tableData) {
        // *****************将本周未完成任务自动同步至下周计划*************
        // 先清空本周未完成任务同步至下周任务数据(周边那你编辑时不需要)
        if (!this.weeklyData.weeklyId) {
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
        }
        // *****************将本周关联的个人目标、okr同步至个人okr完成度*************
        // 将weeklyWorkVoSaveList中的支撑项读出来,放入个人okr完成度中
        this.weeklyOkrSaveList = [];
        const tempWeeklyOkrSaveList = [];
        for (const data of tableData) {
          // 临时项目反显
          if (data.workId && !data.projectId) {
            data.validateProjectId = '临时项目';
          }
          if (data.supportMyOkrObj && data.supportMyOkrObj.o) {
            if (data.supportMyOkrObj.kr) { // kr
              this.$set(data.supportMyOkrObj, 'okrDetailId', data.supportMyOkrObj.kr.okrDetailId);
              this.$set(data.supportMyOkrObj, 'confidenceAfter', data.supportMyOkrObj.kr.okrDetailConfidence);
              this.$set(data.supportMyOkrObj, 'progressAfter', data.supportMyOkrObj.kr.okrDetailProgress);
              if (data.supportMyOkrObj.kr.id) { // 判断是不是前端临时数据、还是后端返回的数据
                // 后端数据中匹配
                this.weeklyData.weeklyOkrVoList.forEach((element) => {
                  if (element.okrDetailId == data.supportMyOkrObj.kr.okrDetailId) {
                    this.$set(data.supportMyOkrObj, 'confidenceBefor', element.confidenceBefor);
                    this.$set(data.supportMyOkrObj, 'progressBefor', element.progressBefor);
                  }
                });
              } else {
                this.$set(data.supportMyOkrObj, 'confidenceBefor', data.supportMyOkrObj.kr.okrDetailConfidence);
                this.$set(data.supportMyOkrObj, 'progressBefor', data.supportMyOkrObj.kr.okrDetailProgress);
              }
            } else { // o
              this.$set(data.supportMyOkrObj, 'okrDetailId', data.supportMyOkrObj.o.okrDetailId);
              // this.$set(data.supportMyOkrObj, 'confidenceAfter', data.supportMyOkrObj.o.okrDetailConfidence);
              this.$set(data.supportMyOkrObj, 'progressAfter', data.supportMyOkrObj.o.okrDetailProgress);
              // 如果是详情则从详情中取值
              if (data.supportMyOkrObj.o.id) {
                // 后端数据中匹配
                this.weeklyData.weeklyOkrVoList.forEach((element) => {
                  if (element.okrDetailId == data.supportMyOkrObj.o.okrDetailId) {
                    // this.$set(data.supportMyOkrObj, 'confidenceBefor', element.confidenceBefor);
                    this.$set(data.supportMyOkrObj, 'progressBefor', element.progressBefor);
                  }
                });
              } else {
                // this.$set(data.supportMyOkrObj, 'confidenceBefor', data.supportMyOkrObj.o.okrDetailConfidence);
                this.$set(data.supportMyOkrObj, 'progressBefor', data.supportMyOkrObj.o.okrDetailProgress);
              }
            }
            tempWeeklyOkrSaveList.push({
              id: data.supportMyOkrObj.kr ? data.supportMyOkrObj.kr.id : '',
              weeklyId: data.supportMyOkrObj.kr ? data.supportMyOkrObj.kr.weeklyId : '',
              ...data.supportMyOkrObj,
            });
          }
        }
        // 去重
        const result = [];
        const obj = {};
        for (let i = 0; i < tempWeeklyOkrSaveList.length; i += 1) {
          if (!obj[tempWeeklyOkrSaveList[i].okrDetailId]) {
            result.push(tempWeeklyOkrSaveList[i]);
            obj[tempWeeklyOkrSaveList[i].okrDetailId] = true;
          }
        }
        this.weeklyOkrSaveList = result;
      },
      deep: true,
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