<template>
  <div class="login">
    <div class="cont-wrap">
      <div class="login-info">
        <div class="box-wrap">
          <div class="login-info-title">
            <em>润才</em>
            <span>CR-Talent</span>
          </div>
          <dl>
            <dt>
              <em>LDAP</em>
              <span>帐号登录</span>
            </dt>
            <dd
              class="tl-input-account"
              :class="{'amt-txt-slip': isInputAccount,'is-error': isLoginError}"
            >
              <el-input
                placeholder="请输入账户名"
                v-model="loginName"
                @focus="changeFocus('input-txt')"
                @blur="loseFocus"
                @input="animationAccound"
                @mouseover.native="mouseover('input-txt')"
                @mouseout.native="mouseout('input-txt')"
                ref="input-txt"
                class="tl-input-line"
                :class="{'amt-line-elastic': focusName == 'input-txt'}"
              ></el-input>
              <div
                @click="removeAccound"
                @mouseover="mouseover('input-txt')"
                @mouseout="mouseout('input-txt')"
                class="remove-current"
              ></div>
              <!-- <ul class="state-info">
                <li @click="removeAccound" class="remove-current"></li>
                <li class="error-msg">
                  <span>您输入的账户名或密码有误！</span>
                  <i></i>
                </li>
              </ul>-->
              <div class="error-msg">您输入的账户名或密码有误！</div>
              <div class="prompt-info">账户名</div>
            </dd>
            <dd class="tl-input-pwd" :class="{'amt-txt-slip': isInputPwd,'is-error': isPwdError}">
              <el-input
                type="password"
                placeholder="请输入密码"
                v-model="loginPwd"
                @focus="changeFocus('input-pwd')"
                @blur="loseFocus"
                @input="animationPwd"
                @mouseover.native="mouseover('input-pwd')"
                @mouseout.native="mouseout('input-pwd')"
                ref="input-pwd"
                class="tl-input-line"
                :class="{'amt-line-elastic': focusName == 'input-pwd'}"
              ></el-input>
              <div
                @click="removePwd"
                @mouseover="mouseover('input-pwd')"
                @mouseout="mouseout('input-pwd')"
                class="remove-current"
              ></div>
              <!-- <ul class="state-info">
                <li @click="removePwd" class="remove-current"></li>
                <li class="error-msg">
                  <span></span>
                  <i></i>
                </li>
              </ul>-->
              <div class="prompt-info">密码</div>
            </dd>
            <dd>
              <el-button type="primary" @click="login" class="tl-btn amt-bg-slip">
                <em>登</em>
                <em>录</em>
              </el-button>
            </dd>
            <dd>
              <el-checkbox v-model="checked" class="tl-checkbox">记住登录账号</el-checkbox>
            </dd>
          </dl>
        </div>
      </div>
      <div class="login-inset"></div>
    </div>
  </div>
</template>

<script>
import {
  localSave,
} from '@/lib/util';
import Server from './server';

const server = new Server();

export default {
  name: 'login',
  components: {
  },
  data() {
    return {
      server,
      loginName: '',
      loginPwd: '',
      checked: true,
      focusName: '',
      isInputAccount: false,
      isInputPwd: false,
      isLoginError: false,
      isPwdError: false,
      mouseRef: '',
    };
  },
  computed: {

  },
  mounted() {},
  methods: {
    login() {
      const self = this;
      // self.isLoginError = true;
      // self.isPwdError = true;
      self.focusName = '';
      self.server.login({
        ciphertext: '',
        loginName: self.loginName,
        loginPwd: self.loginPwd,
      }).then((res) => {
        if (res.code == '200') {
          localSave('token', res.data);
          self.$router.push({
            name: 'overview',
          });
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    changeFocus(ref) {
      this.focusName = ref;
      console.log(11111111);
    },
    loseFocus() {
      if (this.mouseRef == '') {
        this.focusName = '';
      }
      this.isInputAccount = false;
      this.isInputPwd = false;
    },
    animationAccound() {
      this.isInputAccount = true;
      this.isLoginError = false;
    },
    animationPwd() {
      this.isInputPwd = true;
      this.isPwdError = false;
    },
    removeAccound() {
      this.loginName = '';
      this.focusName = '';
    },
    removePwd() {
      this.loginPwd = '';
      this.focusName = '';
    },
    mouseover(ref) {
      this.mouseRef = ref;
    },
    mouseout() {
      this.mouseRef = '';
    },
  },
};
</script>