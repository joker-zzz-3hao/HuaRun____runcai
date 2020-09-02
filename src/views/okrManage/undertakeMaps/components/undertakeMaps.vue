<template>
  <div class="home">
    <div style="margin-left:20px; display: flex;" v-if="!showOne">
      <tl-periodselect :periodList="periodList" @handleData="handleCycleData"></tl-periodselect>

      <div @click="showCascader=!showCascader">
        <el-input v-model="orgName"></el-input>
      </div>
      <el-cascader-panel
        v-model="orgFullId"
        :style="{display: showCascader ? '' : 'none'}"
        :options="departmentData"
        :show-all-levels="false"
        @change="selectIdChange"
        :props="{ checkStrictly: true, expandTrigger: 'hover',value:'orgFullId',label:'orgName',children:'children' }"
      ></el-cascader-panel>
      <!-- <tl-department
        type="department"
        :data="departmentData"
        :initDepartment="initDepartment"
        @handleData="handleData"
        :defaultProps="departmentDefaultProps"
      ></tl-department>-->
    </div>
    <!-- 返回 -->
    <div>
      <el-button v-if="showOne" @click="goback">返回</el-button>
    </div>
    <!-- 要展示多个 -->
    <div v-if="showOne && svgList.length>0">
      <tl-svgtree
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
      </tl-svgtree>
    </div>
    <div v-else-if="svgList.length>0">
      <tl-svgtree
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
      </tl-svgtree>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// import department from '@/components/department';
import periodSelect from '@/components/periodSelect';
import svgtree from '@/components/svgtree';
import card from './card';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'undertakeMaps',
  components: {
    'tl-svgtree': svgtree,
    card,
    // 'tl-department': department,
    'tl-periodselect': periodSelect,
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
      departmentDefaultProps: {
        children: 'children',
        label: 'orgName',
        id: 'orgId',
      },
      svgList: [],
      allTree: [],
      showOne: false, // 是否只展示一棵树
      orgId: '',
      periodList: [],
      orgFullId: '',
      orgFullIdList: [],
      showCascader: false,
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
    ...mapMutations('common', ['setPeriodId']),
    init() {
      const self = this;
      // 直接赋值，为空时也会按false判断（从myokr跳传
      self.showOne = self.$route.params.showOne;
      self.searchForm.okrDetailId = self.$route.params.okrDetailId || '';
      self.searchForm.periodId = self.$route.params.periodId || '';
      self.orgId = self.userInfo.orgId || '';
      self.searchForm.orgId = self.$route.params.orgId || self.userInfo.orgId || '';
      self.orgName = self.userInfo.orgName || '';
      if (!self.showOne) {
        // 查询周期
        self.server.getOkrCycleList().then((res) => {
          if (res.code == 200) {
            this.periodList = res.data || [];
          }
        });
        self.getOrgTable();
      } else {
        self.getmaps();
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
      // 存周期id
      this.setPeriodId(this.searchForm.periodId);
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
              this.svgList.forEach((item) => {
                delete item.krContinueList;
              });
            } else {
              let index = 0;
              allTreeData.forEach((item) => {
                if (item.krContinueList && item.krContinueList.length > 0) {
                  item.okrParentId = null;
                  this.svgList[index] = [];
                  this.svgList[index].push(item);
                  this.svgList[index] = this.svgList[index].concat(item.krContinueList);
                  delete item.krContinueList;
                  index += 1;
                }
                if (item.krList && item.krList.length > 0) {
                  item.krList.forEach((kritem) => {
                    if (kritem.krContinueList && kritem.krContinueList.length > 0) {
                      kritem.okrParentId = null;
                      this.svgList[index] = [];
                      this.svgList[index].push(kritem);
                      this.svgList[index] = this.svgList[index].concat(kritem.krContinueList);
                      delete kritem.krContinueList;
                      index += 1;
                    }
                  });
                  delete item.krList;
                }
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
      console.log('writeokrCycle', data);
      this.getmaps();
    },
    // handleData(data) {
    //   this.searchForm.orgId = this.orgId ? this.orgId : data.orgId;
    //   this.orgId = '';
    //   this.getmaps();
    // },
    // 选择部门
    selectIdChange(data) {
      this.showCascader = false;
      this.orgFullId = data[data.length - 1];
      this.orgFullIdList = this.orgFullId.split(':');
      this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
      // const orgId = this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
      this.searchForm.orgId = this.orgFullIdList[this.orgFullIdList.length - 1];

      console.log(this.orgFullId);
      console.log(this.orgFullIdList);
      // console.log(this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1));
      this.getOrgName(this.departmentData, 0);
      this.getmaps();
    },
    // 显示部门名
    getOrgName(data, index) {
      data.forEach((item) => {
        if (this.orgFullIdList[index] == item.orgId) {
          if (item.children && item.children.length > 0 && this.orgFullIdList[index + 1]) {
            this.getOrgName(item.children, index + 1);
          } else if ((index + 1) == this.orgFullIdList.length) {
            this.orgName = item.orgName;
          }
        }
      });
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
    goback() {
      this.$router.back(-1);
    },
  },
};
</script>
