<!--
  功能：
  作者：王志任
  时间：2020年10月03日 17:18:59
  备注：
-->
<template>
  <div>
    <div>
      <crcloud-table
        :total="total"
        :pageSize.sync="pageSize"
        :currentPage.sync="currentPage"
        @searchList="searchList"
      >
        <div slot="tableContainer">
          <el-table ref="taskTable" v-loading="loading" :data="tableData">
            <el-table-column min-width="100px" align="left" prop="taskTitle"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="taskTitle">
              <template slot-scope="scope">
                <div>
                  <p>
                    <i class="el-icon-user"></i>
                    <span>{{scope.row.userName}}</span>
                  </p>
                  <p>
                    <i class="el-icon-date"></i>
                    <span>{{scope.row.createTime}}</span>
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="100px" align="left" prop="taskProgress">
              <template slot-scope="scope">
                <div>
                  <el-slider disabled v-model="scope.row.taskProgress" :step="1"></el-slider>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="100px" align="left">
              <template slot-scope="scope">
                <span>
                  <el-avatar :size="30" :src="scope.row.headerUrl" @error="errorHandler">
                    <div v-if="scope.row.userName" class="user-name">
                      <em>
                        {{
                        scope.row.userName.substring(
                        scope.row.userName.length - 2
                        )
                        }}
                      </em>
                    </div>
                  </el-avatar>
                </span>
                <span>{{ scope.row.userName }}</span>
              </template>
            </el-table-column>
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
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  computed: {},
  methods: {
    init() {
      this.searchList();
    },
    searchList() {
      const self = this;
      self.rootData = [];
      const params = {
        currentPage: 1,
        pageSize: 10,
        processId: this.$route.query.processId,
      };
      self.server.queryFiledList(params).then((res) => {
        if (res.code == 200) {
          this.currentPage = res.data.currentPage;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.tableData = res.data.content;
          this.tableData.forEach((task) => {
            this.$set(task, 'showChangeUser', false);
          });
        }
      });
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
