export default {
  methods: {
    // 进度
    validateProcess(rule, value, callback) {
      if (!value) {
        callback('');
        this.processError = '进度';
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
        callback('');
        this.workTimeError = '工时';
      } else if (value > 100) {
        callback('工时不能超过100天');
      } else if (!/^(\d{1,2}(\.\d{1})?|100)$/.test(value)) {
        callback('请保留一位小数');
      } else if (value < 0.5) {
        callback('最小值为0.5');
      } else {
        callback();
      }
    },
    // 任务项
    validateWorkContent(rule, value, callback) {
      if (!value) {
        callback('');
        this.workItemError = '工作项';
      } else {
        callback();
      }
    },
    // 项目
    validateProject(rule, value, callback) {
      if (!value) {
        callback('');
        this.projectError = '项目';
      } else {
        callback();
      }
    },
    // 项目
    validateOkr(rule, value, callback) {
      if (!value) {
        callback('');
        this.OKRError = '支撑OKR/价值观';
      } else {
        callback();
      }
    },

  },
};
