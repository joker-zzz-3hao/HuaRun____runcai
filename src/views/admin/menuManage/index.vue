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
    <div class="menuTable">
      <div class="menuth" style="width:100px">ID</div>
      <div class="menuth" style="width:100px">菜单名称</div>
      <div class="menuth" style="width:50px">排序</div>
      <div class="menuth" style="width:200px">权限标识</div>
      <div class="menuth" style="width:200px">组件路径</div>
      <div class="menuth" style="width:100px">状态</div>
      <div class="menuth" style="width:300px">创建时间</div>
      <div class="menuth" style="width:300px">操作</div>
    </div>
    <tl-recurrence-list
      :list="tableData"
      @showForm="menuAdd"
      @menuPut="menuPut"
      @getMenuList="getMenuList"
    ></tl-recurrence-list>
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
import recurrenceList from './components/recurrenceList';
import CONST from './const';

const server = new Server();
export default {
  name: 'menuManagement',
  components: {
    'tl-add-menu': addMenu,
    'tl-recurrence-list': recurrenceList,
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