export default {
  data() {
    return {};
  },
  methods: {
    validateNickName(rule, value, callback) {
      if (value == '' || value == undefined || value == null) {
        callback('请输入原始密码');
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback('不支持设置中文');
      } else if (value.length < 8 || value.length > 32) {
        callback('密码长度不够，请输入8-32个字符');
      } else if (!/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[~!@#$%^&*()])/.test(value)) {
        callback('只支持设置以大小写字母、数字和包含特殊字符~!@#$%^&*()为组合的密码');
      } else if (!/^([0-9a-zA-Z~!@#$%^&*()]*$)/g.test(value)) {
        callback('只支持包含以下特殊字符~!@#$%^&*()');
      } else {
        callback();
      }
    },
    validateLoginPwd(rule, value, callback) {
      if (value == '' || value == undefined || value == null) {
        callback('请输入原始密码');
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback('不支持设置中文');
      } else if (value.length < 8 || value.length > 32) {
        callback('密码长度不够，请输入8-32个字符');
      } else if (!/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[~!@#$%^&*()])/.test(value)) {
        callback('只支持设置以大小写字母、数字和包含特殊字符~!@#$%^&*()为组合的密码');
      } else if (!/^([0-9a-zA-Z~!@#$%^&*()]*$)/g.test(value)) {
        callback('只支持包含以下特殊字符~!@#$%^&*()');
      } else {
        callback();
      }
    },
    validateConfirmPwd(rule, value, callback) {
      if (value == '' || value == undefined || value == null) {
        callback('请输入确认密码');
      } else if (value != this.ruleForm.newPwd) {
        callback('两次输入的密码不一致，请重新输入');
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback('不支持设置中文');
      } else if (value.length < 8 || value.length > 32) {
        callback('密码长度不够，请输入8-32个字符');
      } else if (!/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[~!@#$%^&*()])/.test(value)) {
        callback('只支持设置以大小写字母、数字和包含特殊字符~!@#$%^&*()为组合的密码');
      } else if (!/^([0-9a-zA-Z~!@#$%^&*()]*$)/g.test(value)) {
        callback('只支持包含以下特殊字符~!@#$%^&*()');
      } else {
        callback();
      }
    },
    validateNewPwd(rule, value, callback) {
      if (!value) {
        callback('请输入新密码');
      } else {
        callback();
      }
    },
    // 目标o校验
    validateObjectName(rule, value, callback) {
      console.log('validateObjectName', value);
      if (!value) {
        callback('请输入目标名称');
      } else if (value.length > 50) {
        callback('不能超过50个字符');
      } else {
        callback();
      }
    },
    // 关键结果kr校验
    validateKRName(rule, value, callback) {
      console.log('validateKRName', rule);
      value = this.getValue(rule);
      if (!value) {
        callback('请填写关键结果KR名称');
      } else if (value.length > 50) {
        callback('不能超过100个字符');
      } else {
        callback();
      }
    },
    getValue(rule) {
      const model = this.formData;
      let path = rule.field;
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.');
      }
      return this.getPropByPath(model, path, true).v;
    },
    getPropByPath(obj, path, strict) {
      let tempObj = obj;
      path = path.replace(/\[(\w+)\]/g, '.$1');
      path = path.replace(/^\./, '');

      const keyArr = path.split('.');
      let i = 0;
      for (let len = keyArr.length; i < len - 1; i += 1) {
        if (!tempObj && !strict) break;
        const key = keyArr[i];
        if (key in tempObj) {
          tempObj = tempObj[key];
        } else {
          if (strict) {
            throw new Error('please transfer a valid prop path to form item!');
          }
          break;
        }
      }
      return {
        o: tempObj,
        k: keyArr[i],
        v: tempObj ? tempObj[keyArr[i]] : null,
      };
    },
  },
};