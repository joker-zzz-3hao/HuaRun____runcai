<template>
  <div class="okr-maps">
    <div class="operating-area">
      <div class="operating-area-inside">
        <!-- <div class="operating-box-group"> -->
        <div class="operating-box">
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
          <el-button
            type="primary"
            class="tl-btn amt-bg-slip"
            @click="searchList"
            >查询</el-button
          >
          <el-button @click="goback" plain class="tl-btn amt-border-slip">
            返回
            <span class="lines"></span>
          </el-button>
        </div>
        <div class="operating-box">
          <dl class="dl-item">
            <dt>周期</dt>
            <dd>
              <div>
                <el-select
                  v-model="periodId"
                  placeholder="请选择目标周期"
                  :popper-append-to-body="false"
                  popper-class="tl-select-dropdown"
                  class="tl-select"
                  @change="searchList"
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
              <div>
                <el-select
                  v-model="okrBelongType"
                  placeholder="全部"
                  :popper-append-to-body="false"
                  popper-class="tl-select-dropdown"
                  class="tl-select"
                  @change="searchList"
                  clearable
                >
                  <el-option
                    v-for="item in okrBelongTypeList"
                    :key="item.okrBelongType"
                    :label="item.okrBelongTypeName"
                    :value="item.okrBelongType"
                  ></el-option>
                </el-select>
              </div>
            </dd>
          </dl>
          <dl class="dl-item">
            <dt>OKR状态</dt>
            <dd>
              <div>
                <el-select
                  v-model="status"
                  placeholder="全部"
                  :popper-append-to-body="false"
                  popper-class="tl-select-dropdown"
                  class="tl-select"
                  @change="searchList"
                  clearable
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.status"
                    :label="item.statusName"
                    :value="item.status"
                  ></el-option>
                </el-select>
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <div>
      <div class="cont-area">
        <crcloud-table
          :total="total"
          :pageSize.sync="pageSize"
          :currentPage.sync="currentPage"
          @searchList="searchList"
        >
          <div slot="tableContainer">
            <el-table ref="dicTable" v-loading="loading" :data="tableData">
              <el-table-column
                min-width="100px"
                align="left"
                prop="userName"
                label="姓名"
              ></el-table-column>
              <el-table-column
                min-width="100px"
                align="left"
                prop="orgName"
                label="部门"
              ></el-table-column>
              <el-table-column
                min-width="100px"
                align="left"
                prop="okrProgress"
                label="okr进度"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.okrProgress }}%</div>
                </template>
              </el-table-column>
              <el-table-column
                min-width="100px"
                align="left"
                prop="status"
                label="状态"
              >
                <template slot-scope="scope">{{
                  STATUS_MAP[scope.row.status]
                }}</template>
              </el-table-column>
              <el-table-column width="80" label="操作">
                <template slot-scope="scope">
                  <el-button @click="okrInfo(scope.row)" type="text"
                    >详情</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </crcloud-table>
      </div>
    </div>
    <tl-okr-detail
      v-if="detailExist"
      :exist.sync="detailExist"
      ref="okrdetail"
      :server="server"
      :okrId="okrId"
      :CONST="CONST"
      :showSupport="true"
      :drawerTitle="drawerTitle"
      :isFromOkrSummarize="true"
    ></tl-okr-detail>
  </div>
</template>

<script>

import okrDetail from '@/components/okrDetail';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'okrMaps',
  data() {
    return {
      server,
      CONST,
      detailExist: false,
      okrId: '',
      drawerTitle: '',
      tableData: [],
      loading: false,
      treeData: [],
      periodList: [],
      orgFullIdList: [],
      departmentData: [],
      okrBelongTypeList: [{
        okrBelongType: '1',
        okrBelongTypeName: '部门',
      }, {
        okrBelongType: '2',
        okrBelongTypeName: '个人',
      }],
      statusList: [
        { status: '1', statusName: '进行中' },
        { status: '0', statusName: '待审批' },
        { status: '2', statusName: '复盘中' },
        { status: '3', statusName: '已完成' },
        { status: '4', statusName: '已结束' },
      ],
      STATUS_MAP: {
        0: '待审批',
        1: '进行中',
        2: '复盘中',
        3: '已完成',
        4: '已结束',
      },
      periodId: '',
      okrBelongType: '',
      status: '',
      orgFullId: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      userName: '',
      okrCycle: {},

      test: '',

    };
  },
  components: {
    'tl-okr-detail': okrDetail,
  },
  mounted() {
    const self = this;
    self.init();
  },
  methods: {
    init() {
      // 查询周期
      this.server.getOkrCycleList().then((res) => {
        if (res.code == 200) {
          this.periodList = res.data || [];
          this.okrCycle = this.periodList.filter((item) => item.checkStatus == '1')[0] || {};
          this.periodId = this.okrCycle.periodId;
          // 查询组织树
          this.getOrgTable();
          this.searchList();
        }
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
      // this.orgFullId = data[data.length - 1];
      this.orgFullId = `${data.join(':')}:`;
      this.orgFullIdList = data;
      this.$refs.cascader.dropDownVisible = false;
      this.getOrgName(this.departmentData, 0);
      this.searchList();
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

    okrInfo(okr) {
      this.okrId = okr.okrId;
      this.drawerTitle = this.okrCycle.periodName;
      this.detailExist = true;
      this.$nextTick(() => {
        this.$refs.okrdetail.showOkrDialog();
      });
    },

  },
  watch: {

  },
};
</script>