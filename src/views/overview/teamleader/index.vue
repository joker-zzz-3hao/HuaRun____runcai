<template>
  <div class="home">
    <div class="creatOkr">
      <div>云门户</div>
      <div>
        <img style="width:100px;height:100px;display:block;border:1px solid black;" src alt srcset />
        <el-button type="primary">创建OKR</el-button>
      </div>
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
      <div>OKR进度更新榜</div>
      <tl-okr-update></tl-okr-update>
    </div>
    <div class="creatOkr">
      <div>
        OKR风险状态统计
        <span>部门成员的OKR风险状态总数，点击可以查看对应的OKR列表</span>
      </div>
      <div>
        <el-table :data="tableData" border style="width: 400px;display:inline-block">
          <el-table-column prop="kr" label="KR状态"></el-table-column>
          <el-table-column prop="num" label="数量"></el-table-column>
          <el-table-column prop="zhanbi" label="占比"></el-table-column>
        </el-table>
        <div style="display:inline-block">
          <tl-okr-risk-total></tl-okr-risk-total>
        </div>
        <ul style="display:inline-block">
          <li>风险 20</li>
          <li>风险可控 20</li>
          <li>无风险 20</li>
        </ul>
      </div>
    </div>

    <tl-weeking></tl-weeking>
  </div>
</template>

<script>
import okrSchedule from './components/okrSchedule';
import okrUpdate from './components/okrUpdate';
import okrRiskTotal from './components/okrRiskTotal';
import weeking from './components/weeking';

export default {
  name: 'teamleader',
  components: {
    'tl-okr-schedule': okrSchedule,
    'tl-okr-update': okrUpdate,
    'tl-okr-risk-total': okrRiskTotal,
    'tl-weeking': weeking,
  },
  data() {
    return {
      tableData: [
        {
          num: 111,
          zhanbi: '50%',
          kr: '风险贼大',
        },
        {
          num: 111,
          zhanbi: '50%',
          kr: '风险贼大',
        },
        {
          num: 111,
          zhanbi: '50%',
          kr: '风险贼大',
        },
        {
          num: 111,
          zhanbi: '50%',
          kr: '风险贼大',
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