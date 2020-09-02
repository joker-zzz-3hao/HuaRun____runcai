<template>
  <div class="personal-center">
    <div style="display:flex;">
      <div>
        <el-avatar
          v-if="userInfo.headerUrl"
          src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
        ></el-avatar>
        <div v-if="!userInfo.headerUrl">
          <tl-upload
            :isUploadHead="true"
            :imgWidth="199"
            :imgHeight="199"
            :files="[img]"
            @change="returnParams"
          ></tl-upload>
          <div @click="setHeader">设置图像</div>
        </div>
      </div>
      <div>
        <div>
          <span>账号：</span>
          <span>{{userInfo.userAccount}}</span>
        </div>
        <div>
          <span>姓名：</span>
          <span>{{userInfo.userName}}</span>
        </div>
        <div>
          <span>部门：</span>
          <span>{{userInfo.orgName}}</span>
        </div>
        <div>
          <span>手机：</span>
          <span>{{userInfo.userMobile}}</span>
        </div>
        <div>
          <span>邮箱：</span>
          <span>{{userInfo.userMail}}</span>
        </div>
        <div v-if="userInfo.userType == '2'">
          <el-button type="primary" @click="showSetPassword">修改密码</el-button>
        </div>
      </div>
    </div>
    <div v-if="userInfo.userType == '1'">您当前使用的账号与密码均为LDAP账号与密码，如需修改将跳转至LDAP密码修改处</div>
    <el-dialog title="修改密码" :visible="dialogVisible" width="30%" v-if="dialogVisible">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item
          label="原始密码"
          prop="loginPwd"
          :rules="[{trigger: 'blur',validator:validateLoginPwd,required:true}]"
        >
          <el-input v-model.trim="ruleForm.loginPwd" show-password></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPwd"
          :rules="[{trigger: 'blur',validator:validateLoginPwd,required:true}]"
        >
          <el-input v-model.trim="ruleForm.newPwd" show-password></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPwd"
          :rules="[{trigger: 'blur',validator:validateConfirmPwd,required:true}]"
        >
          <el-input v-model.trim="ruleForm.confirmPwd" show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetPassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
  methods: {
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
      if (!params.url) {
        return;
      }
      const param = {
        headUr: params.url,
        resourceId: params.resourceId,
      };
      this.server.uploadUserHead(param).then((response) => {
        if (response.code == 200) {
          this.$message.success('头像上传成功');
          this.init();
        }
      });
    },
    setHeader() {
    },
  },
};
</script>