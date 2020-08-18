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
        <el-input maxlength="64" v-model="keyWord" placeholder="输入菜单名称">
          <el-button slot="prepend" icon="el-icon-search" @click="getMenuList()"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item class="pageright">
        <el-button type="primary" @click="menuAdd">添加菜单</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table
        :data="tableData"
        row-key="functionId"
        style="width: 100%;"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="functionId" label="ID"></el-table-column>
        <el-table-column prop="functionName" label="菜单名称">
          <template slot-scope="scope">
            <span v-if="scope.row.functionName">{{scope.row.functionName}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="permissionCode" label="权限标识">
          <template slot-scope="scope">
            <span v-if="scope.row.permissionCode">{{scope.row.permissionCode}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="resourceUrl" label="组件路径">
          <template slot-scope="scope">
            <span v-if="scope.row.resourceUrl">{{scope.row.resourceUrl}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model.trim="scope.row.status"
              active-text="启用"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span v-if="scope.row.createTime">{{scope.row.createTime}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
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
  mounted() {
    this.getMenuList();
  },
  methods: {
    getMenuList() {
      this.server.queryMenu({
        functionName: this.keyWord,
        status: this.status,
      })
        .then((res) => {
          if (res.code == 200) {
            this.tableData = res.data;
          } else {
            this.$message.error(res.msg);
          }
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
.pageright {
  float: right;
}
</style>