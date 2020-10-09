<!--
  功能：
  作者：王志任
  时间：2020年10月03日 17:18:59
  备注：
-->
<template>
  <div>
    <div class="operating-area">
      <div class="page-title">已归档任务</div>
      <div class="operating-box">
        <el-form
          v-if="hasPower('sys-dictionary-list')"
          ref="ruleForm"
          :inline="true"
          class="tl-form-inline"
        >
          <el-form-item>
            <el-input
              v-model="keyWord"
              placeholder="输入任务标题"
              maxlength="50"
              class="tl-input-search"
              @keyup.enter.native="searchList"
              clearable
              @clear="clear"
            >
              <i class="el-icon-search" slot="prefix" @click="searchList"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model.trim="executorId"
              placeholder="执行者"
              :popper-append-to-body="false"
              popper-class="tl-select-dropdown"
              class="tl-select"
            >
              <el-option
                v-for="item in executorList"
                :key="item.executorId"
                :label="item.executorName"
                :value="item.executorId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model.trim="creatorId"
              placeholder="创建人"
              :popper-append-to-body="false"
              popper-class="tl-select-dropdown"
              class="tl-select"
            >
              <el-option
                v-for="item in creatorList"
                :key="item.creatorId"
                :label="item.creatorName"
                :value="item.creatorId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="cont-area">
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
import Server from '../server';

const server = new Server();
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      server,
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
