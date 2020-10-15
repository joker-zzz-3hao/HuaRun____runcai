<template>
  <div class="write-weekly">
    <div class="weekly-cont">
      <el-form
        :rules="formData.rules"
        :model="formData"
        ref="formDom"
        class="tl-form"
      >
        <el-table
          ref="workTable"
          v-loading="tableLoading"
          :data="formData.weeklyWorkVoSaveList"
          class="tl-table flex"
        >
          <el-table-column
            label="序号"
            type="index"
            width="55"
          ></el-table-column>
          <el-table-column
            label="工作项"
            prop="workContent"
            :render-header="renderHeader"
            min-width="300"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'weeklyWorkVoSaveList.' + scope.$index + '.workContent'"
                :rules="formData.rules.workContent"
              >
                <el-input
                  v-model.trim="scope.row.workContent"
                  size="small"
                  maxlength="100"
                  clearable
                  placeholder="请用一句话概括某项工作，不超过100个字符"
                  class="tl-input"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="进度"
            prop="workProgress"
            :render-header="renderHeader"
            min-width="120"
          >
            <template slot-scope="scope">
              <template v-if="timeDisabled">
                <el-form-item
                  v-if="timeDisabled"
                  :prop="
                    'weeklyWorkVoSaveList.' + scope.$index + '.workProgress'
                  "
                  :rules="formData.rules.workProgress"
                >
                  <el-input
                    v-model="scope.row.workProgress"
                    controls-position="right"
                    :min="0"
                    :max="100"
                    class="tl-input-number"
                  ></el-input>
                </el-form-item>
              </template>
              <!-- 编辑完提交后展示 -->
              <tl-process
                v-else
                :data="scope.row.workProgress"
                :width="36"
                :marginLeft="6"
              ></tl-process
              >%
            </template>
          </el-table-column>
          <el-table-column
            label="投入工时"
            prop="workTime"
            :render-header="renderHeader"
            min-width="130"
          >
            <template slot-scope="scope">
              <el-form-item
                v-if="timeDisabled"
                :prop="'weeklyWorkVoSaveList.' + scope.$index + '.workTime'"
                :rules="formData.rules.workTime"
              >
                <el-input
                  v-if="timeDisabled"
                  controls-position="right"
                  v-model.trim="scope.row.workTime"
                  :precision="1"
                  :step="0.5"
                  :min="0"
                  :max="5"
                  @change="workTimeChange(scope.row)"
                  class="tl-input-number"
                ></el-input>
              </el-form-item>
              <!-- 编辑完提交后展示 -->
              <em v-else>{{ scope.row.workTime }}</em>
              <span>天</span>
            </template>
          </el-table-column>
          <el-table-column
            label="关联项目"
            :render-header="renderHeader"
            min-width="300"
          >
            <template slot-scope="scope">
              <el-form-item
                v-if="timeDisabled"
                :prop="'weeklyWorkVoSaveList.' + scope.$index + '.projectId'"
                :rules="formData.rules.projectId"
              >
                <el-select
                  v-model="scope.row.projectId"
                  placeholder="请选择关联项目"
                  size="small"
                  @change="projectChange(scope.row)"
                >
                  <el-option
                    v-for="item in projectList"
                    :key="item.projectId"
                    :label="item.projectNameCn"
                    :value="item.projectId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <em v-else>{{ scope.row.projectNameCn }}</em>
            </template>
          </el-table-column>
          <el-table-column
            label="支撑OKR/价值观"
            prop="valueOrOkrIds"
            :render-header="renderHeader"
            min-width="150"
          >
            <!-- okrIds -->
            <template slot-scope="scope">
              <!-- 临时项目可不选择支撑项 -->
              <el-form-item
                :prop="
                  'weeklyWorkVoSaveList.' + scope.$index + '.valueOrOkrIds'
                "
                :rules="formData.rules.valueOrOkrIds"
              >
                <div class="tag-group">
                  <ul class="tag-lists">
                    <li
                      v-for="item in scope.row.selectedOkr"
                      :key="item.okrDetailId"
                    >
                      <el-tooltip
                        class="select-values"
                        effect="dark"
                        placement="top"
                        popper-class="tl-tooltip-popper"
                      >
                        <em slot="content">{{ item.okrDetailObjectKr }}</em>
                        <em
                          @click="timeDisabled ? addSupportOkr(scope.row) : ''"
                          >{{ setOkrStyle(item.okrDetailObjectKr) }}</em
                        >
                      </el-tooltip>
                      <!-- <i
                        @click="deleteOkr(item, scope.row.randomId)"
                        class="el-icon-close"
                      ></i> -->
                    </li>
                    <li
                      class="icon-bg"
                      v-if="scope.row.selectedOkr.length < 1"
                      @click="addSupportOkr(scope.row)"
                    >
                      <i class="el-icon-plus"></i>
                    </li>
                  </ul>
                </div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column fixed="right" width="40">
            <template slot-scope="scope" v-if="timeDisabled">
              <el-tooltip
                class="icon-clear"
                :class="{
                  'is-disabled': formData.weeklyWorkVoSaveList.length == 1,
                }"
                effect="dark"
                :content="
                  formData.weeklyWorkVoSaveList.length > 1
                    ? '删除'
                    : '至少有一条工作项'
                "
                placement="top"
                popper-class="tl-tooltip-popper"
                @click.native="
                  formData.weeklyWorkVoSaveList.length > 1 &&
                    deleteItem(scope.row)
                "
              >
                <i class="el-icon-minus"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="btn-box">
        <el-button
          type="text"
          @click="addItem"
          class="tl-btn dotted-line list-add"
          v-if="timeDisabled"
        >
          <i class="el-icon-plus"></i>添加
        </el-button>
      </div>
    </div>
    <!-- 个人OKR完成度 -->
    <dl class="dl-card-panel okr-completion">
      <dt class="card-title"><em>个人OKR完成度</em></dt>
      <!-- 这里循环 dd 每一条支撑周报的 O 或者 是  KR  如果是O ？is-o：is-kr -->
      <dd v-if="weeklyOkrSaveList.length < 1">暂无关联的OKR</dd>
      <dd
        class="undertake-okr-list"
        :class="item.kr ? 'is-kr' : 'is-o'"
        v-for="item in weeklyOkrSaveList"
        :key="item.o.okrdetailId"
      >
        <div class="o-kr-group" v-if="item.kr">
          <div class="tag-kind">
            <span class="kind-parent">目标</span>
            <el-tooltip
              class="select-values"
              effect="dark"
              placement="top"
              popper-class="tl-tooltip-popper"
            >
              <em slot="content">{{ item.o.okrDetailObjectKr }}</em>
              <em>{{ item.o.okrDetailObjectKr }}</em>
            </el-tooltip>
          </div>
        </div>
        <div class="o-kr-group">
          <template v-if="item.kr">
            <div class="tag-kind">
              <span class="kind-child">KR</span>
              <el-tooltip
                class="select-values"
                effect="dark"
                placement="top"
                popper-class="tl-tooltip-popper"
              >
                <em slot="content">{{ item.kr.okrDetailObjectKr }}</em>
                <em>{{ item.kr.okrDetailObjectKr }}</em>
              </el-tooltip>
              <span
                >被工作项<em>{{ itemIndex(item.kr) }}</em
                >支撑</span
              >
            </div>
          </template>
          <template v-else>
            <div class="tag-kind">
              <span class="kind-parent">目标</span>
              <el-tooltip
                class="select-values"
                effect="dark"
                placement="top"
                popper-class="tl-tooltip-popper"
              >
                <em slot="content">{{ item.o.okrDetailObjectKr }}</em>
                <em>{{ item.o.okrDetailObjectKr }}</em>
              </el-tooltip>
              <span
                >被工作项<em>{{ itemIndex(item.o) }}</em
                >支撑</span
              >
            </div>
          </template>
          <div class="okr-risk" v-if="item.kr">
            <span>信心指数</span>
            <template v-if="timeDisabled">
              <tl-confidence
                v-model="item.confidenceAfter"
                @change="changeConfidence"
              ></tl-confidence>
            </template>
            <template v-else>
              <div class="state-grid">
                <div
                  :class="{
                    'is-no-risk': item.confidenceAfter == 1,
                    'is-risks': item.confidenceAfter == 2,
                    'is-uncontrollable': item.confidenceAfter == 3,
                  }"
                ></div>
                <div
                  :class="{
                    'is-risks': item.confidenceAfter == 2,
                    'is-uncontrollable': item.confidenceAfter == 3,
                  }"
                ></div>
                <div
                  :class="{
                    'is-uncontrollable': item.confidenceAfter == 3,
                  }"
                ></div>
              </div>
              <div class="state-txt">
                {{ CONST.CONFIDENCE_MAP[item.confidenceAfter] }}
              </div>
            </template>
          </div>
          <div class="tl-progress-group">
            <span>当前进度</span>
            <tl-process
              :data="parseInt(item.progressAfter, 10)"
              :showNumber="false"
              :width="30"
              :marginLeft="2"
            ></tl-process>
            <el-slider
              v-if="timeDisabled"
              v-model="item.progressAfter"
              :step="1"
              @change="processChange(item)"
              tooltip-class="slider-tooltip"
            ></el-slider>
            <el-input-number
              v-if="timeDisabled"
              v-model="item.progressAfter"
              controls-position="right"
              :min="0"
              :max="100"
              :step="1"
              :precision="0"
              class="tl-input-number"
            ></el-input-number>
            <!-- <el-input
              v-if="timeDisabled"
              v-model="item.progressAfter"
              controls-position="right"
              class="tl-input-number"
            ></el-input> -->
            <em v-else>{{ item.progressAfter }}</em>
            <span>%</span>
          </div>
          <div class="week-change">
            <span>本周变化</span
            ><em
              >{{ item.progressAfter - item.progressBefor > 0 ? "+" : ""
              }}{{ item.progressAfter - item.progressBefor }}%</em
            >
          </div>
        </div>
      </dd>
    </dl>
    <!-- 以下是你的原版 -->
    <div v-if="showTaskProcess" class="degree-completion">
      <!-- <h1>个人OKR完成度</h1> -->
      <div v-for="item in weeklyOkrSaveList" :key="item.o.okrdetailId"></div>
    </div>
    <!-- 本周心情 -->
    <dl class="dl-card-panel">
      <dt class="card-title"><em>本周心情</em></dt>
      <dd></dd>
    </dl>
    <div class="week-mood">
      <span>
        请选择本周心情
        <el-button @click="setEmotion(100)">有收获</el-button>
        <span :class="{ 'text-color-red': weeklyEmotion == 100 }">有收获</span>
        <el-button @click="setEmotion(50)">还行吧</el-button>
        <span :class="{ 'text-color-red': weeklyEmotion == 50 }">还行吧</span>
        <el-button @click="setEmotion(0)">让我静静</el-button>
        <span :class="{ 'text-color-red': weeklyEmotion == 0 }">让我静静</span>
      </span>
    </div>

    <div class="btn-box">
      <el-button
        :disabled="!canEdit"
        type="primary"
        @click="commitWeekly"
        class="tl-btn amt-bg-slip"
        >提交</el-button
      >
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
    <select-project
      ref="selectProject"
      :showProjectDialog.sync="showProjectDialog"
      v-if="showProjectDialog"
      :server="server"
      :randomIdForProject="randomIdForProject"
      @closeProjectDia="closeProjectDia"
    ></select-project>
  </div>
</template>

<script>
import tlProcess from '@/components/process';
import CONST from '@/components/const';
import Server from '../server';
import selectProject from './selectProject';

import addOkr from './addOkr';
import mixin from '../validateMixin';

const server = new Server();
export default {
  name: 'standardWeekly',
  mixins: [mixin],
  components: {
    'add-okr': addOkr,
    selectProject,
    tlProcess,
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
    cultureList: {
      type: Array,
      default() {
        return [];
      },
    },
    projectList: {
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
    timeDisabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      server,
      CONST,
      weeklyEmotion: '100',
      weeklyId: this.weeklyData.weeklyId ? this.weeklyData.weeklyId : '',
      tableLoading: false,
      currenItemrandomId: '',
      showAddOkr: false,
      showProjectDialog: false,
      thisPageProjectList: [],
      formData: {
        rules: {
          workContent: {
            type: 'string',
            required: true,
            message: '请填写任务项',
            trigger: 'blur',
          },
          projectId: {
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
      },
      weekList: [{}],
      selectedOkr: [],
      weeklyOkrSaveList: [],
      riskList: [
        {
          value: 1,
          label: '高',
        },
        {
          value: 2,
          label: '中',
        },
        {
          value: 3,
          label: '低',
        },
      ],
      showTaskProcess: false,
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
    workItem() {
      return '工作项';
    },
    itemIndex() {
      return (okr) => {
        const result = [];
        if (okr) {
          this.formData.weeklyWorkVoSaveList.forEach((item) => {
            item.selectedOkr.forEach((element) => {
              if (okr.okrDetailId == element.okrDetailId) {
                result.push(this.formData.weeklyWorkVoSaveList.indexOf(item) + 1);
              }
            });
          });
          return result.join('、');
        }
      };
    },
  },
  methods: {
    init() {
      // 本周任务初始化数据
      this.addWork();
      // 如果是已提交过的数据，初始化数据
      this.initPage();
      // this.thisPageProjectList = [...this.projectList];
    },
    initPage() {
      if (this.weeklyData.weeklyId) {
        this.formData.weeklyWorkVoSaveList = this.weeklyData.weeklyWorkVoList;// 列表数据
        this.setWorkTableData();
        // 反显个人OKR进度,判断支撑okr中是否有个人okr，如果有则现在是个人okr进度（O、KR）
        this.setOkrProcess(this.weeklyData.weeklyOkrVoList);
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
      this.formData.weeklyWorkVoSaveList.forEach((tableItem) => { // 列表行数据
        tableItem.workOkrList.forEach((workOkr) => { // 行数据中的支撑项
          // 遍历整理好的数据
          supportList.forEach((supportItem) => {
            // 如果仅仅是个人目标
            if (workOkr.okrDetailId == supportItem.o.okrDetailId) {
              this.$set(tableItem, 'supportMyOkrObj', supportItem);
            }
            // 如果是个人KR
            if (
              supportItem.kr
                && tableItem.workOkrList.length > 0
                && workOkr.okrDetailId == supportItem.kr.okrDetailId) {
              this.$set(tableItem, 'supportMyOkrObj', supportItem);
            }
          });
        });
      });
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
        this.$set(element, 'valueOrOkrIds', valueIdList.join(',') + okrIdList.join(','));// 校验支撑项
        this.$set(element, 'okrCultureValueIds', valueIdList.join(','));// 存到后端的价值观
        this.$set(element, 'okrIds', okrIdList.join(','));// 存到后端的okr
      });
    },
    addWork() {
      let projectId = '';
      let projectNameCn = '';
      if (this.formData.weeklyWorkVoSaveList.length > 0) {
        projectId = this.formData.weeklyWorkVoSaveList[this.formData.weeklyWorkVoSaveList.length - 1].projectId;
        projectNameCn = this.formData.weeklyWorkVoSaveList[this.formData.weeklyWorkVoSaveList.length - 1].projectNameCn;
      }
      this.formData.weeklyWorkVoSaveList.push({
        okrCultureValueIds: '',
        okrIds: '',
        projectId,
        projectNameCn,
        weeklyId: '',
        workContent: '',
        workDesc: '',
        workId: '',
        workIndex: 0,
        workProgress: 0,
        workTime: 0,
        selectedOkr: [],
        randomId: Math.random().toString(36).substr(3), // 添加随机id，用于删除环节
      });
      this.$forceUpdate();
    },

    addItem() { // 添加本地数据
      this.addWork();
    },
    deleteItem(item) {
      // 本地数据、后端数据
      this.formData.weeklyWorkVoSaveList = this.formData.weeklyWorkVoSaveList.filter(
        (thisWeek) => {
          if (item.randomId) {
            return thisWeek.randomId != item.randomId;
          } if (item.workId) {
            return thisWeek.workId != item.workId;
          }
          return thisWeek;
        },
      );
    },
    addSupportOkr(data) {
      this.currenItemrandomId = data.randomId || data.workId;
      this.selectedOkr = data.selectedOkr;
      this.showAddOkr = true;
    },
    deleteOkr(okr, randomId) {
      // 删除已选择的价值观、okr
      for (const item of this.formData.weeklyWorkVoSaveList) {
        // 本地数据、后端数据
        if (item.randomId == randomId || item.workId == okr.workId) {
          item.selectedOkr = item.selectedOkr.filter((element) => element.okrDetailId != okr.okrDetailId);
          let valueIdList = [];
          let okrIdList = [];
          // 删除对应okr、价值观id
          valueIdList = item.valueIdList.filter((id) => okr.okrDetailId != id);
          okrIdList = item.okrIdList.filter((id) => okr.okrDetailId != id);
          item.okrCultureValueIds = valueIdList.join(',');
          item.okrIds = okrIdList.join(',');
          // 添加该字段用于校验支撑项
          this.$set(item, 'okrIdList', okrIdList);
          this.$set(item, 'valueIdList', valueIdList);
          this.$set(item, 'valueOrOkrIds', item.okrCultureValueIds + item.okrIds);
          // 删掉对应的支撑项
          delete item.supportMyOkrObj;
        }
      }
    },
    closeOkrDialog(selectedData) {
      for (const item of this.formData.weeklyWorkVoSaveList) {
        const valueIdList = [];
        const okrIdList = [];
        // 本地数据、后端数据
        if (item.randomId == selectedData.currenItemrandomId || item.workId == selectedData.currenItemrandomId) {
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
    commitWeekly() {
      // 表单校验
      const params = {
        calendarId: this.calendarId,
        weeklyEmotion: this.weeklyEmotion,
        weeklyId: this.weeklyId,
        weeklyType: this.weeklyType,
        weeklyOkrSaveList: this.weeklyOkrSaveList,
        weeklyWorkVoSaveList: this.formData.weeklyWorkVoSaveList,
      };
      this.$refs.formDom.validate((valid) => {
        if (valid) {
          this.server.commitWeekly(params).then((res) => {
            if (res.code == 200) {
              this.$message.success('提交成功');
              // 刷新日历数据
              this.$busEmit('refreshCalendar');
              // 更新个人okr数据
              this.$emit('refreshMyOkr');
            }
          });
        }
      });
    },
    setEmotion(type) {
      this.weeklyEmotion = type;
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
    projectDelete() {
      this.formData.weeklyWorkVoSaveList.forEach((work) => {
        work.projectId = '';
        work.projectNameCn = '';
      });
    },
    projectInputFocus(work) {
      this.randomIdForProject = work.randomId;
      this.showProjectDialog = true;
      this.$nextTick(() => {
        this.$refs.selectProject.show();
      });
    },
    closeProjectDia(data) {
      this.formData.weeklyWorkVoSaveList.forEach((work) => {
        if (work.randomId == data.randomIdForProject) {
          work.projectId = data.project.projectId;
          work.projectNameCn = data.project.projectNameCn;
        }
      });
      this.$forceUpdate();
    },
    workTimeChange(row) {
      let workTimeTotal = 0;
      this.formData.weeklyWorkVoSaveList.forEach((element) => {
        workTimeTotal += Number(element.workTime);
      });
      this.formData.weeklyWorkVoSaveList.forEach((work) => {
        if (row.randomId == work.randomId) {
          // 数据转换为0.5单位
          const tempArr = String(work.workTime).split('.');
          if (tempArr.length > 1) { // 有小数位
            if (tempArr[1] > 5) { //  大于5
              work.workTime = Number(tempArr[0]) + 1;
            } else if (tempArr[1] < 5) { // 小于5
              work.workTime = Number(tempArr[0]);
            }
          }
          if (workTimeTotal > 5) {
            work.workTime = 0;
          }
        }
      });
    },
    projectChange(work) {
      this.formData.weeklyWorkVoSaveList.forEach((element) => {
        if (work.randomId == element.randomId) {
          this.projectList.forEach((project) => {
            if (project.projectId == work.projectId) {
              work.projectNameCn = project.projectNameCn;
            }
          });
        }
      });
    },
  },
  watch: {
    'formData.weeklyWorkVoSaveList': {
      handler(tableData) {
        // *****************将本周关联的个人目标、okr同步至个人okr完成度*************
        // 将weeklyWorkVoSaveList中的支撑项读出来,放入个人okr完成度中
        this.weeklyOkrSaveList = [];
        this.showTaskProcess = false;
        const tempWeeklyOkrSaveList = [];
        for (const data of tableData) {
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
              this.$set(data.supportMyOkrObj, 'progressAfter', data.supportMyOkrObj.o.okrDetailProgress);
              if (data.supportMyOkrObj.o.id) { // 判断是不是前端临时数据、还是后端返回的数据
                // 后端数据中匹配
                this.weeklyData.weeklyOkrVoList.forEach((element) => {
                  if (element.okrDetailId == data.supportMyOkrObj.o.okrDetailId) {
                    this.$set(data.supportMyOkrObj, 'progressBefor', element.progressBefor);
                  }
                });
              } else {
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
        if (this.weeklyOkrSaveList.length > 0) {
          this.$nextTick(() => {
            this.showTaskProcess = true;
          });
        }
        this.$forceUpdate();
      },
      deep: true,
    },
  },
};
</script>