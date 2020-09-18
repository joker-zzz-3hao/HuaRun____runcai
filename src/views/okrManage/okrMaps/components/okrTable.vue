<template>
  <crcloud-table :isPage="false">
    <div slot="tableContainer">
      <el-table
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
        row-key="orgId"
        :data="treeData"
        max-height="600"
        :empty-text="emptyText"
      >
        <el-table-column prop="orgName" label="名称" width="180"></el-table-column>
        <el-table-column prop="userName" label="负责人" width="180"></el-table-column>
        <el-table-column prop="okrProgress" label="进度" width="180">
          <template slot-scope="scope">
            <tl-process :data="scope.row.okrProgress"></tl-process>
          </template>
        </el-table-column>
        <el-table-column prop="okrDetailObjectKr" label="目标（O）" width="180"></el-table-column>
        <el-table-column prop="krCount" label="关键结果（KR）" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" width="180">
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
  methods: {},
  watch: {},
};
</script>