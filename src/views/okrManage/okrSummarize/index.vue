<template>
  <div class="okr-maps">
    <div class="operating-area">
      <div class="operating-area-inside">
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
                :props="{ checkStrictly: true,value:'orgId',label:'orgName',children:'children' }"
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
                  v-model="okrType"
                  placeholder="全部"
                  :popper-append-to-body="false"
                  popper-class="tl-select-dropdown"
                  class="tl-select"
                >
                  <el-option
                    v-for="item in okrTypeList"
                    :key="item.okrType"
                    :label="item.okrTypeName"
                    :value="item.okrType"
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
                  v-model="okrStatus"
                  placeholder="全部"
                  :popper-append-to-body="false"
                  popper-class="tl-select-dropdown"
                  class="tl-select"
                >
                  <el-option
                    v-for="item in okrStatusList"
                    :key="item.okrStatus"
                    :label="item.okrStatusName"
                    :value="item.okrStatus"
                  ></el-option>
                </el-select>
              </div>
            </dd>
          </dl>
          <el-input
            placeholder="成员姓名"
            v-model="keyword"
            @keyup.enter.native="search"
            class="tl-input"
          >
            <i slot="prefix" class="el-input__icon el-icon-search" @click="search"></i>
          </el-input>
          <el-button plain class="tl-btn amt-border-slip">
            返回
            <span class="lines"></span>
          </el-button>
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
              <el-table-column min-width="100px" align="left" prop="code" label="姓名"></el-table-column>
              <el-table-column min-width="100px" align="left" prop="name" label="部门"></el-table-column>
              <el-table-column min-width="100px" align="left" prop="enabledFlag" label="okr进度">
                <template slot-scope="scope">
                  <div>{{scope.row.enabledFlag == "Y" ? '启用' : '停用'}}</div>
                </template>
              </el-table-column>
              <el-table-column min-width="100px" align="left" prop="createTime" label="状态">
                <template slot-scope="scope"></template>
              </el-table-column>
            </el-table>
          </div>
        </crcloud-table>
      </div>
    </div>
  </div>
</template>

<script>

import Server from './server';

const server = new Server();

export default {
  name: 'okrMaps',
  data() {
    return {
      server,
      loading: false,
      treeData: [],
      periodList: [],
      orgFullIdList: [],
      departmentData: [],
      okrTypeList: [{
        okrType: '1',
        okrTypeName: '部门',
      }, {
        okrType: '2',
        okrTypeName: '个人',
      }],
      okrStatusList: [
        { okrStatus: '1', okrStatusName: '进行中' },
        { okrStatus: '2', okrStatusName: '待审批' },
        { okrStatus: '3', okrStatusName: '考核中' },
        { okrStatus: '4', okrStatusName: '已完成' },
        { okrStatus: '5', okrStatusName: '已通过' },
      ],
      periodId: '',
      okrType: '',
      okrStatus: '',
      currentPage: '',
      pageSize: '',
      keyword: '',
      okrCycle: {},
      orgFullId: '',

      test: '',

    };
  },
  components: {

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
        }
      });
      this.searchList();
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
      this.orgFullId = `${data.join(':')}:`;
      this.orgFullIdList = data;
      // this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
      this.$refs.cascader.dropDownVisible = false;
      this.getOrgName(this.departmentData, 0);
    },

    searchList(params = { currentPage: 1 }) {
      params.currentPage = this.currentPage;
      params.pageSize = this.pageSize;
      params.keyWord = this.keyWord;
      this.loading = true;
      this.server.queryOfPage(params).then((res) => {
        if (res.code == 200) {
          this.total = res.data.total;
          this.currentPage = res.data.currentPage;
          this.pageSize = res.data.pageSize;
          this.tableData = res.data.content;
        }
        this.loading = false;
      });
    },
  },
  watch: {

  },
};
</script>