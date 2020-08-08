<template>
  <div class="home">
    <div style="margin-left:20px;" v-if="showAll">
      <department
        :data="cycleData"
        type="cycleListSelect"
        @handleData="handleCycleData"
        :defaultProps="cycleDefaultProps"
      ></department>
    </div>
    <div style="margin-left:20px;" v-if="showAll">
      <department
        type="department"
        :data="departmentData"
        :initDepartment="initDepartment"
        @handleData="handleData"
        :defaultProps="departmentDefaultProps"
      ></department>
    </div>
    <!-- 要展示多个 -->
    <div v-if="showAll">
      <vue-svg-tree
        v-for="item in svgList"
        :key="item.id"
        :treeData="treeData"
        :svgId="'svg'+item.id"
        ref="svgTree"
        :curveness="false"
        direction="col"
        fatherId="okrParentDetailId"
        childId="okrDetailId"
        :colAlign="false"
      >
        <div slot="treecard" slot-scope="props">
          <card :node="props.node"></card>
        </div>
      </vue-svg-tree>
    </div>
    <div v-else>
      <vue-svg-tree
        :treeData="treeData"
        svgId="svg"
        ref="svgTree"
        :curveness="false"
        direction="col"
        fatherId="okrParentDetailId"
        childId="okrDetailId"
        :colAlign="false"
      >
        <div slot="treecard" slot-scope="props">
          <card :node="props.node"></card>
        </div>
      </vue-svg-tree>
    </div>
  </div>
</template>

<script>
import department from '@/components/department';
import svgtree from '@/components/svgtree';
import card from './components/card';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'supportMaps',
  components: {
    'vue-svg-tree': svgtree,
    card,
    department,
  },
  data() {
    return {
      CONST,
      server,
      treeData: [],
      searchForm: {
        okrDetailId: '',
        orgId: '888822223333',
        periodId: 'periodId',
      },
      cycleData: [],
      departmentData: [],
      initDepartment: {},
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
      departmentDefaultProps: {
        children: 'children',
        label: 'orgName',
        id: 'orgId',
      },
      svgList: [{
        id: 1, name: '赚1个亿',
      }],
      showAll: true,
    };
  },
  created() {
    this.init();
    this.showAll = this.$route.params.showAll;
    this.searchForm.okrDetailId = this.$route.params.okrDetailId || '';
  },
  methods: {
    init() {
      const self = this;
      if (this.showAll) {
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
          self.getmaps();
        });
        self.getOrgTable();
      } else {
        self.getmaps();
        this.svgList = [{
          id: 1, name: '赚1个亿',
        }];
      }
      // 查询组织树
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
    getmaps() {
      // 查承接地图
      this.server.getmaps(this.searchForm).then((res) => {
        if (res.code == 200) {
          this.treeData = res.data;
          // this.treeData.forEach((item) => {
          //   if (!item.okrParentDetailId) {
          //     item.okrParentDetailId = '0';
          //   }
          // });
          console.log('承接地图', this.treeData);
        }
      });
    },
    handleCycleData(data) {
      this.okrCycle = data;
      console.log(data);
    },
    handleData(data) {
      console.log(data);
    },
  },
};
</script>
