<template>
  <div class="home">
    <tl-period></tl-period>
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
      <tl-okr-schedule></tl-okr-schedule>
    </div>
    <div class="creatOkr">
      <div>
        <em>OKR承接与变更统计</em>
      </div>
      <div>
        <el-table :data="tableData" border>
          <el-table-column prop="data1" label></el-table-column>
          <el-table-column prop="data2" label="容云"></el-table-column>
          <el-table-column prop="data3" label="捷云"></el-table-column>
          <el-table-column prop="data4" label="耕云"></el-table-column>
          <el-table-column prop="data5" label="行云"></el-table-column>
          <el-table-column prop="data6" label="合云"></el-table-column>
          <el-table-column prop="data7" label="门户"></el-table-column>
          <el-table-column prop="data8" label="运维管理"></el-table-column>
          <el-table-column prop="data9" label="运营管理部"></el-table-column>
        </el-table>
      </div>
    </div>

    <tl-weeking></tl-weeking>
  </div>
</template>

<script>
import okrSchedule from './components/okrSchedule';
import okrUpdate from './components/okrUpdate';
import okrRiskTotal from './components/okrRiskTotal';
import orgPage from '../component/orgPage';
import weeking from './components/weeking';
import period from '../component/period';

export default {
  name: 'departleader',
  components: {
    'tl-okr-schedule': okrSchedule,
    // eslint-disable-next-line vue/no-unused-components
    'tl-okr-update': okrUpdate,
    // eslint-disable-next-line vue/no-unused-components
    'tl-okr-risk-total': okrRiskTotal,
    'tl-weeking': weeking,
    'tl-org-page': orgPage,
    'tl-period': period,
  },
  data() {
    return {
      tableData: [
        {
          data1: '承接数',
          data2: '111',
          data3: '111',
          data4: '111',
          data5: '111',
          data6: '111',
          data7: '111',
          data8: '111',
          data9: '111',
        },
        {
          data1: '变更数',
          data2: '111',
          data3: '111',
          data4: '111',
          data5: '111',
          data6: '111',
          data7: '111',
          data8: '111',
          data9: '111',
        },
        {
          data1: '总人数',
          data2: '111',
          data3: '111',
          data4: '111',
          data5: '111',
          data6: '111',
          data7: '111',
          data8: '111',
          data9: '111',
        },
      ],
    };
  },
  methods: {

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