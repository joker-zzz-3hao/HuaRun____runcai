<template>
  <div class="okr-maps">
    <div class="cont-area">
      <div v-if="showDepartmentSelect" class="maps-view">
        <!-- OKR树 -->
        <div v-if="showOkrMap" class="maps-view-tree">
          <svgtree
            v-if="this.treeData.length > 0"
            fatherId="orgParentId"
            childId="orgId"
            :treeData="treeData"
            direction="col"
          >
            <template slot="treecard" slot-scope="node">
              <card
                :node="node"
                @showDetail="showDetail(node.node.okrId)"
                @takeOvierview="takeOvierview"
              ></card>
            </template>
          </svgtree>
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
        <!-- OKR表格 -->
        <tl-okr-table
          v-if="!showOkrMap"
          :treeData="treeTableData"
          @showDetail="showDetail"
          @takeOvierview="takeOvierview"
          class="maps-view-table"
        ></tl-okr-table>
      </div>
      <div v-if="!showDepartmentSelect" class="maps-search">
        <tl-search-table
          @showDetail="showDetail"
          @takeOvierview="takeOvierview"
          :keyword="keyword"
          :searchType="searchType"
          :searchData="searchData"
        >
        </tl-search-table>
      </div>
      <tl-mission ref="mission"></tl-mission>
      <tl-setperiod ref="setperiod" @success="getPeriod"></tl-setperiod>
    </div>
    <div class="operating-area">
      <div class="operating-area-inside">
        <div class="operating-box">
          <dl class="dl-item" v-if="showDepartmentSelect">
            <dt>周期</dt>
            <dd>
              <el-select
                :disabled="periodList.length == 0"
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
            </dd>
            <dd class="prefer-text" @click="showSetPeriod">设置偏好</dd>
          </dl>
          <dl class="dl-item" v-if="showDepartmentSelect">
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
            <dd>
              <el-input
                placeholder="请输入OKR内容、部门、用户"
                v-model="keyword"
                @keyup.enter.native="search"
                class="tl-input"
              >
                <i
                  slot="prefix"
                  class="el-input__icon el-icon-search"
                  @click="search"
                ></i>
              </el-input>
            </dd>
            <dd>
              <el-button
                :disabled="!hasPower('okr-maps-query')"
                type="primary"
                class="tl-btn amt-bg-slip"
                @click="search"
                >搜索</el-button
              >
            </dd>
          </dl>

          <div class="toggle-view" v-if="showDepartmentSelect">
            <i
              class="table-view"
              :class="showOkrMap ? 'is-selected' : ''"
              @click="showOkrMap = true"
            ></i>
            <i
              class="column-view"
              :class="!showOkrMap ? 'is-selected' : ''"
              @click="showOkrMap = false"
            ></i>
          </div>
        </div>
        <div class="operating-box">
          <el-button
            plain
            icon="el-icon-arrow-right"
            class="tl-btn amt-border-slip"
            @click="showMission(3, '公司价值观宣导')"
          >
            <em>公司价值观宣导</em>
            <span class="lines"></span>
          </el-button>
          <el-button
            plain
            icon="el-icon-arrow-right"
            class="tl-btn amt-border-slip"
            @click="showMission(1, '华润使命·愿景')"
          >
            <em>公司使命愿景</em>
            <span class="lines"></span>
          </el-button>
          <el-button
            plain
            icon="el-icon-arrow-right"
            class="tl-btn amt-border-slip"
            @click="showMission(2, '华润发展战略')"
          >
            <em>公司战略</em>
            <span class="lines"></span>
          </el-button>
          <el-button
            plain
            @click="showDepartmentSelect = !showDepartmentSelect"
            v-if="!showDepartmentSelect"
            class="tl-btn amt-border-slip"
          >
            返回
            <span class="lines"></span>
          </el-button>
        </div>
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
    ></tl-okr-detail>
  </div>
</template>

<script>
import global from '@/mixin/global';
import svgtree from '@/components/svgtree';
import okrDetail from '@/components/okrDetail';
import { mapMutations } from 'vuex';
import card from './components/card';
import okrTable from './components/okrTable';
import mission from './components/mission';
import setPeriod from './components/setPeriod';
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
      loading: true,
      hadSet: false,
      preferPeriod: '', // 偏好周期
    };
  },
  mixins: [global],
  components: {
    svgtree,
    card,
    'tl-mission': mission,
    'tl-setperiod': setPeriod,
    'tl-okr-table': okrTable,
    'tl-search-table': searchTable,
    'tl-okr-detail': okrDetail,
  },
  mounted() {
    const self = this;
    // self.getPeriod();document.documentElement.scrollTop
    self.getOrgTable();
    document.body.scrollTop = 200;
    console.log('滚动条', document.body.scrollTop, document.documentElement.scrollTop);
  },
  methods: {
    ...mapMutations('common', ['changeTestModel']),
    changeCascader(data) {
      this.test = data;
      this.showCascader = false;
    },
    getPeriod() {
      // 查询周期
      this.server.getOkrMapPeriod({ orgFullId: this.orgFullId }).then((res) => {
        if (res.code == 200) {
          this.periodList = res.data || [];
          this.periodList.forEach((item) => {
            // 如果有设置偏好
            console.log(item.okrMapDefault);
            if (item.okrMapDefault) {
              this.okrCycle = item;
              this.periodId = this.okrCycle.periodId;
              this.preferPeriod = this.okrCycle.periodId;
              this.hadSet = true;
              console.log(this.okrCycle);
            }
            if (item.checkStatus == 1 && !this.hadSet) {
              this.okrCycle = item;
              this.periodId = this.okrCycle.periodId;
              console.log(item.checkStatus);
              if (!item.existOkrData) {
                this.showSetPeriod();
              }
            }
          });
        }
      });
    },
    // 查询组织树
    getOkrTree() {
      if (this.okrCycle.periodId && this.orgFullId) {
        this.treeTableData = [];
        this.loading = true;
        this.server.getOkrTree({
          periodId: this.okrCycle.periodId,
          orgId: this.orgFullId,
        }).then((res) => {
          if (res.code == '200') {
            // OKR表格数据
            if (this.treeTableData.orgId) {
              this.treeTableData.push(res.data);
            } else {
              this.treeTableData = [];
            }
            if (this.treeTableData.length > 0) {
              this.replaceName(this.treeTableData[0]);
            }
            // 如果搜索的不是第一级，就要将过滤数据里面的最高级orgParentId设置成null
            if (res.data.okrTree.length > 0) {
              res.data.okrTree.forEach((item) => {
                if (item.orgFullId == this.orgFullId) {
                // if (item.orgFullId == 'CR0011000054:CR0012000174:CR0012000184:') {
                  item.orgParentId = null;
                }
              });
            }
            this.treeData = res.data.okrTree;
          }
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    },
    // replaceName(data) {
    //   const parentName = data.orgName;
    //   if (data.children && data.children.length > 0) {
    //     data.children.forEach((item) => {
    //       if (item.orgName.indexOf(parentName) > -1) {
    //         item.orgName = item.orgName.replace(`${parentName}-`, '');
    //       }
    //       this.replaceName(item);
    //     });
    //   }
    // },
    getOrgTable() {
      // 查询组织树
      this.server.getOrgTable().then((res) => {
        if (res.code == '200') {
          if (res.data) {
            this.departmentData = [];
            this.departmentData.push(res.data);
            if (this.departmentData.length > 0) {
              this.replaceName(this.departmentData[0]);
            }
            // 默认取第二层润联科技
            this.orgFullId = this.departmentData[0].children[0].orgFullId;
            this.orgFullIdList = this.orgFullId.split(':');
            this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
            this.getOrgName(this.departmentData, 0);
            this.getPeriod();
          }
        }
      });
    },
    search() {
      if (this.hasPower('okr-maps-query')) {
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
      }
    },
    selectIdChange(data) {
      this.showCascader = false;
      this.orgFullId = `${data.join(':')}:`;
      this.orgFullIdList = data;
      // this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
      this.$refs.cascader.dropDownVisible = false;
      this.getOrgName(this.departmentData, 0);
      // this.getPeriod();
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
      this.drawerTitle = this.okrCycle.periodName;
      this.detailExist = true;
      this.$nextTick(() => {
        this.$refs.okrdetail.showOkrDialog();
      });
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
              id: node.orgId, userId: node.userId,
            },
          });
          return false;
        }
        if (res.data.identityType == 'team') {
          this.$router.push({
            name: 'teamleader',
            query: {
              id: node.orgId, userId: node.userId,
            },
          });
          return false;
        }
        if (res.data.identityType == 'person') {
          this.$router.push({
            name: 'grassStaff',
            query: {
              id: node.orgId, userId: node.userId,
            },
          });
        }
      });
    },
    // 打开设置周期
    showSetPeriod() {
      this.$nextTick(() => {
        this.$refs.setperiod.show(this.preferPeriod, this.periodList);
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