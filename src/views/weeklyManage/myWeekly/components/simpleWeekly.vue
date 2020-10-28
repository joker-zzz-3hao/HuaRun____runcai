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
          class="tl-table"
          :class="{ 'is-edit': canUpdate }"
        >
          <el-table-column width="40" v-if="canUpdate">
            <template slot-scope="scope" v-if="canUpdate">
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
                  maxlength="20"
                  v-if="canUpdate"
                  clearable
                  placeholder="简短概括任务，20字以内"
                  class="tl-input"
                ></el-input>
                <!-- 编辑完提交后展示 -->
                <em v-else>{{ scope.row.workContent }}</em>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="进度"
            prop="workProgress"
            :render-header="renderHeader"
            width="90"
          >
            <template slot-scope="scope">
              <template v-if="canUpdate">
                <el-form-item
                  v-if="canUpdate"
                  :prop="
                    'weeklyWorkVoSaveList.' + scope.$index + '.workProgress'
                  "
                  :rules="formData.rules.workProgress"
                >
                  <el-input
                    v-model="scope.row.workProgress"
                    @change="tableProcessChange(scope.row)"
                    class="tl-input"
                  ></el-input>
                </el-form-item>
              </template>
              <!-- 编辑完提交后展示 -->
              <em v-else>{{ scope.row.workProgress }}</em
              ><span>%</span>
            </template>
          </el-table-column>
          <el-table-column
            label="投入工时"
            prop="workTime"
            :render-header="renderHeader"
            width="100"
          >
            <template slot-scope="scope">
              <el-form-item
                v-if="canUpdate"
                :prop="'weeklyWorkVoSaveList.' + scope.$index + '.workTime'"
                :rules="formData.rules.workTime"
              >
                <el-input
                  v-if="canUpdate"
                  v-model.trim="scope.row.workTime"
                  @change="workTimeChange(scope.row)"
                  class="tl-input"
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
                v-if="canUpdate"
                :prop="'weeklyWorkVoSaveList.' + scope.$index + '.projectId'"
                :rules="formData.rules.projectId"
              >
                <el-select
                  v-model="scope.row.projectId"
                  placeholder="请选择关联项目"
                  @change="projectChange(scope.row)"
                  class="tl-select"
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
                          v-if="canUpdate"
                          @click="addSupportOkr(scope.row)"
                          >{{ setOkrStyle(item.okrDetailObjectKr) }}</em
                        >
                        <em v-else>{{
                          setOkrStyle(item.okrDetailObjectKr)
                        }}</em>
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
        </el-table>
        <div class="btn-box" v-if="canUpdate">
          <el-button
            type="text"
            @click="addItem"
            class="tl-btn dotted-line list-add"
          >
            <i class="el-icon-plus"></i>添加
          </el-button>
        </div>
      </el-form>
    </div>
    <!-- 个人OKR完成度 -->
    <dl class="dl-card-panel okr-completion" v-if="configItemCodeOKR == 'O'">
      <dt class="card-title"><em>个人OKR完成度</em></dt>
      <!-- 这里循环 dd 每一条支撑周报的 O 或者 是  KR  如果是O ？is-o：is-kr -->
      <dd v-if="weeklyOkrSaveList.length < 1" class="no-data">
        <span>当工作项中的任务支撑OKR，才能修改相关OKR完成度</span>
      </dd>
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
            <template v-if="canUpdate">
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
              v-if="canUpdate"
              v-model="item.progressAfter"
              :step="1"
              @change="processChange(item)"
              tooltip-class="slider-tooltip"
            ></el-slider>
            <el-input-number
              v-if="canUpdate"
              v-model="item.progressAfter"
              controls-position="right"
              :min="0"
              :max="100"
              :step="1"
              :precision="0"
              class="tl-input-number"
              @blur="progressAfterBlur(item)"
            ></el-input-number>
            <em>{{ item.progressAfter }}</em>
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
    <!-- 本周心情 -->
    <dl class="dl-card-panel mood">
      <dt class="card-title"><em>本周心情</em></dt>
      <dd>
        <ul>
          <li
            class="has-harvest"
            :class="{ 'is-selected': weeklyEmotion === 100 }"
          >
            <i @click="canUpdate ? setEmotion(100) : ''"></i><i></i>
          </li>
          <li
            class="not-too-bad"
            :class="{ 'is-selected': weeklyEmotion === 50 }"
          >
            <i @click="canUpdate ? setEmotion(50) : ''"></i><i></i>
          </li>
          <li class="let-quiet" :class="{ 'is-selected': weeklyEmotion === 0 }">
            <i @click="canUpdate ? setEmotion(0) : ''"></i><i></i>
          </li>
        </ul>
        <span v-if="showEmotionError">请选择本周心情</span>
      </dd>
    </dl>
    <div class="footer-panel" v-if="hasPower('weekly-submit')">
      <el-button
        :loading="commitLoading"
        v-if="canEdit && canUpdate"
        type="primary"
        @click="commitWeekly"
        class="tl-btn amt-bg-slip"
        >提交</el-button
      >
      <el-button
        v-if="canEdit && !canUpdate"
        type="primary"
        @click="canUpdate = true"
        class="tl-btn amt-bg-slip"
        >编辑</el-button
      >
      <span v-if="!canEdit"
        >不好意思同学，历史周报不能编辑（补写），让往事随风吧，向前看</span
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
      :orgOkrPeriodList="orgOkrPeriodList"
      :myOkrPeriodList="myOkrPeriodList"
      :cultureList="cultureList"
      :configItemCodeOKR="configItemCodeOKR"
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
import confidenceSelect from '@/components/confidenceSelect';
import CONST from '@/components/const';
import merge from 'webpack-merge';
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
    'tl-confidence': confidenceSelect,
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
    orgOkrPeriodList: {
      type: Array,
      default() {
        return [];
      },
    },
    myOkrPeriodList: {
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
    configItemCodeOKR: {
      type: String,
      default: '',
    },
    // canUpdate: {
    //   type: Boolean,
    //   default() {
    //     return false;
    //   },
    // },
  },
  data() {
    return {
      server,
      CONST,
      canUpdate: !this.weeklyData.weeklyId,
      weeklyEmotion: '',
      showEmotionError: false,
      weeklyId: this.weeklyData.weeklyId ? this.weeklyData.weeklyId : '',
      tableLoading: false,
      currenItemrandomId: '',
      showAddOkr: false,
      showProjectDialog: false,
      commitLoading: false,
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
          workProgress: {
            type: 'string',
            required: true,
            trigger: 'blur',
            validator: this.validateProcess,
          },
          workTime: {
            type: 'string',
            required: true,
            trigger: 'blur',
            validator: this.validateTime,
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
      this.weeklyDataCopy = { ...this.weeklyData };

      if (!this.weeklyDataCopy.weeklyId && !(this.$route.params && this.$route.params.weeklySumParams)) {
        // 本周任务初始化数据
        this.addWork();
      }
      // 如果是已提交过的数据，初始化数据
      this.initPage();
      // this.thisPageProjectList = [...this.projectList];
    },
    initPage() {
      // if (this.weeklyData.weeklyId) {
      //   this.formData.weeklyWorkVoSaveList = this.weeklyData.weeklyWorkVoList;// 列表数据
      //   this.setWorkTableData();
      //   // 反显个人OKR进度,判断支撑okr中是否有个人okr，如果有则现在是个人okr进度（O、KR）
      //   this.setOkrProcess(this.weeklyData.weeklyOkrVoList);
      // }
      const self = this;
      // // 来自任务的数据,同步至本周任务中
      // console.log('任务', self.$route.params);
      const tempOkrList = [];
      if (self.$route.params && self.$route.params.weeklySumParams) {
        self.canUpdate = true;
        self.$route.params.weeklySumParams.forEach((okr) => {
          if (okr.okrDetailId) {
            tempOkrList.push({
              okrDetailId: okr.okrDetailId,
            });
          }
        });
      }
      if (self.weeklyDataCopy.weeklyId) { // 后端查回来的数据
        // 任务汇总传过来的数据
        if (self.$route.params && self.$route.params.weeklySumParams) {
          // 初始化
          self.$route.params.weeklySumParams.forEach((work) => {
            self.formData.weeklyWorkVoSaveList.push({
              okrCultureValueIds: '',
              okrIds: '',
              okrDetailId: work.okrDetailId || '',
              projectId: work.projectId || '',
              projectNameCn: work.projectName || '',
              weeklyId: '',
              workContent: work.taskTitle || '',
              workDesc: work.taskDesc || '',
              workId: '',
              workIndex: 0,
              workProgress: '',
              workTime: 0.5,
              selectedOkr: [],
              randomId: Math.random().toString(36).substr(3), // 添加随机id，用于删除环节
              workOkrList: [],
              okrCultureValueList: [],
            });
          });
          // 合并后端取回数据
          self.formData.weeklyWorkVoSaveList = [
            ...self.formData.weeklyWorkVoSaveList,
            ...self.weeklyDataCopy.weeklyWorkVoList,
          ];
        } else {
          // 后端查询数据
          self.formData.weeklyWorkVoSaveList = self.weeklyDataCopy.weeklyWorkVoList;// 列表数据
        }

        // 反显周报列表数据
        self.setWorkTableData();

        // 反显个人OKR进度,判断支撑okr中是否有个人okr，如果有则现在是个人okr进度（O、KR）
        self.setOkrProcess([...tempOkrList, ...self.weeklyDataCopy.weeklyOkrVoList]);
      } else if (!self.weeklyDataCopy.weeklyId) {
        // 任务汇总传过来的数据
        if (self.$route.params && self.$route.params.weeklySumParams) {
          // 初始化
          self.$route.params.weeklySumParams.forEach((work) => {
            self.formData.weeklyWorkVoSaveList.push({
              okrCultureValueIds: '',
              okrIds: '',
              projectId: work.projectId || '',
              okrDetailId: work.okrDetailId || '',
              projectNameCn: work.projectName || '',
              weeklyId: '',
              workContent: work.taskTitle || '',
              workDesc: work.taskDesc || '',
              workId: '',
              workIndex: 0,
              workProgress: '',
              workTime: 0.5,
              selectedOkr: [],
              randomId: Math.random().toString(36).substr(3), // 添加随机id，用于删除环节
              workOkrList: [],
              okrCultureValueList: [],
            });
          });
          // 反显周报列表数据
          self.setWorkTableData();
          // 反显个人OKR进度,判断支撑okr中是否有个人okr，如果有则现在是个人okr进度（O、KR）
          self.setOkrProcess(tempOkrList);
        }
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
        // 后端取回的数据，如果没支撑项，则加上‘不关联任何okr’
        if ([...element.okrCultureValueList, ...element.workOkrList].length < 1 && element.workId) {
          element.okrCultureValueList = [{
            okrDetailId: 'noOkr',
            okrDetailObjectKr: '不关联任何OKR',
            randomId: Math.random().toString(36).substr(3),

          }];
          valueIdList.push('noOkr');
        }
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
        workProgress: '',
        workTime: 0.5,
        selectedOkr: [],
        workOkrList: [],
        okrCultureValueList: [],
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
    // deleteOkr(okr, randomId) {
    //   // 删除已选择的价值观、okr
    //   for (const item of this.formData.weeklyWorkVoSaveList) {
    //     // 本地数据、后端数据
    //     if (item.randomId == randomId || item.workId == okr.workId) {
    //       item.selectedOkr = item.selectedOkr.filter((element) => element.okrDetailId != okr.okrDetailId);
    //       let valueIdList = [];
    //       let okrIdList = [];
    //       // 删除对应okr、价值观id
    //       valueIdList = item.valueIdList.filter((id) => okr.okrDetailId != id);
    //       okrIdList = item.okrIdList.filter((id) => okr.okrDetailId != id);
    //       item.okrCultureValueIds = valueIdList.join(',');
    //       item.okrIds = okrIdList.join(',');
    //       // 添加该字段用于校验支撑项
    //       this.$set(item, 'okrIdList', okrIdList);
    //       this.$set(item, 'valueIdList', valueIdList);
    //       this.$set(item, 'valueOrOkrIds', item.okrCultureValueIds + item.okrIds);
    //       // 删掉对应的支撑项
    //       delete item.supportMyOkrObj;
    //     }
    //   }
    // },
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
      if (this.weeklyEmotion === '') {
        this.showEmotionError = true;
        return;
      }
      this.$refs.formDom.validate((valid) => {
        if (valid) {
          this.commitLoading = true;
          this.server.commitWeekly(params).then((res) => {
            this.commitLoading = false;
            if (res.code == 200) {
              this.$message.success('提交成功');
              // 刷新日历数据
              this.$busEmit('refreshCalendar');
              // 更新个人okr数据
              this.$emit('refreshMyOkr');
              // 清空params中的参数  防止再次将参数中的数据插入到任务列表中
              this.$router.push({
                query: merge({}, { params: 'clear' }),
              });
            }
          });
        }
      });
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
    // tableProcessChange(item) {
    //   item.workProgress = Math.round(item.workProgress);
    // },
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
      this.formData.weeklyWorkVoSaveList.forEach((work) => {
        if (row.randomId == work.randomId) {
          // 数据转换为0.5单位
          const tempArr = String(work.workTime).split('.');
          if (tempArr.length > 1) { // 有小数位
            // if (tempArr[1].length == 1) {
            // work.workTime.toFixed();
            if (tempArr[1] != 5) { //  小数点后不为5
              work.workTime = Number(work.workTime).toFixed(0);
            }
            // }
          }
        }
      });
    },
    tableProcessChange(row) {
      this.formData.weeklyWorkVoSaveList.forEach((work) => {
        if (row.randomId == work.randomId) {
          work.workProgress = Number(work.workProgress).toFixed(0);
          if (work.workProgress > 100) {
            work.workProgress = 100;
          }
        }
      });
    },
    changeConfidence() {},
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
    progressAfterBlur(okrItem) {
      if (okrItem.progressAfter == undefined) {
        this.weeklyOkrSaveList.forEach((okr) => {
          if (okrItem.okrDetailId == okr.okrDetailId) {
            okr.progressAfter = 0;
          }
        });
      }
    },
    setEmotion(emotion) {
      this.weeklyEmotion = emotion;
      this.showEmotionError = false;
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