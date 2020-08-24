<template>
  <div class="home">
    <div style="margin-left:20px;" v-if="!showOne">
      <department
        :data="cycleData"
        type="cycleListSelect"
        @handleData="handleCycleData"
        :defaultProps="cycleDefaultProps"
      ></department>
    </div>
    <div style="margin-left:20px;" v-if="!showOne">
      <department
        type="department"
        :data="departmentData"
        :initDepartment="initDepartment"
        @handleData="handleData"
        :defaultProps="departmentDefaultProps"
      ></department>
    </div>
    <!-- 要展示多个 -->
    <div v-if="showOne">
      <vue-svg-tree
        :treeData="svgList"
        svgId="svg"
        ref="svgTree"
        :curveness="false"
        direction="col"
        fatherId="okrParentId"
        childId="okrDetailId"
        :colAlign="true"
      >
        <div slot="treecard" slot-scope="props">
          <card :node="props.node"></card>
        </div>
      </vue-svg-tree>
    </div>
    <div v-else>
      <vue-svg-tree
        v-for="(item,index) in svgList"
        :key="index"
        :treeData="item"
        :svgId="'svg'+index"
        ref="svgTree"
        :curveness="false"
        direction="col"
        fatherId="okrParentId"
        childId="okrDetailId"
        :colAlign="true"
        @handleTree="handleTree"
      >
        <div slot="treecard" slot-scope="props">
          <card :node="props.node"></card>
        </div>
      </vue-svg-tree>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import department from '@/components/department';
import svgtree from '@/components/svgtree';
import card from './card';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'undertakeMaps',
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
        orgId: '',
        periodId: '',
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
      svgList: [],
      showOne: false, // 是否只展示一棵树
      orgId: '',
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const self = this;
      // 直接赋值，为空时也会按false判断（从myokr跳传
      self.showOne = self.$route.params.showOne;
      self.searchForm.okrDetailId = self.$route.params.okrDetailId || '';
      self.searchForm.periodId = self.$route.params.periodId || '';
      self.orgId = self.userInfo.orgId || '';
      self.searchForm.orgId = self.$route.params.orgId || '';
      if (!self.showOne) {
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
        self.getOrgTable();
      } else {
        self.getmaps();
      }
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
      if (this.searchForm.orgId) {
        this.server.getmaps(this.searchForm).then((res) => {
          if (res.code == 200) {
            const allTreeData = res.data;
            this.svgList = [];
            if (this.showOne) {
            // 要做兼容处理
              allTreeData.forEach((item, index) => {
                if (index === 0) {
                  item.okrParentId = null;
                }
                this.svgList.push(item);
                if (item.krContinueList && item.krContinueList.length > 0) {
                  this.svgList = this.svgList.concat(item.krContinueList);
                }
              });
              console.log('承接树', this.svgList);
            } else {
              let index = 0;
              allTreeData.forEach((item) => {
                item.okrParentId = null;
                this.svgList[index] = [];
                this.svgList[index].push(item);
                if (item.krContinueList && item.krContinueList.length > 0) {
                  this.svgList[index] = this.svgList[index].concat(item.krContinueList);
                }
                index += 1;
                if (item.krList && item.krList.length > 0) {
                  item.krList.forEach((kritem) => {
                    kritem.okrParentId = null;
                    this.svgList[index] = [];
                    this.svgList[index].push(kritem);
                    index += 1;
                    if (kritem.krContinueList && kritem.krContinueList.length > 0) {
                      this.svgList[index] = this.svgList[index].concat(kritem.krContinueList);
                    }
                  });
                }
                console.log('承接树', this.svgList);
              });
              // 默认收起其他
              this.$nextTick(() => {
                for (let i = 1; i < this.svgList.length; i += 1) {
                  this.$refs.svgTree[i].closeTree();
                }
              });
            }
          }
        });
      }
    },
    handleCycleData(data) {
      this.searchForm.periodId = data.periodId;
      console.log(this.searchForm.periodId);
      this.getmaps();
    },
    handleData(data) {
      this.searchForm.orgId = this.orgId ? this.orgId : data.orgId;
      this.orgId = '';
      this.getmaps();
    },
    // 当点击根节点，收起其他已打开的树
    handleTree(data) {
      this.svgList.forEach((item, index) => {
        let closeOther = true;
        item.forEach((tree) => {
          if (tree.okrDetailId == data) {
            // 当前点击的树不做处理
            closeOther = false;
          }
        });
        if (closeOther) {
          this.$refs.svgTree[index].closeTree();
        }
      });
    },
  },
};
</script>
