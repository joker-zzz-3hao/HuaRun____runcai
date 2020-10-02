<template>
  <div class="write-weekly">
    <div class="weekly-cont">
      <el-form :rules="formData.rules" :model="formData" ref="formDom" class="tl-form">
        <el-table
          ref="workTable"
          v-loading="tableLoading"
          :data="formData.weeklyWorkVoSaveList"
          class="tl-table flex"
        >
          <el-table-column label="序号" type="index" width="55"></el-table-column>
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
            min-width="300"
          >
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.workProgress"
                controls-position="right"
                :min="0"
                :max="100"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            label="投入工时"
            :precision="2"
            :step="0.1"
            prop="workTime"
            :render-header="renderHeader"
            min-width="130"
          >
            <template slot-scope="scope">
              <el-input-number
                controls-position="right"
                v-model.trim="scope.row.workTime"
                :precision="0"
                :step="1"
                :min="1"
                :max="80"
                class="tl-input-number"
              ></el-input-number>
              <span>h</span>
            </template>
          </el-table-column>
          <el-table-column label="关联项目" :render-header="renderHeader" min-width="300">
            <template slot-scope="scope">
              <el-form-item
                :prop="'weeklyWorkVoSaveList.' + scope.$index + '.projectNameCn'"
                :rules="formData.rules.projectNameCn"
              >
                <el-input
                  v-model.trim="scope.row.projectNameCn"
                  maxlength="0"
                  @focus="projectInputFocus(scope.row)"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="支撑OKR/价值观"
            prop="valueOrOkrIds"
            :render-header="renderHeader"
            min-width="300"
          >
            <template slot-scope="scope">
              <!-- 临时项目可不选择支撑项 -->
              <el-form-item
                :prop="'weeklyWorkVoSaveList.' + scope.$index + '.valueOrOkrIds'"
                :rules="scope.row.projectId ? formData.rules.valueOrOkrIds:{}"
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
                      popper-class="tl-tooltip-popper"
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
          <el-table-column prop="code" fixed="right" width="50">
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
      <el-button @click="addItem" style>添加</el-button>
    </div>
    <!-- 个人OKR完成度 -->
    <div v-if="showTaskProcess" class="degree-completion">
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
                :step="1"
                @change="processChange(item)"
                show-input
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
    <div class="week-mood">
      <span>
        请选择本周心情
        <el-button @click="setEmotion(100)">有收获</el-button>
        <span :class="{'text-color-red': weeklyEmotion==100}">有收获</span>
        <el-button @click="setEmotion(50)">还行吧</el-button>
        <span :class="{'text-color-red': weeklyEmotion==50}">还行吧</span>
        <el-button @click="setEmotion(0)">让我静静</el-button>
        <span :class="{'text-color-red': weeklyEmotion==0}">让我静静</span>
      </span>
    </div>
    <el-button style="marginTop:65px" :disabled="!canEdit" @click="commitWeekly">提交</el-button>
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

import Server from '../server';
import selectProject from './selectProject';

import addOkr from './addOkr';
import mixin from '../mixin';

const server = new Server();
export default {
  name: 'standardWeekly',
  mixins: [mixin],
  components: {
    'add-okr': addOkr,
    selectProject,
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
          projectNameCn: {
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