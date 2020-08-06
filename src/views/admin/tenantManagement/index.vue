<!--
 * @Author: 许志鹏
 * @Date: 2020-08-04 15:39:16
 * @Description: file content
-->
<template>
  <div class="tenant-management">
    <el-form ref="ruleForm" :inline="true">
      <el-form-item>
        <el-input maxlength="50" v-model="inputValue" placeholder="输入ID/企业名称/企业申请人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
      <el-form-item class="pageright">
        <el-button type="primary" @click="showAddRoule">创建租户</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed prop="roleId" label="企业ID"></el-table-column>
        <el-table-column prop="name" label="企业名称"></el-table-column>
        <el-table-column prop="role" label="申请人"></el-table-column>
        <el-table-column prop="vioer" label="开通版本"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="date" label="创建时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="130">
          <template slot-scope="scope">
            <el-button @click="putRoule(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pageright">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total,  prev, pager,next, sizes"
        :total="400"
      ></el-pagination>
    </div>
    <tl-create-tenant v-if="exist" :exist.sync="exist" :title="title"></tl-create-tenant>
  </div>
</template>

<script>
import createTenant from './components/createTenant';

export default {
  name: 'tenantManagement',
  components: {
    'tl-create-tenant': createTenant,
  },
  methods: {
    showAddRoule() {
      this.title = '创建租户';
      this.exist = true;
    },
    putRoule() {
      this.title = '编辑租户';
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
      rouleType: false, // 是否内置管理员
      exist: false,
      value: [],
      inputValue: '',
      tableData: [{
        roleId: 'US20190210_111001',
        name: '华润水泥控股有限公司',
        role: '张三',
        date: '2020-07-16 11:33:00',
        vioer: '基础版',
        status: '正常',
      }, {
        roleId: 'US20190210_111001',
        name: '华润水泥控股有限公司',
        role: '张三',
        date: '2020-07-16 11:33:00',
        vioer: '基础版',
        status: '正常',
      }, {
        roleId: 'US20190210_111001',
        name: '华润水泥控股有限公司',
        role: '张三',
        date: '2020-07-16 11:33:00',
        vioer: '基础版',
        status: '正常',
      }, {
        roleId: 'US20190210_111001',
        name: '华润水泥控股有限公司',
        role: '张三',
        date: '2020-07-16 11:33:00',
        vioer: '基础版',
        status: '正常',
      }],
    };
  },
};
</script>
<style  scoped>
.pageright {
  float: right;
}
</style>