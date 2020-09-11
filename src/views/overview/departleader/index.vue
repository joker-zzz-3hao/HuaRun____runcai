<template>
  <div class="home">
    <tl-period @getPeriod="getPeriod" :showBack="false"></tl-period>
    <div class="creatOkr">
      <div>{{userInfo.userName}}</div>
      <tl-org-page :periodId="periodId"></tl-org-page>
    </div>
    <div class="creatOkr">
      <tl-okr-schedule :mainData="mainData"></tl-okr-schedule>
    </div>
    <div class="creatOkr">
      <div>
        <em>OKR承接与变更统计</em>
      </div>
      <div>
        <ul class="flex">
          <li v-for="(item,index) in mainData" :key="index">
            <dd>{{item.orgName}}</dd>
            <dd>承接数:{{item.okrContinueCount}}</dd>
            <dd>变更数:{{item.okrChangeCount}}</dd>
            <dd>总人数:{{item.personCount}}</dd>
          </li>
        </ul>
      </div>
    </div>
    <tl-weeking :periodId="periodId"></tl-weeking>
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
      server,
      orgTable: [],
      periodId: '',
      mainData: [],
      orgUser: [],
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
    }),
  },
  mounted() {
    this.getidentity();
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
      });
    },
    // 认证身份跳转对应身份首页
    getidentity() {
      this.server.identity({
        user: this.userInfo.userId,
        orgId: this.setOrgId,
      }).then((res) => {
        if (res.data.identityType == 'org') {
          this.$router.replace({ name: 'departleader' });
          return false;
        }
        if (res.data.identityType == 'team') {
          this.$router.replace({ name: 'teamleader' });
          return false;
        }
        if (res.data.identityType == 'person') {
          this.$router.replace({ name: 'grassStaff' });
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
</style>