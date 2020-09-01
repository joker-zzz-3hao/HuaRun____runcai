<template>
  <div class="home">
    <div>
      <el-button
        v-if="weeklyType == '1'||!this.weeklyData.weeklyId"
        @click="standard"
        :class="{'is-stantard':weeklyType=='1'}"
      >标准版</el-button>
      <el-button
        v-if="weeklyType == '0'||!this.weeklyData.weeklyId"
        @click="simple"
        :class="{'is-stantard':weeklyType=='0'}"
      >简单版</el-button>
    </div>
    <!-- 日期 -->
    <calendar @setCalendarId="setCalendarId" @getWeeklyById="getWeeklyById"></calendar>
    <!-- 标准版 -->
    <standard-Weekly
      :weeklyData="weeklyData"
      :weeklyType="weeklyType"
      :calendarId="calendarId"
      :myOkrList="myOkrList"
      :orgOkrList="orgOkrList"
      :originalMyOkrList="originalMyOkrList"
      :originalOrgOkrList="originalOrgOkrList"
      :projectList="projectList"
      :cultureList="cultureList"
      @initValueAllFalse="initValueAllFalse"
      v-if="weeklyType=='1'"
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
      :projectList="projectList"
      :cultureList="cultureList"
      @initValueAllFalse="initValueAllFalse"
      v-else
    ></simple-weekly>
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
    calendar,
  },
  data() {
    return {
      server,
      calendarId: '',
      weeklyType: '',
      weeklyData: {},
      myOkrList: [],
      orgOkrList: [],
      originalMyOkrList: [],
      originalOrgOkrList: [],
      projectList: [],
      cultureList: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.queryTeamOrPersonalTarget('my');
      this.queryTeamOrPersonalTarget('org');
      this.getValues();
      // 获取项目列表
      this.getProjectList();
    },
    getValues() {
      this.server.getValues().then((res) => {
        if (res.code == 200) {
          this.cultureList = res.data;
          this.initValueAllFalse();
        }
      });
    },
    getProjectList(projectName) {
      this.server.getProjectList({
        pageSize: 10,
        currentPage: 1,
        projectName: projectName || '',
      }).then((res) => {
        if (res.code == 200) {
          this.projectList = res.data.content;
        }
      });
    },
    queryTeamOrPersonalTarget(myOrOrg) {
      const params = {
        myOrOrg,
        status: '1',
        orgId: this.userInfo.orgId,
      };
      this.server.queryTeamOrPersonalTarget(params).then((res) => {
        if (res.code == 200) {
          if (myOrOrg == 'my') {
            // 我的目标
            this.myOkrList = [];
            this.originalMyOkrList = res.data.okrDetails;
            this.setMyOrOrgOkrList(this.originalMyOkrList, 'my');
          } else {
            // 团队目标
            this.orgOkrList = [];
            this.originalOrgOkrList = res.data.okrDetails;
            this.setMyOrOrgOkrList(this.originalOrgOkrList, 'org');
          }
        }
      });
    },
    setMyOrOrgOkrList(okrDetails, orgOrMy) {
      let tempResult = this.myOkrList;
      if (orgOrMy == 'org') {
        tempResult = this.orgOkrList;
      }
      let oIndex = 0;
      for (const okr of okrDetails) {
        oIndex += 1;
        okr.indexText = `目标O${oIndex}`;
        this.$set(okr, 'checked', false);
        tempResult.push(okr);
        if (okr.krList && okr.krList.length > 0) {
          let krIndex = 0;
          for (const kr of okr.krList) {
            krIndex += 1;
            kr.indexText = `KR${krIndex}`;
            this.$set(kr, 'checked', false);
            tempResult.push(kr);
          }
        }
      }
      if (orgOrMy == 'org') {
        this.orgOkrList = [...tempResult];
      } else {
        this.myOkrList = [...tempResult];
      }
    },
    // 价值观选项全初始化为未选中
    initValueAllFalse() {
      this.cultureList.forEach((value) => {
        this.$set(value, 'checked', false);
      });
    },
    getWeeklyById(item) {
      this.weeklyData = {};
      if (item.weeklyId) {
        this.server.queryWeekly({ weeklyId: item.weeklyId }).then((res) => {
          if (res.code == 200) {
            this.weeklyType = String(res.data.weeklyType);
            this.weeklyData = res.data;
          }
        });
      } else {
        this.weeklyType = '1';
      }
    },
    setCalendarId(id) {
      this.calendarId = id;
    },
    standard() {
      this.weeklyType = '1';
    },
    simple() {
      this.weeklyType = '0';
    },
    handleClick() {},
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
};
</script>
<style lang="css">
.is-stantard {
  background: green;
}
.is-simple {
  background: green;
}
</style>