<template>
  <div class="working-hours approval-list">
    <div class="operating-area">
      <div class="operating-box">
        <div class="dl-item-group">
          <dl class="dl-item">
            <dt>审批状态</dt>
            <dd>
              <el-select
                v-model="formData.approvalStatus"
                :popper-append-to-body="false"
                placeholder="请选择审批状态"
                style="width: 100px"
                @change="changeStatus"
                clearable
                popper-class="tl-select-dropdown"
                class="tl-select"
              >
                <el-option
                  v-for="(item, index) in CONST.APPROVAL_STATUS_LIST"
                  :key="index + item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </dd>
          </dl>
          <dl class="dl-item">
            <dt>筛选工作项</dt>
            <dd style="margin-right: 20px">
              <el-select
                v-model="selectType"
                style="width: 130px"
                popper-class="tl-select-dropdown"
                class="tl-select"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in CONST.APPROVAL_SELECT"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </dd>
            <dd>
              <el-date-picker
                v-if="selectType == 2"
                v-model="weekLine"
                type="daterange"
                @change="changePick"
                @clear="searchList"
                clearable
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                class="tl-range-editor"
                popper-class="tl-range-popper"
              >
              </el-date-picker>
              <tl-element-week
                v-else
                @weekSelect="weekSelect"
              ></tl-element-week>
            </dd>
          </dl>
        </div>
        <div class="dl-item-group">
          <dl class="dl-item">
            <dd>
              <el-input
                maxlength="64"
                v-model="keyWord"
                placeholder="工作项,工作内容"
                class="tl-input-search"
              >
                <i class="el-icon-search" slot="prefix" @click="searchList"></i>
              </el-input>
              <el-button plain class="tl-btn light" @click="searchList">
                搜索
              </el-button>
            </dd>
          </dl>
          <el-button plain @click="back()" class="tl-btn amt-border-slip">
            返回
            <span class="lines"></span>
          </el-button>
        </div>
      </div>
    </div>
    <div class="cont-area">
      <tl-crcloud-table
        :total="total"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="searchList"
      >
        <div slot="tableContainer" class="table-container project-members">
          <el-table
            :data="tableData"
            class="tl-table"
            @select="selectList"
            @select-all="selectList"
            row-key="sourceId"
          >
            <el-table-column
              :reserve-selection="true"
              type="selection"
              width="55"
              :selectable="
                (row) => {
                  return row.approvalStatus == '1';
                }
              "
            >
            </el-table-column>
            <el-table-column
              label="工作项"
              prop="workContent"
              min-width="180px"
            >
              <template slot-scope="scope">
                <a
                  @click="
                    showDesc(
                      scope.row,
                      scope.row.arrHide.length * 0.5,
                      changeListDate(scope.row.arrHide),
                      weekWorkListCheck(scope.row)
                    )
                  "
                >
                  {{ GetLength(scope.row.workContent, 20) }}
                </a>
              </template>
            </el-table-column>
            <el-table-column label="工作项内容" min-width="200" prop="workDesc">
              <template slot-scope="scope">
                <a
                  v-if="scope.row.workDesc"
                  @click="
                    showDesc(
                      scope.row,
                      scope.row.arrHide.length * 0.5,
                      changeListDate(scope.row.arrHide),
                      weekWorkListCheck(scope.row)
                    )
                  "
                  >{{ GetLength(scope.row.workDesc, 16) }}</a
                >

                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column label="投入工时" min-width="100px">
              <template slot-scope="scope">
                <div v-show="scope.row.approvalStatus == '1'">
                  <div>
                    <em>{{ scope.row.arrHide.length * 0.5 }}天 </em>
                    <el-popover
                      placement="top"
                      width="300"
                      :key="scope.$index"
                      trigger="click"
                      :tabindex="scope.$index"
                      :ref="'popover-' + scope.$index"
                      popper-class="approval-pop"
                      @show="
                        listTimeFun(
                          scope.row.arrHide,
                          scope.row.userId,
                          scope.row.weekBegin,
                          scope.row.ldapType,
                          scope.$index
                        )
                      "
                    >
                      <div
                        v-for="(item, index) in monDayList"
                        :key="index"
                        class="flex-start"
                      >
                        <div class="week-day">{{ item }}</div>
                        <el-checkbox-group
                          v-model="checkList"
                          :ref="'check' + index"
                        >
                          <el-checkbox
                            :label="item + '上午'"
                            :disabled="checkItem[item + '上午']"
                            class="tl-checkbox"
                            >上午</el-checkbox
                          >

                          <el-checkbox
                            :label="item + '下午'"
                            :disabled="checkItem[item + '下午']"
                            class="tl-checkbox"
                            >下午</el-checkbox
                          >
                        </el-checkbox-group>
                      </div>
                      <div class="text-desc">
                        不能选择的日期已被其他工作项占用
                      </div>
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入修改原因"
                        class="tl-textarea"
                        v-model="scope.row.remark"
                      >
                      </el-input>
                      <div class="flex-end">
                        <el-button
                          type="primary"
                          class="tl-btn amt-bg-slip"
                          @click="alertSelect(scope, true)"
                          >确认审批</el-button
                        >
                        <el-button
                          plain
                          class="tl-btn amt-border-fadeout"
                          @click="close(scope)"
                          >取消</el-button
                        >
                      </div>
                      <el-button type="text" class="tl-btn" slot="reference"
                        >修改</el-button
                      >
                    </el-popover>
                  </div>

                  <!-- <el-tooltip
                    class="item"
                    effect="dark"
                    :content="changeListDate(scope.row.arrHide)"
                    placement="left"
                    popper-class="tl-tooltip-popper"
                  >
                    <div>
                      {{ GetLength(changeListDate(scope.row.arrHide), 9) }}
                    </div>
                  </el-tooltip> -->
                </div>
                <div
                  v-show="scope.row.approvalStatus == '2'"
                  class="flex-start"
                >
                  <em>{{ scope.row.arrHide.length * 0.5 }}天 </em>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    placement="top"
                    popper-class="tl-tooltip-popper"
                  >
                    <div slot="content">
                      <div>
                        填入工时：{{
                          checkOldNew(scope.row).showOldText || "0天"
                        }}
                      </div>
                      <div>
                        修改工时：{{
                          checkOldNew(scope.row).showNewText || "0天"
                        }}
                      </div>
                      <div style="max-width: 200px">
                        修改原因：{{ scope.row.remark || "0天" }}
                      </div>
                    </div>
                    <i
                      class="icon-remind"
                      v-show="checkOldNew(scope.row).show"
                    ></i>
                  </el-tooltip>
                  <!-- <div>
                    {{ checkOldNew(scope.row).showNewText }}
                  </div> -->
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="填入类型" prop="timeType" min-width="100px">
               </el-table-column> -->
            <el-table-column label="工时日期" min-width="150px">
              <template slot-scope="scope">
                <!-- <el-tooltip
                  class="item"
                  effect="dark"
                  :content="weekWorkListCheck(scope.row)"
                  placement="top"
                  popper-class="tl-tooltip-popper"
                > -->
                <span>{{
                  GetLength(weekWorkListCheck(scope.row), 13) || "--"
                }}</span>
                <!-- <span slot="reference">{{
                     GetLength(weekWorkListCheck(scope.row),9) || "--"
                  }}</span> -->
                <!-- </el-tooltip> -->
              </template>
            </el-table-column>

            <!-- <el-table-column
              prop="projectNameCn"
              label="项目名称"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.projectNameCn)">{{
                  scope.row.projectNameCn
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column> -->
            <el-table-column
              prop="approvalStatus"
              label="审批状态"
              min-width="100"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.approvalStatus)">
                  <!-- <i
                    :class="{
                      'el-icon-basketball111': scope.row.approvalStatus == '1',
                      'el-icon-basketball222': scope.row.approvalStatus == '2',
                    }"
                  ></i> -->
                  {{
                    CONST.APPROVAL_STATUS_MAP[scope.row.approvalStatus]
                  }}</span
                >
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="approvalTime"
              label="审批时间"
              min-width="150"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.approvalTime)">{{
                  GetLength(scope.row.approvalTime, 16)
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="submitTime" label="提交日期" min-width="150">
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.submitTime)">{{
                  GetLength(scope.row.submitTime, 16)
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>

            <!-- <el-table-column label="进度" min-width="180" prop="workProgress">
              <template slot-scope="scope">
                <tl-process
                  :data="parseInt(scope.row.workProgress || 0, 10)"
                ></tl-process>
              </template>
            </el-table-column> -->
            <!-- <el-table-column
              prop="approvalUserName"
              label="审批人"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.approvalUserName)">{{
                  scope.row.approvalUserName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column> -->
            <el-table-column
              fixed="right"
              label="操作"
              width="100"
              v-if="tableData.length > 0"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.approvalStatus == '1'"
                  @click="alertSelect(scope, false)"
                  type="text"
                  class="tl-btn"
                  >确认审批</el-button
                >
                <el-button
                  v-if="scope.row.approvalStatus == '2'"
                  type="text"
                  disabled
                  >审批完成</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
    <div class="footer-panel">
      <span
        >已选择<em>{{ workList.length }}</em
        >位成员</span
      >
      <el-button
        type="primary"
        @click="showTableSelect"
        class="tl-btn amt-bg-slip"
        >批量审批</el-button
      >
    </div>

    <tl-approval
      ref="approval"
      v-if="showApproval"
      :server="server"
      @success="approvalSuccess"
    ></tl-approval>
    <tl-approval-detail
      ref="approvalDetail"
      v-if="showApprovalDetail"
      :server="server"
    ></tl-approval-detail>
    <tl-desc-model ref="descModel"></tl-desc-model>
    <tl-select-approval
      ref="selectApproval"
      @alertSelectAll="alertSelectAll"
    ></tl-select-approval>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import crcloudTable from '@/components/crcloudTable';
// import process from '@/components/process';
import elementWeek from '@/components/elementWeek';
import approval from './approval';
import selectApproval from './selectApproval';
import approvalDetail from './approvalDetail';
import descModel from './descModel';
import Server from '../../server';
import CONST from '../../const';

const server = new Server();
export default {
  name: 'mainHours',
  data() {
    return {
      weekLine: [],
      selectType: 1,
      userId: '',
      monDayList: [
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
        '周六',
        '周日',
      ],
      options: [],
      weekBegin: '',
      startTime: '',
      checkItem: {},
      CONST,
      server,
      keyWord: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      showApproval: false,
      showApprovalDetail: false,
      tableData: [],
      textMay: [],
      timeMay: [],
      checkList: [],
      showPop: false,
      projectList: [],
      formData: {
        projectId: '',
        approvalStatus: '',
      },
      projectBudgetAmount: 0,
      projectBudgetCurrency: '',
      projectConfirmAmount: 0,
      projectConfirmCurrency: '',
      workList: [],
      listDis: [],
      tableDataSelect: [],
    };
  },

  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-approval': approval,
    'tl-approval-detail': approvalDetail,
    // 'tl-process': process,
    'tl-element-week': elementWeek,
    'tl-desc-model': descModel,
    'tl-select-approval': selectApproval,
  },
  props: {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  mounted() {
    this.server.projectPageList({
      currentPage: 1,
      pageSize: 9999,
      projectName: '',
      userAccount: this.userInfo.userAccount,
    }).then((res) => {
      if (res.code == '200') {
        this.projectList = res.data.content;
        if (this.projectList.length > 0) {
          this.formData.projectId = this.projectList[0].projectId;
          if (this.$route.query.projectId) {
            this.formData.projectId = this.$route.query.projectId;
          }

          this.summaryList();
          this.searchList();
        }
      }
    });
  },
  methods: {
    showDesc(row, day, text, week) {
      this.$refs.descModel.show(row, day, text, week);
    },
    back() {
      this.$router.push({ name: 'mainHours', query: { projectId: this.formData.projectId } });
    },
    GetLength(text, max) {
      if (this.getBLen(text) >= max) {
        const str = JSON.parse(JSON.stringify(text));
        return `${str.substring(0, max)}`;
      }
      return text;
    },

    getBLen(str) {
      if (str == null) return 0;
      if (typeof str != 'string') {
        str += '';
      }
      // eslint-disable-next-line no-control-regex
      return str.replace(/[^\x00-\xff]/g, '01').length;
    },
    summaryList() {
      this.server.summaryList({ projectId: this.formData.projectId }).then((res) => {
        if (res.code == 200) {
          this.options = res.data;
        }
      });
    },
    changePick() {
      if (this.weekLine) {
        this.weekBegin = this.weekLine[0] || '';
        this.weekEnd = this.weekLine[1] || '';
      } else {
        this.weekBegin = '';
        this.weekEnd = '';
      }

      this.searchList();
    },
    weekWorkListCheck(row) {
      const listFiler = row.weekWorkList.filter((item) => item.weekTimeAfter != '0');
      const self = this;
      // eslint-disable-next-line no-useless-escape
      const list = listFiler.map((item) => `${item.weekDate.split('-')[1]}月第${self.getWeekInMonth(new Date(item.weekDate.replace(/\-/g, '/')))}周`);
      const checkList = [...new Set(list)];
      return checkList.join(',');
    },
    weekSelect(startTime, endTime) {
      this.weekBegin = startTime;
      this.weekEnd = endTime;
      this.searchList();
    },
    getMonthWeek(dateTime) {
      const timeArr = dateTime.split('-');
      const a = timeArr[0];
      const b = timeArr[1];
      const c = timeArr[2];
      // eslint-disable-next-line radix
      const date = new Date(a, parseInt(b) - 1, c);
      let w = date.getDay();
      const d = date.getDate();
      if (w == 0) {
        w = 7;
      }
      const config = {
        getMonth: date.getMonth() + 1,
        getYear: date.getFullYear(),
        getWeek: Math.ceil((d + 6 - w) / 7),
      };

      return `${config.getMonth}月${config.getWeek}周`;
    },
    checkOldNew(row) {
      const { weekBegin } = row;
      const list = row.weekWorkList;
      const arr = [];
      list.forEach((item) => {
        const obj = this.changeTimeText(weekBegin, item.weekDate, item.weekTimeType);
        arr.push({ text: obj.text, weekTimeAfter: item.weekTimeAfter, weekTimeFront: item.weekTimeFront });
      });
      const showNew = arr.filter((item) => item.weekTimeAfter != '0');
      const showOld = arr.filter((item) => item.weekTimeFront == '1');
      const showNewText = showNew.map((item) => item.text);
      const showOldText = showOld.map((item) => item.text);
      let bool = true;
      // eslint-disable-next-line no-unused-vars
      let oldNew;
      if (this.scalarArrayEquals(showNewText, showOldText)) {
        bool = false;
        oldNew = showOldText;
      } else {
        bool = true;
        oldNew = [...showOldText];
      }

      return {
        showNewText: this.totalDate(showNewText).join(','),
        showOldText: this.totalDate(showOldText).join(','),
        day: showNewText.length * 0.5,
        show: bool,
      };
    },
    selectList(select) {
      this.tableDataSelect = select;
      this.workList = select.map((item) => ({
        sourceId: item.sourceId,
        projectApprovalId: item.projectApprovalId,
        weekSum: item.weekSum,
        weekWorkList: item.checkList,
        weekBegin: item.weekBegin,
        remark: '',
      }));
    },
    getTypeTm(li) {
      const list = CONST.DATE_MODE_NUMOBJ.filter((item) => li == item.value);
      return { weekDate: list[0].weekDate, weekTimeType: list[0].weekTimeType };
    },

    confirmTimeSheet(index, scope) {
      const arr = this.checkList.map((item) => ({ weekDate: item, type: '0', weekTimeFront: '' }));

      // eslint-disable-next-line array-callback-return
      this.tableData[index].old.forEach((item) => {
        const eq = arr.findIndex((k) => k.weekDate == item.text);
        if (eq >= 0) {
          arr[eq].weekTimeFront = item.weekTimeFront || '';
        }
        if (!(arr.some((li) => li.weekDate == item.text))) {
          arr.push({ weekDate: item.text, type: '1', weekTimeFront: item.weekTimeFront });
        } else {
          const indexs = arr.findIndex((li) => li.weekDate == item.text);
          arr[indexs].type = '2';
        }
      });

      // eslint-disable-next-line max-len
      const arrgo = arr.map((item) => ({
        // eslint-disable-next-line max-len
        weekDate: this.getTypeTm(item.weekDate).weekDate, type: item.type, weekTimeType: this.getTypeTm(item.weekDate).weekTimeType, weekTimeFront: item.weekTimeFront,
      }));

      // if (arrgo.some((item) => item.type == '0' || item.type == '1')) {

      //  }

      // eslint-disable-next-line max-len
      // } else if (arrgo.every((item) => item.type == '3' || (item.type == '1' && item.weekTimeFront == '0')) && this.tableData[index].remark) {
      //   this.$message.error('当前未修改工作项，不需要写修改原因');
      //   return false;
      // }
      // this.tableData[index].arrgo = this.checkList;
      this.$set(this.tableData[index], arrgo, this.checkList);
      this.tableData[index].checkList = arrgo;
      this.timeSheetListapproval(this.tableData[index]);
      scope._self.$refs[`popover-${index}`].doClose();
    },
    close(scope) {
      scope._self.$refs[`popover-${scope.$index}`].doClose();
    },
    // 组合全天
    totalDate(dateArr) {
      this.monDayList.forEach((li) => {
        const one = dateArr.some((item) => item == `${li}上午`);
        const tow = dateArr.some((item) => item == `${li}下午`);
        if (one && tow) {
          dateArr.remove(`${li}上午`);
          dateArr.remove(`${li}下午`);
          dateArr.push(`${li}全天`);
        }
      });
      this.$forceUpdate();
      return dateArr;
    },
    alertSelect(scope, desc) {
      if (desc) {
        if (!this.tableData[scope.$index].remark) {
          this.$message.error('修改理由不能为空');
          return false;
        }
      }

      this.$xconfirm({
        title: '确认审批',
        content: '工时确认后将不可再修改, 请确认',
      }).then(() => {
        if (desc) {
          this.confirmTimeSheet(scope.$index, scope);
        } else {
          this.tableData[scope.$index].remark = '';
          this.timeSheetListapproval(scope.row);
        }
      });
    },
    showTableSelect() {
      if (this.workList.length == 0) {
        this.$message.success('请勾选审批项');
        return false;
      }
      this.$nextTick(() => {
        this.$refs.selectApproval.show(this.tableDataSelect);
      });
    },
    alertSelectAll() {
      // this.$xconfirm({
      //   title: '确认批量审批',
      //   content: '工时确认后将不可再修改, 请确认',
      // }).then(() => {

      // });
      this.server.timeSheetListapproval({ workList: this.workList }).then((res) => {
        if (res.code == '200') {
          this.$message.success('审批成功');
          this.$refs.selectApproval.close();
          this.searchList();
          this.tableDataSelect = [];
          this.workList = [];
        }
      });
    },
    updateTimeWeek(row) {
      const {
        projectApprovalId, weekBegin, checkList, sourceId, remark,
      } = row;
      const params = {};
      params.sourceId = sourceId;
      params.weekWorkList = checkList;
      params.weekBegin = weekBegin;
      params.remark = remark;
      params.projectApprovalId = projectApprovalId;
      this.server.updateTimeWeek(params).then((res) => {
        if (res.code == '200') {
          this.$message.success('修改成功');
          this.searchList();
        }
      });
    },
    timeSheetListapproval(row) {
      const {
        projectApprovalId, sourceId,
      } = row;
      const params = {};
      params.sourceId = sourceId;
      params.projectApprovalId = projectApprovalId;
      params.weekSum = row.weekSum;
      params.weekBegin = row.weekBegin;
      params.weekWorkList = row.checkList;
      params.remark = row.remark;
      this.server.timeSheetListapproval({ workList: [params] }).then((res) => {
        if (res.code == '200') {
          this.$message.success('审批成功');
          this.searchList();
        }
      });
    },
    changTextTime() {
      // const date = new Date(time).getDay();
    },
    fdeWeightTwo(arr1, arr2) {
      const list = [];
      // console.log(arr1);
      // console.log(arr2);
      arr2.forEach((a) => {
        const bool = arr1.some((item) => ((item.text == a.text)));

        // eslint-disable-next-line no-unused-expressions
        bool ? list.push({ ...a, type: 1 }) : list.push({ ...a, type: 0 });
        // eslint-disable-next-line array-callback-return
        const index = arr1.findIndex((item) => {
          // eslint-disable-next-line no-unused-expressions
          (item.text == a.text);
        });

        arr1.splice(index, 1);
      });
      return [...list, ...arr1];
    },
    selectWeeklyTimeSumByUserId(userId, weekBegin, index) {
      this.server.selectWeeklyTimeSumByUserId({
        userId,
        weekDate: weekBegin,
      }).then((res) => {
        const arr = res.data.filter((item) => item.weekTimeAfter != 0);
        // eslint-disable-next-line no-shadow
        const listDis = [];
        arr.forEach((item) => {
          const obj = this.changeTimeText(weekBegin, item.weekDate, item.weekTimeType);
          listDis.push(obj.text);
        });

        const setArr = JSON.parse(JSON.stringify(listDis));
        listDis.forEach((item) => {
          const bool = this.tableData[index].old.some((li) => li.text == item);

          if (bool) {
            setArr.remove(item);
          }
        });

        this.listDis = setArr;
        this.listDis.forEach((item) => {
          this.$set(this.checkItem, item, true);
        });
      });
    },
    scalarArrayEquals(array1, array2) {
      return array1.length == array2.length && array1.every((v, i) => v === array2[i]);
    },
    searchList() {
      this.server.timeSheetList({
        userId: this.$route.query.userId,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        projectId: this.formData.projectId,
        approvalStatus: this.formData.approvalStatus,
        approvalUser: this.userInfo.userAccount,
        weekBegin: this.weekBegin,
        weekEnd: this.weekEnd,
        keyWord: this.keyWord,
      }).then((res) => {
        if (res.code == '200') {
          this.projectBudgetAmount = res.data.projectBudgetAmount || 0;
          this.projectBudgetCurrency = res.data.projectBudgetCurrency;
          this.projectConfirmAmount = res.data.projectConfirmAmount || 0;
          this.projectConfirmCurrency = res.data.projectConfirmCurrency;
          this.tableData = res.data.resultPageDto.content;
          this.total = res.data.resultPageDto.total;
          this.tableData.forEach((item, index) => {
            const arr = [];
            const arrOld = [];
            const arrHide = [];
            const arrDev = [];
            item.weekWorkList.forEach((li, i) => {
              const obj = this.changeTimeText(item.weekBegin, li.weekDate, li.weekTimeType);

              if (li.weekTimeAfter != '0') {
                arrHide.push(obj.text);
                arr.push(obj.text);
                arrDev.push({ text: obj.text, weekTimeFront: li.weekTimeFront });
              }

              this.tableData[index].weekWorkList[i].text = obj.text;
              this.tableData[index].weekWorkList[i].num = 0.5;
              //  if (li.weekTimeFront == 1) {
              arrOld.push({ text: obj.text, weekTimeFront: li.weekTimeFront, weekTimeType: li.weekTimeType });
            //  }
            });
            this.tableData[index].old = arrOld;
            this.tableData[index].arr = arr;
            this.tableData[index].arrHide = arrHide;
            this.tableData[index].weekSum = this.tableData[index].weekWorkList.filter((li) => li.weekTimeFront == '1').length;
            // eslint-disable-next-line no-shadow
            this.tableData[index].checkList = arrDev.map((item) => ({ weekDate: this.getTypeTm(item.text).weekDate, type: '2', weekTimeFront: item.weekTimeFront }));
          });
        }
      });
    },
    changeListDate(time) {
      const arr = JSON.parse(JSON.stringify(time));
      return this.totalDate(arr).join(',');
    },
    listTimeFun(list, userId, weekBegin, ldapType, index) {
    //  this.monDayList = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      this.$set(this, 'monDayList', ['周一', '周二', '周三', '周四', '周五', '周六', '周日']);
      if (ldapType == 'OTHER') {
        this.$set(this, 'monDayList', ['周一', '周二', '周三', '周四', '周五']);
      } else {
        this.$set(this, 'monDayList', ['周一', '周二', '周三', '周四', '周五', '周六', '周日']);
      }
      this.checkList = JSON.parse(JSON.stringify(list));
      this.checkItem = {};

      this.selectWeeklyTimeSumByUserId(userId, weekBegin, index);
    },
    changeTimeText(weekBegin, weekDate, weekTimeType) {
      const oneDate = 24 * 60 * 60 * 1000;
      const date = new Date(weekDate) - new Date(weekBegin);
      const timePro = (date + oneDate) / oneDate;
      const mode = weekTimeType == 1 ? 'Mor' : 'Aft';
      // eslint-disable-next-line max-len
      return { day: CONST.DATE_NUM[timePro.toString()] + mode, text: CONST.DATE_MODE[CONST.DATE_NUM[timePro.toString()] + mode] };
    },
    async calendarqurey(date) {
      const res = await this.server.calendarqurey({ date });
      const nowDate = new Date(date).getTime();
      // eslint-disable-next-line max-len
      const index = res.data.findIndex((item) => nowDate > new Date(item.weekBegin).getTime() && nowDate < (new Date(item.weekEnd).getTime() + 24 * 60 * 60 * 1000));
      return `${new Date(date).getMonth()}月${index}周`;
    },
    changeProject() {
      this.userId = '';
      this.summaryList();
      this.searchList();
    },
    changeStatus(data) {
      console.log(data);
      this.searchList();
    },
    approval(data) {
      this.showApproval = true;
      this.$nextTick(() => {
        this.$refs.approval.show(data);
      });
    },
    detail(data) {
      this.showApprovalDetail = true;
      this.$nextTick(() => {
        this.$refs.approvalDetail.show(data);
      });
    },
    approvalSuccess() {
      this.showApproval = false;
      this.searchList();
    },
  },
};
</script>