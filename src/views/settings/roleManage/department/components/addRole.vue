<!--
 * @Author: 许志鹏
 * @Date: 2020-08-04 18:02:57
 * @Description: file content
-->
<template>
  <el-dialog
    @click.native="closeshowMember"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
    center
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="角色编号">
        <el-input style="width:320px" v-model="form.roleCode" placeholder="请输入角色编号"></el-input>
      </el-form-item>
      <el-form-item label="角色名称">
        <el-input style="width:320px" v-model="form.roleName" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="菜单权限" v-if="!rouleType">
        <el-tree
          :data="data"
          show-checkbox
          ref="treeMenu"
          node-key="id"
          @check="getCheckData"
          default-expand-all
          @check-change="handleCheckChange"
        ></el-tree>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm()">确定</el-button>
      <el-button @click="close()">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'home',
  props: {
    title: {
      type: String,
      required: true,
    },
    rouleType: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      server,
      form: {
        roleCode: '',
        roleName: '',
        menuTree: [],
      },
      dialogTableVisible: false,
      dialogVisible: false,
      data: [],
    };
  },

  mounted() {
    this.dialogTableVisible = true;
    this.getqueryMenu();
  },
  methods: {

    handleCheckChange() {
      const keys = this.$refs.treeMenu.getCheckedKeys();
      this.form.menuTree = keys.map((item) => ({ id: item }));
    },
    // 获取菜单功能树形结构
    getqueryMenu() {
      this.server.queryMenu()
        .then((res) => {
          this.data = this.getTreeList(res.data, true);
        });
    },
    // 递归修改符合element tree结构数据
    getTreeList(data, disabled) {
      if (data) {
        return data.map((item) => ({
          id: item.functionId,
          label: item.functionName,
          disabled: this.infoBool,
          children: this.getTreeList(item.children, disabled),
        }));
      }
    },
    submitForm() {
      const { form } = this;
      form.roleType = 'CREATION';
      this.server.addRole(form).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.closed();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    close() {
      this.dialogTableVisible = false;
    },
    closed() {
      this.$emit('update:exist', false);
    },
    showMember() {
      this.dialogVisible = !this.dialogVisible;
    },
    closeshowMember() {
      this.dialogVisible = false;
    },
    getCheckData() {

    },
  },
};
</script>
<style  scoped>
.addRoule {
  position: relative;
}
.roulemember {
  width: 100%;
  z-index: 99999999;
  position: absolute;
  left: 0;
  top: 50px;
  padding: 25px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
<style>
.selectMember .el-select-dropdown {
  display: none !important;
}
</style>