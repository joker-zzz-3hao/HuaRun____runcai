<template>
  <div class="my-weekly">
    <div class="operating-area">
      <div class="page-title">我的周报</div>
      <div class="operating-box" v-if="weeklyTypeList.length > 0">
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
    <!-- <div class="cont-area" v-show="weeklyTypeList.length > 0"> -->
    <div class="cont-area">
      <!-- 日期 -->
      <tl-calendar
        @setCalendarId="setCalendarId"
        @getWeeklyById="getWeeklyById"
      ></tl-calendar>
      <div class="weekly-area" v-if="newPage">
        <!-- 以前的周报未填写，友情提示 -->
        <div v-if="noWrite" class="no-data">
          <div class="no-data-bg"></div>
          <div class="no-data-txt">周报未填写</div>
        </div>
        <!-- 标准版 -->
        <div v-if="!noWrite && myOkrLoadFinish && teamOkrLoadFinish">
          <standard-Weekly
            :weeklyData="weeklyData"
            :weeklyType="weeklyType"
            :calendarId="calendarId"
            :myOkrList="myOkrList"
            :orgOkrList="orgOkrList"
            :originalMyOkrList="originalMyOkrList"
            :originalOrgOkrList="originalOrgOkrList"
            :orgOkrPeriodList="orgOkrPeriodList"
            :myOkrPeriodList="myOkrPeriodList"
            :cultureList="cultureList"
            :projectList="projectList"
            :canEdit="canEdit"
            @refreshMyOkr="refreshMyOkr"
            :timeDisabled="timeDisabled"
            :configItemCodeOKR="configItemCodeOKR"
            v-if="weeklyType == '1'"
          ></standard-Weekly>
          <!-- 简单版 -->
          <simple-weekly
            :weeklyData="weeklyData"
            :weeklyType="weeklyType"
            :calendarId="calendarId"
            :myOkrList="myOkrList"
            :orgOkrList="orgOkrList"
            :originalMyOkrList="originalMyOkrList"
            :originalOrgOkrList="originalOrgOkrList"
            :orgOkrPeriodList="orgOkrPeriodList"
            :myOkrPeriodList="myOkrPeriodList"
            :cultureList="cultureList"
            :projectList="projectList"
            :canEdit="canEdit"
            :configItemCodeOKR="configItemCodeOKR"
            @refreshMyOkr="refreshMyOkr"
            v-else
          ></simple-weekly>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import standardWeekly from './components/standardWeekly';
import simpleWeekly from './components/simpleWeekly';
import calendar from './components/calendar';
import Server from './server';

const server = new Server();
export default {
  name: 'myWeekly',
  components: {
    'standard-Weekly': standardWeekly,
    'simple-weekly': simpleWeekly,
    'tl-calendar': calendar,
  },
  data() {
    return {
      server,
      newPage: false,
      noWrite: false,
      calendarId: '',
      weeklyType: '',
      // weeklyTypeList: [],
      weeklyData: {},
      myOkrList: [],
      orgOkrList: [],
      originalMyOkrList: [],
      originalOrgOkrList: [],
      orgOkrPeriodList: [],
      myOkrPeriodList: [],
      teamOkrLoadFinish: false,
      myOkrLoadFinish: false,
      cultureList: [],
      canEdit: false,
      weeklyTypeList: [],
      timeDisabled: false,
      orgId: '',
      projectList: [],
      configItemCodeOKR: '',
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.queryPersonalOkr();
      this.queryTeamOkr();
      this.getValues();
      this.getProjectList();
      // 周报关联okr配置查询
      this.server.getTypeConfig({
        configType: 'OKR',
        configTypeDetail: 'O-2',
        level: 'T',
        sourceId: this.userInfo.tenantId,
      }).then((res) => {
        if (res.code == 200) {
          if (!!res.data && res.data.length > 0) {
            this.configItemCodeOKR = res.data[0].configItemCode;
          } else {
            this.configItemCodeOKR = 'S';
          }
        }
      });
    },
    refreshMyOkr() {
      this.teamOkrLoadFinish = false;
      this.myOkrLoadFinish = false;
      this.queryPersonalOkr();
      this.queryTeamOkr();
    },
    getValues() {
      this.server.getValues().then((res) => {
        if (res.code == 200) {
          this.cultureList = res.data;
        }
      });
    },
    getProjectList() {
      if (this.hasPower('weekly-project-query')) {
        this.server.queryOrgProject({ flag: '0' }).then((res) => {
          if (res.code == 200) {
            this.projectList = res.data;
          }
        });
      }
    },
    // queryTeamOkr() {
    //   if (this.roleCode.includes('ORG_ADMIN') && this.userInfo.orgParentName) {
    //     this.departmentName = this.userInfo.orgParentName;
    //     this.orgId = this.userInfo.orgParentId;
    //   } else {
    //     this.departmentName = this.userInfo.orgName || '部门';
    //     this.orgId = this.userInfo.orgId;
    //   }
    //   const params = {
    //     myOrOrg: 'org',
    //     status: '1',
    //     orgId: this.orgId,
    //   };
    //   this.server.getorgOkr(params).then((res) => {
    //     if (res.code == 200) {
    //       // 团队目标
    //       this.orgOkrList = [];
    //       this.originalOrgOkrList = res.data.okrDetails;
    //       if (this.originalOrgOkrList) {
    //         this.setMyOrOrgOkrList(this.originalOrgOkrList, 'org');
    //       }
    //     }
    //   });
    // },
    queryTeamOkr() {
      this.originalOrgOkrList = [];
      this.orgOkrPeriodList = [];
      this.server.getOrgOkr().then((res) => {
        if (res.code == 200) {
          // 将所有团队目标、周期整合到一个数组
          if (res.data.parentUndertakeOkrInfoResults && res.data.parentUndertakeOkrInfoResults.length > 0) {
            res.data.parentUndertakeOkrInfoResults.forEach((element) => {
              // 周期
              this.orgOkrPeriodList.push(element.okrPeriodEntity);
              element.okrList.forEach((okr) => {
                okr.periodId = element.okrPeriodEntity.periodId;
              });
              this.originalOrgOkrList = [...this.originalOrgOkrList, ...element.okrList];
            });
            if (this.originalOrgOkrList) {
              this.setOrgOkrList(this.originalOrgOkrList);
            }
          }
          this.teamOkrLoadFinish = true;
        }
      });
    },
    queryPersonalOkr() {
      this.originalMyOkrList = [];
      this.myOkrPeriodList = [];
      this.server.queryPersonalOkr().then((res) => {
        if (res.code == 200) {
          // 将所有个人目标、周期整合到一个数组
          if (res.data && res.data.length > 0) {
            res.data.forEach((element) => {
              // 周期
              this.myOkrPeriodList.push(element.okrMain);
              element.okrDetails.forEach((okr) => {
                okr.periodId = element.okrMain.periodId;
              });
              this.originalMyOkrList = [...this.originalMyOkrList, ...element.okrDetails];
            });
            if (this.originalMyOkrList) {
              this.setMyOkrList(this.originalMyOkrList);
            }
          }
          this.myOkrLoadFinish = true;
        }
      });
    },
    setMyOkrList(okrDetails) {
      const tempResult = [];
      // if (orgOrMy == 'org') {
      //   tempResult = this.orgOkrList;
      // }
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
      this.myOkrList = [...tempResult];
    },
    setOrgOkrList(okrDetails) {
      const tempResult = [];
      // if (orgOrMy == 'org') {
      //   tempResult = this.orgOkrList;
      // }
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
      this.orgOkrList = [...tempResult];
    },
    newEdit(item) {
      const now = new Date().getTime();
      const weekBegin = new Date(item.weekBegin).getTime();
      const weekEnd = new Date(item.weekEnd).getTime();
      if (weekBegin < now && now < weekEnd) {
        return true;
      }
      return false;
    },
    getWeeklyById(item) {
      this.newPage = false;// 防止日历标签间点击页面闪烁
      this.noWrite = false;
      this.timeDisabled = this.newEdit(item);
      this.canEdit = item.canEdit;
      this.weeklyTypeList = [];
      // 每次切换周报日期，则重新刷新okr数据，防止上次数据篡改
      // this.queryPersonalOkr();
      this.weeklyData = {};
      if (item.weeklyId) {
        if (this.hasPower('weekly-detail-query')) {
          this.server.queryWeekly({ weeklyId: item.weeklyId }).then((res) => {
            if (res.code == 200) {
              this.weeklyType = String(res.data.weeklyType);
              this.weeklyData = res.data;
            }
            this.newPage = false;// 清空页面实例，重新加载新页面
            this.$nextTick(() => {
              this.newPage = true;
            });
            this.getTypeConfig();// 在这调用，防止俩标签闪烁
          });
        }
      } else if (!item.weeklyId && !this.timeDisabled) { // 以前的周 未填写周报
        this.newPage = false;// 清空页面实例，重新加载新页面
        this.$nextTick(() => {
          this.newPage = true;
        });
        this.noWrite = true;
        this.getTypeConfig('noWrite');// 在这调用，防止俩标签闪烁
      } else {
        this.newPage = false;// 清空页面实例，重新加载新页面
        this.$nextTick(() => {
          this.newPage = true;
        });
        this.getTypeConfig('noWrite');// 在这调用，防止俩标签闪烁
      }
    },
    getTypeConfig(writeStatus) {
      this.server.getTypeConfig({
        sourceId: this.userInfo.orgId, configType: 'WEEKLY', configTypeDetail: 'W-2', level: 'O',
      }).then((res) => {
        if (res.code == 200) {
          if (res.data.length > 0) {
            this.weeklyTypeList = res.data[0].configItemCode.split(',');
          } else {
            this.weeklyTypeList = ['1', '2'];
          }
        }
        // 未提交周报时，给周报模式赋值
        if (writeStatus && writeStatus == 'noWrite') { // 没提交周报
          if (this.weeklyTypeList.includes('1')) {
            this.weeklyType = '1';
          } else {
            this.weeklyType = '2';
          }
        } else { // 提交了周报
          this.weeklyTypeList = [this.weeklyType];
        }
        this.$forceUpdate();
      });
    },
    setCalendarId(id) {
      this.calendarId = id;
    },
    standard() {
      this.weeklyType = '1';
    },
    simple() {
      this.weeklyType = '2';
    },
    setWeeklyType(data) {
      this.weeklyType = data;
    },
    handleClick() {},
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      roleCode: (state) => state.roleCode,
    }),
  },
};
</script>
<style lang="css" stylus>
.is-stantard {
  background: green;
}
.is-simple {
  background: green;
}
</style>