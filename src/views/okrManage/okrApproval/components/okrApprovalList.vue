<template>
  <div class="okr-approval-list">
    <div class="cont-area">
      <crcloud-table
        :total="formData.total"
        :pageSize.sync="formData.pageSize"
        :currentPage.sync="formData.currentPage"
        @searchList="searchList"
      >
        <div slot="tableContainer" class="table-container">
          <el-table
            :data="tableData"
            :empty-text="emptyText"
            class="tl-table"
            v-loading="tableLoading"
          >
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
                    <div slot="content">
                      {{ cutOrgName(scope.row.orgName) }}
                    </div>
                    <em>{{ cutOrgName(scope.row.orgName) }}</em>
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
              prop="okrBelongType"
              label="OKR类型"
              min-width="160"
            >
               <template slot-scope="scope">
                 <span>
                   {{CONST.OKR_TYPE_MAP[scope.row.okrBelongType || 2]}}
                 </span>
               </template>
            </el-table-column>
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
            <el-table-column prop="createTime" label="提交时间" min-width="170">
              <template slot-scope="scope">
                <span>{{
                  scope.row.updateTime
                    ? scope.row.updateTime
                    : scope.row.createTime
                }}</span>
              </template>
            </el-table-column>
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
                    hasApproval(scope.row) &&
                    hasPower('okr-approval-pass') &&
                    canApproval
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
                :disabled="periodList.length == 0"
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
            <el-form-item v-if="roleCode.includes('TENANT_ADMIN')">
              <p>组织</p>
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
                class="tl-cascader has-bg"
              ></el-cascader>
            </el-form-item>
            <el-form-item>
              <el-input
                maxlength="64"
                v-model.trim="formData.keyword"
                placeholder="请输入成员姓名"
                class="tl-input"
                @keyup.enter.native="searchList"
              >
                <i
                  class="el-input__icon el-icon-search"
                  slot="prefix"
                  @click="searchList"
                ></i>
              </el-input>
            </el-form-item>
            <el-button
              :disabled="!hasPower('okr-approval-list')"
              plain
              class="tl-btn light"
              @click="searchList"
              >搜索</el-button
            >
          </el-form>
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
  props: {
    canApproval: {
      type: Boolean,
      default: true,
    },
  },
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
      tableLoading: false,
      orgFullIdList: [],
      departmentData: [],
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
      roleCode: (state) => state.roleCode,
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
      // 只有租户管理员才需要
      if (self.roleCode.includes('TENANT_ADMIN')) {
        self.getOrgTable();
      }
    },

    searchList() {
      if (this.hasPower('okr-approval-list')) {
        this.tableData = [];
        if (this.formData.periodId) {
          this.tableLoading = true;
          this.server.getokrApproval({
            approvalStatus: this.formData.approvalStatus,
            approvalType: this.formData.approvalType,
            currentPage: this.formData.currentPage,
            keyword: this.formData.keyword,
            pageSize: this.formData.pageSize,
            periodId: this.formData.periodId,
            orgId: this.orgId,
          }).then((res) => {
            if (res.code == '200') {
              this.tableData = res.data.content;
              this.formData.total = res.data.total;
              this.formData.currentPage = res.data.currentPage;
            }
            this.tableLoading = false;
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
    // 查询组织树
    getOrgTable() {
      this.server.getOrgTable().then((res) => {
        if (res.code == '200') {
          if (res.data) {
            this.departmentData = [];
            this.departmentData.push(res.data);
            if (this.departmentData.length > 0) {
              this.replaceName(this.departmentData[0]);
            }
            // 默认取第二层润联科技
            this.orgFullId = this.departmentData[0].orgFullId;
            this.orgId = this.departmentData[0].orgId;
            this.orgFullIdList = this.orgFullId.split(':');
            this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
            this.getOrgName(this.departmentData, 0);
            this.searchList();
          }
        }
      });
    },
    getOrgName(data, index) {
      data.forEach((item) => {
        if (this.orgFullIdList[index] == item.orgId) {
          if (item.children && item.children.length > 0 && this.orgFullIdList[index + 1]) {
            this.getOrgName(item.children, index + 1);
          } else if ((index + 1) == this.orgFullIdList.length) {
            this.test = item.orgName;
          }
        }
      });
    },
    selectIdChange(data) {
      this.orgFullId = `${data.join(':')}:`;
      this.orgFullIdList = data;
      this.$refs.cascader.dropDownVisible = false;
      this.getOrgName(this.departmentData, 0);
      this.orgId = data[data.length - 1];
      this.searchList();
    },
    hasApproval(row) {
      if (this.roleCode.includes('TENANT_ADMIN') && row.approvalStatus === 5) {
        return true;
      }
      if (this.roleCode.includes('ORG_ADMIN')) {
        if (row.approvalStatus === 4 && row.ownerFlag) {
          return true;
        }
        if (row.approvalStatus === 6 && !row.ownerFlag && !this.roleCode.includes('TENANT_ADMIN')) {
          return true;
        }
        if (row.okrBelongType === 2 && row.approvalStatus === 4) {
          return true;
        }
        return false;
      }
      return false;
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
