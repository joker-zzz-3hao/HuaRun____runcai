<template>
  <div class="home">
    <div style="display: flex;">
      <div style="margin-left:20px;">
        <department
          :data="cycleData"
          type="cycleListSelect"
          @handleData="handleCycleData"
          :defaultProps="cycleDefaultProps"
        ></department>
      </div>
      <div style="margin-left:20px;">
        <department
          type="department"
          :data="departmentData"
          :initDepartment="initDepartment"
          @handleData="handleData"
          :defaultProps="departmentDefaultProps"
        ></department>
      </div>
      <div>
        <el-input placeholder="部门名称/成员/关键词" v-model="keyword" @keyup.enter.native="search">
          <i slot="prefix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
      </div>
      <div>
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
    </div>
    <div>
      <tl-worth @click.native="showMission(3,'公司价值观宣导')"></tl-worth>
      <svgtree fatherId="orgParentId" childId="orgId" :treeData="treeData">
        <template slot="treecard" slot-scope="node">
          <card @showDetail="showDetail()" :node="node"></card>
        </template>
      </svgtree>
    </div>
    <tl-mission ref="mission"></tl-mission>
    <!-- okr详情 -->
    <tl-okr-detail ref="okrDetail" :dialogExist.sync="dialogExist" :okrId="okrId" :server="server"></tl-okr-detail>
  </div>
</template>

<script>
import department from '@/components/department';
import svgtree from '@/components/svgtree';
import okrDetail from '@/components/okrDetail';
import card from './components/card';
import mission from './components/mission';
import worth from './components/worth';
import Server from './server';

const server = new Server();

export default {
  name: 'okrMaps',
  data() {
    return {
      server,
      keyword: '',
      treeData: [],
      departmentData: [],
      initDepartment: {},
      cycleData: [],
      okrCycle: {},
      departmentObj: {},
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
    };
  },
  components: {
    department,
    svgtree,
    card,
    'tl-mission': mission,
    'tl-worth': worth,
    'tl-okr-detail': okrDetail,
  },
  mounted() {
    const self = this;
    self.init();
  },
  methods: {
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
      if (this.okrCycle.periodId && this.departmentObj.orgFullId) {
        this.server.getOkrTree({
          periodId: this.okrCycle.periodId,
          orgId: this.departmentObj.orgFullId,
        }).then((res) => {
          if (res.code == '200') {
            // 如果搜索的不是第一级，就要将过滤数据里面的最高级orgParentId设置成null
            res.data.forEach((item) => {
              if (item.orgFullId == this.departmentObj.orgFullId) {
                item.orgParentId = null;
              }
            });
            this.treeData = res.data;
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
          }
        }
      });
    },
    search() {
      const self = this;
      self.server.searchKeyword({
        keyword: self.keyword,
      }).then((res) => {
        if (res.code == '200') {
          console.log(res);
        }
      });
    },
    handleData(data) {
      this.departmentObj = data;
      this.getOkrTree();
      console.log(data);
    },
    handleCycleData(data) {
      this.okrCycle = data;
      // 查询OKR树
      this.getOkrTree();
      console.log(data);
    },
    showMission(type, title) {
      this.$nextTick(() => {
        this.$refs.mission.show(type, title);
      });
    },
    showDetail(okrId) {
      this.okrId = okrId;
      this.$nextTick(() => {
        this.$refs.okrDetail.showOkrDialog();
        this.dialogExist = true;
      });
    },
  },
};
</script>