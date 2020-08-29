export default {
  methods: {
    validateWorkContent(rule, value, callback) {
      debugger;
      if (!value) {
        callback('请填写工作项');
      } else {
        callback();
      }
    },
    validateProjectId(rule, value, callback) {
      if (!value) {
        callback('请选择关联项目');
      } else {
        callback();
      }
    },
    validateSelectedOkr(rule, value, callback) {
      if (!value) {
        callback('请选择支撑项');
      } else {
        callback();
      }
    },
  },
};
