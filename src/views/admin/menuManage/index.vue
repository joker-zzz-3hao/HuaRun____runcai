<template>
  <div class="menuManagement">
    <div class="operating-area">
      <div class="page-title">菜单管理</div>
      <div class="operating-panel">
        <el-select
          v-model="status"
          :popper-append-to-body="false"
          placeholder="请选择"
          @change="getMenuList"
          clearable
        >
          <el-option
            v-for="(item,index) in CONST.STATUS_LIST"
            :key="index"
            :label="item.statusName"
            :value="item.statusCode"
          ></el-option>
        </el-select>
        <el-input
          maxlength="64"
          @keyup.enter.native="getMenuList"
          v-model="keyWord"
          placeholder="输入菜单名称"
          class="tl-input-search"
        >
          <i class="el-icon-search" slot="prefix" @click="getMenuList"></i>
        </el-input>

        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="menuAdd"
          class="tl-btn amt-bg-slip"
        >添加菜单</el-button>
      </div>
    </div>
    <tl-crcloud-table :isPage="false">
      <div slot="tableContainer">
        <el-table
          :data="tableData"
          row-key="functionId"
          style="width: 100%;"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column prop="functionId" label="ID"></el-table-column>
          <el-table-column prop="functionCode" label="菜单编码">
            <template slot-scope="scope">
              <span v-if="scope.row.functionCode">{{scope.row.functionCode}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
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
          <el-table-column prop="functionEvent" label="事件名">
            <template slot-scope="scope">
              <span v-if="scope.row.functionEvent">{{scope.row.functionEvent}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model.trim="scope.row.status"
                :active-text="scope.row.status=='Y'?'启用':'禁用'"
                active-value="Y"
                inactive-value="N"
                @change="addOrUpdate(scope.row)"
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
              <el-button type="text" size="small" @click="menuPut(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="menuAdd(scope.row)">新增</el-button>
              <el-button type="text" size="small" @click="deleteList(scope.row.functionId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </tl-crcloud-table>
    <tl-add-menu
      :title="title"
      :exist.sync="dialogVisible"
      v-if="dialogVisible"
      :menuName="menuName"
      :parentId="parentId"
      :menuData="menuData"
      @getMenuList="getMenuList"
    ></tl-add-menu>
    <tl-put-menu
      :title="title"
      :exist.sync="dialogVisiblePut"
      v-if="dialogVisiblePut"
      :menuName="menuName"
      :parentId="parentId"
      :menuData="menuData"
      @getMenuList="getMenuList"
    ></tl-put-menu>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import global from '@/mixin/global';
import addMenu from './components/addMenu';
import putMenu from './components/putMenu';
import Server from './server';
import CONST from './const';

const server = new Server();
export default {
  name: 'menuManagement',
  components: {
    'tl-add-menu': addMenu,
    'tl-crcloud-table': crcloudTable,
    'tl-put-menu': putMenu,
  },
  mixins: [global],
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
      dialogVisiblePut: false,
      parentId: '',
      menuData: '',
    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    addOrUpdate(row) {
      this.server.addOrUpdate({
        functionId: row.functionId,
        status: row.status,
      }).then((res) => {
        if (res.code == 200) {
          this.getMenuList();
        }
      });
    },
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
      this.dialogVisiblePut = true;
      this.title = '编辑';
      this.menuName = row.functionName;
      this.parentId = row.parentId;
      this.menuData = JSON.parse(JSON.stringify(row));
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
      this.$xconfirm({
        title: '您是否确定需要移除？',
        content: '',
      }).then(() => {
        this.deleteById(id);
      });
    },
    statusList(row) {
      this.$confirm('是否确认修改状态', '状态确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.addOrUpdate(row);
      }).catch(() => {
        this.getMenuList();
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