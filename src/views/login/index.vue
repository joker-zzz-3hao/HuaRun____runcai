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
                v-model="input"
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
                v-model="input2"
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
              <el-button type="primary" @click="hasState" class="tl-btn amt-bg-slip">
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
export default {
  name: 'login',
  components: {
  },
  data() {
    return {
      input: '',
      input2: '',
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
  methods: {
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
    hasState() {
      this.isLoginError = true;
      this.isPwdError = true;
      this.focusName = '';
    },
    removeAccound() {
      this.input = '';
      this.focusName = '';
    },
    removePwd() {
      this.input2 = '';
      this.focusName = '';
    },
    mouseover(ref) {
      this.mouseRef = ref;
      console.log(`mouseover:${this.mouseRef}`);
    },
    mouseout() {
      this.mouseRef = '';
      console.log('mouseover:空');
    },
  },
};
</script>