<template>
  <el-dialog
    @click.native="closeshowMember"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :append-to-body="true"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
    class="tl-dialog"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      :label-position="labelPosition"
      class="tl-form"
    >
      <el-form-item label="角色编号" prop="roleCode">
        <el-input
          maxlength="64"
          v-model="form.roleCode"
          placeholder="请输入角色编号"
          class="tl-input"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          maxlength="64"
          v-model="form.roleName"
          placeholder="请输入角色名称"
          class="tl-input"
        ></el-input>
      </el-form-item>
      <el-form-item label="菜单权限" v-if="!rouleType">
        <div class="menuTreeList">
          <div class="list" v-for="(item, index) in menuTreeList" :key="index">
            <span>{{ item.data.functionName }}</span>
            <i class="el-icon-error" @click.stop="clearNode(item)"></i>
          </div>
          <div class="postMenu">
            <el-tree
              @check-change="handleCheckChange"
              ref="treeMenu"
              show-checkbox
              :data="data"
              :props="{
                multiple: true,
                id: 'functionId',
                children: 'children',
                label: 'functionName',
              }"
              node-key="functionId"
            ></el-tree>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" class="tl-btn amt-bg-slip"
        >确定</el-button
      >
      <el-button plain @click="close" class="tl-btn amt-border-fadeout"
        >取 消</el-button
      >
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
    roleInfo: {
      type: [Object, String],
      required: false,
    },
  },
  data() {
    return {
      server,
      labelPosition: 'left',
      menuTreeList: [],
      selectArr: [],
      list: [],
      showMenu: false,
      form: {
        roleCode: '',
        roleName: '',
        functionList: [],
      },
      dialogTableVisible: false,
      dialogVisible: false,
      data: [],
      selectList: [],
      rules: {
        roleCode: [
          { required: true, message: '请输入角色编号', trigger: 'blur' },
          {
            pattern: /^[0-9a-zA-Z]+$/,
            message: '请输入数字或者英文字母',
            trigger: 'blur',
          },
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
    getqueryMenu() {
      this.server.listTenantFuncation()
        .then((res) => {
          this.data = res.data;
        });
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // eslint-disable-next-line no-unused-expressions
          this.addRole();
        } else {
          return false;
        }
      });
    },
    addRole() {
      const { form } = this;
      this.form.functionList = this.list.map((item) => ({ functionId: item }));
      form.roleType = 'CREATION';
      this.server.addRole(form).then((res) => {
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