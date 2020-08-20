<template>
  <div>
    <el-tabs v-model="searchType" @tab-click="handleClick">
      <el-tab-pane label="OKR" name="2">
        <tl-searchOKR :searchData="searchData"></tl-searchOKR>
      </el-tab-pane>
      <el-tab-pane label="部门管理" name="1">
        <tl-searchResult :searchData="searchData"></tl-searchResult>
      </el-tab-pane>
      <el-tab-pane label="个人" name="3">
        <tl-searchResult :searchData="searchData"></tl-searchResult>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import searchResult from './searchResult';
import searchOKR from './searchOKR';
import Server from '../server';

const server = new Server();

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
    searchType: {
      type: String,
      default: '',
    },
    keyword: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      server,
      activeName: 'second',
    };
  },
  mounted() {},
  computed: {},
  methods: {
    handleClick() {
      const self = this;
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
    },
  },
  watch: {},
};
</script>