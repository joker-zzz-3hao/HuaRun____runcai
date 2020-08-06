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
        <el-button type="primary">移除</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed prop="roleId" label="角色编码"></el-table-column>
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column prop="role" label="类型"></el-table-column>
        <el-table-column prop="city" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="value[scope.$index]" active-text="启用"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="创建时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDelete(scope.row)" size="small">移除</el-button>
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
    <tl-add-member v-if="exist" :exist.sync="exist" :title="title" :rouleType="rouleType"></tl-add-member>
  </div>
</template>

<script>
import addMember from './components/addMember';

export default {
  methods: {
    showAddRoule() {
      this.title = '新增角色';
      this.exist = true;
    },
    putRoule() {
      this.title = '编辑角色';
      this.exist = true;
    },
    handleDelete(done) {
      this.$confirm('该数据删除将无法恢复，确认要删除吗？', '删除确认')
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
    'tl-add-member': addMember,
  },
  data() {
    return {
      title: '',
      rouleType: false, // 是否内置管理员
      exist: false,
      value: [],
      inputValue: '',
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      tableData: [{
        roleId: '0001',
        name: '王小虎',
        role: '内置角色',
        date: '2020-07-16 11:33:00',
      }, {
        roleId: '0001',
        name: '王小虎',
        role: '内置角色',
        date: '2020-07-16 11:33:00',
      }, {
        roleId: '0001',
        name: '王小虎',
        role: '内置角色',
        date: '2020-07-16 11:33:00',
      }, {
        roleId: '0001',
        name: '王小虎',
        role: '内置角色',
        date: '2020-07-16 11:33:00',
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