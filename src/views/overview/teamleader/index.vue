<template>
  <div class="home">
    <tl-period @getPeriod="getPeriod" :showBack="true"></tl-period>
    <div class="creatOkr">
      <em v-if="$route.query.name">{{decodeURI($route.query.name)}}</em>
      <em v-else>{{userInfo.userName}}</em>
      <div v-if="false">
        <img style="width:100px;height:100px;display:block;border:1px solid black;" src alt srcset />
        <el-button type="primary">创建OKR</el-button>
      </div>
      <tl-org-page :periodId="periodId"></tl-org-page>
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
      <div>OKR当前进度</div>
      <tl-okr-schedule :mainData="mainData"></tl-okr-schedule>
    </div>
    <div class="creatOkr">
      <div>OKR进度更新榜</div>
      <tl-okr-update :mainData="mainData"></tl-okr-update>
    </div>
    <div class="creatOkr">
      <div>
        OKR风险状态统计
        <span>部门成员的OKR风险状态总数，点击可以查看对应的OKR列表</span>
      </div>
      <div>
        <el-table :data="tableData" border style="width: 400px;display:inline-block">
          <el-table-column prop="riskName" label="KR状态"></el-table-column>
          <el-table-column prop="count" label="数量"></el-table-column>
          <el-table-column prop="ratio" label="占比">
            <template slot-scope="scope">
              <span v-if="scope.row.ratio">{{scope.row.ratio+'%'}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
        <div style="display:inline-block">
          <tl-okr-risk-total :tableData="tableData"></tl-okr-risk-total>
        </div>
        <ul style="display:inline-block">
          <li v-for="(item,index) in tableData" :key="index">{{item.riskName}} {{item.ratio+'%'}}</li>
        </ul>
      </div>
    </div>

    <tl-weeking></tl-weeking>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Server from '../server';
import okrSchedule from './components/okrSchedule';
import okrUpdate from './components/okrUpdate';
import okrRiskTotal from './components/okrRiskTotal';
import weeking from './components/weeking';
import periodcom from '../component/period';
import orgPage from '../component/orgPage';

const server = new Server();
export default {
  name: 'teamleader',
  components: {
    'tl-okr-schedule': okrSchedule,
    'tl-okr-update': okrUpdate,
    'tl-okr-risk-total': okrRiskTotal,
    'tl-weeking': weeking,
    'tl-period': periodcom,
    'tl-org-page': orgPage,
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
    }),
  },
  data() {
    return {
      server,
      orgUser: [],
      tableData: [],
      periodId: '',
      mainData: [],
      orgId: '',
      orgTable: [],
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.orgId = this.$route.query.id;
    } else {
      this.orgId = this.setOrgId;
    }
    this.getqueryMyOkr();
  },
  methods: {
    goToDep(id, name) {
      const chename = encodeURI(name);
      this.$router.push({ name: 'grassStaff', query: { id, name: chename } });
    },
    checkName(name) {
      return name.substring(0, 1);
    },
    getokrData() {
      this.server.okrData({
        periodId: this.periodId,
        orgId: this.orgId,
      }).then((res) => {
        this.mainData = res.data;
      });
    },
    getokrRisk() {
      this.server.okrRisk({
        periodId: this.periodId,
        orgId: this.orgId,
      }).then((res) => {
        this.tableData = res.data;
      });
    },
    getmainData() {
      this.server.mainData({
        periodId: this.periodId,
        orgId: this.orgId,
      }).then((res) => {
        console.log(res);
      });
    },
    // eslint-disable-next-line no-shadow
    getPeriod(periodId) {
      this.periodId = periodId;
      this.getokrRisk();
      this.getokrData();
      this.getmainData();
    },
    getqueryMyOkr() {
      this.server.queryMyOkr({
        myOrOrg: 'org', status: '1', orgId: this.orgId, type: 'INDEX',
      }).then((res) => {
        if (res.code == 200) {
          this.orgUser = res.data.orgUser;
          this.orgTable = res.data.orgTable;
        }
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