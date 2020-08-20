<template>
  <div class="system-user-management">
    <div>
      <div>系统用户管理</div>
    </div>
    <div>
      <el-form>
        <el-form-item label="用户在账号">
          <span>{{userInfo.userAccount}}</span>
        </el-form-item>
        <el-form-item label="用户角色">
          <span>超级管理员</span>
        </el-form-item>
        <el-form-item label="账号类型">
          <span>内置用户</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{userInfo.createTime}}</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-button @click="resetPwd">修改密码</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      ref="createDepart"
      v-if="visible"
      :append-to-body="true"
      :visible="visible"
      @close="close"
      title="修改密码"
      :close-on-click-modal="false"
    >
      <el-form :model="formData" ref="resetForm">
        <el-form-item
          label="原始密码"
          prop="loginPwd"
          :rules="[
          {required:true,validator: validatePwd,trigger:'blur'}]"
        >
          <el-input v-model.trim="formData.loginPwd" show-password></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPwd"
          :rules="[{required:true,validator:validateNewPwd,trigger:'blur'}]"
        >
          <el-input v-model.trim="formData.newPwd" show-password></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPwd"
          :rules="[
          {required:true,validator: validateNewConfirmPwd,trigger:'blur'}]"
        >
          <el-input v-model.trim="formData.confirmPwd" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="save">确认</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Server from './server';
import validateMixin from './validateMixin';

const server = new Server();

export default {
  name: 'sysUserManage',
  mixins: [validateMixin],
  components: {
  },
  data() {
    return {
      server,
      loading: false,
      visible: false,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      userInfo: {},
      formData: {
        loginPwd: '',
        newPwd: '',
        userAccount: '',
      },
    };
  },
  created() {
    this.searchList();
  },
  methods: {
    searchList() {
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        userAccount: 'admin',
      };
      this.server.getUserLIst(params).then((res) => {
        if (res.code == 200) {
          this.userInfo = res.data;
        }
      });
    },

    resetPwd() {
      this.visible = true;
    },
    save() {
      this.formData.userAccount = this.userInfo.userAccount;
      this.$refs.resetForm.validate((valid) => {
        if (valid) {
          this.server.editPwd(this.formData).then((res) => {
            if (res.code == 200) {
              this.$message.success('重置密码成功');
            }
            this.visible = false;
          });
        }
      });
    },
    // 关闭弹窗
    close() {
      this.visible = false;
    },
  },
  watch: {

  },
};
</script>