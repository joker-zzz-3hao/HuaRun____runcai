<template>
  <div class="okr-maps">
    <div class="cont-area"></div>
    <div class="operating-area">
      <div class="operating-area-inside">
        <div class="operating-box">
          <dl class="dl-item">
            <dt>周期</dt>
            <dd>
              <div v-if="showDepartmentSelect">
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
          <!-- <el-button
            type="primary"
            icon="el-icon-plus"
            @click="goWriteOkr"
            class="tl-btn amt-bg-slip"
          >创建OKR</el-button>-->
        </div>
      </div>
    </div>
    <div>
      <div v-if="showDepartmentSelect">
        <!-- <el-cascader
          v-model="orgFullId"
          :options="departmentData"
          :show-all-levels="false"
          :props="{ checkStrictly: true, expandTrigger: 'hover',value:'orgFullId',label:'orgName',children:'children' }"
          @change="selectIdChange"
        ></el-cascader>-->
        <div @click="showCascader=!showCascader">
          <el-input v-model="test"></el-input>
        </div>
        <!-- <el-cascader-panel
          v-model="orgFullId"
          :style="{display: showCascader ? '' : 'none'}"
          :options="departmentData"
          :show-all-levels="false"
          @change="selectIdChange"
          :props="{ checkStrictly: true, expandTrigger: 'hover',value:'orgFullId',label:'orgName',children:'children' }"
        ></el-cascader-panel>-->
        <el-cascader-panel
          v-model="orgFullIdList"
          :style="{display: showCascader ? '' : 'none'}"
          :options="departmentData"
          :show-all-levels="false"
          @change="selectIdChange"
          :props="{ checkStrictly: true,value:'orgId',label:'orgName',children:'children' }"
        ></el-cascader-panel>
        <!-- <el-cascader
            v-model="formData.orgIdList"
            :options="treeData"
            :show-all-levels="false"
            :props="{ checkStrictly: true,value:'orgId',label:'orgName',children:'sonTree' }"
            @change="selectIdChange"
        ></el-cascader>-->
      </div>
      <!-- 搜索框 -->
      <div>
        <el-input placeholder="请输入关键词" v-model="keyword" @keyup.enter.native="search">
          <i slot="prefix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
      </div>
      <!-- 视图切换，公司使命 -->
      <div v-if="showDepartmentSelect">
        <el-button @click="showOkrMap = !showOkrMap">视图切换</el-button>
        <!-- type传1表示使命愿景，2表示战略 -->
        <el-button @click="showMission(1,'华润使命·愿景')">
          公司使命愿景
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
        <el-button @click="showMission(2,'华润发展战略')">
          公司战略
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </div>
      <!-- 返回 -->
      <div v-if="!showDepartmentSelect">
        <el-button @click="showDepartmentSelect = !showDepartmentSelect">返回</el-button>
      </div>
    </div>
    <!-- 组织树显示 -->
    <div v-if="showDepartmentSelect">
      <!-- OKR树 -->
      <div v-if="showOkrMap">
        <tl-worth @click.native="showMission(3,'公司价值观宣导')"></tl-worth>
        <svgtree fatherId="orgParentId" childId="orgId" :treeData="treeData">
          <template slot="treecard" slot-scope="node">
            <card
              :node="node"
              @showDetail="showDetail(node.node.okrId)"
              @takeOvierview="takeOvierview(node)"
            ></card>
          </template>
        </svgtree>
      </div>
      <!-- OKR表格 -->
      <tl-okr-table v-if="!showOkrMap" :treeData="treeTableData"></tl-okr-table>
    </div>
    <!-- 搜索框显示 -->
    <div v-if="!showDepartmentSelect">
      <tl-search-table :keyword="keyword" :searchType="searchType" :searchData="searchData"></tl-search-table>
    </div>
    <tl-mission ref="mission"></tl-mission>
    <!-- okr详情 -->

    <tl-okr-detail
      :exist.sync="detailExist"
      ref="okrdetail"
      :server="server"
      :okrId="okrId"
      :CONST="CONST"
      :showSupport="true"
    ></tl-okr-detail>
  </div>
</template>

<script>
import svgtree from '@/components/svgtree';
import okrDetail from '@/components/okrDetail';
import card from './components/card';
import okrTable from './components/okrTable';
import mission from './components/mission';
import worth from './components/worth';
import searchTable from './components/searchTable';
import CONST from './const';
import Server from './server';

const server = new Server();

export default {
  name: 'okrMaps',
  data() {
    return {
      CONST,
      server,
      keyword: '',
      test: '',
      showCascader: false,
      searchType: '2',
      treeData: [],
      treeTableData: [],
      departmentData: [],
      initDepartment: {},
      cycleData: [],
      orgFullIdList: [],
      okrCycle: {},
      orgFullId: '',
      showOkrMap: true,
      showDepartmentSelect: true,
      okrId: '',
      searchData: [],
      drawerTitle: 'OKR详情',
      detailExist: false,
      periodId: '',
      periodList: [],
    };
  },
  components: {
    svgtree,
    card,
    'tl-mission': mission,
    'tl-worth': worth,
    'tl-okr-table': okrTable,
    'tl-search-table': searchTable,
    'tl-okr-detail': okrDetail,
  },
  mounted() {
    const self = this;
    self.init();
  },
  methods: {
    changeCascader(data) {
      this.test = data;
      this.showCascader = false;
    },
    init() {
      const self = this;
      // 查询周期
      self.server.getOkrCycleList().then((res) => {
        if (res.code == 200) {
          this.periodList = res.data || [];
          this.okrCycle = this.periodList.filter((item) => item.checkStatus == '1')[0] || {};
          this.periodId = this.okrCycle.periodId;
        }
      });
      // 查询组织树
      self.getOrgTable();
    },
    getOkrTree() {
      if (this.okrCycle.periodId && this.orgFullId) {
        this.treeTableData = [];
        this.server.getOkrTree({
          periodId: this.okrCycle.periodId,
          // periodId: '1204827318294274048',
          orgId: this.orgFullId,
          // orgId: 'CR0011000054:CR0012000174:CR0012000184:',
        }).then((res) => {
          if (res.code == '200') {
            // OKR表格数据
            this.treeTableData.push(res.data);
            // 如果搜索的不是第一级，就要将过滤数据里面的最高级orgParentId设置成null
            if (res.data.okrTree.length > 0) {
              res.data.okrTree.forEach((item) => {
                if (item.orgFullId == this.orgFullId) {
                // if (item.orgFullId == 'CR0011000054:CR0012000174:CR0012000184:') {
                  item.orgParentId = null;
                }
              });
              this.treeData = res.data.okrTree;
            }
          }
        });
      }
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
            this.getOkrTree();
          }
        }
      });
    },
    search() {
      const self = this;
      self.showDepartmentSelect = false;
      self.server.search({
        keyWord: self.keyword,
        currentPage: 1,
        pageSize: 10,
        type: self.searchType,
      }).then((res) => {
        if (res.code == '200') {
          self.searchData = res.data.content;
        }
      });
    },
    selectIdChange(data) {
      this.showCascader = false;
      this.orgFullId = `${data.join(':')}:`;
      this.orgFullIdList = data;
      // this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
      this.getOrgName(this.departmentData, 0);
      this.getOkrTree();
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
    handleCycleData(data) {
      this.okrCycle = data;
      // 查询OKR树
      this.getOkrTree();
    },
    showMission(type, title) {
      this.$nextTick(() => {
        this.$refs.mission.show(type, title);
      });
    },
    changeType() {
      this.search();
    },
    showDetail(okrId) {
      this.okrId = okrId;
      this.drawerTitle = 'OKR详情';
      this.detailExist = true;
      this.$nextTick(() => {
        this.$refs.okrdetail.showOkrDialog();
      });
    },
    takeOvierview({ node }) {
      this.server.identity({
        orgId: node.orgId,
        user: node.userId,
      }).then((res) => {
        if (res.data.identityType == 'org') {
          this.$router.push({
            name: 'departleader',
            query: {
              id: node.orgId, name: encodeURI(node.orgName), userId: node.userId, tenantId: node.tenantId,
            },
          });
          return false;
        }
        if (res.data.identityType == 'team') {
          this.$router.push({
            name: 'teamleader',
            query: {
              id: node.orgId, name: encodeURI(node.orgName), userId: node.userId, tenantId: node.tenantId,
            },
          });
          return false;
        }
        if (res.data.identityType == 'person') {
          this.$router.push({
            name: 'grassStaff',
            query: {
              id: node.userId, name: encodeURI(node.orgName), userId: node.userId, tenantId: node.tenantId,
            },
          });
        }
      });
    },
  },
  watch: {
    periodId: {
      handler(newVal) {
        if (newVal) {
          this.okrCycle = this.periodList.filter(
            (citem) => citem.periodId == newVal,
          )[0] || {};
          this.getOkrTree();
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>