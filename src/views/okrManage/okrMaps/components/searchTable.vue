<template>
  <el-tabs v-model="searchType" @tab-click="handleClick" class="tl-tabs">
    <el-tab-pane label="OKR" name="2">
      <tl-searchOKR
        :searchData="searchData"
        @showDetail="getDetail"
        @takeOvierview="gotoView"
      ></tl-searchOKR>
    </el-tab-pane>
    <el-tab-pane label="部门" name="1">
      <tl-searchResult
        :searchType="searchType"
        :searchData="searchData"
        @takeOvierview="gotoView"
      ></tl-searchResult>
    </el-tab-pane>
    <el-tab-pane label="成员" name="3">
      <tl-searchResult
        :searchType="searchType"
        :searchData="searchData"
        @takeOvierview="gotoView"
      ></tl-searchResult>
    </el-tab-pane>
  </el-tabs>
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
    getDetail(okrid) {
      this.$emit('showDetail', okrid);
    },
    gotoView(data) {
      this.$emit('takeOvierview', data);
    },
  },
  watch: {},
};
</script>