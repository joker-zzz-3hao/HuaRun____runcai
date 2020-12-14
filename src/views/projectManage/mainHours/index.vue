<template>
  <div class="working-hours">
    <div class="operating-area">
      <div>
        <div class="operating-box">
          <dl class="dl-item">
            <dt>项目</dt>
            <dd>
              <el-select
                v-model="formData.projectId"
                :popper-append-to-body="false"
                placeholder="请选择项目"
                @change="changeProject"
                style="width: 400px"
                popper-class="tl-select-dropdown"
                class="tl-select has-bg"
              >
                <el-option
                  v-for="(item, index) in projectList"
                  :key="index"
                  :label="item.projectNameCn"
                  :value="item.projectId"
                ></el-option>
              </el-select>
            </dd>
          </dl>
          <dl class="dl-item">
            <dt>团队成员</dt>
            <dd>
              <el-select
                v-model="userId"
                placeholder="请选择"
                filterable
                style="width: 118px"
                @change="searchList"
                popper-class="tl-select-dropdown"
                class="tl-select has-bg"
              >
                <el-option label="全部" value=""> </el-option>
                <el-option
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item.userName"
                  :value="item.userId"
                >
                </el-option>
              </el-select>
            </dd>
          </dl>
            <!-- <dl class="dl-item">
            <dt>选择查询日期</dt>
            <dd>
            <tl-elementWeek :showTime="true"></tl-elementWeek>
            </dd>
          </dl> -->
        </div>
        <div class="operating-box">
          <!-- <dl class="dl-item">

            <dd>
           <el-button type="primary" class="tl-btn amt-bg-slip" @click="$router.push('/HoursJoin')">工时调入</el-button>
            </dd>
          </dl> -->
        </div>
      </div>
    </div>
    <div class="cont-area">
        <div class="dl-list">
               <dl class="dl-item">
          <dt><span> 上一周 {{week}} </span></dt>

        </dl>
        <dl class="dl-item">
          <dt><span>项目成员</span></dt>
          <dd>
            <em>{{projectUserSum}} </em><span>人</span>
            <span></span>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>预计提交工时</span></dt>
          <dd>
            <em >{{submissionHours}} </em
            ><span>天</span
            >     <span></span>
          </dd>
        </dl>
          <dl class="dl-item">
          <dt><span>实际提交工时</span></dt>
          <dd>
            <em >{{actualSubmissionHours}} </em
            ><span>天</span
            >     <span></span>
          </dd>
        </dl>
      </div>
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
          <el-table :data="tableData" class="tl-table" row-key="index">
            <el-table-column prop="applyTime" label="团队成员" min-width="130">
              <template slot-scope="scope">
                <span>{{ scope.row.userName }}</span>
              </template>
            </el-table-column>
             <el-table-column prop="userPost" label="职能" min-width="130">
              <template slot-scope="scope">
                <span>{{ scope.row.userPost }}</span>
              </template>
            </el-table-column>
             <el-table-column prop="userLevel" label="职级" min-width="130">
              <template slot-scope="scope">
                <span>{{ scope.row.userLevel }}</span>
              </template>
            </el-table-column>
             <el-table-column prop="ldapType" label="成员类型" min-width="130">
              <template slot-scope="scope">
                <span v-if="scope.row.ldapType=='Contractor'">外部账户</span>
                 <span v-if="scope.row.ldapType=='OTHER'">特殊账户</span>
                  <span v-if="scope.row.ldapType=='Full-Time'">员工账户</span>
                   <span v-if="!scope.row.ldapType">--</span>
              </template>
            </el-table-column>
            <el-table-column
              label="已审批工时"
              prop="approvedTimeSum"
              min-width="200px"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.approvedTimeSum }} 天</span>
              </template>
            </el-table-column>
            <el-table-column
              label="待审批工时"
              prop="pendingApprovalTimeSum"
              min-width="200px"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.pendingApprovalTimeSum }} 天</span>
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
              prop="submitTime"
              label="最新提交时间"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.submitTime">{{
                  scope.row.submitTime
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

                  @click="goTo(scope.row)"
                  type="text"
                  class="tl-btn"
                  >工时管理</el-button
                >

              </template>
            </el-table-column>
          </el-table>
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
      actualSubmissionHours: 0,
      workList: [],
      listDis: [],
      week: '',
      projectUserSum: 0,
      submissionHours: 0,
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
    this.projectPageList();
    this.getWeekDate();
  },
  methods: {
    getWeekDate() {
      const oneDate = 24 * 60 * 60 * 1000;
      const prevDate = new Date().getTime() - oneDate * 6;
      const date = this.dateFormat('YYYY-mm-dd', new Date(prevDate));
      this.server.getCalendar({ date }).then((res) => {
        console.log(res);
        // eslint-disable-next-line max-len
        const indexs = res.data.findIndex((item) => new Date(item.weekBegin).getTime() <= prevDate && prevDate < new Date(item.weekEnd).getTime());
        if (indexs) {
          this.week = `${this.dateFormat('mm月dd日', new Date(res.data[indexs].weekBegin))}至${this.dateFormat('mm月dd日', new Date(res.data[indexs].weekEnd))}`;
        }
      });
    },
    goTo(row) {
      this.$router.push({ name: 'approvalList', query: { userId: row.userId, projectId: this.formData.projectId } });
    },
    searchList() {
      this.server.projectUserTimeList({
        projectId: this.formData.projectId,
        userId: this.userId,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      }).then((res) => {
        this.tableData = res.data.content;
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;
      });
    },
    changeProject() {
      sessionStorage.setItem('projectId', this.formData.projectId);
      this.userId = '';
      this.timeSheetList();
      this.summaryList();
      this.searchList();
    },
    summaryList() {
      this.server.summaryList({ projectId: this.formData.projectId }).then((res) => {
        if (res.code == 200) {
          this.options = res.data;
        }
      });
    },
    timeSheetList() {
      this.server.timeSheetList({

        projectId: this.formData.projectId,
      }).then((res) => {
        this.projectBudgetAmount = res.data.projectBudgetAmount || 0;
        this.projectBudgetCurrency = res.data.projectBudgetCurrency;
        this.projectConfirmAmount = res.data.projectConfirmAmount || 0;
        this.projectConfirmCurrency = res.data.projectConfirmCurrency;
        this.actualSubmissionHours = res.data.actualSubmissionHours;
        this.submissionHours = res.data.submissionHours;
        this.projectUserSum = res.data.projectUserSum;
      });
    },
    projectPageList() {
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
            console.log(list);
            if (list.length > 0) {
              this.formData.projectId = list[0].projectId;
            } else {
              this.formData.projectId = this.projectList[0].projectId;
            }
            if (this.$route.query.projectId) {
              this.formData.projectId = this.$route.query.projectId;
            }
            this.timeSheetList();
            this.summaryList();
            this.searchList();
          }
        }
      });
    },
  },

};
</script>