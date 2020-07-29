<template>
  <div>
    <div>
      <div class="search-bar">
        <slot name="searchBar"></slot>
      </div>
      <div class="action-bar">
        <slot name="actionBar"></slot>
      </div>
      <div class="table-container">
        <slot name="tableContainer"></slot>
      </div>
      <div class="page-bar" v-show="isPage">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'crcloudTable',
  data() {
    return {

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