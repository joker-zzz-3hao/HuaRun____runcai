<template>
  <div class="tenant-management">
    <div class="operating-area">
      <div class="page-title">租户管理</div>
      <div class="operating-box">
        <el-form ref="ruleForm" :inline="true" class="tl-form-inline">
          <el-form-item>
            <el-input
              maxlength="64"
              @keyup.enter.native="getTenantList"
              v-model="keyWord"
              placeholder="输入ID/企业名称/企业申请人"
              class="tl-input-search"
            >
              <i class="el-icon-search" slot="prefix" @click="getTenantList"></i>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="createAddTenant"
          class="tl-btn amt-bg-slip"
        >创建租户</el-button>
      </div>
    </div>
    <div class="cont-area">
      <tl-crcloud-table
        :total="totalpage"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="getTenantList"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column fixed prop="tenantBuId" label="企业ID"></el-table-column>
            <el-table-column prop="tenantName" label="企业名称"></el-table-column>
            <el-table-column prop="applyUser" label="申请人"></el-table-column>
            <!-- <el-table-column prop="version" label="开通版本"></el-table-column> -->
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <el-switch
                  v-model.trim="scope.row.status"
                  active-value="O"
                  inactive-value="S"
                  @change="updateStatus(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.createTime"
                >{{ dateFormat("YYYY-mm-dd HH:MM:SS", new Date(scope.row.createTime))}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="130">
              <template slot-scope="scope">
                <el-button @click="putTenant(scope.row.tenantId)" type="text" size="small">编辑</el-button>
                <el-button type="text" size="small" @click="infoTenant(scope.row.tenantId)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
    <tl-create-tenant
      v-if="exist"
      :exist.sync="exist"
      :title="title"
      :tenantId="tenantId"
      @getTenantList="getTenantList"
      :infoBool="infoBool"
    ></tl-create-tenant>
    <tl-tenant-detail
      v-if="existDetail"
      :exist.sync="existDetail"
      :title="title"
      :tenantId="tenantId"
      :infoBool="infoBool"
    ></tl-tenant-detail>
    <tl-tenant-manage
      v-if="existPut"
      :exist.sync="existPut"
      :title="title"
      :tenantId="tenantId"
      @getTenantList="getTenantList"
      :infoBool="infoBool"
    ></tl-tenant-manage>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import global from '@/mixin/global';
import createTenant from './components/createTenant';
import putTenant from './components/putTenant';
import Server from './server';
import CONST from './const';
import tenantDetail from './components/tenantDetail';

const server = new Server();
export default {
  name: 'tenantManage',
  components: {
    'tl-create-tenant': createTenant,
    'tl-crcloud-table': crcloudTable,
    'tl-tenant-detail': tenantDetail,
    'tl-tenant-manage': putTenant,
  },
  created() {
    this.getTenantList();
  },
  mixins: [global],
  methods: {
    updateStatus(row) {
      this.server.updateTenantStatus({
        tenantId: row.tenantId,
        status: row.status,
      }).then((res) => {
        if (res.code == 200) {
          this.getTenantList();
          this.$message.success(res.msg);
        }
      });
    },
    getTenantList() {
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

    createAddTenant() {
      this.title = '创建租户';
      this.infoBool = false;
      this.tenantId = false;
      this.exist = true;
    },
    putTenant(tenantId) {
      this.title = '编辑租户';
      this.infoBool = false;
      this.tenantId = tenantId;
      this.existPut = true;
    },
    infoTenant(tenantId) {
      this.title = '详情';
      this.tenantId = tenantId;
      this.infoBool = true;
      this.existDetail = true;
    },
    handleChange(row) {
      this.$xconfirm({
        title: '是否修改状态？',
        content: '',
      }).then(() => {
        this.updateStatus(row);
      });
    },
  },
  data() {
    return {
      CONST,
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