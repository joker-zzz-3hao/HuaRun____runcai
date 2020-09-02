<template>
  <div class="home">
    <tl-period @getPeriod="getPeriod" :showBack="false"></tl-period>
    <div class="creatOkr">
      <div>{{userInfo.userName}}</div>
      <div v-if="false">
        <img style="width:100px;height:100px;display:block;border:1px solid black;" src alt srcset />
        <el-button type="primary">创建OKR</el-button>
      </div>
      <tl-org-page></tl-org-page>
      <div>
        <ul style="display:flex;flex-direction: row;">
          <template v-if="orgTable">
            <li
              class="user-info"
              v-for="(item,index) in orgTable"
              :key="index"
              @click="goToDep(item.orgId,item.orgName)"
            >
              <div>
                <div class="user-name">{{checkName(item.orgName)}}</div>
                <div>{{item.orgName}}</div>
              </div>
            </li>
          </template>
          <template v-if="orgUser">
            <li
              class="user-info"
              v-for="(item,index) in orgUser"
              :key="index"
              @click="goToDep(item.userId,item.userName)"
            >
              <div>
                <div class="user-name">{{checkName(item.userName)}}</div>
                <div>{{item.userName}}</div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div class="creatOkr">
      <tl-okr-schedule :mainData="mainData"></tl-okr-schedule>
    </div>
    <div class="creatOkr">
      <div>
        <em>OKR承接与变更统计</em>
      </div>
      <div>
        <table border="1">
          <tr>
            <td></td>
            <td v-for="(item,index) in mainData" :key="index">{{item.orgName}}</td>
          </tr>
          <tr>
            <td>承接数</td>
            <td v-for="(item,index) in mainData" :key="index">{{item.okrContinueCount}}</td>
          </tr>
          <tr>
            <td>变更数</td>
            <td v-for="(item,index) in mainData" :key="index">{{item.okrChangeCount}}</td>
          </tr>
          <tr>
            <td>总人数</td>
            <td v-for="(item,index) in mainData" :key="index">{{item.personCount}}</td>
          </tr>
        </table>
      </div>
    </div>
    <tl-weeking :orgTable="orgTable"></tl-weeking>
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
      period: '',
      mainData: [],
      orgUser: [],
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  created() {
    this.getqueryMyOkr();
  },

  methods: {
    goToDep(id, name) {
      const chename = encodeURI(name);
      this.$router.push({ name: 'teamleader', query: { id, name: chename } });
    },
    // eslint-disable-next-line no-shadow
    getPeriod(period) {
      this.period = period;
      this.getmainData();
    },
    checkName(name) {
      return name.substring(0, 1);
    },
    getqueryMyOkr() {
      this.server.queryMyOkr({
        myOrOrg: 'org', status: '1', orgId: this.userInfo.orgId, type: 'INDEX',
      }).then((res) => {
        if (res.code == 200) {
          this.orgTable = res.data.orgTable;
          this.orgUser = res.data.orgUser;
        }
      });
    },
    getmainData() {
      this.server.mainData({
        periodId: this.period,
        orgId: this.userInfo.orgId,
      }).then((res) => {
        this.mainData = res.data;
      });
    },
  },
};
</script>
<style  scoped>
.creatOkr {
  width: 100%;
  min-height: 200px;
  background: white;
  margin-bottom: 30px;
}
</style>