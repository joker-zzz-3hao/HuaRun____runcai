<template>
  <div class="home">
    <div style="display: flex;">
      <div style="margin-left:20px;" v-if="cycleData.length>0 && showDepartmentSelect">
        <department
          :data="cycleData"
          type="cycleListSelect"
          @handleData="handleCycleData"
          :defaultProps="cycleDefaultProps"
        ></department>
      </div>
      <div style="margin-left:20px;" v-if="showDepartmentSelect">
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
        <el-cascader-panel
          v-model="orgFullId"
          :style="{display: showCascader ? '' : 'none'}"
          :options="departmentData"
          :show-all-levels="false"
          @change="selectIdChange"
          :props="{ checkStrictly: true, expandTrigger: 'hover',value:'orgFullId',label:'orgName',children:'children' }"
        ></el-cascader-panel>
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
            <card :node="node" @showDetail="showDetail(node.node.okrId)"></card>
          </template>
        </svgtree>
      </div>
      <!-- OKR表格 -->
      <tl-okr-table v-if="!showOkrMap" :treeData="treeData"></tl-okr-table>
    </div>
    <!-- 搜索框显示 -->
    <div v-if="!showDepartmentSelect">
      <tl-search-table :keyword="keyword" :searchType="searchType" :searchData="searchData"></tl-search-table>
    </div>
    <tl-mission ref="mission"></tl-mission>
    <!-- okr详情 -->
    <el-drawer
      :modal="false"
      :wrapperClosable="false"
      :modal-append-to-body="false"
      class="tl-drawer"
      :title="drawerTitle"
      :visible.sync="myokrDrawer"
      :before-close="handleClose"
    >
      <tl-okr-detail
        v-if="myokrDrawer"
        ref="okrdetail"
        :server="server"
        :okrId="okrId"
        :CONST="CONST"
      ></tl-okr-detail>
    </el-drawer>
  </div>
</template>

<script>
import department from '@/components/department';
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
      departmentDefaultProps: {
        children: 'children',
        label: 'orgName',
        id: 'orgId',
      },
      cycleDefaultProps: {
        children: 'children',
        label: 'periodName',
        id: 'periodId',
      },
      cycleObj: {
        old: {
          checkStatus: 0,
          children: [],
          periodName: '历史OKR周期',
          okrCycleType: '0',
          periodId: '0',
        },
        current: {
          checkStatus: 1,
          children: [],
          periodName: '当前的OKR周期',
          okrCycleType: '0',
          periodId: '1',
        },
      },
      dialogExist: false,
      okrId: '',
      searchData: [],
      myokrDrawer: false,
      drawerTitle: 'OKR详情',
    };
  },
  components: {
    department,
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
        if (res.data.length > 0) {
          res.data.forEach((item) => {
            // checkStatus为0时是历史周期，1为当前周期
            if (item.checkStatus == '0') {
              self.cycleObj.old.children.push(item);
            } else if (item.checkStatus == '1') {
              self.cycleObj.current.children.push(item);
            }
          });
          self.pushCycleObj('current');
          self.pushCycleObj('old');
        }
      });
      // 查询组织树
      self.getOrgTable();
    },
    pushCycleObj(key) {
      if (this.cycleObj[key].children.length > 0) {
        this.cycleData.push(this.cycleObj[key]);
      }
    },
    getOkrTree() {
      if (this.okrCycle.periodId && this.orgFullId) {
        this.server.getOkrTree({
          periodId: this.okrCycle.periodId,
          // periodId: '1204827318294274048',
          orgId: this.orgFullId,
          // orgId: 'CR0011000054:CR0012000174:CR0012000184:',
        }).then((res) => {
          if (res.code == '200') {
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
            this.departmentData.push(res.data);
            this.orgFullId = this.departmentData[0].orgFullId;
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
      this.orgFullId = data[data.length - 1];
      this.orgFullIdList = this.orgFullId.split(':');
      this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
      this.getOrgName(this.departmentData, 0);
      this.getOkrTree();
    },
    getOrgName(data, index) {
      data.forEach((item) => {
        if (this.orgFullIdList[index] == item.orgId) {
          if (item.children.length > 0 && this.orgFullIdList[index + 1]) {
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
      this.myokrDrawer = true;
      this.$nextTick(() => {
        this.$refs.okrdetail.showOkrDialog();
      });
    },
    handleClose() {
      this.myokrDrawer = false;
    },
  },
};
</script>