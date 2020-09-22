<template>
  <div class="my-weekly">
    <div v-if="!showReal" class="show-pic">
      <div class="pic-myweekly01">
        <!-- <img src="~@/assets/images/demoPic/myweekly01.png" /> -->
      </div>
      <div class="pic-myweekly02">
        <!-- <img src="~@/assets/images/demoPic/myweekly02.png" /> -->
      </div>
      <div class="pic-myweekly03">
        <!-- <img src="~@/assets/images/demoPic/myweekly03.png" /> -->
      </div>
    </div>
    <div v-if="showReal">
      <div class="page-title">我的周报</div>
      <!-- <div class="operating-box" :class="{'visibility-hidden': weeklyTypeList.length > 0 }"> -->
      <div class="operating-box" v-if="weeklyTypeList.length > 0">
        <div
          class="tl-custom-btn"
          v-for="item in weeklyTypeList"
          :key="item"
          :class="{'is-select': weeklyType == item,'is-version': weeklyTypeList.length == 1}"
          @click="setWeeklyType(item)"
        >
          <em>{{item == '1' ? '标准版':'简单版'}}</em>
        </div>
      </div>
    </div>
    <div v-if="showReal" class="cont-area" v-show="weeklyTypeList.length > 0">
      <!-- 日期 -->
      <tl-calendar @setCalendarId="setCalendarId" @getWeeklyById="getWeeklyById"></tl-calendar>
      <div class="weekly-area" v-if="newPage">
        <!-- 标准版 -->
        <standard-Weekly
          :weeklyData="weeklyData"
          :weeklyType="weeklyType"
          :calendarId="calendarId"
          :myOkrList="myOkrList"
          :orgOkrList="orgOkrList"
          :originalMyOkrList="originalMyOkrList"
          :originalOrgOkrList="originalOrgOkrList"
          :cultureList="cultureList"
          :canEdit="canEdit"
          @refreshMyOkr="refreshMyOkr"
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
          :cultureList="cultureList"
          :canEdit="canEdit"
          @refreshMyOkr="refreshMyOkr"
          v-else
        ></simple-weekly>
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
      calendarId: '',
      weeklyType: '',
      // weeklyTypeList: [],
      weeklyData: {},
      myOkrList: [],
      orgOkrList: [],
      originalMyOkrList: [],
      originalOrgOkrList: [],
      cultureList: [],
      canEdit: false,
      weeklyTypeList: [],
      showReal: false, // 展示示例图片 false
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
    },
    refreshMyOkr() {
      this.queryTeamOrPersonalTarget('my');
    },
    getValues() {
      this.server.getValues().then((res) => {
        if (res.code == 200) {
          this.cultureList = res.data;
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
            if (this.originalMyOkrList.length > 0) {
              this.setMyOrOrgOkrList(this.originalMyOkrList, 'my');
            }
          } else {
            // 团队目标
            this.orgOkrList = [];
            this.originalOrgOkrList = res.data.okrDetails;
            if (this.originalOrgOkrList) {
              this.setMyOrOrgOkrList(this.originalOrgOkrList, 'org');
            }
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
        this.$set(okr, 'okrType', 'O');
        tempResult.push(okr);
        if (okr.krList && okr.krList.length > 0) {
          let krIndex = 0;
          for (const kr of okr.krList) {
            krIndex += 1;
            kr.indexText = `KR${krIndex}`;
            this.$set(kr, 'okrType', 'KR');
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
    getWeeklyById(item) {
      this.canEdit = item.canEdit;
      this.weeklyTypeList = [];
      // 每次切换周报日期，则重新刷新okr数据，防止上次数据篡改
      this.queryTeamOrPersonalTarget('my');
      this.weeklyData = {};
      if (item.weeklyId) {
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
.show-pic {
  /* display: flex;
  flex-direction: column; */
}
.pic-myweekly01 {
  background: url("~@/assets/images/demoPic/myweekly01.png") no-repeat;
  background-size: 100%;
  height: calc(39vh - 7px);
}

.pic-myweekly02 {
  background: url("~@/assets/images/demoPic/myweekly02.png") no-repeat;
  /* background-size: cover; */
  background-size: 100%;
  height: calc(39vh - 2px);
}
.pic-myweekly03 {
  background: url("~@/assets/images/demoPic/myweekly03.png") no-repeat;
  /* background-size: cover; */
  background-size: 100%;
  height: calc(30vh);
}
/* .pic-one img,
.pic-two img,
.pic-three img {
  display: inline-block;
  height: auto;
  max-width: 100%;
} */
</style>