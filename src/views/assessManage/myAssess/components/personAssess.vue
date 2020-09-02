<template>
  <div class="home">
    <div>
      <div style="display:inline-block">周期</div>
      <el-select v-model="value" placeholder="请选择">
        <el-option>11</el-option>
      </el-select>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="okrzhouqi" label="OKR周期" width="180"></el-table-column>
      <el-table-column prop="press" label="OKR进度"></el-table-column>
      <el-table-column prop="date" label="考核时间"></el-table-column>
      <el-table-column prop="enddate" label="终止考核时间"></el-table-column>
      <el-table-column prop="score" label="成员评分"></el-table-column>
      <el-table-column prop="pf" label="评分"></el-table-column>
      <el-table-column fixed="right" label="查看详情" width="130">
        <template>
          <el-button type="text" size="small">自评</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'myAssess',
  data() {
    return {
      value: '',
      tableData: [{
        name: '李四',
        okrzhouqi: '2020年第三季度',
        status: '待考核',
        press: '100%',
        date: '2019/09/15',
        enddate: '2019/09/25',
        score: '54',
        pf: '--',
      },
      {
        name: '李四',
        okrzhouqi: '2020年第三季度',
        status: '待考核',
        press: '100%',
        date: '2019/09/15',
        enddate: '2019/09/25',
        score: '54',
        pf: '--',
      }, {
        name: '李四',
        okrzhouqi: '2020年第三季度',
        status: '待考核',
        press: '100%',
        date: '2019/09/15',
        enddate: '2019/09/25',
        score: '54',
        pf: '--',
      }, {
        name: '李四',
        okrzhouqi: '2020年第三季度',
        status: '待考核',
        press: '100%',
        date: '2019/09/15',
        enddate: '2019/09/25',
        score: '54',
        pf: '--',
      }, {
        name: '李四',
        okrzhouqi: '2020年第三季度',
        status: '待考核',
        press: '100%',
        date: '2019/09/15',
        enddate: '2019/09/25',
        score: '54',
        pf: '--',
      }],
    };
  },
  components: {
  },
};
</script>