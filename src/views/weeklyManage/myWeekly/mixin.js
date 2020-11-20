import { mapState } from 'vuex';

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
  computed: {
    ...mapState('weekly', {
      weekList: (state) => state.weekList,
      projectList: (state) => state.projectList,
      configItemCodeOKR: (state) => state.configItemCodeOKR,
      weeklyTypeList: (state) => state.weeklyTypeList,
      originalMyOkrList: (state) => state.originalMyOkrList,

    }),
    setOkrStyle() {
      return (okr) => {
        if (okr && okr.length > 5) {
          return `${okr.slice(0, 5)}...`;
        }
        return okr;
      };
    },
    itemIndex() {
      return (okr) => {
        const result = [];
        this.weeklyWorkVoSaveList.forEach((item) => {
          item.selectedOkr.forEach((element) => {
            if (okr.okrDetailId == element.okrDetailId) {
              result.push(this.weeklyWorkVoSaveList.indexOf(item) + 1);
            }
          });
        });
        return result.join('、');
      };
    },
    canEdit() {
      let result = false;
      this.weekList.forEach((item) => {
        if (item.calendarId == this.week.calendarId) {
          result = item.canEdit;
        }
      });
      return result;
    },
  },
  methods: {
    // 进度
    validateProcess(rule, value, callback) {
      if (!value) {
        callback('请填写进度');
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
      if (value.length < 1) {
        callback('请填写工时');
      } else {
        callback();
      }
    },
    // 任务项
    validateWorkContent(rule, value, callback) {
      if (!value) {
        callback('请填写工作项');
      } else {
        callback();
      }
    },
    // 项目
    validateProject(rule, value, callback) {
      if (!value) {
        callback('请选择项目');
      } else {
        callback();
      }
    },
    // 关联项
    validateOkr(rule, value, callback) {
      if (!value) {
        callback('请填写支撑OKR/价值观');
      } else {
        callback();
      }
    },

  },
};
