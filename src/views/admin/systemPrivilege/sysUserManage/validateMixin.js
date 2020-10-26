export default {
  methods: {
    // 密码校验
    validatePwd(rule, value, callback) {
      if (!value) {
        callback('请输入密码');
      } else if (value.length < 8 || value.length > 32) {
        callback('长度为8-32个字符');

        /* eslint no-useless-escape:off */
      } else if (!/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[~!@#$%^&*()])/.test(value)) {
        callback('只支持设置以大小写字母、数字和包含特殊字符~!@#$%^&*()为组合的密码');
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback('不支持中文');
      } else {
        callback();
      }
    },
    // 密码校验
    validateNewPwd(rule, value, callback) {
      if (!value) {
        callback('请输入密码');
      } else if (value.length < 8 || value.length > 32) {
        callback('长度为8-32个字符');

        /* eslint no-useless-escape:off */
      } else if (!/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[~!@#$%^&*()])/.test(value)) {
        callback('只支持设置以大小写字母、数字和包含特殊字符~!@#$%^&*()为组合的密码');
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback('不支持中文');
      } else {
        if (this.formData.confirmPwd !== '') {
          this.$refs.resetForm.validateField('confirmPwd');
        }
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
  },
};
