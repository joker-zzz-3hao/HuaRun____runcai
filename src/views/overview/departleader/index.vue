<template>
  <div class="department-view">
    <div class="cont-area">
      <tl-org-page :periodId="periodId"></tl-org-page>
      <tl-okr-schedule :mainData="mainData"></tl-okr-schedule>
      <div class="tl-card-panel">
        <div class="card-panel-head">
          <div class="panner-title">
            <em>OKR承接与变更统计</em>
            <span v-show="testModel">示例数据</span>
          </div>
        </div>
        <div class="card-panel-body">
          <div class="tl-card-panel-group">
            <dl v-for="(item,index) in riskList" :key="index">
              <dt>{{item.orgName}}</dt>
              <dd>
                <span>总人数</span>
                <em>{{item.personCount}}</em>
              </dd>
              <dd>
                <span>承接数</span>
                <em>{{item.okrContinueCount}}</em>
              </dd>
              <dd>
                <span>变更数</span>
                <em>{{item.okrChangeCount}}</em>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <tl-weeking :periodId="periodId"></tl-weeking>
      <tl-weekTable :periodId="periodId"></tl-weekTable>
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
// eslint-disable-next-line import/no-unresolved
import weekTable from './components/weekTable';
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
    'tl-weekTable': weekTable,
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