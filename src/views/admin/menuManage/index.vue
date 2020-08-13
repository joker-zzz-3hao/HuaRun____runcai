<!--
 * @Author: 许志鹏
 * @Date: 2020-08-11 10:43:56
 * @Description: file content
-->
<template>
  <div class="menuManagement">
    <el-form ref="ruleForm" :inline="true">
      <el-form-item>
        <el-select v-model="status" placeholder="请选择">
          <el-option
            v-for="(item,index) in CONST.STATUS_LIST"
            :key="index"
            :label="item.statusName"
            :value="item.statusCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input maxlength="50" v-model="keyWord" placeholder="输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getMenuList()">查询</el-button>
      </el-form-item>
      <el-form-item class="pageright">
        <el-button type="primary" @click="menuAdd">添加菜单</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table
        :data="tableData"
        row-key="functionId"
        style="width: 100%;margin-bottom: 20px;"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="functionId" label="ID" width="180"></el-table-column>
        <el-table-column prop="functionName" label="菜单名称" width="180"></el-table-column>
        <el-table-column prop="permissionCode" label="权限标识" width="180"></el-table-column>
        <el-table-column prop="resourceUrl" label="组件路径" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" width="180">
          <template slot-scope="scope">
            <span>{{CONST.STATUS[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column fixed="right" label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="menuPut(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="menuAdd(scope.row)">新增</el-button>
            <el-button type="text" size="small" @click="deleteList(scope.row.functionId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <tl-add-menu
      :title="title"
      :exist.sync="dialogVisible"
      v-if="dialogVisible"
      :menuName="menuName"
      :parentId="parentId"
      :menuData="menuData"
      @getMenuList="getMenuList"
    ></tl-add-menu>
  </div>
</template>

<script>
import addMenu from './components/addMenu';
import Server from './server';
import CONST from './const';

const server = new Server();
export default {
  name: 'menuManagement',
  components: {
    'tl-add-menu': addMenu,
  },
  data() {
    return {
      title: '',
      menuName: '',
      CONST,
      server,
      status: '',
      keyWord: '',
      tableData: [],
      dialogVisible: false,
      parentId: '',
      menuData: '',
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    getMenuList() {
      this.server.MenuList({
        functionName: this.keyWord,
        status: this.status,
      })
        .then((res) => {
          console.log(res);
          this.tableData = res.data;
        });
    },
    menuAdd(row) {
      this.dialogVisible = true;
      this.title = '新增';
      this.parentId = row.functionId;
      this.menuData = '';
      this.menuName = row.functionName;
    },
    menuPut(row) {
      this.dialogVisible = true;
      this.title = '编辑';
      this.menuName = row.functionName;
      this.menuData = row;
    },
    deleteById(id) {
      this.server.deleteById({ functionId: id }).then((res) => {
        if (res.code == 200) {
          this.getMenuList();
          this.$message.success('删除成功');
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    deleteList(id) {
      this.$confirm('是否确认删除该数据，删除将无法恢复', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.deleteById(id);
      });
    },
  },
};
</script>
<style  scoped>
.menu-table {
  display: flex;
  flex-direction: row;
}
.menuTable {
  display: flex;
  flex-direction: row;
  height: 50px;
  line-height: 50px;
}
.pageright {
  float: right;
}
</style>