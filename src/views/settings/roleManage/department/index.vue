<!--
 * @Author: 许志鹏
 * @Date: 2020-08-04 16:48:29
 * @Description: file content
-->
<template>
  <div class="home">
    <el-form ref="ruleForm" :inline="true">
      <el-form-item>
        <el-input maxlength="50" v-model="keyWord" placeholder="请输入角色名称/创建时间/角色状态"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="listRolePage">查询</el-button>
      </el-form-item>
      <el-form-item class="pageright">
        <el-button type="primary" @click="showAddRoule()">新增角色</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column fixed prop="roleCode" label="角色编码"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleType" label="类型"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="$router.push({path:'/members',query:{roleId:scope.row.roleId,name:encodeURI(scope.row.roleName)}})"
            >成员管理</el-button>
            <el-button @click="putRoule(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row.roleCode)">移除</el-button>
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
        :searchList="listRolePage"
      ></tl-crcloud-table>
    </div>
    <tl-add-role
      v-if="exist"
      :exist.sync="exist"
      :title="title"
      :rouleType="rouleType"
      :roleInfo="roleInfo"
      @getSearchList="listRolePage"
    ></tl-add-role>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import addRole from './components/addRole';
import Server from './server';

const server = new Server();
export default {
  created() {
    this.listRolePage();
  },
  methods: {
    listRolePage() {
      this.server.listRolePage({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        keyWord: this.keyWord,
      }).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data.content;
          this.totalpage = res.data.total;
        }
      });
    },

    showAddRoule() {
      this.title = '新增角色';
      this.exist = true;
    },
    putRoule(row) {
      this.roleInfo = row;
      this.title = '编辑角色';
      this.exist = true;
    },
    handleDelete(roleCode) {
      this.$confirm('您是否确定需要移除该成员？', '移除成员确认')
        .then(() => {
          this.delRole(roleCode);
        })
        .catch(() => {});
    },
    delRole(roleCode) {
      this.server.delRole({ roleCode }).then((res) => {
        if (res.code == 200) {
          this.listRolePage();
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
  },
  components: {
    'tl-add-role': addRole,
    'tl-crcloud-table': crcloudTable,
  },
  data() {
    return {
      server,
      title: '',
      rouleType: false, // 是否内置管理员
      exist: false,
      value: [],
      totalpage: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      keyWord: '',
    };
  },
};
</script>
<style  scoped>
.pageright {
  float: right;
}
</style>