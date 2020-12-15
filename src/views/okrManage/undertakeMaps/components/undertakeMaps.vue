<template>
  <div class="undertake-maps-tree">
    <div class="cont-area">
      <div v-if="showOne && svgList.length > 0">
        <tl-svgtree
          :treeData="svgList"
          svgId="svg"
          ref="svgTree"
          :curveness="false"
          direction="col"
          fatherId="okrParentId"
          childId="okrDetailId"
          :colAlign="false"
          :middlePoint="cardHight"
          :blockHeight="blockHeight"
        >
          <div slot="treecard" slot-scope="props">
            <card
              :node="props.node"
              @takeOvierview="takeOvierview(props.node)"
            ></card>
          </div>
        </tl-svgtree>
      </div>
      <div v-else-if="svgList.length > 0">
        <tl-svgtree
          v-for="(item, index) in svgList"
          :key="index"
          :treeData="item"
          :svgId="'svg' + index"
          ref="svgTree"
          direction="col"
          fatherId="okrParentId"
          childId="okrDetailId"
          :colAlign="false"
          @handleTree="handleTree"
          :middlePoint="cardHight"
          :blockHeight="blockHeight"
        >
          <div slot="treecard" slot-scope="props">
            <card
              :node="props.node"
              @takeOvierview="takeOvierview(props.node)"
            ></card>
          </div>
        </tl-svgtree>
      </div>
      <!-- 加载中 -->
      <div v-else-if="loading" class="bg-loading">
        <i class="el-icon-loading"></i>
        <em>加载中...</em>
      </div>
      <!-- 暂无数据 -->
      <div v-else class="no-data">
        <div class="bg-no-data-map"></div>
        <div class="no-data-txt">暂无数据</div>
      </div>
    </div>
    <div class="operating-area">
      <div class="operating-area-inside">
        <div class="operating-box">
          <dl>
            <dd v-if="!showOne">
              <el-select
                :disabled="periodList.length == 0"
                v-model="searchForm.periodId"
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
            </dd>
            <dd>
              <el-button
                v-if="showOne"
                @click="goback"
                plain
                class="tl-btn amt-border-fadeout"
                >返回</el-button
              >
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// import department from '@/components/department';
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
      okrCycle: {},
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
      cardHight: 55, // 块高度的一半
      blockHeight: 170,
      loading: true,
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
    ...mapMutations('common', ['setPeriodId', 'changeTestModel']),
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
        self.getOkrCycleList();
      }
    },
    getOkrCycleList() {
      // 查询周期
      this.server.getOkrCycleList().then((res) => {
        if (res.code == 200) {
          this.periodList = res.data || [];
          this.okrCycle = this.periodList.filter((item) => item.checkStatus == '1')[0] || {};
          this.searchForm.periodId = this.okrCycle.periodId;
        }
      });
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
        this.loading = true;
        if (this.showOne) {
          this.server.okrContinueMapById(this.searchForm).then((res) => {
            this.loading = false;
            if (res.code == 200) {
              const allTreeData = res.data;
              this.svgList = [];
              allTreeData.forEach((item) => {
              // if (index === 0) {
              //   item.okrParentId = null;
              // }
                this.svgList.push(item);
                // if (item.krContinueList && item.krContinueList.length > 0) {
                this.svgList = this.svgList.concat(item.krContinueList || []);
              // }
              });
              this.svgList.forEach((item) => {
                delete item.krContinueList;
              });
            }
          });
        } else {
          this.server.getmaps(this.searchForm).then((res) => {
            this.loading = false;
            if (res.code == 200) {
              const allTreeData = res.data;
              this.svgList = [];
              let index = 0;
              allTreeData.forEach((item) => {
                // if (item.krContinueList && item.krContinueList.length > 0) {
                item.okrParentId = null;
                this.svgList[index] = [];
                this.svgList[index].push(item);
                this.svgList[index] = this.svgList[index].concat(item.krContinueList || []);
                delete item.krContinueList;
                index += 1;
                // }
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
            this.loading = false;
          });
        }
      }
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
    takeOvierview(node) {
      this.changeTestModel(false);
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
              id: node.orgId, name: encodeURI(node.userName), userId: node.userId, tenantId: node.tenantId,
            },
          });
        }
      });
    },
  },
  watch: {
    'searchForm.periodId': {
      handler(newVal) {
        console.log('周期');
        if (newVal) {
          this.okrCycle = this.periodList.filter(
            (citem) => citem.periodId === newVal,
          )[0] || {};
          this.getmaps();
        }
      },
      immediate: true,
    },
  },
};
</script>
