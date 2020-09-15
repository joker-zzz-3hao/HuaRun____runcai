<template>
  <div class="home">
    <el-form :inline="true" @submit.native.prevent @keyup.enter.native="searchList">
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
        <el-select v-model="formData.approvalStatus" :popper-append-to-body="false">
          <el-option
            v-for="(item) in CONST.APPROVAL_STATUS_LIST"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <p>审批类型</p>
        <el-select v-model="formData.approvalType" :popper-append-to-body="false">
          <el-option
            v-for="(item) in CONST.APPROVAL_TYPE_LIST"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <p>成员</p>
        <el-input v-model.trim="formData.keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="searchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button @click="goUndertake">OKR对齐</el-button>
    </div>
    <crcloud-table
      :total="formData.total"
      :pageSize.sync="formData.pageSize"
      :currentPage.sync="formData.currentPage"
      @searchList="searchList"
      layout="prev, pager, next, jumper"
    >
      <div slot="tableContainer">
        <el-table :data="tableData" max-height="600" :empty-text="emptyText">
          <el-table-column prop="userName" label="姓名" width="220">
            <template slot-scope="scope">
              <div style="display: flex;">
                <div v-if="scope.row.headUrl">
                  <el-avatar :src="scope.row.headUrl"></el-avatar>
                </div>
                <div v-else-if="scope.row.userName" class="user-info">
                  <div class="user-name">
                    <em>{{scope.row.userName.substring(scope.row.userName.length-2)}}</em>
                  </div>
                </div>
                <div>
                  <div>{{scope.row.userName}}</div>
                  <div>{{scope.row.orgName}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="periodName" label="OKR周期" width="300"></el-table-column>
          <el-table-column prop="approvalStatus" label="审批状态" width="150">
            <template slot-scope="scope">
              <i class v-if="scope.row.approvalStatus == '0'"></i>
              <i class v-else-if="scope.row.approvalStatus == '1'"></i>
              <i class v-else-if="scope.row.approvalStatus == '2'"></i>
              <span>{{CONST.APPROVAL_STATUS_MAP[scope.row.approvalStatus]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="approvalType" label="审批类型" width="150">
            <template slot-scope="scope">
              <span>{{CONST.APPROVAL_TYPE_MAP[scope.row.approvalType]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="okrProgress" label="OKR进度" width="300">
            <template slot-scope="scope">
              <tl-process :data="scope.row.okrProgress"></tl-process>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="提交时间" width="300"></el-table-column>
          <el-table-column prop="approveTime" label="审批时间" width="300"></el-table-column>
          <el-table-column fixed="right" label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.approvalStatus == '0'"
                @click.native.prevent="okrApproval(scope.row)"
                type="text"
                size="small"
              >审批</el-button>
              <el-button
                v-else
                @click.native.prevent="detail(scope.row)"
                type="text"
                size="small"
              >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </crcloud-table>
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
        approvalStatus: '0',
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
      this.tableData = [];
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
