<!--
  功能：
  作者：王志任
  时间：2020年12月01日 10:34:43
  备注：
-->
<template>
  <div>
    <div class="operating-area">
      <el-button @click="addEvaluate">添加评定</el-button>
    </div>
    <div class="cont-area">
      <crcloud-table
        :total="total"
        :pageSize.sync="pageSize"
        :currentPage.sync="currentPage"
        @searchList="searchList"
      >
        <div slot="tableContainer" class="table-container">
          <el-table
            ref="performanceEvaluate"
            v-loading="loading"
            :data="evaluateData"
          >
            <el-table-column
              label="评定方式"
              align="left"
              prop=""
            ></el-table-column>
            <el-table-column
              label="内容"
              align="left"
              prop=""
            ></el-table-column>
            <el-table-column
              label="设置时间"
              align="left"
              prop=""
            ></el-table-column>
            <el-table-column
              label="更新时间"
              align="left"
              prop=""
            ></el-table-column>
            <el-table-column
              label="添加人"
              align="left"
              prop=""
            ></el-table-column>
            <el-table-column
              label="操作"
              align="left"
              width="100px"
              fixed="right"
            ></el-table-column>
          </el-table>
        </div>
      </crcloud-table>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      total: 0,
      pageSize: 10,
      currentPage: 1,
      evaluateData: [],
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    searchList() {

    },
    addEvaluate() {

    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
