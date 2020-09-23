<template>
  <el-drawer
    @click.native="closeshowMember"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
    :modal="false"
    :wrapperClosable="false"
    class="tl-drawer"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="tl-form"
      style="width:400px"
    >
      <el-form-item label="角色编号" prop="roleCode">
        <em>{{form.roleCode}}</em>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          maxlength="64"
          style="width:200px"
          v-model="form.roleName"
          placeholder="请输入角色名称"
          class="tl-input"
        ></el-input>
      </el-form-item>
      <el-form-item label="菜单权限">
        <div class="menuTreeList">
          <div class="list" v-for="(item,index) in menuTreeList" :key="index">
            <span>{{item.data.functionName}}</span>
            <i class="el-icon-error" @click.stop="clearNode(item)"></i>
          </div>
          <div class="postMenu">
            <el-tree
              @check-change="handleCheckChange"
              ref="treeMenu"
              :data="data"
              show-checkbox
              :props="{ multiple: true, id:'functionId', label:'functionName',children:'children' }"
              node-key="functionId"
            ></el-tree>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div class="operating-box">
      <el-button type="primary" @click="submitForm" class="tl-btn amt-bg-slip">保存</el-button>
      <el-button plain @click="close" class="tl-btn amt-border-fadeout">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'putRole',
  props: {
    title: {
      type: String,
      required: true,
    },
    rouleType: {
      type: Boolean,
      required: true,
    },
    roleInfo: {
      type: [Object, String],
      required: false,
    },
  },
  data() {
    return {
      list: [],
      server,
      menuTreeList: [],
      selectArr: [],
      showMenu: false,
      selectList: [],
      form: {
        roleCode: '',
        roleName: '',
        functionList: [],
      },
      dialogTableVisible: false,
      dialogVisible: false,
      data: [],
      rules: {
        roleCode: [
          { required: true, message: '请输入角色编号', trigger: 'blur' },
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            pattern: /^[\u0391-\uFFE5A-Za-z]+$/,
            message: '只允许输入中文或者字母',
            trigger: 'blur',
          },
        ],
      },
    };
  },

  mounted() {
    this.dialogTableVisible = true;

    this.getqueryMenu();
  },
  methods: {
    handleCheckChange() {
      this.list = this.$refs.treeMenu.getCheckedKeys();
    },
    // 获取菜单功能树形结构
    getqueryMenu() {
      this.server.listTenantFuncation()
        .then((res) => {
          this.data = res.data;
          this.getRole();
        });
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.updateRole();
        } else {
          return false;
        }
      });
    },
    getRole() {
      this.server.getRole({
        roleId: this.roleInfo.roleId,
        roleCode: this.roleInfo.roleCode,
      }).then((res) => {
        if (res.code == 200) {
          this.form = res.data;
          this.$refs.treeMenu.setCheckedKeys(res.data.functionMenuTree);
        }
      });
    },
    updateRole() {
      const { form } = this;
      form.functionList = this.list.map((item) => ({ functionId: item, roleId: this.roleInfo.roleId }));
      form.roleType = 'CREATION';
      form.roleId = this.roleInfo.roleId;
      this.server.updateRole(form).then((res) => {
        if (res.code == 200) {
          this.$emit('getSearchList');
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
  },
};
</script>