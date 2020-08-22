<template>
  <div class="table-pagination">
    <slot name="tableContainer" class="table-container"></slot>
    <div class="page-bar" v-show="isPage">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="layout"
        :total="total"
        background
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'crcloudTable',
  data() {
    return {
      // layout: 'total, sizes, prev, pager, next, jumper',
    };
  },
  props: {
    total: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    isPage: {
      type: Boolean,
      default: true,
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50];
      },
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
  },
  computed: {},
  mounted() {},
  methods: {
    handleSizeChange(pageSize) {
      this.$emit('update:pageSize', pageSize);
      this.$emit('searchList');
    },
    handleCurrentChange(currentPage) {
      this.$emit('update:currentPage', currentPage);
      this.$emit('searchList');
    },
  },
};
</script>
<style scoped>
</style>