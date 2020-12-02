/* eslint-disable no-extend-native */
/* eslint-disable func-names */
<template>
  <div class="working-hours">
    <div class="operating-area">
      <!-- <div class="page-title">工时审批</div> -->
      <div>
        <dl class="dl-item">
          <dt>项目</dt>
          <dd>
            <el-select
              v-model="formData.projectId"
              :popper-append-to-body="false"
              placeholder="请选择项目"
              @change="changeProject"
              popper-class="tl-select-dropdown"
              class="tl-select"
            >
              <el-option
                v-for="(item, index) in projectList"
                :key="index + item.projectId"
                :label="item.projectNameCn"
                :value="item.projectId"
              ></el-option>
            </el-select>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt>审批状态</dt>
          <dd>
            <el-select
              v-model="formData.approvalStatus"
              :popper-append-to-body="false"
              placeholder="请选择审批状态"
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
          <dt>时间</dt>
          <dd>
            <!-- <el-date-picker
              v-model="weekBegin"
              type="week"
              format="yyyy 第 WW 周"
              value-format="yyyy-MM-dd"

              placeholder="选择周"
            >
            </el-date-picker> -->
            <el-date-picker
              v-model="weekLine"
              type="daterange"
              @change="changePick"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt>按周选择投入工时</dt>
          <dd>
            <el-date-picker
              v-model="startTime"
              type="week"
              @change="searchList"
              format="yyyy 第 WW 周"
              value-format="yyyy-MM-dd"
              placeholder="选择周"
            >
            </el-date-picker>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt>提交人</dt>
          <dd>
            <el-select
              v-model="userId"
              placeholder="请选择"
              filterable
              @change="searchList"
            >
              <el-option
                v-for="item in options"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              >
              </el-option>
            </el-select>
          </dd>
        </dl>

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
            <el-button plain class="tl-btn" @click="searchList">
              搜索
            </el-button>
          </dd>
        </dl>
      </div>
    </div>
    <div class="cont-area">
      <div class="dl-list">
        <dl class="dl-item">
          <dt><span>项目总预算</span></dt>
          <dd>
            <em v-money="{ value: projectBudgetAmount, precision: 2 }"></em
            ><span>元</span><span>{{ projectBudgetCurrency || "人民币" }}</span>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>项目已确认人力成本</span></dt>
          <dd>
            <em v-money="{ value: projectConfirmAmount, precision: 2 }"></em
            ><span>元</span
            ><span>{{ projectConfirmCurrency || "人民币" }}</span>
          </dd>
        </dl>
      </div>
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
            row-key="projectApprovalId"
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
            <el-table-column label="工作项" prop="workContent" min-width="150">
            </el-table-column>
            <el-table-column label="工作项内容" min-width="150" prop="workDesc">
              <template slot-scope="scope">
                <el-popover
                  placement="top"
                  width="300"
                  trigger="hover"
                  popper-class="approval-pop"
                >
                  {{ scope.row.workDesc }}
                  <span slot="reference">{{ scope.row.workDesc }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="进度" min-width="180" prop="workProgress">
              <template slot-scope="scope">
                <tl-process
                  :data="parseInt(scope.row.workProgress || 0, 10)"
                ></tl-process>
              </template>
            </el-table-column>
            <el-table-column prop="applyTime" label="提交人" min-width="180">
              <template slot-scope="scope">
                <div class="user-info">
                  <img
                    v-if="hasValue(scope.row.headUrl)"
                    :src="scope.row.headUrl"
                    alt
                  />
                  <div v-else-if="scope.row.userName" class="user-name">
                    <em>{{
                      scope.row.userName.substring(
                        scope.row.userName.length - 2
                      )
                    }}</em>
                  </div>
                </div>
                <span>{{ scope.row.userName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="投入工时" min-width="200px">
              <template slot-scope="scope">
                {{ weekWorkListCheck(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column label="投入工时" min-width="200px">
              <template slot-scope="scope">
                <div v-show="scope.row.approvalStatus == '1'">
                  <div>
                    <em>{{ scope.row.arrHide.length * 0.5 }}天 </em>
                    <el-popover
                      placement="top"
                      width="300"
                      :key="scope.$index + scope.row.projectId"
                      trigger="click"
                      :tabindex="scope.$index"
                      :ref="'popover' + scope.$index"
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
                      <div v-for="(item, index) in monDayList" :key="index">
                        <dt>{{ item }}</dt>
                        <el-checkbox-group
                          v-model="checkList"
                          :ref="'check' + index"
                        >
                          <el-checkbox
                            :label="item + '上午'"
                            :disabled="checkItem[item + '上午']"
                            >上午</el-checkbox
                          >
                          <el-checkbox
                            :label="item + '下午'"
                            :disabled="checkItem[item + '下午']"
                            >下午</el-checkbox
                          >
                        </el-checkbox-group>
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
                          @click="
                            confirmTimeSheet(
                              scope.$index,
                              scope.row.arrHide,
                              scope.row.weekBegin
                            )
                          "
                          >确定</el-button
                        >
                      </div>
                      <el-button type="text" slot="reference">修改</el-button>
                    </el-popover>
                  </div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="changeListDate(scope.row.arrHide)"
                    placement="top"
                  >
                    <div>{{ changeListDate(scope.row.arrHide) }}</div>
                  </el-tooltip>
                </div>
                <div v-show="scope.row.approvalStatus == '2'">
                  <em>{{ checkOldNew(scope.row).day }}天 </em>
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">
                      <div>
                        填入工时：{{
                          checkOldNew(scope.row).showOldText || "无"
                        }}
                      </div>
                      <div>
                        修改工时：{{
                          checkOldNew(scope.row).showNewText || "无"
                        }}
                      </div>
                      <div>修改原因：{{ scope.row.remark || "无" }}</div>
                    </div>
                    <i
                      class="el-icon-warning"
                      v-show="checkOldNew(scope.row).show"
                    ></i>
                  </el-tooltip>
                  <!-- <div>
                    {{ checkOldNew(scope.row).showNewText }}
                  </div> -->
                </div>
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
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.approvalStatus)">
                  <i
                    :class="{
                      'el-icon-basketball': scope.row.approvalStatus == '1',
                      'el-icon-basketball': scope.row.approvalStatus == '2',
                    }"
                  ></i>
                  {{
                    CONST.APPROVAL_STATUS_MAP[scope.row.approvalStatus]
                  }}</span
                >
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="submitTime" label="提交日期" min-width="180">
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.submitTime)">{{
                  scope.row.submitTime
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="approvalTime"
              label="审批时间"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.approvalTime)">{{
                  scope.row.approvalTime
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
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
                  @click="alertSelect(scope.row)"
                  type="text"
                  class="tl-btn"
                  >确认审批</el-button
                >
                <el-button
                  v-if="scope.row.approvalStatus == '2'"
                  type="text"
                  class="tl-btn"
                  >已审批</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button
            type="primary"
            @click="alertSelectAll"
            class="tl-btn amt-bg-slip"
            >批量审批</el-button
          >
        </div>
      </tl-crcloud-table>
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
  </div>
</template>

<script>
import { mapState } from 'vuex';
import crcloudTable from '@/components/crcloudTable';
import process from '@/components/process';
import approval from './components/approval';
import approvalDetail from './components/approvalDetail';
import Server from '../server';
import CONST from '../const';

const server = new Server();
export default {
  name: 'mainHours',
  data() {
    return {
      weekLine: [],
      userId: '',
      monDayList: [
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
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
    };
  },

  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-approval': approval,
    'tl-approval-detail': approvalDetail,
    'tl-process': process,
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
        //  this.formData.projectId = this.projectList[0].projectId;
          const list = this.projectList.filter((item) => Number(item.projectCount) > 0);
          this.formData.projectId = list[0].projectId
           || this.projectList[0].projectId;
          this.searchList();
        }
      }
    });
  },
  methods: {
    summaryList() {
      this.server.summaryList({ projectId: this.formData.projectId }).then((res) => {
        if (res.code == 200) {
          this.options = res.data;
        }
      });
    },
    changePick() {
      this.searchList();
    },
    weekWorkListCheck(row) {
      const listFiler = row.weekWorkList.filter((item) => item.weekTimeAfter != '0');
      const list = listFiler.map((item) => `${item.weekDate.split('-')[1]}月${item.weekDate.split('-')[2]}日`);
      const checkList = [...new Set(list)];
      return checkList.join(',');
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
      const showNew = arr.filter((item) => item.weekTimeAfter == '2');
      const showOld = arr.filter((item) => item.weekTimeAfter == '1');
      const showNewText = showNew.map((item) => item.text);
      const showOldText = showOld.map((item) => item.text);
      let bool = true;
      // eslint-disable-next-line no-unused-vars
      let oldNew;
      if (showNewText.length == 0) {
        bool = false;
        oldNew = showOldText;
      } else {
        bool = true;
        oldNew = [...showNewText, ...showOldText];
      }

      return {
        showNewText: this.totalDate(oldNew).join(','),
        showOldText: this.totalDate(showOldText).join(','),
        day: oldNew.length * 0.5,
        show: bool,
      };
    },
    selectList(select) {
      this.workList = select.map((item) => ({
        sourceId: item.sourceId,
        projectApprovalId: item.projectApprovalId,
        weekSum: item.weekSum,
      }));
    },
    getTypeTm(li) {
      const list = CONST.DATE_MODE_NUMOBJ.filter((item) => li == item.value);
      console.log(list);
      return { weekDate: list[0].weekDate, weekTimeType: list[0].weekTimeType };
    },
    confirmTimeSheet(index) {
      const arr = this.checkList.map((item) => ({ weekDate: item, type: '0', weekTimeFront: '' }));
      console.log(arr);
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
          if (item.weekTimeFront == 1) {
            arr[indexs].type = '3';
          } else {
            arr[indexs].type = '2';
          }
        }
      });

      // eslint-disable-next-line max-len
      const arrgo = arr.map((item) => ({
        // eslint-disable-next-line max-len
        weekDate: this.getTypeTm(item.weekDate).weekDate, type: item.type, weekTimeType: this.getTypeTm(item.weekDate).weekTimeType, weekTimeFront: item.weekTimeFront,
      }));
      console.log(arrgo);
      if (!arrgo.every((item) => item.type == '1')) {
        if (!this.tableData[index].remark) {
          this.$message.error('修改理由不能为空');
          return false;
        }
      }
      this.tableData[index].arrgo = this.checkList;
      this.$set(this.tableData[index], arrgo, this.checkList);
      this.tableData[index].checkList = arrgo;
      this.updateTimeWeek(this.tableData[index]);
      this.$refs[`popover${index}`].doClose();
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
      return dateArr;
    },
    alertSelect(row) {
      this.$xconfirm({
        title: '确认审批',
        content: '工时确认后将不可再修改, 请确认',
      }).then(() => {
        this.timeSheetListapproval(row);
      });
    },
    alertSelectAll() {
      if (this.workList.length == 0) {
        this.$message.success('请勾选审批项');
        return false;
      }
      this.$xconfirm({
        title: '确认批量审批',
        content: '工时确认后将不可再修改, 请确认',
      }).then(() => {
        this.server.timeSheetListapproval({ workList: this.workList }).then((res) => {
          if (res.code == '200') {
            this.$message.success('审批成功');
            this.searchList();
          }
        });
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
        const arr = res.data;
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
    searchList() {
      const weekBegin = this.weekLine[0] || '';
      const weekEnd = this.weekLine[1] || '';
      this.server.timeSheetList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        projectId: this.formData.projectId,
        approvalStatus: this.formData.approvalStatus,
        approvalUser: this.userInfo.userAccount,
        weekBegin,
        startTime: this.startTime,
        userId: this.userId,
        weekEnd,
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
            item.weekWorkList.forEach((li, i) => {
              const obj = this.changeTimeText(item.weekBegin, li.weekDate, li.weekTimeType);

              if (li.weekTimeAfter != 0) {
                arrHide.push(obj.text);
                arr.push(obj.text);
              }

              this.tableData[index].weekWorkList[i].text = obj.text;
              this.tableData[index].weekWorkList[i].num = 0.5;
              if (li.weekTimeFront == 1) {
                arrOld.push({ text: obj.text, weekTimeFront: li.weekTimeFront, weekTimeType: li.weekTimeType });
              }
            });
            this.tableData[index].old = arrOld;
            this.tableData[index].arr = arr;
            this.tableData[index].arrHide = arrHide;
            this.tableData[index].weekSum = this.tableData[index].weekWorkList.filter((li) => li.weekTimeFront == '1').length;
            // eslint-disable-next-line no-shadow
            this.tableData[index].checkList = arr.map((item) => ({ weekDate: item, type: '2' }));
            console.log(this.tableData);
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
      if (ldapType == 'OTHER' || !ldapType) {
        this.monDayList.remove('周六');
        this.monDayList.remove('周日');
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
  watch: {},
};
</script>
