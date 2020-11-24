<template>
  <div class="working-hours">
    <div class="operating-area">
      <div class="page-title">工时审批</div>
      <div class="operating-box">
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
            <el-date-picker
              v-model="value1"
              type="week"
              format="yyyy 第 WW 周"
              placeholder="选择周"
            >
            </el-date-picker>
          </dd>
        </dl>
        <dl class="dl-item">
          <dd>
            <el-input
              maxlength="64"
              v-model="keyWord"
              placeholder="请输入项目名称或者项目经理"
              class="tl-input-search"
            >
              <i class="el-icon-search" slot="prefix"></i>
            </el-input>
            <el-button plain class="tl-btn"> 搜索 </el-button>
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
          <el-table :data="tableData" class="tl-table">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="工作项"> </el-table-column>
            <el-table-column label="工作项内容" min-width="110">
            </el-table-column>
            <el-table-column label="进度" min-width="110"> </el-table-column>
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
            <el-table-column label="周期时间"> </el-table-column>
            <el-table-column label="投入工时" min-width="200px">
              <template slot-scope="scope">
                <div>
                  <div>
                    <em v-if="timeMay[scope.$index]"
                      >{{ timeMay[scope.$index] }}天
                    </em>
                    <el-popover
                      placement="top"
                      width="300"
                      trigger="click"
                      :tabindex="scope.$index"
                      :ref="'popover' + scope.$index"
                      popper-class="approval-pop"
                      @show="
                        listTimeFun(scope.row.weekWorkList, scope.row.weekBegin)
                      "
                    >
                      <div>
                        <dt>周一</dt>

                        <el-checkbox
                          label="周一上午"
                          v-model="checkList.mondayMor"
                          true-label="周一上午"
                          >上午</el-checkbox
                        >
                        <el-checkbox
                          label="周一下午"
                          v-model="checkList.mondayAft"
                          true-label="周一下午"
                          >下午</el-checkbox
                        >
                      </div>
                      <div>
                        <dt>周二</dt>

                        <el-checkbox
                          label="周二上午"
                          v-model="checkList.tuesdayMor"
                          true-label="周二上午"
                          >上午</el-checkbox
                        >
                        <el-checkbox
                          label="周二下午"
                          v-model="checkList.tuesdayAft"
                          true-label="周二下午"
                          >下午</el-checkbox
                        >
                      </div>
                      <div>
                        <dt>周三</dt>

                        <el-checkbox
                          label="周三上午"
                          v-model="checkList.wednesdayMor"
                          true-label="周三上午"
                          >上午</el-checkbox
                        >
                        <el-checkbox
                          label="周三下午"
                          v-model="checkList.wednesdayAft"
                          true-label="周三下午"
                          >下午</el-checkbox
                        >
                      </div>
                      <div>
                        <dt>周四</dt>

                        <el-checkbox
                          label="周四上午"
                          v-model="checkList.thursdayMor"
                          true-label="周四上午"
                          >上午</el-checkbox
                        >
                        <el-checkbox
                          label="周四下午"
                          v-model="checkList.thursdayAft"
                          true-label="周四下午"
                          >下午</el-checkbox
                        >
                      </div>
                      <div>
                        <dt>周五</dt>

                        <el-checkbox
                          label="周五上午"
                          v-model="checkList.fridayMor"
                          true-label="周五上午"
                          >上午</el-checkbox
                        >
                        <el-checkbox
                          label="周五下午"
                          v-model="checkList.fridayAft"
                          true-label="周五下午"
                          >下午</el-checkbox
                        >
                      </div>
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入修改原因"
                        class="tl-textarea"
                      >
                      </el-input>
                      <div class="flex-end">
                        <el-button
                          type="primary"
                          class="tl-btn amt-bg-slip"
                          @click="confirmTimeSheet(scope.$index)"
                          >确定</el-button
                        >
                      </div>
                      <el-button type="text" slot="reference">修改</el-button>
                    </el-popover>
                  </div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="textMay[scope.$index]"
                    placement="top"
                  >
                    <div>{{ textMay[scope.$index] }}</div>
                  </el-tooltip>
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

            <el-table-column prop="submitTime" label="提交日期" min-width="180">
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.submitTime)">{{
                  scope.row.submitTime
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="approvalStatus"
              label="审批状态"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.approvalStatus)">
                  <i
                    :class="{
                      'el-icon-basketball': scope.row.approvalStatus == '0',
                      'el-icon-basketball': scope.row.approvalStatus == '1',
                    }"
                  ></i>
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
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.approvalTime)">{{
                  scope.row.approvalTime
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100"
              v-if="tableData.length > 0"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.approvalStatus == '0'"
                  @click="approval(scope.row)"
                  type="text"
                  class="tl-btn"
                  >确认审批</el-button
                >
                <el-button
                  v-if="scope.row.approvalStatus == '1'"
                  @click="detail(scope.row)"
                  type="text"
                  class="tl-btn"
                  >已审批</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary">批量审批</el-button>
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
    <div class="dialog-footer-l"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import crcloudTable from '@/components/crcloudTable';
import approval from './components/approval';
import approvalDetail from './components/approvalDetail';
import Server from '../server';
import CONST from '../const';

const server = new Server();
export default {
  name: 'mainHours',
  data() {
    return {
      CONST,
      value1: '',
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
      checkList: {

      },
      showPop: false,
      projectList: [],
      popoverVisible: false,
      editRemark: '',
      formData: {
        projectId: '',
        approvalStatus: '',
      },
      projectBudgetAmount: 0,
      projectBudgetCurrency: '',
      projectConfirmAmount: 0,
      projectConfirmCurrency: '',
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-approval': approval,
    'tl-approval-detail': approvalDetail,
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
          this.searchList();
        }
      }
    });
  },
  methods: {
    confirmTimeSheet(index) {
      console.log(this.checkList);
      const dateList = [];
      let timeTotal = 0;
      // eslint-disable-next-line guard-for-in
      for (const key in this.checkList) {
        dateList.push(this.checkList[key]);
      }

      const mapList = dateList.filter((item) => item);
      timeTotal = mapList.length * 0.5 + timeTotal;
      const listString = mapList.join(',');

      this.$set(this.textMay, index, listString);
      this.$set(this.timeMay, index, timeTotal);
      this.$refs[`popover${index}`].doClose();
    },
    searchList() {
      this.server.timeSheetList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        projectId: this.formData.projectId,
        approvalStatus: this.formData.approvalStatus,
        approvalUser: this.userInfo.userAccount,
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
            item.weekWorkList.forEach((li) => {
              const obj = this.changeTimeText(item.weekBegin, li.weekDate, li.weekTimeType);

              arr.push(obj.text);
              this.textMay[index] = arr.join(',');
              this.timeMay[index] = arr.length * 0.5;
            });
          });
        }
      });
    },
    listTimeFun(list, weekBegin) {
      this.$set(this, 'checkList', {
        mondayMor: '',
        mondayAft: '',
        tuesdayMor: '',
        tuesdayAft: '',
        wednesdayMor: '',
        wednesdayAft: '',
        thursdayMor: '',
        thursdayAft: '',
        fridayMor: '',
        fridayAft: '',
      });
      const listText = list.map((item) => this.changeTimeText(weekBegin, item.weekDate, item.weekTimeType));
      listText.forEach((item) => {
        this.$set(this.checkList, item.day, item.text);
      });
      this.$forceUpdate();
    },
    changeTimeText(weekBegin, weekDate, weekTimeType) {
      const oneDate = 24 * 60 * 60 * 1000;
      const date = new Date(weekDate) - new Date(weekBegin);
      const timePro = (date + oneDate) / oneDate;
      console.log(timePro);
      const mode = weekTimeType == 0 ? 'Mor' : 'Aft';
      // eslint-disable-next-line max-len
      return { day: CONST.DATE_NUM[timePro.toString()] + mode, text: CONST.DATE_MODE[CONST.DATE_NUM[timePro.toString()] + mode] };
    },
    changeProject() {
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
