<template>
  <div class="role-type">
    <div class="operating-area">
      <div class="page-title">价值观事件簿</div>
      <div class="operating-box">
        <el-form ref="ruleForm" :inline="true" class="tl-form-inline">
          <el-form-item>
            <el-input
              maxlength="64"
              @keyup.enter.native="searchList"
              v-model.trim="keyWord"
              placeholder="请输入您要查找的关键字"
              class="tl-input-search"
            >
              <i class="el-icon-search" slot="prefix" @click="searchList"></i>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="cont-area">
      <tl-crcloud-table
        :total="total"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="searchList"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table">
            <el-table-column prop="userName" label="员工" min-width="140"></el-table-column>
            <el-table-column prop="updateTime" label="时间" min-width="160"></el-table-column>
            <el-table-column prop="workContent" label="工作项" min-width="120"></el-table-column>
            <el-table-column prop="cultureName" label="支撑的价值观" min-width="180"></el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-button @click="goWeekly(scope.row)" type="text" class="tl-btn">查看周报</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import Server from './server';

const server = new Server();
export default {
  name: 'worthManage',
  data() {
    return {
      server,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      keyWord: '',
      tableData: [],
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
  },
  created() {
    this.searchList();
  },
  mixins: [global],
  methods: {
    searchList() {
      this.server.weeklyEvents({
        currentPage: this.currentPage,
        keyWord: this.keyWord,
        pageSize: this.pageSize,
      }).then((res) => {
        if (res.code == '200') {
          this.tableData = res.data.content;
          this.total = res.data.total;
        }
      });
    },
    goWeekly(data) {
      console.log(data);
    },
  },

};
</script>