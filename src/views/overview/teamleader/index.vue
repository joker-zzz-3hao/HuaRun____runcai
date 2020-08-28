<template>
  <div class="home">
    <tl-period @getPeriod="getPeriod"></tl-period>
    <div class="creatOkr">
      <div>云门户</div>
      <div v-if="false">
        <img style="width:100px;height:100px;display:block;border:1px solid black;" src alt srcset />
        <el-button type="primary">创建OKR</el-button>
      </div>
      <tl-org-page></tl-org-page>
      <div>
        <ul>
          <li class="user-info" style="display:flex;flex-direction: row;">
            <div class="user-name">马云</div>
            <div class="user-name">马云</div>
            <div class="user-name">马云</div>
          </li>
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
    }),
  },
  data() {
    return {
      server,
      tableData: [],
      period: '',
      mainData: [],
    };
  },
  mounted() {

  },
  methods: {

    getokrData() {
      this.server.okrData({
        periodId: this.period,
        orgId: this.userInfo.orgId,
      }).then((res) => {
        console.log(res);
      });
    },
    getokrRisk() {
      this.server.okrRisk({
        periodId: this.period,
        orgId: this.userInfo.orgId,
      }).then((res) => {
        this.tableData = res.data;
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
    // eslint-disable-next-line no-shadow
    getPeriod(period) {
      this.period = period;
      this.getokrRisk();
      this.getokrData();
      this.getmainData();
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