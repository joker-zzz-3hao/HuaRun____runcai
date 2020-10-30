<template>
  <div class="monitor-data">
    <div class="operating-area">
      <div class="page-title">监控数据</div>
      <div class="operating-box">
        <el-form
          v-if="type == 2"
          ref="ruleForm"
          :inline="true"
          class="tl-form-inline"
        >
          <el-form-item>
            <el-date-picker
              v-model="timeVal"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              popper-class="tl-range-popper"
              class="tl-range-editor"
              @change="searchHistory()"
            >
            </el-date-picker>
          </el-form-item>
          <!-- <el-form-item>
            <el-input
              maxlength="64"
              v-model.trim="searchData.userName"
              placeholder="请输入姓名"
              class="tl-input-search"
              @keyup.enter.native="searchHistory()"
            >
            </el-input>
          </el-form-item> -->
        </el-form>
        <div
          class="tl-custom-btn"
          v-for="item in typeList"
          :key="item"
          :class="{
            'is-select': type == item,
          }"
          @click="setType(item)"
        >
          <em>{{ item == "1" ? "在线人数" : "登录登出审批日志" }}</em>
        </div>
      </div>
    </div>
    <div class="monitor-area" v-if="type == 1">
      <div class="title">
        <span>在线总人数：</span>
        <em>{{ formData.total || 0 }}</em>
        <span>历史累计登录人数：</span>
        <em>{{ formData.historyVisitNumber || 0 }}</em>
      </div>

      <el-collapse v-if="formData.tenantUserDtoList">
        <el-collapse-item
          v-for="tenant in formData.tenantUserDtoList"
          :key="tenant.tenantDto.tenantId"
        >
          <template slot="title">
            <span>{{ tenant.tenantDto.tenantName }}</span>
            <span>在线人数：{{ tenant.sum }}</span>
          </template>
          <el-table :data="tenant.userDtoList">
            <el-table-column label="所属部门" prop="orgName"></el-table-column>
            <el-table-column label="姓名" prop="userName"></el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="cont-area" v-else>
      <crcloud-table
        :total="total"
        :pageSize.sync="pageSize"
        :currentPage.sync="currentPage"
        @searchList="searchHistory"
      >
        <div slot="tableContainer">
          <el-table :data="historyTable">
            <el-table-column
              label="姓名（账号）"
              prop="userName"
              min-width="120px"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.userName }}</span>
                <span v-if="scope.row.userAccount"
                  >（{{ scope.row.userAccount }}）</span
                >
              </template>
            </el-table-column>
            <el-table-column
              label="所属租户"
              prop="tenantName"
            ></el-table-column>
            <el-table-column label="所属部门" prop="orgName"></el-table-column>

            <el-table-column label="操作时间" prop="createTime">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime }}</span>
                <span>（{{ OPERTYPE_MAP[scope.row.operType] }}）</span>
              </template>
            </el-table-column>
            <el-table-column label="操作系统/浏览器" prop="os">
              <template slot-scope="scope">
                <span>{{ scope.row.os }}</span>
                <span>/{{ scope.row.userAgent }}</span>
              </template></el-table-column
            >
          </el-table>
        </div>
      </crcloud-table>
    </div>
  </div>
</template>

<script>
import Server from './server';

const OPERTYPE_MAP = {
  1: '系统登录',
  2: 'ldap登录',
  3: '润工作登录',
  0: '登出',
};
const server = new Server();
export default {
  name: 'listenerData',
  data() {
    return {
      OPERTYPE_MAP,
      server,
      formData: {},
      typeList: [1, 2],
      type: 1,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      historyTable: [],
      searchData: {},
      timeVal: [],
    };
  },
  components: {},
  props: {},
  computed: {},
  mounted() {
    this.searchOnline();
    this.searchHistory();
  },
  methods: {
    searchHistory(params = { currentPage: 1 }) {
      params.pageSize = this.pageSize;
      if (this.timeVal) {
        params.startTime = this.timeVal[0] ? `${this.timeVal[0]}  00:00:00` : null;
        params.endTime = this.timeVal[1] ? `${this.timeVal[1]}  23:59:59` : null;
      }
      this.server.getLoginLogPage(params).then((res) => {
        if (res.code == '200') {
          this.historyTable = res.data.records;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
        }
      });
    },
    searchOnline() {
      this.server.onlineUserInfo().then((res) => {
        if (res.code == '200') {
          this.formData = res.data;
          console.log(res);
        }
      });
    },
    setType(type) {
      this.type = type;
    },
  },
  watch: {},
};
</script>