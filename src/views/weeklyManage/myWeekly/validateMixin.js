export default {
  data() {
    return {

      weekDataList: [
        {
          value: '0',
          label: '周一',
          id: 'zero',
          disabled: false,
          children: [{
            value: '1',
            id: 'zero_1',
            label: '上午',
            disabled: false,

          }, {
            value: '2',
            label: '下午',
            id: 'zero_2',
            disabled: false,

          }],
        },
        {
          value: '1',
          label: '周二',
          id: 'two',
          disabled: false,
          children: [{
            value: '1',
            label: '上午',
            id: 'two_1',
            disabled: false,

          }, {
            value: '2',
            label: '下午',
            id: 'two_2',
            disabled: false,

          }],
        },
        {
          value: '2',
          label: '周三',
          id: 'three',
          disabled: false,
          children: [{
            value: '1',
            label: '上午',
            id: 'three_1',
            disabled: false,

          }, {
            value: '2',
            label: '下午',
            id: 'three_2',
            disabled: false,

          }],
        },
        {
          value: '3',
          label: '周四',
          id: 'four',
          disabled: false,
          children: [{
            value: '1',
            label: '上午',
            id: 'four_1',
            disabled: false,

          }, {
            value: '2',
            label: '下午',
            id: 'four_2',
            disabled: false,

          }],
        },
        {
          value: '4',
          label: '周五',
          id: 'five',
          disabled: false,
          children: [{
            value: '1',
            label: '上午',
            id: 'five_1',
            disabled: false,

          }, {
            value: '2',
            label: '下午',
            id: 'five_2',
            disabled: false,

          }],
        },
        {
          value: '5',
          label: '周六',
          id: 'six',
          children: [{
            value: '1',
            label: '上午',
            id: 'six_1',
            disabled: false,

          }, {
            value: '2',
            label: '下午',
            id: 'six_2',
            disabled: false,

          }],
        },
        {
          value: '6',
          label: '周日',
          id: 'seven',
          disabled: false,
          children: [{
            value: '1',
            label: '上午',
            id: 'seven_1',
            disabled: false,

          }, {
            value: '2',
            label: '下午',
            id: 'seven_2',
            disabled: false,
          }],
        },
      ],
    };
  },
  methods: {
    // 进度
    validateProcess(rule, value, callback) {
      if (!value) {
        callback('请填写进度');
        this.processError = '进度';
      } else if (!/(^[0-9]\d*$)/.test(value)) {
        callback('填写正整数');
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
    // 关联项
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
