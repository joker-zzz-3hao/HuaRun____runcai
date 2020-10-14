/* eslint-disable indent */
/* eslint-disable space-unary-ops */
export default {
  methods: {
    // 进度
    validateProcess(rule, value, callback) {
      if (!value) {
        callback('请填写进度');
      } else if (!/(^[0-9]\d*$)/.test(value)) {
        callback('只能填写正整数');
      } else if (value > 100) {
        callback('不能大于100');
      } else {
        callback();
      }
    },
    // 工时
    validateTime(rule, value, callback) {
      if (!value) {
        callback('请填写工时');
      } else if (!/^(\d{1,2}(\.[0-9]{1})?)$|^100$/.test(value)) {
        callback('请保留一位小数');
      } else if (value > 5) {
        callback('不能大于5');
      } else {
        callback();
      }
    },

  },
};
