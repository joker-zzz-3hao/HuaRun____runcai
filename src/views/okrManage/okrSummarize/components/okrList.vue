<template>
  <div class="okr-summarize-list">
    <div class="operating-area">
      <div class="page-title">OKR汇总</div>
      <div class="operating-box">
        <dl class="dl-item">
          <dt>周期</dt>
          <dd>
            <div>
              <el-select
                v-if="periodList.length > 0"
                v-model="periodId"
                placeholder="请选择目标周期"
                :popper-append-to-body="false"
                popper-class="tl-select-dropdown"
                class="tl-select"
                @change="periodChange"
              >
                <el-option
                  v-for="item in periodList"
                  :key="item.periodId"
                  :label="item.periodName"
                  :value="item.periodId"
                ></el-option>
              </el-select>
            </div>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt>组织</dt>
          <dd>
            <el-cascader
              v-model="orgFullIdList"
              ref="cascader"
              :options="departmentData"
              :show-all-levels="false"
              :props="{
                checkStrictly: true,
                value: 'orgId',
                label: 'orgName',
                children: 'children',
              }"
              @change="selectIdChange"
              popper-class="tl-cascader-popper"
              class="tl-cascader"
            ></el-cascader>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt>OKR类型</dt>
          <dd>
            <el-select
              v-model="okrBelongType"
              placeholder="全部"
              :popper-append-to-body="false"
              popper-class="tl-select-dropdown"
              class="tl-select"
              style="width: 120px"
              @change="okrTypeChange"
            >
              <el-option
                v-for="item in CONST.BELONG_TYPE_LIST"
                :key="item.okrBelongType"
                :label="item.okrBelongTypeName"
                :value="item.okrBelongType"
              ></el-option>
            </el-select>
          </dd>
        </dl>
        <!-- <dl class="dl-item">
          <el-dropdown @command="showprempt">
            <span class="el-dropdown-link">
              提醒设置<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="progress"
                >OKR进度更新提醒</el-dropdown-item
              >
              <el-dropdown-item command="update"
                >OKR更新次数提醒</el-dropdown-item
              >
              <el-dropdown-item command="time"
                >自定义时间更新进展提醒</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </dl> -->
      </div>
    </div>
    <div class="cont-area">
      <div class="dl-list-group">
        <div class="dl-list-info">
          <dl class="dl-item">
            <dt><span>组织</span></dt>
            <dd>
              <em>{{ orgName }}</em>
            </dd>
          </dl>
          <dl class="dl-item">
            <dt><span>已提交/未提交</span></dt>
            <dd>
              <em>{{ summaryData.submitOkrUser }}</em
              ><em>/</em>
              <em>{{ summaryData.unSubmitOkrUser }}</em>
            </dd>
          </dl>
        </div>
        <div class="dl-list-detail">
          <dl class="dl-item">
            <dt>
              <span>{{ okrBelongType == "2" ? "成员" : "部门" }}总数</span>
            </dt>
            <dd>
              <em>{{ summaryData.orgSumUser }}</em>
            </dd>
          </dl>
          <dl class="dl-item">
            <dt><span>进行中</span></dt>
            <dd>
              <em>{{ summaryData.okrProgressNum }}</em>
            </dd>
          </dl>
          <dl class="dl-item">
            <dt><span>待审批</span></dt>
            <dd>
              <em>{{ summaryData.okrApprovalNum }}</em>
            </dd>
          </dl>
          <dl class="dl-item">
            <dt><span>复盘中</span></dt>
            <dd>
              <em>{{ summaryData.okrReviewNum }}</em>
            </dd>
          </dl>
          <dl class="dl-item">
            <dt><span>已完成</span></dt>
            <dd>
              <em>{{ summaryData.okrCompleteNum }}</em>
            </dd>
          </dl>
          <dl class="dl-item">
            <dt><span>已结束</span></dt>
            <dd>
              <em>{{ summaryData.okrDoneNum }}</em>
            </dd>
          </dl>

          <!-- <dl class="dl-item okr-summarize-search-form">
            <dt>OKR状态</dt>
            <dd>
              <el-select
                v-model="status"
                placeholder="全部"
                :popper-append-to-body="false"
                popper-class="tl-select-dropdown"
                class="tl-select"
                style="width: 120px"
                @change="searchList"
                clearable
              >
                <el-option
                  v-for="item in CONST.STATUS_LIST"
                  :key="item.status"
                  :label="item.statusName"
                  :value="item.status"
                ></el-option>
              </el-select>
            </dd>
          </dl>
          <dl class="dl-item okr-summarize-search-form">
            <dd>
              <el-input
                placeholder="成员姓名"
                v-model="userName"
                @keyup.enter.native="searchList"
                class="tl-input"
                clearable
                @clear="searchList"
              >
                <i
                  slot="prefix"
                  class="el-input__icon el-icon-search"
                  @click="searchList"
                ></i>
              </el-input>
            </dd>
          </dl>
          <el-button
            type="primary"
            class="tl-btn amt-bg-slip okr-summarize-search-form"
            @click="searchList"
            >查询</el-button
          > -->
        </div>
      </div>
      <div class="operating-box" style="margin-bottom: 20px">
        <dl class="dl-item">
          <dt>OKR状态</dt>
          <dd>
            <el-select
              v-model="status"
              placeholder="全部"
              :popper-append-to-body="false"
              popper-class="tl-select-dropdown"
              class="tl-select"
              style="width: 120px"
              @change="searchList"
              clearable
            >
              <el-option
                v-for="item in CONST.STATUS_LIST"
                :key="item.status"
                :label="item.statusName"
                :value="item.status"
              ></el-option>
            </el-select>
          </dd>
        </dl>
        <dl class="dl-item">
          <dd>
            <el-input
              placeholder="成员姓名"
              v-model="userName"
              @keyup.enter.native="searchList"
              class="tl-input"
              clearable
              @clear="searchList"
            >
              <i
                slot="prefix"
                class="el-input__icon el-icon-search"
                @click="searchList"
              ></i>
            </el-input>
          </dd>
        </dl>
        <el-button type="primary" class="tl-btn amt-bg-slip" @click="searchList"
          >查询</el-button
        >
        <el-button
          plain
          class="tl-btn amt-border-fadeout"
          :loading="loadokring"
          @click="loadOkr"
          >全部导出</el-button
        >
      </div>
      <crcloud-table
        :total="total"
        :pageSize.sync="pageSize"
        :currentPage.sync="currentPage"
        @searchList="searchList"
      >
        <div slot="tableContainer">
          <el-table
            ref="dicTable"
            v-loading="loading"
            :data="tableData"
            class="tl-table"
          >
            <el-table-column
              min-width="80px"
              align="left"
              prop="userName"
              label="姓名"
            ></el-table-column>
            <el-table-column
              min-width="170px"
              align="left"
              prop="orgName"
              label="部门"
            ></el-table-column>
            <el-table-column
              min-width="70px"
              align="left"
              prop="okrProgress"
              label="okr进度"
            >
              <template slot-scope="scope">
                <!-- <tl-process
                  :data="parseInt(scope.row.okrProgress, 10)"
                  :showNumber="true"
                  :width="30"
                  :marginLeft="2"
                ></tl-process> -->
                {{ `${scope.row.okrProgress}%` }}
              </template>
            </el-table-column>
            <el-table-column
              min-width="70px"
              align="left"
              prop="status"
              label="状态"
            >
              <template slot-scope="scope">{{
                CONST.TABLE_STATUS_MAP[scope.row.status]
              }}</template>
            </el-table-column>
            <el-table-column
              min-width="80px"
              align="left"
              prop="okrConfidence"
              label="信心指数"
            >
              <template slot-scope="scope">{{
                scope.row.okrConfidence || "--"
              }}</template>
            </el-table-column>
            <el-table-column
              width="180px"
              align="left"
              prop="updateTime"
              label="最后更新时间"
            ></el-table-column>
            <el-table-column
              min-width="80px"
              align="left"
              prop="okrUpdateCount"
              label="更新次数"
            ></el-table-column>
            <el-table-column
              min-width="90px"
              align="left"
              prop="okrUpContinueCount"
              label="向上承接数"
            ></el-table-column>
            <el-table-column
              min-width="80px"
              align="left"
              prop="okrDownContinueCount"
              label="被承接数"
            >
            </el-table-column>
            <el-table-column fixed="right" width="95" label="操作">
              <template slot-scope="scope">
                <el-button @click="checkOkr(scope.row, 'info')" type="text"
                  >详情</el-button
                >
                <!-- 根节点、未审阅、非进行中 -->
                <el-button
                  v-if="
                    ![1, 2].includes(scope.row.readStatus) &&
                    rootRole &&
                    [1, 2, 3, 4].includes(scope.row.status)
                  "
                  @click="checkOkr(scope.row, 'check')"
                  type="text"
                  >审阅</el-button
                >
                <!-- 根节点、已审阅||待审批 -->
                <el-button
                  disabled
                  type="text"
                  v-if="
                    rootRole &&
                    ([1, 2].includes(scope.row.readStatus) ||
                      ![1, 2, 3, 4].includes(scope.row.status))
                  "
                  ><span v-if="[1, 2].includes(scope.row.readStatus)">
                    已审阅</span
                  ><span v-if="![1, 2, 3, 4].includes(scope.row.status)">
                    审阅</span
                  >
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcloud-table>
    </div>
    <tl-prempt
      ref="prempt"
      :upDateType="upDateType"
      :periodId="periodId"
    ></tl-prempt>
  </div>
</template>

<script>

import { mapMutations, mapState } from 'vuex';
// import tlProcess from '@/components/process';
import Server from '../server';
import prempt from './prempt';
import CONST from '../const';

const server = new Server();

export default {
  name: 'okrMaps',
  data() {
    return {
      server,
      CONST,
      okrId: '',
      tableData: [],
      loading: false,
      loadokring: false,
      treeData: [],
      periodList: [],
      orgFullIdList: [],
      departmentData: [],
      showSelectOrg: false,
      periodId: '',
      okrBelongType: '1',
      status: '',
      orgFullId: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      userName: '',
      okrCycle: {},

      orgName: '',
      summaryData: {},
      rootRole: false,
      upDateType: '',
    };
  },
  components: {
    // tlProcess,
    // eslint-disable-next-line vue/no-unused-components
    'tl-prempt': prempt,
  },
  mounted() {
    const self = this;
    self.init();
    this.$busOn('refreshPage', () => {
      this.searchList();
    });
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),

  },
  methods: {
    ...mapMutations('common', ['setOkrSummarizeDetailData', 'setOkrSummarizeStep', 'setSummasizeOptionType']),
    init() {
      this.rootRole = false;
      // 查询周期
      this.server.getOkrCycleList().then((res) => {
        if (res.code == 200) {
          this.periodList = res.data || [];
          this.okrCycle = this.periodList.filter((item) => item.checkStatus == '1')[0] || {};
          this.periodId = this.okrCycle.periodId;
          // 查询组织树
          this.getOrgTable();
        }
      });
      this.userInfo.roleList.forEach((element) => {
        if (element.roleCode == 'ROOT_ADMIN') {
          this.rootRole = true;
        }
      });
    },
    loadOkr() {
      this.loadokring = true;
      const name = `${this.userInfo.tenantInfo.tenantName}OKR汇总(所有).xlsx`;
      this.exportExcel('/gateway/system-service/sys/excelOkr/exportExcel', {
        periodId: this.periodId,
      }, name).then(() => {
        this.loadokring = false;
      });
    },
    showprempt(data) {
      this.upDateType = data;
      this.$nextTick(() => {
        this.$refs.prempt.show();
      });
    },
    getOrgTable() {
      // 查询组织树
      this.server.getOrgTable().then((res) => {
        if (res.code == '200') {
          if (res.data) {
            this.departmentData = [];
            this.departmentData.push(res.data);
            this.orgFullId = this.departmentData[0].orgFullId;
            this.orgFullIdList = this.orgFullId.split(':');
            this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
            this.getOrgName(this.departmentData, 0);
            if (res.data.length > 0) {
              this.orgFullId = res.data[0].orgFullId;
            }

            this.searchList();
            this.getSummaryOkrInfo();
          }
        }
      });
    },
    getSummaryOkrInfo() {
      const params = {
        currentPage: 1,
        okrBelongType: this.okrBelongType,
        orgFullId: this.orgFullId,
        pageSize: 10,
        periodId: this.periodId,
        status: this.status,
        // tenantId: 'string',
        userName: this.userName,
      };
      this.server.summaryOkrInfo(params).then((res) => {
        if (res.code == 200) {
          this.summaryData = res.data;
        }
      });
    },
    getOrgName(data, index) {
      data.forEach((item) => {
        if (this.orgFullIdList[index] == item.orgId) {
          if (item.children && item.children.length > 0 && this.orgFullIdList[index + 1]) {
            this.getOrgName(item.children, index + 1);
          } else if ((index + 1) == this.orgFullIdList.length) {
            this.orgName = item.orgName;
          }
        }
      });
    },

    selectIdChange(data) {
      // this.orgFullId = data[data.length - 1];
      this.orgFullId = `${data.join(':')}:`;
      this.orgFullIdList = data;
      this.$refs.cascader.dropDownVisible = false;
      this.getOrgName(this.departmentData, 0);
      this.searchList();
      this.getSummaryOkrInfo();
    },
    okrTypeChange() {
      this.searchList();
      this.getSummaryOkrInfo();
    },

    searchList() {
      const params = {};
      params.periodId = this.periodId;
      params.orgFullId = this.orgFullId;
      params.okrBelongType = this.okrBelongType;
      params.status = this.status;
      params.currentPage = this.currentPage;
      params.pageSize = this.pageSize;
      params.userName = this.userName;
      this.loading = true;
      this.server.queryAllOkrList(params).then((res) => {
        if (res.code == 200) {
          this.total = res.data.total;
          this.currentPage = res.data.currentPage;
          this.pageSize = res.data.pageSize;
          this.tableData = res.data.content;
          // this.tableData = res.data;
        }
        this.loading = false;
      });
    },
    goback() {
      this.$router.go('-1');
    },

    checkOkr(row, optionType) {
      this.setSummasizeOptionType(optionType);
      // 1、查询okr详情
      if (row.status === 0) { // 如果是待审批，从行数据中取数据
        this.setOkrSummarizeDetailData(JSON.stringify(row));
        this.$busEmit('clearInput');
        this.setOkrSummarizeStep('2');
      } else {
        this.server.getokrDetail({ okrId: row.okrId }).then((res) => {
          if (res.code == 200) {
            if (res.data) { this.setOkrSummarizeDetailData(JSON.stringify(res.data)); }
            this.$busEmit('clearInput');
            this.setOkrSummarizeStep('2');
          }
        });
      }
    },
    periodChange() {
      this.searchList();
      this.getSummaryOkrInfo();
    },

  },
  watch: {

  },
};
</script>
<style lang="css">
.okr-summarize-info {
  width: 100%;
  background: #f4f6f8;
  padding: 20px;
}
.okr-summarize-search-form {
}
</style>