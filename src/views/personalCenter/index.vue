<template>
  <div class="personal-center">
    <div class="cont-wrap">
      <div class="operating-area">
        <div class="page-title">基本设置</div>
      </div>
      <div class="cont-area">
        <div class="cont-panel">
          <div class="user-info">
            <tl-upload
              :isUploadHead="true"
              :imgWidth="199"
              :imgHeight="199"
              :files="[img]"
              @change="returnParams"
            ></tl-upload>
          </div>
          <div class="dl-list">
            <dl class="dl-item">
              <dt>账号</dt>
              <dd>{{ userInfo.userAccount }}</dd>
            </dl>
            <dl class="dl-item">
              <dt>姓名</dt>
              <dd>{{ userInfo.userName }}</dd>
            </dl>
            <dl class="dl-item">
              <dt>部门</dt>
              <dd>{{ userInfo.orgName }}</dd>
            </dl>
            <dl class="dl-item">
              <dt>手机</dt>
              <dd>{{ userInfo.userMobile }}</dd>
            </dl>
            <dl class="dl-item">
              <dt>邮箱</dt>
              <dd>{{ userInfo.userMail }}</dd>
            </dl>
            <dl class="dl-item">
              <dt>密码</dt>
              <dd v-if="userInfo.userType == '2' || userInfo.userType == '0'">
                <el-button
                  type="primary"
                  @click="showSetPassword"
                  class="tl-btn amt-bg-slip"
                  >修改密码</el-button
                >
              </dd>
              <dd v-if="userInfo.userType == '1'">
                您当前使用的账号与密码均为LDAP账号与密码，如需修改将跳转至LDAP密码修改处
              </dd>
            </dl>
          </div>
        </div>
        <div class="operating-box">
          <!-- <el-button type="primary" class="tl-btn amt-bg-slip"
            >保存更改</el-button
          > -->
        </div>
      </div>
    </div>
    <el-dialog
      title="修改密码"
      @close="dialogVisible = false"
      :visible="dialogVisible"
      v-if="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      class="tl-dialog"
    >
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="tl-form"
      >
        <el-form-item label="原始密码" prop="loginPwd">
          <el-input
            v-model.trim="ruleForm.loginPwd"
            show-password
            class="tl-input"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPwd"
          :rules="[
            { trigger: 'blur', validator: validateLoginPwd, required: true },
          ]"
        >
          <el-input
            v-model.trim="ruleForm.newPwd"
            show-password
            class="tl-input"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPwd"
          :rules="[
            { trigger: 'blur', validator: validateConfirmPwd, required: true },
          ]"
        >
          <el-input
            v-model.trim="ruleForm.confirmPwd"
            show-password
            class="tl-input"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          plain
          @click="dialogVisible = false"
          class="tl-btn amt-border-fadeout"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="resetPassword"
          class="tl-btn amt-bg-slip"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import validateMixin from '@/mixin/validateMixin';
import Cryptojs from '@/lib/cryptojs';
import { loginOut } from '@/lib/util';
import upload from '@/components/uploadImg';
import Server from './server';

const server = new Server();

export default {
  name: 'personalCenter',
  mixins: [validateMixin],
  data() {
    return {
      Cryptojs,
      server,
      dialogVisible: false,
      ruleForm: {
        loginPwd: '',
        newPwd: '',
        confirmPwd: '',
      },
      img: {
        url: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
        resourceId: '',
      },
    };
  },
  components: {
    'tl-upload': upload,
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  mounted() {
    if (this.userInfo.headUrl) {
      this.img = {
        url: this.userInfo.headUrl,
        resourceId: '',
      };
    }
  },
  methods: {
    ...mapMutations('common', ['setUserInfo']),
    showSetPassword() {
      this.dialogVisible = true;
      this.ruleForm.loginPwd = '';
      this.ruleForm.newPwd = '';
      this.ruleForm.confirmPwd = '';
      // this.$refs.ruleForm.resetFields();
    },
    resetPassword() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.server.updateResetPassword({
            userId: this.userInfo.userId,
            loginPwd: this.Cryptojs.encrypt(this.ruleForm.loginPwd),
            newPwd: this.Cryptojs.encrypt(this.ruleForm.newPwd),
          }).then((res) => {
            if (res.code == '200') {
              this.$message.success('修改密码成功');
              loginOut();
              this.dialogVisible = false;
            }
          });
        }
      });
    },
    returnParams(params) {
      console.log(111);
      console.log(params);
      if (!params.resourceUrl) {
        return;
      }
      this.server.queryByTenantIdAndUserId().then((res) => {
        if (res.code == '200') {
          this.setUserInfo(res.data);
          this.img = {
            url: this.userInfo.headUrl,
            resourceId: '',
          };
        }
      });
    },
  },
};
</script>