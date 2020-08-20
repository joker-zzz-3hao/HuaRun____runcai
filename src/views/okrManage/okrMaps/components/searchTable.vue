<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="OKR" name="first">
        <tl-searchOKR :searchData="searchData"></tl-searchOKR>
      </el-tab-pane>
      <el-tab-pane label="部门管理" name="second">
        <tl-searchResult :searchData="searchData"></tl-searchResult>
      </el-tab-pane>
      <el-tab-pane label="个人" name="third">
        <tl-searchResult :searchData="searchData"></tl-searchResult>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import searchResult from './searchResult';
import searchOKR from './searchOKR';

export default {
  name: 'searchTable',
  components: {
    'tl-searchResult': searchResult,
    'tl-searchOKR': searchOKR,
  },
  props: {
    searchData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      activeName: 'second',
    };
  },
  mounted() {},
  computed: {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
  watch: {},
};
</script>