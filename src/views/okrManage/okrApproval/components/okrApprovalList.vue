<template>
  <div class="okr-approval-list">
    <div class="cont-area">
      <crcloud-table
        :total="formData.total"
        :pageSize.sync="formData.pageSize"
        :currentPage.sync="formData.currentPage"
        @searchList="searchList"
        layout="prev, pager, next, jumper"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" :empty-text="emptyText" class="tl-table">
            <el-table-column prop="userName" label="姓名" min-width="140">
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
                <div class="user-name-txt">
                  <em>{{ scope.row.userName }}</em>
                  <el-tooltip
                    effect="dark"
                    placement="top"
                    popper-class="tl-tooltip-popper"
                  >
                    <div slot="content">{{ scope.row.orgName }}</div>
                    <em>{{ scope.row.orgName }}</em>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="periodName"
              label="OKR周期"
              min-width="160"
            ></el-table-column>
            <el-table-column
              prop="approvalStatus"
              label="审批状态"
              min-width="90"
            >
              <template slot-scope="scope">
                <i
                  :class="{
                    create: scope.row.approvalType == '0',
                    change: scope.row.approvalType == '1',
                    unchange: scope.row.approvalType == '1',
                  }"
                ></i>
                <span>{{
                  CONST.APPROVAL_STATUS_MAP[scope.row.approvalStatus]
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="approvalType"
              label="审批类型"
              min-width="80"
            >
              <template slot-scope="scope">
                <span
                  :class="{
                    create: scope.row.approvalType == '0',
                    change: scope.row.approvalType == '1',
                  }"
                  >{{ CONST.APPROVAL_TYPE_MAP[scope.row.approvalType] }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="okrProgress" label="OKR进度" min-width="160">
              <template slot-scope="scope">
                <tl-process
                  v-if="scope.row.approvalType == '1'"
                  :data="scope.row.okrProgress"
                ></tl-process>
                <div v-else>--</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="提交时间"
              min-width="170"
            ></el-table-column>
            <el-table-column
              prop="approveTime"
              label="审批时间"
              min-width="170"
            >
              <template slot-scope="scope">
                <span
                  v-if="scope.row.approveTime"
                  :class="{
                    select: scope.row.approvalDateType == '0',
                    unselect: scope.row.approvalDateType == '1',
                  }"
                  >{{ scope.row.approveTime }}</span
                >
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="50">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  v-if="
                    scope.row.approvalStatus == '0' &&
                    hasPower('okr-approval-pass')
                  "
                  @click.native.prevent="okrApproval(scope.row)"
                  class="tl-btn"
                  >审批</el-button
                >
                <el-button
                  v-else
                  type="text"
                  @click.native.prevent="detail(scope.row)"
                  class="tl-btn"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcloud-table>
    </div>
    <div class="operating-area">
      <div class="operating-area-inside">
        <div class="operating-box">
          <el-form
            :inline="true"
            @submit.native.prevent
            class="tl-form"
            v-if="hasPower('okr-approval-list')"
          >
            <el-form-item>
              <p>周期</p>
              <el-select
                v-model="formData.periodId"
                placeholder="请选择目标周期"
                :popper-append-to-body="false"
                popper-class="tl-select-dropdown"
                class="tl-select"
              >
                <el-option
                  v-for="item in periodList"
                  :key="item.periodId"
                  :label="item.periodName"
                  :value="item.periodId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <p>审批状态</p>
              <el-select
                v-model="formData.approvalStatus"
                :popper-append-to-body="false"
                popper-class="tl-select-dropdown"
                class="tl-select"
                @change="searchList"
              >
                <el-option
                  v-for="item in CONST.APPROVAL_STATUS_LIST"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <p>审批类型</p>
              <el-select
                v-model="formData.approvalType"
                :popper-append-to-body="false"
                popper-class="tl-select-dropdown"
                class="tl-select"
                @change="searchList"
              >
                <el-option
                  v-for="item in CONST.APPROVAL_TYPE_LIST"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                maxlength="64"
                v-model.trim="formData.keyword"
                placeholder="请输入成员姓名"
                class="tl-input-search"
                @keyup.enter.native="searchList"
              >
                <i class="el-icon-search" slot="prefix" @click="searchList"></i>
              </el-input>
            </el-form-item>
            <el-button
              :disabled="!hasPower('okr-approval-list')"
              type="primary"
              class="tl-btn amt-bg-slip"
              @click="searchList"
              >搜索</el-button
            >
          </el-form>
          <!-- <el-button
            type="primary"
            @click="goUndertake"
            class="tl-btn amt-bg-slip"
            >OKR对齐</el-button
          > -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import process from '@/components/process';
import CONST from '@/lib/const';
import Server from '../server';

const server = new Server();

export default {
  name: 'okrApprovalList',
  components: {
    'tl-process': process,
  },
  props: {},
  data() {
    return {
      CONST,
      server,
      tableData: [],
      emptyText: '暂无数据',
      formData: {
        periodId: '',
        approvalStatus: '',
        approvalType: '',
        keyword: '',
        total: 0,
        pageSize: 10,
        currentPage: 1,
        okrCycle: {}, // 当前选择的周期
      },

      periodList: [], // 周期列表
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  computed: {
    ...mapState('common', {
      okrApprovalDetail: (state) => state.okrApprovalDetail,
      okrApprovalStep: (state) => state.okrApprovalStep,
    }),
  },
  methods: {
    ...mapMutations('common', ['setOkrApprovalStep', 'setDetailData']),
    init() {
      const self = this;
      self.server.getOkrCycleList().then((res) => {
        if (res.code == 200) {
          self.periodList = res.data;
          self.formData.okrCycle = self.periodList.filter((item) => item.checkStatus == '1')[0] || {};
          self.formData.periodId = self.formData.okrCycle.periodId;
        }
      });
    },
    searchList() {
      if (this.hasPower('okr-approval-list')) {
        this.tableData = [];
        if (this.formData.periodId) {
          this.server.getokrApproval({
            approvalStatus: this.formData.approvalStatus,
            approvalType: this.formData.approvalType,
            currentPage: this.formData.currentPage,
            keyword: this.formData.keyword,
            pageSize: this.formData.pageSize,
            periodId: this.formData.periodId,
          }).then((res) => {
            if (res.code == '200') {
              this.tableData = res.data.content;
              this.formData.total = res.data.total;
              this.formData.currentPage = res.data.currentPage;
            }
          });
        }
      }
    },
    okrApproval(row) {
      this.setDetailData(JSON.stringify(row));
      this.setOkrApprovalStep('2');
    },
    detail(row) {
      this.setDetailData(JSON.stringify(row));
      this.setOkrApprovalStep('2');
    },
    goUndertake() {
      this.go('undertakeMaps');
    },
  },
  watch: {
    okrApprovalStep: {
      handler(newVal) {
        if (newVal == '1') {
          this.searchList();
        }
      },
      deep: true,
      immediate: true,
    },
    'formData.periodId': {
      handler(newVal) {
        if (newVal) {
          this.formData.okrCycle = this.periodList.filter(
            (citem) => citem.periodId === newVal,
          )[0] || {};
          this.formData.periodId = this.formData.okrCycle.periodId;
          this.searchList();
        }
      },
    },
  },
};
</script>
