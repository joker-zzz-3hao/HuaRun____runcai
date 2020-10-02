<template>
  <div class="system-user-management">
    <div>
      <div>系统用户管理</div>
    </div>
    <div>
      <el-form class="tl-form" v-if="hasPower('sys_auth')">
        <el-form-item label="用户账号">
          <span>{{ userInfo.userAccount }}</span>
        </el-form-item>
        <el-form-item label="用户角色">
          <span>系统管理员</span>
        </el-form-item>
        <el-form-item label="账号类型">
          <span>内置用户</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{
            dateFormat("YYYY-mm-dd HH:MM:SS", new Date(userInfo.createTime))
          }}</span>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetPwd" class="tl-btn amt-border-fadeout" plain
            >修改密码</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      ref="createDepart"
      class="tl-dialog"
      v-if="visible"
      :append-to-body="true"
      :visible="visible"
      @close="close"
      title="修改密码"
      :close-on-click-modal="false"
    >
      <el-form
        :model="formData"
        ref="resetForm"
        class="tl-form"
        label-width="90px"
      >
        <el-form-item
          label="原始密码"
          prop="loginPwd"
          :rules="[{ required: true, validator: validatePwd, trigger: 'blur' }]"
        >
          <el-input
            v-model.trim="formData.loginPwd"
            show-password
            class="tl-input"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          class="tl-input"
          prop="newPwd"
          :rules="[
            { required: true, validator: validateNewPwd, trigger: 'blur' },
          ]"
        >
          <el-input
            v-model.trim="formData.newPwd"
            show-password
            class="tl-input"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPwd"
          :rules="[
            {
              required: true,
              validator: validateNewConfirmPwd,
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model.trim="formData.confirmPwd"
            show-password
            class="tl-input"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          :loading="loading"
          @click="save"
          class="tl-btn amt-bg-slip"
          type="primary"
          >确认</el-button
        >
        <el-button
          :disabled="loading"
          @click="close"
          class="tl-btn amt-border-fadeout"
          plain
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cryptojs from '@/lib/cryptojs';
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
      Cryptojs,
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
        confirmPwd: '',
        userAccount: '',
      },
    };
  },
  created() {
    this.searchList();
  },
  methods: {
    searchList() {
      if (this.hasPower('sys-sysuser-query')) {
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
      }
    },

    resetPwd() {
      this.visible = true;
    },
    save() {
      this.formData.userAccount = this.userInfo.userAccount;
      const params = {
        userAccount: 'admin',
        loginPwd: this.Cryptojs.encrypt(this.formData.loginPwd),
        newPwd: this.Cryptojs.encrypt(this.formData.newPwd),
        userId: this.userInfo.userId,
      };
      this.$refs.resetForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.server.editPwd(params).then((res) => {
            if (res.code == 200) {
              this.formData.loginPwd = '';
              this.formData.newPwd = '';
              this.formData.confirmPwd = '';
              this.$message.success('重置密码成功');
              this.visible = false;
            }
            this.loading = false;
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