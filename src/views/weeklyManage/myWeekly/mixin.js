import { mapState } from 'vuex';

export default {
  data() {
    return {
      WEEK_MAP: {
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六',
        0: '周日',
      },
      weekDataList: [
        {
          value: '1',
          label: '周一',
          id: 'one',
          disabled: false,
          children: [{
            value: '1',
            id: 'one_1',
            label: '上午',
            disabled: false,

          }, {
            value: '2',
            label: '下午',
            id: 'one_2',
            disabled: false,

          }],
        },
        {
          value: '2',
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
          value: '3',
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
          value: '4',
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
          value: '5',
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
          value: '6',
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
          value: '0',
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
      originalMyOkrList: (state) => state.originalMyOkrList,
    }),
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
    // setOkrStyle() {
    //   return (okr) => {
    //     if (okr && okr.length > 5) {
    //       return `${okr.slice(0, 5)}...`;
    //     }
    //     return okr;
    //   };
    // },
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
  created() {
    // 内部员工不展示周六、周日
    if (this.userInfo.ldapType == 'Full-Time') {
      this.weekDataList.pop();
      this.weekDataList.pop();
    }
  },
  methods: {
    // 该方法主要是兼容从我的任务-任务汇总模块汇总过来的数据
    initPage() {
      const self = this;
      // 来自任务的数据,同步至本周任务中
      const tempOkrList = [];
      // 将任务的okr遍历出来
      if (self.$route.params && self.$route.params.weeklySumParams) {
        self.canUpdate = true;
        self.$route.params.weeklySumParams.forEach((okr) => {
          if (okr.okrDetailId) {
            tempOkrList.push({
              okrDetailId: okr.okrDetailId,
            });
          }
        });
      }
      if (self.weeklyDataCopy.weeklyId) { // 后端查回来的数据
        // 任务汇总传过来的数据，合并至当前周
        if (self.$route.params
          && self.$route.params.weeklySumParams
          && this.currentWeek.calendarId == this.week.calendarId
        ) {
          // 初始化
          self.$route.params.weeklySumParams.forEach((work) => {
            self.weeklyWorkVoSaveList.push({
              okrCultureValueIds: '',
              okrIds: '',
              okrDetailId: work.okrDetailId || '',
              projectId: work.projectId || '',
              projectNameCn: work.projectName || '',
              weeklyId: '',
              workContent: work.taskTitle || '',
              workDesc: work.taskDesc || '',
              workId: '',
              workIndex: 0,
              workProgress: work.taskProgress || '',
              selectedOkr: [],
              workOkrList: [],
              okrCultureValueList: [],
              randomId: Math.random().toString(36).substr(3), // 添加随机id，用于删除环节
            });
          });
          // 合并后端取回数据
          self.weeklyWorkVoSaveList = [
            ...self.weeklyWorkVoSaveList, // 任务汇总过来的数据
            ...self.weeklyDataCopy.weeklyWorkVoList, // 后端查回来的数据
          ];
        } else {
          // 后端查询数据
          self.weeklyWorkVoSaveList = self.weeklyDataCopy.weeklyWorkVoList;// 列表数据
        }
        // 反显个人OKR进度,判断支撑okr中是否有个人okr，如果有则现在是个人okr进度（O、KR）
        self.setOkrProcess([...tempOkrList, ...self.weeklyDataCopy.weeklyOkrVoList]);
      } else if (!self.weeklyDataCopy.weeklyId) {
        // 任务汇总传过来的数据，合并至当前周
        if (self.$route.params
          && self.$route.params.weeklySumParams
           && this.currentWeek.calendarId == this.week.calendarId
        ) {
          // 初始化
          self.$route.params.weeklySumParams.forEach((work) => {
            self.weeklyWorkVoSaveList.push({
              okrCultureValueIds: '',
              okrIds: '',
              projectId: work.projectId || '',
              okrDetailId: work.okrDetailId || '',
              projectNameCn: work.projectName || '',
              weeklyId: '',
              workContent: work.taskTitle || '',
              workDesc: work.taskDesc || '',
              workId: '',
              workIndex: 0,
              workProgress: '',
              selectedOkr: [],
              workOkrList: [],
              okrCultureValueList: [],
              randomId: Math.random().toString(36).substr(3), // 添加随机id，用于删除环节
            });
          });
        }
        // 反显个人OKR进度,判断支撑okr中是否有个人okr，如果有则现在是个人okr进度（O、KR）
        self.setOkrProcess(tempOkrList);
      }
      // 反显周报列表数据
      self.setWorkTableData();
      // 反显本周感想
      self.setThoughts();
      // 反显下周计划
      self.setNextWeekPlan();
    },
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
