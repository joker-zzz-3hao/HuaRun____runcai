/* eslint-disable indent */
/* eslint-disable space-unary-ops */
export default {
  methods: {
    // 密码校验
    validatePwd(rule, value, callback) {
      if (!value) {
        callback('请输入密码');
      } else if (value.length < 8 || value.length > 32) {
        callback('长度为8-32个字符');

        /* eslint no-useless-escape:off */
      } else if (!/^(?![a-z]+$)(?!\d+$)(?![^\w\s]+$)\S+$/i.test(value)) {
        callback('数字、大小写字母及特殊字符至少包含两种');
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback('不支持中文');
      } else {
        if (this.formData.confirmPwd !== '') {
          this.$refs.userForm.validateField('confirmPwd');
        }
        callback();
      }
    },
    // 注册确认密码校验
    validateConfirmPwd(rule, value, callback) {
      if (!value) {
        callback('请确认密码');
      } else if (this.formData.loginPwd != value) {
        callback('两次输入密码必须保持一致');
      } else {
        callback();
      }
    },
    // 注册确认密码校验
    validateNewConfirmPwd(rule, value, callback) {
      if (!value) {
        callback('请确认密码');
      } else if (this.formData.newPwd != value) {
        callback('两次输入密码必须保持一致');
      } else {
        callback();
      }
    },
    // 邮箱校验
    validateEmail(rule, value, callback) {
      if (!value) {
        callback('请输入邮箱');
      } else if (
        !
        /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
        .test(value)) {
        callback('邮箱格式不正确');
      } else {
        callback();
      }
    },
    // 手机号校验
    validateInsideMobile(rule, value, callback) {
      if (!value) {
        callback('请输入手机号');
      } else if (!/^[1][3456789][0-9]{9}$/
        .test(value)) {
        callback('手机号格式不正确');
      } else {
        if (this.formData.loginPwd) {
          this.$refs.userForm.validateField('loginPwd');
        }
        callback();
      }
    },
    // 校验账号
    validateAccount(rule, value, callback) {
      if (!value) {
        callback('请输入账号');
      } else if (this.server.judgeUser && value != this.initUserAccount) {
        this.server.judgeUser({
          userAccount: value,
        }).then((res) => {
          if (res.code == 200 && res.data == 'Y') {
            callback('该账号已被使用');
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    },
  },
};
