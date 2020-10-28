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
            <el-table-column prop="applyTime" label="填报人" min-width="180">
              <template slot-scope="scope">
                <div class="user-info">
                  <img v-if="scope.row.headUrl" :src="scope.row.headUrl" alt />
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
            <el-table-column
              prop="projectNameCn"
              label="项目名称"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.projectNameCn">{{
                  scope.row.projectNameCn
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
                <span v-if="scope.row.approvalStatus">
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
            <el-table-column prop="submitTime" label="提交日期" min-width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.submitTime">{{
                  scope.row.submitTime
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="approvalTime"
              label="审批日期"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.approvalTime">{{
                  scope.row.approvalTime
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="approvalUserName"
              label="审批人"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.approvalUserName">{{
                  scope.row.approvalUserName
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
                  >审批</el-button
                >
                <el-button
                  v-if="scope.row.approvalStatus == '1'"
                  @click="detail(scope.row)"
                  type="text"
                  class="tl-btn"
                  >查看</el-button
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
      CONST,
      server,
      keyWord: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      showApproval: false,
      showApprovalDetail: false,
      tableData: [],
      projectList: [],
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
        }
      });
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