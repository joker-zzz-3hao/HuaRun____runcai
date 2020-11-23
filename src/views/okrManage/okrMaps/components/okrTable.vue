<template>
  <crcloud-table :isPage="false">
    <div slot="tableContainer" class="table-container">
      <el-table
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        row-key="orgId"
        :data="treeData"
        class="tl-table"
        @expand-change="expand"
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
              :ref="'process' + scope.row.orgId"
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
</template>

<script>
import process from '@/components/process';
import CONST from '../const';

export default {
  name: 'okrTable',
  data() {
    return {
      CONST,
    };
  },
  components: {
    'tl-process': process,
  },
  props: {
    treeData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mounted() {
    console.log(this.treeData);
  },
  computed: {},
  methods: {
    gotoView(row) {
      console.log(row);
      this.$emit('takeOvierview', row);
    },
    goDetail(okrid) {
      this.$emit('showDetail', okrid);
    },
    // 重新触发进度条计算
    expand(row, expanded) {
      if (expanded) {
        row.children.forEach((item) => {
          console.log(item.orgId);
          this.$nextTick(() => {
            this.$refs[`process${item.orgId}`].changeWidth();
          });
        });
      }
    },
  },
  watch: {},
};
</script>