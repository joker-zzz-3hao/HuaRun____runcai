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
        <el-button>
          公司使命愿景
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
        <el-button>
          公司战略
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </div>
    </div>
    <div>
      <svgtree :treeData="treeData">
        <div style="width: 216px" slot="treecard">11111</div>
      </svgtree>
    </div>
  </div>
</template>

<script>
import department from '@/components/department';
import svgtree from '@/components/svgtree';
import Server from './server';
import { list } from './list';

const server = new Server();

export default {
  name: 'okrMaps',
  data() {
    return {
      server,
      keyword: '',
      treeData: list,
      departmentData: [],
      initDepartment: {},
      cycleData: [],
      departmentDefaultProps: {
        children: 'children',
        label: 'orgName',
        id: 'orgId',
      },
      cycleDefaultProps: {
        children: 'children',
        label: 'okrCycleName',
        id: 'okrCycleCode',
      },
      cycleObj: {
        old: {
          checkStatus: 0,
          children: [],
          okrCycleName: '历史OKR周期',
          okrCycleType: '0',
          okrCycleCode: '0',
        },
        current: {
          checkStatus: 1,
          children: [],
          okrCycleName: '当前的OKR周期',
          okrCycleType: '0',
          okrCycleCode: '1',
        },
      },
    };
  },
  components: {
    department,
    svgtree,
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
      console.log(data);
    },
    handleCycleData(data) {
      console.log(data);
    },

  },
};
</script>