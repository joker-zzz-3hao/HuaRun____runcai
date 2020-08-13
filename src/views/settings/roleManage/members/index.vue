<!--
 * @Author: 许志鹏
 * @Date: 2020-08-04 16:48:29
 * @Description: file content
-->
<template>
  <div class="home">
    <el-form ref="membersForm" :inline="true">
      <el-form-item class="pageright">
        <el-button type="primary" @click="showAddRoule()">添加成员</el-button>
        <el-button type="primary" @click="handleDelete()">移除</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column fixed prop="userAccount" label="用户帐号"></el-table-column>
        <el-table-column prop="userName" label="用户姓名"></el-table-column>
        <el-table-column prop="userMobile" label="手机号"></el-table-column>
        <el-table-column prop="sortPropName" label="所在团队"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDeleteOne(scope.row.roleId)" size="small">移除</el-button>
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
        :searchList="listRoleUser"
      ></tl-crcloud-table>
    </div>
    <tl-add-member
      v-if="exist"
      :exist.sync="exist"
      :title="title"
      :rouleType="rouleType"
      @getTableList="listRoleUser"
    ></tl-add-member>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import addMember from './components/addMember';
import Server from './server';

const server = new Server();
export default {
  created() {
    this.listRoleUser();
  },
  methods: {
    showAddRoule() {
      this.title = '新增角色';
      this.exist = true;
    },
    putRoule() {
      this.title = '编辑角色';
      this.exist = true;
    },
    handleDelete() {
      this.$confirm('该数据删除将无法恢复，确认要删除吗？', '删除确认')
        .then(() => {
          this.delUserRole(this.listUserRole);
        })
        .catch(() => {});
    },
    handleDeleteOne(id) {
      this.$confirm('该数据删除将无法恢复，确认要删除吗？', '删除确认')
        .then(() => {
          this.delUserRole({ id });
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    delUserRole(listUserRole) {
      this.server.delUserRole({
        listUserRole,
      }).then((res) => {
        if (res.code == 200) {
          this.listRoleUser();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleSelectionChange(data) {
      const listUserRole = data.map((item) => ({ id: item.id }));
      this.listUserRole = listUserRole;
    },
    listRoleUser() {
      this.server.listRoleUser({
        roleId: this.$route.query.roleId,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      }).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data.content;
          this.totalpage = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
  components: {
    'tl-add-member': addMember,
    'tl-crcloud-table': crcloudTable,
  },
  data() {
    return {
      listUserRole: [],
      server,
      title: '',
      rouleType: false, // 是否内置管理员
      exist: false,
      value: [],
      inputValue: '',
      currentPage: 1,
      pageSize: 10,
      totalpage: 0,
      tableData: [],
    };
  },
};
</script>
<style  scoped>
.pageright {
  float: right;
}
</style>