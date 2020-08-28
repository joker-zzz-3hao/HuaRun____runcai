<template>
  <div class="weeking">
    <div class="model">
      <div>周报动态</div>
      <el-select v-model="value" placeholder="请选择">
        <el-option :key="1" :value="1">2020年07月 第三周</el-option>
      </el-select>
      <div id="weeking"></div>
    </div>
    <div class="model">
      <div>周报动态</div>
      <el-table :data="tableData" :show-header="false" style="width: 100%">
        <el-table-column prop="name" label="名称" width="100"></el-table-column>
        <el-table-column prop="desc" label="内容"></el-table-column>
        <el-table-column prop="date" label="日期"></el-table-column>
      </el-table>
    </div>
    <div class="model">
      <div>周报动态</div>
      <div>
        <el-select v-model="value" placeholder="请选择">
          <el-option :key="1" :value="1">2020年07月 第三周</el-option>
        </el-select>
      </div>
      <div id="mood" style="display:inline-block"></div>
      <div style="display:inline-block">
        <el-table :data="submittData" border style="width: 400px;">
          <el-table-column prop="name" label="已提交" width="100"></el-table-column>
          <el-table-column prop="desc" label="未提交"></el-table-column>
          <el-table-column prop="date" label="简单模式"></el-table-column>
          <el-table-column prop="ad" label="标准模式"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import Server from '../../server';

const server = new Server();
export default {
  name: 'weeking',
  data() {
    return {
      server,
      dateOption: [],
      value: '',
      tableData: [
        {
          name: '陆涛',
          desc: '完成了工作项：「与传统PAAS、网络安全服务部沟通堡垒机外网访问的需求编写',
          date: '2020年7月21日',
        },
        {
          name: '陆涛',
          desc: '完成了工作项：「与传统PAAS、网络安全服务部沟通堡垒机外网访问的需求编写',
          date: '2020年7月21日',
        },
        {
          name: '陆涛',
          desc: '完成了工作项：「与传统PAAS、网络安全服务部沟通堡垒机外网访问的需求编写',
          date: '2020年7月21日',
        },
      ],
      submittData: [
        {
          name: '112',
          desc: '11',
          date: '12',
          ad: '12',
        },
        {
          name: '112',
          desc: '11',
          date: '12',
          ad: '12',
        },
        {
          name: '112',
          desc: '11',
          date: '12',
          ad: '12',
        },
      ],
    };
  },
  mounted() {
    this.init();
    this.initMood();
  },
  methods: {

    init() {
      const myChart = echarts.init(document.getElementById('weeking'));
      const option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          name: '邮件营销',
          type: 'line',
          stack: '总量',
        },
        {
          data: [120, 132, 101, 134, 90, 230, 210],
          name: '联盟广告',
          type: 'line',
          stack: '总量',
        }],
      };

      myChart.setOption(option);
    },
    initMood() {
      const myChart = echarts.init(document.getElementById('mood'));
      const option = {
        xAxis: {
          type: 'category',
          data: ['开心', '沮丧', '平常'],
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          data: [120, 200, 150],
          type: 'bar',
          showBackground: true,
          barWidth: 30,
          backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)',
          },
        }],
      };

      myChart.setOption(option);
    },
  },
};
</script>
<style  scoped>
#weeking {
  width: 100%;
  height: 400px;
}

.model {
  width: 100%;
  min-height: 200px;
  background: white;
  margin-bottom: 30px;
}

#mood {
  width: 300px;
  height: 400px;
}
</style>