<!--
 * @Author: 许志鹏
 * @Date: 2020-08-11 14:28:43
 * @Description: file content
-->
<template>
  <div>
    <el-collapse>
      <el-collapse-item v-for="(item,index) in list" :key="index">
        <template slot="title" :name="item.functionId">
          <div class="menu-tr" style="width:100px">{{item.functionCode}}</div>
          <div class="menu-tr" style="width:100px">{{item.functionName}}</div>
          <div class="menu-tr" style="width:50px">{{item.functionSequence}}</div>
          <div class="menu-tr" style="width:200px">{{item.permissionCode}}</div>
          <div class="menu-tr" style="width:200px">{{item.resourceUrl}}</div>
          <div class="menu-tr" style="width:100px">{{CONST.STATUS[item.status]}}</div>
          <div class="menu-tr" style="width:300px">{{item.updateTime}}</div>
          <div class="menu-tr" style="width:300px">
            <el-button type="text" @click="menuPut(item)">修改</el-button>
            <el-button type="text" @click="Addmenu(item)">新增</el-button>
            <el-button type="text" @click="deleteList(item.functionId)">删除</el-button>
          </div>
        </template>
        <template v-if="item.children">
          <list
            :list="item.children"
            @showForm="Addmenu"
            @menuPut="menuPut"
            @deleteList="deleteList"
          ></list>
        </template>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import CONST from '../const';
import Server from '../server';

const server = new Server();
export default {
  name: 'List',
  props: {
    list: Array,
  },
  data() {
    return {
      server,
      CONST,
    };
  },
  methods: {
    Addmenu(row) {
      this.$emit('showForm', row);
    },
    menuPut(row) {
      this.$emit('menuPut', row);
    },
    deleteById(id) {
      this.server.deleteById({ functionId: id }).then((res) => {
        if (res.code == 200) {
          this.$emit('getMenuList');
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
