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
            <dd class="tl-input-account" :class="{'amt-txt-slip': isInputAccount}">
              <el-input
                placeholder="请输入账户名"
                v-model="input"
                clearable
                @focus="changeFocus('input-txt')"
                @blur="loseFocus"
                @input="animationAccound"
                ref="input-txt"
                class="tl-input-line"
                :class="{'amt-line-elastic': focusName == 'input-txt'}"
              ></el-input>
            </dd>
            <dd class="tl-input-pwd" :class="{'amt-txt-slip': isInputPwd}">
              <el-input
                type="password"
                placeholder="请输入密码"
                v-model="input2"
                clearable
                @focus="changeFocus('input-pwd')"
                @blur="loseFocus"
                @input="animationPwd"
                ref="input-pwd"
                class="tl-input-line"
                :class="{'amt-line-elastic': isInputPwd}"
              ></el-input>
            </dd>
            <dd>
              <el-button type="primary" class="tl-btn amt-bg-slip">
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
    };
  },
  computed: {

  },
  methods: {
    changeFocus(ref) {
      this.focusName = ref;
    },
    loseFocus() {
      this.focusName = '';
    },
    animation(ref) {
      this.changeName = ref;
    },
  },
};
</script>