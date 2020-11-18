<template>
  <div class="write-weekly standard-version">
    <div class="weekly-cont">
      <el-form
        :ref="workForm.workFormIndex"
        :model="workForm"
        :key="workForm.randomId"
        v-for="workForm in workFormList"
        label-width="80px"
      >
        <el-form-item
          prop="workContent"
          label="工作项"
          :rules="[
            { required: true, message: '请填写工作项', trigger: 'blur' },
          ]"
        >
          <el-input v-model="workForm.workContent"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="workForm.workDesc"
            :autosize="{ minRows: 3, maxRows: 8 }"
            type="textarea"
            class="tl-textarea"
            clearable
            maxlength="500"
          ></el-input>
        </el-form-item>
        <el-form-item label="进度">
          <div class="tl-progress-group">
            <tl-process
              :data="parseInt(workForm.workProgress, 10)"
              :showNumber="false"
              :width="30"
              :marginLeft="2"
            ></tl-process>
            <!-- kr支持更改进度 -->
            <el-slider
              v-model="workForm.workProgress"
              :step="1"
              @change="processChange(workForm)"
              tooltip-class="slider-tooltip"
            ></el-slider>
            <el-input-number
              v-model="workForm.workProgress"
              controls-position="right"
              :min="0"
              :max="100"
              :step="1"
              :precision="0"
              class="tl-input-number"
              @blur="workProgressBlur(item)"
            ></el-input-number>
          </div>
        </el-form-item>
        <el-form-item label="所用时长(工时)" class="time-cascader">
          <span v-for="(text, index) in workForm.timeSpanList" :key="index"
            >{{ text }}
          </span>
          <el-button
            type="text"
            v-if="!workForm.showCascader"
            @click="workForm.showCascader = true"
            >添加工时</el-button
          >
          <el-cascader
            ref="timeCascater"
            v-model="workForm.timeList"
            :options="weekDataList"
            :props="props"
            placeholder="添加工时"
            collapse-tags
            @visible-change="visibleChange(workForm)"
            @change="selectWeekData(workForm)"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="项目"
          prop="projectId"
          :rules="[
            { required: true, message: '请选择项目', trigger: 'change' },
          ]"
        >
          <el-select
            v-model="workForm.projectId"
            placeholder="请选择关联项目"
            @change="projectChange(workForm)"
            class="tl-select"
            :class="{ 'select-error': !!projectError }"
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
        <el-form-item label="支撑OKR/价值观">
          <div class="tag-group">
            <ul class="tag-lists">
              <li v-for="item in workForm.selectedOkr" :key="item.okrDetailId">
                <el-tooltip
                  class="select-values"
                  effect="dark"
                  placement="top"
                  popper-class="tl-tooltip-popper"
                >
                  <em slot="content">{{ item.okrDetailObjectKr }}</em>
                  <em v-if="canUpdate" @click="addSupportOkr(workForm)">{{
                    setOkrStyle(item.okrDetailObjectKr)
                  }}</em>
                  <em v-else>{{ setOkrStyle(item.okrDetailObjectKr) }}</em>
                </el-tooltip>
              </li>
              <li
                class="icon-bg"
                :class="{ 'okr-error': !!OKRError }"
                v-if="workForm.selectedOkr.length < 1 && canUpdate"
                @click="addSupportOkr(workForm)"
              >
                <i class="el-icon-plus"></i>
              </li>
            </ul>
          </div>
        </el-form-item>
      </el-form>
      <div class="btn-box" v-if="canUpdate">
        <el-button
          type="text"
          @click="addWork"
          class="tl-btn dotted-line list-add"
        >
          <i class="el-icon-plus"></i>添加
        </el-button>
      </div>
    </div>

    <!-- 本周心情 -->
    <dl class="dl-card-panel mood" :class="{ 'is-edit': canUpdate }">
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
      :orgOkrPeriodList="orgOkrPeriodList"
      :myOkrPeriodList="myOkrPeriodList"
      :originalMyOkrList="originalMyOkrList"
      :originalOrgOkrList="originalOrgOkrList"
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
// import confidenceSelect from '@/components/confidenceSelect';
import merge from 'webpack-merge';
import CONST from '@/components/const';
import CONST1 from '@/lib/const';
import { mapState } from 'vuex';
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
    'tl-process': tlProcess,
    // 'tl-confidence': confidenceSelect,
  },
  props: {
    week: {
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

    myOkrPeriodList: {
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

    configItemCodeOKR: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      server,
      CONST,
      CONST1,
      weeklyData: {},
      canUpdate: true,
      weeklyEmotion: '',
      showEmotionError: false,
      weeklyId: '',
      tableLoading: false,
      currenItemrandomId: '',
      showAddOkr: false,
      showProjectDialog: false,
      commitLoading: false,
      workFormList: [],
      formData: {
        rules: {
          workContent: {
            type: 'string',
            required: true,
            validator: this.validateWorkContent,
            trigger: 'blur',
          },
          workDesc: {
            type: 'string',
            required: true,
            message: '请填写任务描述',
            trigger: 'blur',
          },

          projectId: {
            type: 'string',
            required: true,
            validator: this.validateProject,
            trigger: 'change',
          },
          valueOrOkrIds: {
            type: 'string',
            required: true,
            validator: this.validateOkr,
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
        weeklyPlanSaveList: [],
        weeklyThoughtSaveList: [],
      },
      selectedOkr: [],
      tempResult: [],
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
      thoughtOpen: false,
      // planOpen: false,
      randomIdForProject: '',
      textarea: '',
      showTaskProcess: false,
      weeklyDataCopy: {},
      emotionError: '',
      processError: '',
      workTimeError: '',
      workItemError: '',
      projectError: '',
      OKRError: '',

      props: { multiple: true },
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState('weekly', {
      weekList: (state) => state.weekList,
      projectList: (state) => state.projectList,
    }),
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
    canEdit() {
      let result = false;
      this.weekList.forEach((item) => {
        if (item.calendarId == this.week.calendarId) {
          result = item.canEdit;
        }
      });
      return result;
    },
  },
  methods: {
    init() {
      if (this.week.weeklyId) {
        this.weeklyId = this.week.weeklyId;
        this.server.queryWeekly({ weeklyId: this.week.weeklyId }).then((res) => {
          if (res.code == 200) {
            // 将所有数据保存
            this.weeklyData = res.data;
            this.weeklyDataCopy = { ...this.weeklyData };
            this.initPage();
          }
        });
      } else if (!this.weeklyDataCopy.weeklyId) {
        this.weeklyDataCopy = { ...this.weeklyData };
        if (!this.weeklyDataCopy.weeklyId) {
          if (!(this.$route.params && this.$route.params.weeklySumParams)) {
          // 本周任务初始化数据
            this.addWork();
          }
        }
      }
    },
    initPage() {
      this.workFormList = this.weeklyDataCopy.weeklyWorkVoList;// 列表数据
      const self = this;
      // 来自任务的数据,同步至本周任务中
      const tempOkrList = [];
      // 将任务的okr遍历出来
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
              workOkrList: [],
              okrCultureValueList: [],
              randomId: Math.random().toString(36).substr(3), // 添加随机id，用于删除环节
            });
          });
          // 合并后端取回数据
          self.workFormList = [
            ...self.workFormList,
            ...self.weeklyDataCopy.weeklyWorkVoList,
          ];
        } else {
          // 后端查询数据
          self.workFormList = self.weeklyDataCopy.weeklyWorkVoList;// 列表数据
        }
      } else if (!self.weeklyDataCopy.weeklyId) {
        // 任务汇总传过来的数据
        if (self.$route.params && self.$route.params.weeklySumParams) {
          // 初始化
          self.$route.params.weeklySumParams.forEach((work) => {
            self.workFormList.push({
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
              workOkrList: [],
              okrCultureValueList: [],
              randomId: Math.random().toString(36).substr(3), // 添加随机id，用于删除环节
            });
          });
        }
      }
      // 反显周报列表数据
      self.setWorkTableData();
    },

    setWorkTableData() {
      this.weeklyEmotion = this.weeklyDataCopy.weeklyEmotion;// 心情
      if (this.workFormList && this.workFormList.length > 0) {
        this.workFormList.forEach((element) => {
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
          this.$set(element, 'showCascader', false);// 存到后端的okr
          this.$set(element, 'timeList', this.setTimeList(element.weekList));// 存到后端的okr
          this.$set(element, 'timeSpanList', this.setTimeSpanList(element.weekList));// 存到后端的okr
        });
      }
      this.$forceUpdate();
    },
    setTimeList(weekList) {
      const result = [];
      weekList.forEach((day) => {
        const whichDay = new Date(day.weekDate).getDay() - 1;
        if (day.weekTimeType == 0) {
          result.push([whichDay, 1], [whichDay, 2]);
        } else {
          result.push([whichDay, day.weekTimeType]);
        }
      });
      return result;
    },
    setTimeSpanList(weekList) {
      const result = [];
      weekList.forEach((day) => {
        const whichDay = new Date(day.weekDate).getDay();
        let text = '';
        if (day.weekTimeType == 0) {
          text = `${this.CONST1.WEEK_MAP[whichDay]}全天`;
        } else if (day.weekTimeType == 1) {
          text = `${this.CONST1.WEEK_MAP[whichDay]}上午`;
        } else {
          text = `${this.CONST1.WEEK_MAP[whichDay]}下午`;
        }
        result.push(text);
      });
      return result;
    },
    addWork() {
      this.workFormList.push({
        workContent: '',
        workDesc: '',
        projectId: '',
        projectNameCn: '',
        workProgress: '',
        selectedOkr: [],
        timeList: [],
        weekList: [],
        okrCultureValueIds: '',
        okrIds: '',
        showCascader: false,
        workIndex: 0,
        workFormIndex: Math.random().toString(36).substr(3), // 添加随机id，用于删除环节
        randomId: Math.random().toString(36).substr(3), // 添加随机id，用于删除环节
      });
      this.$forceUpdate();
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
    addSupportOkr(data) {
      this.currenItemrandomId = data.randomId;
      this.selectedOkr = data.selectedOkr;
      this.showAddOkr = true;
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
      this.$forceUpdate();
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
    checkForm(formName) {
      const self = this;
      return new Promise((resolve, reject) => {
        self.$refs[formName][0].validate((valid) => {
          if (valid) {
            resolve();
          } else reject();
        });
      });
    },
    commitWeekly() {
      const self = this;
      const validateForms = [];
      self.workFormList.forEach((workForm) => {
        // 将表单放在一起
        validateForms.push(this.checkForm(workForm.workFormIndex));
      });
      Promise.all(validateForms).then(() => {
        console.log('校验通过');
      }).catch(() => {
        console.log('校验未通过');
      });

      if (this.weeklyEmotion === '') {
        this.showEmotionError = true;
        this.emotionError = '本周心情';
      }
      // 校验关联okr
      // this.formData.weeklyWorkVoSaveList.forEach((work) => {
      //   if (!work.valueOrOkrIds) {
      //     this.OKRError = '支撑OKR/价值观';
      //   }
      // });
      // 将下周计划、感想有未填写的内容的数据删除
      this.formData.weeklyThoughtSaveList = this.formData.weeklyThoughtSaveList.filter(
        (thought) => !!thought.thoughtContent,
      );
      this.formData.weeklyPlanSaveList = this.formData.weeklyPlanSaveList.filter(
        (plan) => !!plan.planContent,
      );
      // 表单校验
      const params = {
        calendarId: this.week.calendarId,
        weeklyEmotion: this.weeklyEmotion,
        weeklyId: this.weeklyId,
        weeklyType: this.weeklyType,
        weeklyOkrSaveList: this.weeklyOkrSaveList,
        weeklyPlanSaveList: this.formData.weeklyPlanSaveList,
        weeklyThoughtSaveList: this.formData.weeklyThoughtSaveList,
        weeklyWorkVoSaveList: this.workFormList,
      };

      // const params = {
      //   calendarId: this.week.calendarId,
      //   weeklyEmotion: 100,
      //   weeklyId: this.weeklyId,
      //   weeklyType: '1',
      //   weeklyOkrSaveList: [],
      //   weeklyPlanSaveList: [],
      //   weeklyThoughtSaveList: [],
      //   weeklyWorkVoSaveList: [{
      //     workContent: '4',
      //     workDesc: '4',
      //     projectId: '1420372313765593088',
      //     projectNameCn: '测试项目',
      //     workProgress: 6,
      //     selectedOkr: [],
      //     weekList: [
      //       { weekDate: '2020-11-18', weekTimeType: 0 },
      //       { weekDate: '2020-11-16', weekTimeType: 1 },
      //       { weekDate: '2020-11-17', weekTimeType: 0 },
      //     ],
      //     okrCultureValueIds: '', // 价值观
      //     okrIds: '', // okr
      //     workIndex: 0,
      //     showCascader: true,
      //     workFormIndex: 'gn7761dpkt',
      //     randomId: 'msnnn5hlv',
      //   }],
      // };
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
    },
    renderHeader(h, { column }) {
      // 这里在最外层插入一个div标签
      return h('div', [// h即为cerateElement的简写
        h(column ? 'span' : '', { style: { color: 'red' } }, '*'),
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
      item.workProgress = Math.round(item.workProgress);
    },
    // tableProcessChange(item) {
    //   item.workProgress = Math.round(item.workProgress);
    // },
    openThought() {
      this.thoughtOpen = true;
    },
    closeThought() {
      this.thoughtOpen = false;
    },
    projectInputFocus(work) {
      this.randomIdForProject = work.randomId;
      this.showProjectDialog = true;
      this.$nextTick(() => {
        this.$refs.selectProject.show();
      });
    },
    projectDelete() {
      this.formData.weeklyWorkVoSaveList.forEach((work) => {
        work.projectId = '';
        work.projectNameCn = '';
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
          // eslint-disable-next-line no-restricted-globals
          if (isNaN(work.workTime)) { // 不是数字，清空
            work.workTime = 0.5;
          }
          if (work.workTime < 0) {
            work.workTime = 0.5;
          }
          if (tempArr.length > 1) { // 有小数位
            // if (tempArr[1].length == 1) {
            // work.workTime.toFixed();
            if (tempArr[1] != 5) { // 小数点后不为5
              work.workTime = Number(work.workTime).toFixed(0);
            }
            // }
          }
        }
      });
    },
    getPlaceholder(type) {
      if (type == 0) {
        return '本周有什么感想，工作的个人的都可以, 记录成长点滴';
      } if (type == 1) {
        return '对团队对公司对眼前事有什么建议吗';
      } if (type == 2) {
        return '做版本更好的自己，希望你本周有收获，记下来吧';
      }
    },
    tableProcessChange(row) {
      this.formData.weeklyWorkVoSaveList.forEach((work) => {
        if (row.randomId == work.randomId) {
          work.workProgress = Number(work.workProgress).toFixed(0);
          if (work.workProgress > 100) {
            work.workProgress = 100;
          }
          if (work.workProgress < 0) {
            work.workProgress = '';
          }
          // eslint-disable-next-line no-restricted-globals
          if (isNaN(work.workProgress)) { // 不是数字，清空
            work.workProgress = '';
          }
        }
      });
    },
    changeConfidence() {},
    projectChange(work) {
      this.projectError = '';
      this.workFormList.forEach((element) => {
        if (work.randomId == element.randomId) {
          this.projectList.forEach((project) => {
            if (project.projectId == work.projectId) {
              work.projectNameCn = project.projectNameCn;
            }
          });
        }
      });
    },
    workProgressBlur(okrItem) {
      if (okrItem.workProgress == undefined) {
        this.weeklyOkrSaveList.forEach((okr) => {
          if (okrItem.okrDetailId == okr.okrDetailId) {
            okr.workProgress = 0;
          }
        });
      }
    },
    setEmotion(emotion) {
      this.weeklyEmotion = emotion;
      this.showEmotionError = false;
    },
    setDisabledSelectedData(list) {
      // 1、先将所有数据disabled状态置为false
      list.forEach((selectedData) => {
        this.weekDataList.forEach((day) => {
          day.disabled = false;
          this.$nextTick(() => {
            if (selectedData.data.id == day.id) {
              day.disabled = true;
            }
          });
          if (day.children && day.children.length > 0) {
            day.children.forEach((dayChild) => {
              dayChild.disabled = false;
              this.$nextTick(() => {
                if (selectedData.data.id == dayChild.id) {
                  dayChild.disabled = true;
                }
              });
            });
          }
        });
      });
      this.$forceUpdate();
    },
    // 禁用已选时间（除了正在展开的本个级联款）
    visibleChange(workForm) {
      let selectedList = [];
      // 1、找出被选中的数据
      for (let i = 0; i < this.workFormList.length; i += 1) {
        if (this.workFormList[i].randomId != workForm.randomId) {
          const list = this.$refs.timeCascater[i].getCheckedNodes();
          selectedList = [...selectedList, ...list];
        }
      }
      // 遍历级联框数据，将整理好的数据禁用
      this.setDisabledSelectedData(selectedList);
    },
    selectWeekData(workItem) {
      workItem.weekList = [];
      const dayList = [];
      let daySet = [];
      const dayAndTimeTypeList = [];
      // if (workItem.timeList.length > 0) {
      workItem.timeList.forEach((day) => {
        // 日期遍历
        dayList.push(day[0]);
      });
      // 去重
      daySet = Array.from(new Set(dayList));
      // 将同一天的数据合并为一条数据
      daySet.forEach((item) => {
        dayAndTimeTypeList.push({
          date: item,
          timeTypeList: [],
        });
        workItem.timeList.forEach((day) => {
          if (day[0] == item) {
            dayAndTimeTypeList[daySet.indexOf(item)].timeTypeList.push(day[1]);
          }
        });
      });
      // 将选中的数据转换成后端数据格式
      dayAndTimeTypeList.forEach((element) => {
        let timeType = 0;// 上、下午、全天
        if (element.timeTypeList.length == 1) {
          // eslint-disable-next-line prefer-destructuring
          timeType = element.timeTypeList[0];
        } else if (element.timeTypeList.length == 2) {
          timeType = 0;
        }
        // 日期转换
        const begindate = new Date(this.week.weekBegin);
        begindate.setDate(begindate.getDate() + Number(element.date));
        workItem.weekList.push({
          weekDate: this.dateFormat('YYYY-mm-dd', begindate),
          weekTimeType: timeType,
        });
      });
      this.$set(workItem, 'timeSpanList', this.setTimeSpanList(workItem.weekList));
      // }
    },

  },
  watch: {
    'formData.weeklyWorkVoSaveList': {
      handler(tableData) {
        // *****************将本周未完成任务自动同步至下周计划*************
        // 先清空本周未完成任务同步至下周任务数据(周边那你编辑时不需要)
        if (!this.weeklyDataCopy.weeklyId) {
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
        this.showTaskProcess = false;
        const tempWeeklyOkrSaveList = [];
        for (const data of tableData) {
          // 临时项目反显
          // if (data.workId && !data.projectId) {
          //   data.validateProjectId = '临时项目';
          // }
          if (data.supportMyOkrObj && data.supportMyOkrObj.o) {
            if (data.supportMyOkrObj.kr) { // kr
              this.$set(data.supportMyOkrObj, 'okrDetailId', data.supportMyOkrObj.kr.okrDetailId);
              this.$set(data.supportMyOkrObj, 'confidenceAfter', data.supportMyOkrObj.kr.okrDetailConfidence);
              this.$set(data.supportMyOkrObj, 'workProgress', data.supportMyOkrObj.kr.okrDetailProgress);
              if (data.supportMyOkrObj.kr.id) { // 判断是不是前端临时数据、还是后端返回的数据
                // 后端数据中匹配
                this.weeklyDataCopy.weeklyOkrVoList.forEach((element) => {
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
              this.$set(data.supportMyOkrObj, 'workProgress', data.supportMyOkrObj.o.okrDetailProgress);
              // 如果是详情则从详情中取值
              if (data.supportMyOkrObj.o.id) {
                // 后端数据中匹配
                this.weeklyDataCopy.weeklyOkrVoList.forEach((element) => {
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
<style lang="css">
.select-error .el-input__inner {
  border: 1px solid #f56c6c !important;
  border-radius: 2px;
}
.okr-error {
  background: #f56c6c !important;
}
.time-cascader .el-cascader {
  margin-left: -56px;
  width: 60px;
}
.time-cascader .el-cascader__tags {
  display: none;
}
.time-cascader .el-cascader .el-input .el-input__inner {
  border: solid 0px rgb(252, 250, 250);
  background-color: rgba(0, 0, 0, 0.3);
}
.time-cascader .el-input__suffix-inner {
  display: none;
}
</style>