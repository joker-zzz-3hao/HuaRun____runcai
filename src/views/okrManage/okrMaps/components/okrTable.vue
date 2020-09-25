<template>
  <crcloud-table :isPage="false">
    <div slot="tableContainer" class="table-container">
      <el-table
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
        row-key="orgId"
        :data="treeData"
        class="tl-table"
      >
        <el-table-column prop="orgName" label="名称" min-width="180"></el-table-column>
        <el-table-column prop="userName" label="负责人" min-width="100">
          <template slot-scope="scope">
            <span @click="gotoView(scope.row)">{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="okrProgress" label="进度" min-width="116">
          <template slot-scope="scope">
            <tl-process :data="scope.row.okrProgress"></tl-process>
          </template>
        </el-table-column>
        <el-table-column prop="okrDetailObjectKr" label="目标（O）" min-width="180"></el-table-column>
        <el-table-column prop="krCount" label="关键结果（KR）" min-width="90"></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <span>{{CONST.TABLE_STATUS_MAP[scope.row.status]}}</span>
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
  mounted() {},
  computed: {},
  methods: {
    gotoView(row) {
      const data = { node: row };
      this.$emit('takeOvierview', data);
    },
  },
  watch: {},
};
</script>