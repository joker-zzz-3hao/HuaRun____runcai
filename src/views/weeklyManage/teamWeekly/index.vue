<template>
  <div class="tenant-management">
    <div class="operating-area">
      <div class="page-title">团队周报</div>
      <tl-calendar @setCalendarId="setCalendarId" @getWeeklyById="getWeeklyById"></tl-calendar>
      <div class="operating-panel">
        <el-form ref="ruleForm" :inline="true" class="tl-form-inline">
          <el-form-item>
            <el-input
              maxlength="64"
              @keyup.enter.native="getTeamWeekly"
              v-model="keyWord"
              placeholder="输入ID/企业名称/企业申请人"
              class="tl-input-search"
            >
              <i class="el-icon-search" slot="prefix" @click="getTeamWeekly"></i>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="cont-area">
      <crcloud-table
        :total="totalpage"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="getTeamWeekly"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column fixed prop="tenantBuId" label="姓名"></el-table-column>
            <el-table-column fixed prop="tenantBuId" label="所在团队"></el-table-column>
            <el-table-column fixed prop="tenantBuId" label="角色"></el-table-column>
            <el-table-column fixed prop="tenantBuId" label="状态"></el-table-column>
            <el-table-column fixed prop="tenantBuId" label="查看类型"></el-table-column>
            <el-table-column fixed prop="tenantBuId" label="本周心情"></el-table-column>
            <el-table-column fixed prop="tenantBuId" label="更新时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="130">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="weeklyInfo(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcloud-table>
    </div>
    <tl-create-tenant
      v-if="exist"
      :exist.sync="exist"
      :title="title"
      :tenantId="tenantId"
      @getTeamWeekly="getTeamWeekly"
      :infoBool="infoBool"
    ></tl-create-tenant>
  </div>
</template>

<script>
import calendar from '../myWeekly/components/calendar';
import Server from './server';

const server = new Server();
export default {
  name: 'tenantManage',
  components: {
    'tl-calendar': calendar,
  },
  created() {
    this.getTeamWeekly();
  },
  methods: {
    getTeamWeekly() {
      this.server.tenantList({
        keyWord: this.keyWord,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
      }).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data.content;
          this.totalpage = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    weeklyInfo() {},
  },
  data() {
    return {
      keyWord: '',
      pageSize: 10,
      currentPage: 1,
      pageSizes: 1,
      exist: false,
      value: [],
      server,
      inputValue: '',
      tableData: [],
      tenantId: null,
      totalpage: 0,
      infoBool: false,
      existDetail: false,
      existPut: false,
    };
  },
};
</script>
<style  scoped>
.pageright {
  float: right;
}
</style>