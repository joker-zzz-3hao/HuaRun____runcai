<template>
  <div class="my-weekly">
    <div class="operating-area">
      <div class="page-title">我的周报</div>
    </div>
    <div class="cont-area">
      <tl-calendar-tabs :server="server" :selectedWeekIndex.sync="weekIndex">
      </tl-calendar-tabs>
      <div
        v-for="(week, index) in weekList"
        v-show="weekIndex == index"
        :key="week.calendarId"
      >
        <div class="weekly-area" v-if="weeklyTypeList.length > 0">
          <div v-if="!week.weeklyId && !week.canEdit" class="no-data">
            <div class="no-data-bg"></div>
            <div class="no-data-txt">周报未填写</div>
          </div>
          <div v-else>
            <standard-Weekly
              :week="week"
              :weeklyTypeList="weeklyTypeList"
            ></standard-Weekly>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import calendarTabs from '../components/calendarTabs';
import Server from './server';
import standardWeekly from './components/standardWeekly';

const server = new Server();
export default {
  name: '',
  components: {
    'tl-calendar-tabs': calendarTabs,
    'standard-Weekly': standardWeekly,
  },
  props: {

  },
  data() {
    return {
      server,
      monthDate: this.dateFormat('YYYY-mm-dd', new Date()), // 初始化日期
      calendarId: '', // 日历Id
      weekIndex: undefined,
      currentMonthWeekList: [],
      afterDisabled: {
        disabledDate: (date) => {
          const now = new Date('2020-01-01');
          return date.getTime() > new Date().getTime() || now.getTime() > date.getTime();
        },
      },
      noWrite: false,
      weeklyTypeList: [],
    };
  },
  created() {
  //  查询项目
    this.getProjectList();
    // 查询个人okr
    this.queryPersonalOkr();
    // 查询团队okr
    this.queryTeamOkr();
    // 价值观
    this.getValues();
    // 查询okr配置
    this.getOkrConfig();
    this.getWeeklyTypeConfig();
    this.$busOn('refreshMyOkr', () => {
      // 查询个人okr
      this.queryPersonalOkr();
      // 查询团队okr
      this.queryTeamOkr();
    });
  },
  mounted() {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
    ...mapState('weekly', {
      weekList: (state) => state.weekList,
      orgOkrList: (state) => state.orgOkrList,
      weeklyType: (state) => state.weeklyType,
    }),
    isChecked() {
      return (weeklyId) => {
        if (weeklyId) {
          return true;
        }
        return false;
      };
    },
  },
  methods: {
    ...mapMutations('weekly',
      [
        'setOriginalOrgOkrList',
        'setOrgOkrPeriodList',
        'setOrgOkrList',
        'setMyOkrList',
        'setMyOkrPeriodList',
        'setProjectList',
        'setOriginalMyOkrList',
        'setCultureList',
        'setConfigItemCodeOKR',
      ]),
    getProjectList() {
      if (this.hasPower('weekly-project-query')) {
        this.server.queryOrgProject({ flag: '0' }).then((res) => {
          if (res.code == 200) {
            this.setProjectList(res.data);
          }
        });
      }
    },
    queryPersonalOkr() {
      let originalMyOkrList = [];
      const myOkrPeriodList = [];
      this.server.queryPersonalOkr().then((res) => {
        if (res.code == 200) {
          // 将所有个人目标、周期整合到一个数组
          if (res.data && res.data.length > 0) {
            res.data.forEach((element) => {
              // 周期
              myOkrPeriodList.push(element.okrMain);
              element.okrDetails.forEach((okr) => {
                okr.periodId = element.okrMain.periodId;
              });
              originalMyOkrList = [...originalMyOkrList, ...element.okrDetails];
            });
            if (originalMyOkrList) {
              this.getMyOkrList(originalMyOkrList);
            }
          }
          this.setOriginalMyOkrList(originalMyOkrList);
          this.setMyOkrPeriodList(myOkrPeriodList);
        }
      });
    },
    getMyOkrList(okrDetails) {
      const tempResult = [];
      for (const okr of okrDetails) {
        okr.indexText = '目标O';
        this.$set(okr, 'okrType', 'O');
        this.$set(okr, 'periodId', okr.periodId);
        tempResult.push(okr);
        if (okr.krList && okr.krList.length > 0) {
          let krIndex = 0;
          for (const kr of okr.krList) {
            krIndex += 1;
            kr.indexText = `KR${krIndex}`;
            this.$set(kr, 'okrType', 'KR');
            this.$set(kr, 'periodId', okr.periodId);
            tempResult.push(kr);
          }
        }
      }
      this.setMyOkrList(tempResult);
    },
    queryTeamOkr() {
      let originalOrgOkrList = [];
      const orgOkrPeriodList = [];
      this.server.getOrgOkr({ okrBelongType: 1 }).then((res) => {
        if (res.code == 200) {
          // 将所有团队目标、周期整合到一个数组
          if (res.data.parentUndertakeOkrInfoResults && res.data.parentUndertakeOkrInfoResults.length > 0) {
            res.data.parentUndertakeOkrInfoResults.forEach((element) => {
              // 周期
              orgOkrPeriodList.push(element.okrPeriodEntity);
              element.okrList.forEach((okr) => {
                okr.periodId = element.okrPeriodEntity.periodId;
              });
              originalOrgOkrList = [...originalOrgOkrList, ...element.okrList];
            });
            if (originalOrgOkrList) {
              this.getOrgOkrList(originalOrgOkrList);
            }
          }
          this.setOriginalOrgOkrList(originalOrgOkrList);
          this.setOrgOkrPeriodList(orgOkrPeriodList);
        }
      });
    },
    getOrgOkrList(okrDetails) {
      const tempResult = [];
      for (const okr of okrDetails) {
        okr.o.indexText = '目标O';
        this.$set(okr.o, 'okrType', 'O');
        this.$set(okr.o, 'periodId', okr.periodId);
        tempResult.push(okr.o);
        if (okr.krList && okr.krList.length > 0) {
          let krIndex = 0;
          for (const kr of okr.krList) {
            krIndex += 1;
            kr.indexText = `KR${krIndex}`;
            this.$set(kr, 'okrType', 'KR');
            this.$set(kr, 'periodId', okr.periodId);
            tempResult.push(kr);
          }
        }
      }
      this.setOrgOkrList(tempResult);
    },
    getValues() {
      this.server.getValues().then((res) => {
        if (res.code == 200) {
          this.setCultureList(res.data);
        }
      });
    },
    // 周报关联okr配置查询
    getOkrConfig() {
      let configItemCodeOKR = 'S';
      this.server.getTypeConfig({
        configType: 'OKR',
        configTypeDetail: 'O-2',
        level: 'T',
        sourceId: this.userInfo.tenantId,
      }).then((res) => {
        if (res.code == 200) {
          if (!!res.data && res.data.length > 0) {
            configItemCodeOKR = res.data[0].configItemCode;
          }
        }
        this.setConfigItemCodeOKR(configItemCodeOKR);
      });
    },
    seclectBtn(item) {
      if (item.noOpen) {
        return;
      }
      this.$emit('setCalendarId', item.calendarId);
      this.weekList.forEach((week) => {
        week.btnType = '';
      });
      item.btnType = 'success';
      this.$forceUpdate();
      this.$emit('getWeeklyById', item);
    },

    getWeekItem(item, index) {
      if (item.calendarId) {
        const beg = item.weekBegin.split('-').splice(1, 2).join('/');
        const end = item.weekEnd.split('-').splice(1, 2).join('/');
        return `第${index + 1}周(${beg}-${end})`;
      }
    },
    goCurrentWeek() {
      this.getWeek(this.dateFormat('YYYY-mm-dd', new Date()));
    },

    getWeeklyTypeConfig() {
      let temp = [];
      this.server.getTypeConfig({
        sourceId: this.userInfo.orgId, configType: 'WEEKLY', configTypeDetail: 'W-2', level: 'O',
      }).then((res) => {
        if (res.code == 200) {
          if (res.data.length > 0) {
            temp = res.data[0].configItemCode.split(',');
            if (temp.length == 2) {
              temp = ['1', '2'];
            }
          } else {
            temp = ['1', '2'];
          }
        }
        this.weeklyTypeList = temp;
      });
    },
  },
  watch: {
    weekIndex: {
      handler(val) {
        if (this.hasValue(val)) {
          this.$busEmit('refreshPage');
        }
      },
    },

  },
  updated() {},
  beforeDestroy() {},
};
</script>