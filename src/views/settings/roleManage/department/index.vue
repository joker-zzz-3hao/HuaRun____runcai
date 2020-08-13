<!--
 * @Author: 许志鹏
 * @Date: 2020-08-04 16:48:29
 * @Description: file content
-->
<template>
  <div class="home">
    <el-form ref="ruleForm" :inline="true">
      <el-form-item>
        <el-input maxlength="50" v-model="inputValue" placeholder="请输入角色名称/创建时间/角色状态"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
      <el-form-item class="pageright">
        <el-button type="primary" @click="showAddRoule()">新增角色</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed prop="roleCode" label="角色编码"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleType" label="类型"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="$router.push('/members')">成员管理</el-button>
            <el-button @click="putRoule(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">移除</el-button>
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
    <tl-add-role v-if="exist" :exist.sync="exist" :title="title" :rouleType="rouleType"></tl-add-role>
  </div>
</template>

<script>
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
        keyWord: this.keyWord,
      }).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data.content;
        }
      });
    },

    showAddRoule() {
      this.title = '新增角色';
      this.exist = true;
    },
    putRoule() {
      this.title = '编辑角色';
      this.exist = true;
    },
    handleDelete(done) {
      this.$confirm('您是否确定需要移除该成员？', '移除成员确认')
        .then(() => {
          done();
        })
        .catch(() => {});
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
  },
  data() {
    return {
      server,
      title: '',
      rouleType: false, // 是否内置管理员
      exist: false,
      value: [],
      inputValue: '',
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
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