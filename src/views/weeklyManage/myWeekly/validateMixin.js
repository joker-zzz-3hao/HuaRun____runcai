export default {
  methods: {
    // 进度
    validateProcess(rule, value, callback) {
      if (!value) {
        callback('请填写进度');
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
        callback('请填写工时');
        this.workTimeError = '工时';
      } else if (value > 100) {
        callback('最多100天');
      } else if (!/^(\d{1,2}(\.\d{1})?|100)$/.test(value)) {
        callback('保留一位小数');
      } else if (value < 0.5) {
        callback('最小值0.5');
      } else {
        callback();
      }
    },
    // 任务项
    validateWorkContent(rule, value, callback) {
      if (!value) {
        callback('请填写工作项');
        this.workItemError = '工作项';
      } else {
        callback();
      }
    },
    // 项目
    validateProject(rule, value, callback) {
      if (!value) {
        callback('请选择项目');
        this.projectError = '项目';
      } else {
        callback();
      }
    },
    // 项目
    validateOkr(rule, value, callback) {
      if (!value) {
        callback('请填写支撑OKR/价值观');
        this.OKRError = '支撑OKR/价值观';
      } else {
        callback();
      }
    },

  },
};
