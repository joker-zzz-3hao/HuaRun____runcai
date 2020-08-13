<template>
  <div class="tenant-management">
    <el-form ref="ruleForm" :inline="true">
      <el-form-item>
        <el-input maxlength="50" v-model="keyWord" placeholder="输入ID/企业名称/企业申请人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTenantList">查询</el-button>
      </el-form-item>
      <el-form-item class="pageright">
        <el-button type="primary" @click="createAddTenant">创建租户</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column fixed prop="tenantBuId" label="企业ID"></el-table-column>
        <el-table-column prop="tenantName" label="企业名称"></el-table-column>
        <el-table-column prop="applyUser" label="申请人"></el-table-column>
        <!-- <el-table-column prop="version" label="开通版本"></el-table-column> -->
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span>{{CONST.STATUS[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="130">
          <template slot-scope="scope">
            <el-button @click="putTenant(scope.row.tenantId)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="infoTenant(scope.row.tenantId)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pageright">
      <tl-crcloud-table
        layout="total,  prev, pager,next, sizes"
        :total="totalpage"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :searchList="getTenantList"
      ></tl-crcloud-table>
    </div>
    <tl-create-tenant
      v-if="exist"
      :exist.sync="exist"
      :title="title"
      :tenantId="tenantId"
      :infoBool="infoBool"
    ></tl-create-tenant>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import createTenant from './components/createTenant';
import Server from './server';
import CONST from './const';

const server = new Server();
export default {
  name: 'tenantManagement',
  components: {
    'tl-create-tenant': createTenant,
    'tl-crcloud-table': crcloudTable,
  },
  created() {
    this.getTenantList();
  },
  methods: {
    getTenantList() {
      this.server.tenantList({
        keyWord: this.keyWord,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
      }).then((res) => {
        this.tableData = res.data.content;
        this.totalpage = res.data.total;
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
      this.exist = true;
    },
    infoTenant(tenantId) {
      this.title = '详情';
      this.tenantId = tenantId;
      this.infoBool = true;
      this.exist = true;
    },
    handleDelete(done) {
      this.$confirm('该数据删除将无法恢复，确认要删除吗？', '删除确认')
        .then(() => {
          done();
        })
        .catch(() => {});
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
    };
  },
};
</script>
<style  scoped>
.pageright {
  float: right;
}
</style>