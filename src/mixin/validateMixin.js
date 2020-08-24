export default {
  data() {
    return {};
  },
  methods: {
    validateNickName(rule, value, callback) {
      if (!value) {
        callback('请输入昵称');
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
      console.log('validateKRName', value);
      if (!value) {
        callback('请填写关键结果KR名称');
      } else if (value.length > 50) {
        callback('不能超过100个字符');
      } else {
        callback();
      }
    },
  },
};