<template>
  <div class="team-view">
    <div class="cont-area">
      <div class="creatOkr">
        <!-- <div>{{userInfo.userName}}</div> -->
        <tl-org-page :periodId="periodId"></tl-org-page>
      </div>
      <div class="creatOkr">
        <tl-okr-schedule :mainData="mainData"></tl-okr-schedule>
      </div>
      <div class="creatOkr">
        <div>
          <em>
            OKR承接与变更统计
            <em v-show="testModel">(示例数据)</em>
          </em>
        </div>
        <div class="risk">
          <ul class="flex">
            <li v-for="(item,index) in riskList" :key="index">
              <dd>
                <em>{{item.orgName}}</em>
                <em>承接数:{{item.okrContinueCount}}</em>
              </dd>
              <dd>
                <em>变更数:{{item.okrChangeCount}}</em>
                <em>总人数:{{item.personCount}}</em>
              </dd>
            </li>
          </ul>
        </div>
      </div>
      <tl-weeking :periodId="periodId"></tl-weeking>
    </div>
    <tl-period @getPeriod="getPeriod" :showBack="false"></tl-period>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import okrSchedule from './components/okrSchedule';
import okrUpdate from './components/okrUpdate';
import orgPage from '../component/orgPage';
import weeking from './components/weeking';
import period from '../component/period';
import Server from '../server';
import { mainData } from '../testData';

const server = new Server();

export default {
  name: 'departleader',
  components: {
    'tl-okr-schedule': okrSchedule,
    // eslint-disable-next-line vue/no-unused-components
    'tl-okr-update': okrUpdate,
    'tl-weeking': weeking,
    'tl-org-page': orgPage,
    'tl-period': period,
  },
  data() {
    return {
      showOver: false,
      server,
      orgTable: [],
      periodId: '',
      mainData: [],
      orgUser: [],
      riskList: [],
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
      testModel: (state) => state.testModel,
    }),
  },
  mounted() {
    // eslint-disable-next-line no-unused-expressions
    // this.$route.query.id ? this.showOver = true : this.getidentity();
  },

  methods: {

    // 切换周期
    getPeriod(periodId) {
      this.periodId = periodId;
      this.getmainData();
    },
    // 截取名字第一个字
    checkName(name) {
      return name.substring(0, 1);
    },
    // 获取主页okr进度与更新次数统计 this.$route.query.id如果为部门负责人或团队负责人则为orgId,普通员工为userId
    getmainData() {
      this.server.mainData({
        orgId: this.$route.query.id ? this.$route.query.id : this.setOrgId,
        periodId: this.periodId,
      }).then((res) => {
        this.mainData = res.data;
        this.riskList = this.testModel ? mainData.orkData.data : res.data;
      });
    },
    // 认证身份跳转对应身份首页
    getidentity() {
      this.server.identity({
        user: this.userInfo.userId,
        orgId: this.setOrgId,
      }).then((res) => {
        if (res.data.identityType == 'org') {
          // this.$router.replace({ name: 'departleader' });
          this.showOver = true;
          return false;
        }
        if (res.data.identityType == 'team') {
          this.$router.replace({ name: 'teamleader' });
          this.showOver = true;
          return false;
        }
        if (res.data.identityType == 'person') {
          this.$router.replace({ name: 'grassStaff' });
          this.showOver = true;
          return false;
        }
      });
    },
  },
};
</script>
<style  scoped>
.flex {
  display: flex;
  flex-direction: row;
}
.creatOkr {
  width: 100%;
  min-height: 200px;
  background: white;
  margin-bottom: 30px;
}

.risk ul li {
  background: #ffffff;
  box-shadow: 0 6px 16px 0 rgba(0, 11, 84, 0.04);
  border-radius: 4px;
  border-radius: 4px;
  width: 280px;
  height: 114px;
}

.risk ul li dd {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

.risk ul li dd em {
  margin-top: 20px;
}
</style>