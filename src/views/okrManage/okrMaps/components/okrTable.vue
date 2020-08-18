<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="orgId"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="orgName" label="名称" sortable width="180"></el-table-column>
      <el-table-column prop="name" label="负责人" sortable width="180"></el-table-column>
      <el-table-column prop="address" label="进度"></el-table-column>
      <el-table-column prop="address" label="目标（O）"></el-table-column>
      <el-table-column prop="address" label="关键结果（KR）"></el-table-column>
      <el-table-column prop="address" label="状态"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'okrTable',
  data() {
    return {};
  },
  components: {},
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