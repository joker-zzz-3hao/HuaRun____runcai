<template>
  <div>
    <div class="operating-area">
      <div class="page-title">我的周报</div>
      <div class="operating-box">
        <div
          class="tl-custom-btn"
          v-for="item in weeklyTypeList"
          :key="item"
          :class="{
            'is-select': weeklyType == item,
          }"
          @click="setWeeklyType(item)"
        >
          <em>{{ item == "1" ? "标准版" : "简单版" }}</em>
        </div>
      </div>
    </div>

    <tl-calendar-tabs :server="server" :weekIndex.sync="weekIndex">
    </tl-calendar-tabs>
    <div v-if="showWeekly">
      <div
        v-for="(week, index) in weekList"
        v-show="weekIndex == index"
        :key="week.calendarId"
      >
        <div class="weekly-area">
          <!-- <div v-if="noWrite" class="no-data">
          <div class="no-data-bg"></div>
          <div class="no-data-txt">周报未填写</div>
        </div> -->
          <div>
            <standard-Weekly
              :week="week"
              :myOkrList="myOkrList"
              :orgOkrList="orgOkrList"
              :originalMyOkrList="originalMyOkrList"
              :originalOrgOkrList="originalOrgOkrList"
              :orgOkrPeriodList="orgOkrPeriodList"
              :myOkrPeriodList="myOkrPeriodList"
              :cultureList="cultureList"
              :projectList="projectList"
              @refreshMyOkr="refreshMyOkr"
              :timeDisabled="timeDisabled"
              :configItemCodeOKR="configItemCodeOKR"
              v-if="weeklyType == '1'"
            ></standard-Weekly>
            <simple-weekly
              :weeklyData="weeklyData"
              :myOkrList="myOkrList"
              :orgOkrList="orgOkrList"
              :originalMyOkrList="originalMyOkrList"
              :originalOrgOkrList="originalOrgOkrList"
              :orgOkrPeriodList="orgOkrPeriodList"
              :myOkrPeriodList="myOkrPeriodList"
              :cultureList="cultureList"
              :projectList="projectList"
              :configItemCodeOKR="configItemCodeOKR"
              @refreshMyOkr="refreshMyOkr"
              v-else
            ></simple-weekly>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import calendarTabs from '../components/calendarTabs';
import Server from './server';
import standardWeekly from './components/standardWeekly';
// import simpleWeekly from './components/simpleWeekly';

const server = new Server();
export default {
  name: '',
  components: {
    'tl-calendar-tabs': calendarTabs,
    'standard-Weekly': standardWeekly,
    // 'simple-weekly': simpleWeekly,
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
      teamOkrLoadFinish: false,
      myOkrLoadFinish: false,
      weeklyType: '1',
      originalMyOkrList: [],
      myOkrPeriodList: [],
      originalOrgOkrList: [],
      orgOkrPeriodList: [],
      cultureList: [],
      projectList: [],
      timeDisabled: false,
      configItemCodeOKR: 'O',
      showWeekly: false,
    };
  },
  created() {
    // this.$busOn('refreshCalendar', () => {
    //   this.getWeek();
    // });
  },
  mounted() {},
  computed: {
    ...mapState('weekly', {
      weekList: (state) => state.weekList,
      weeklyDataList: (state) => state.weeklyDataList,
      myOkrList: (state) => state.myOkrList,
      orgOkrList: (state) => state.orgOkrList,
      weeklyTypeList: (state) => state.weeklyTypeList,
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
    refreshMyOkr() {

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
    setWeeklyType(data) {
      this.weeklyType = data;
    },

  },
  watch: {
    weekIndex: {
      handler(val) {
        console.log(val);
      },
    },
    weeklyDataList: {
      handler() {
        this.showWeekly = false;
        this.$nextTick(() => {
          this.showWeekly = true;
        });
      },
    },
  },
  updated() {},
  beforeDestroy() {},
};
</script>