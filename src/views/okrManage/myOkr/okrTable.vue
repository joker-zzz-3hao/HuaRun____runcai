<template>
  <div class="maps-view-table">
    <crcloud-table :isPage="false">
      <div slot="tableContainer" class="table-container">
        <el-table
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          border
          row-key="orgId"
          :data="treeTableData"
          class="tl-table"
          @expand-change="expand"
          :expand-row-keys="expands"
        >
          <el-table-column prop="orgName" label="名称" min-width="170">
            <template slot-scope="scope">
              <span class="can-click" @click="gotoView(scope.row)">{{
                cutOrgName(scope.row.orgName)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="负责人" width="120">
            <template slot-scope="scope">
              <span class="can-click" @click="gotoView(scope.row)">{{
                scope.row.userName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="periodName" label="周期" min-width="116">
          </el-table-column>
          <el-table-column prop="okrProgress" label="进度" width="180">
            <template slot-scope="scope">
              <tl-process
                :ref="'process' + scope.row.orgId + scope.row.okrProgress"
                :data="scope.row.okrProgress"
              ></tl-process>
            </template>
          </el-table-column>
          <el-table-column
            prop="okrDetailObjectKr"
            label="目标（O）"
            min-width="160"
          >
            <template slot-scope="scope">
              <span class="can-click" @click="goDetail(scope.row.okrId)">{{
                scope.row.okrDetailObjectKr
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="krCount"
            label="关键结果（KR）"
            width="130"
          ></el-table-column>
          <el-table-column prop="status" label="状态" width="70">
            <template slot-scope="scope">
              <span>{{ CONST.TABLE_STATUS_MAP[scope.row.status] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </crcloud-table>
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
import { mapState, mapMutations } from 'vuex';
import okrDetail from '@/components/okrDetail';
import process from '@/components/process';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'okrTable',
  data() {
    return {
      CONST,
      server,
      treeData: [],
      treeTableData: [],
      expands: [],
      detailExist: false,
      drawerTitle: 'OKR详情',
    };
  },
  components: {
    'tl-process': process,
    'tl-okr-detail': okrDetail,
  },
  props: {
  },
  mounted() {
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      okrCycle: (state) => state.okrCycle,
      orgFullId: (state) => state.orgFullId,
      okrOrgId: (state) => state.okrOrgId,
    }),
  },
  methods: {
    ...mapMutations('common', ['changeTestModel']),
    gotoView(row) {
      this.changeTestModel(false);
      this.server.identity({
        orgId: row.orgId,
        user: row.userId,
      }).then((res) => {
        if (res.data.identityType == 'org') {
          this.$router.push({
            name: 'departleader',
            query: {
              id: row.orgId, userId: row.userId,
            },
          });
          return false;
        }
        if (res.data.identityType == 'team') {
          this.$router.push({
            name: 'teamleader',
            query: {
              id: row.orgId, userId: row.userId,
            },
          });
          return false;
        }
        if (res.data.identityType == 'person') {
          this.$router.push({
            name: 'grassStaff',
            query: {
              id: row.orgId, userId: row.userId,
            },
          });
        }
      });
    },
    goDetail(okrId) {
      this.okrId = okrId;
      this.drawerTitle = this.okrCycle.periodName;
      this.detailExist = true;
      this.$nextTick(() => {
        this.$refs.okrdetail.showOkrDialog();
      });
    },
    // 重新触发进度条计算
    expand(row, expanded) {
      if (expanded) {
        row.children.forEach((item) => {
          console.log(item.orgId);
          if (item.okrProgress > 0) {
            this.$nextTick(() => {
              this.$refs[`process${item.orgId}${item.okrProgress}`].changeWidth();
            });
          }
        });
      }
    },
    // 查询组织树
    getOkrTree() {
      console.log('组织树', this.okrCycle.periodId, this.okrOrgId);
      if (this.okrCycle.periodId && this.okrOrgId) {
        this.treeTableData = [];
        this.loading = true;
        this.server.getOkrTree({
          periodId: this.okrCycle.periodId,
          // periodId: '1204827318294274048',
          orgId: this.okrOrgId,
          // orgId: 'CR0011000054:CR0012000174:CR0012000184:',
        }).then((res) => {
          if (res.code == '200') {
            // OKR表格数据
            if (res.data.children.length > 0) {
              this.treeTableData.push(res.data);
            } else {
              this.treeTableData = [];
            }
            if (this.treeTableData.length > 0) {
              this.replaceName(this.treeTableData[0]);
              // 默认展开第一个
              this.expands[0] = this.treeTableData[0].orgId;
            }
          }
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    },
  },
  watch: {
    okrCycle: {
      handler(newVal) {
        if (newVal.periodId) {
          this.getOkrTree();
        }
      },
      deep: true,
      immediate: true,
    },
    okrOrgId: {
      handler(newVal) {
        console.log('getOkrTree', newVal);
        if (newVal) {
          this.getOkrTree();
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>