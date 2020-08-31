<template>
  <div class="weeking">
    <div class="model">
      <div>周报动态</div>
      <el-date-picker
        format="yyyy-MM"
        value-format="yyyy-MM"
        v-model="teamTime"
        @change="getteamTime"
        type="month"
        placeholder="选择日期"
      ></el-date-picker>
      <div id="weeking"></div>
      <div>
        <div>进行中工作项</div>
        <div>已完成工作项</div>
      </div>
    </div>
    <div class="model">
      <div>周报动态</div>
      <div>
        <el-date-picker
          format="yyyy-MM"
          value-format="yyyy-MM"
          v-model="dateTime"
          @change="getDate"
          type="month"
          placeholder="选择日期"
        ></el-date-picker>
      </div>

      <div id="mood"></div>
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
      moodDataY: [],
      moodDataX: [],
      teamDataY: [],
      teamDataX: [],
      server,
      dateTime: '',
      teamTime: '',
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
    this.fetchData();
  },
  methods: {
    fetchData() {
      const date = new Date();
      const y = date.getFullYear();
      const m = date.getMonth();
      const time = `${y}-${m}`;
      this.dateTime = time;
      this.teamTime = time;
      this.getDate(this.dateTime);
      this.getteamTime(this.dateTime);
    },
    getteamTime(date) {
      this.teamWeekly(`${date}-01`);
    },
    getDate(date) {
      this.teamEmotion(`${date}-01`);
    },
    teamWeekly(date) {
      this.server.teamWeekly({
        date,
      }).then((res) => {
        this.teamDataX = res.data.map((item) => [
          `${item.weekBegin}至${item.weekEnd}`,
          item.doingNumber,
          item.doneNumber,
        ]);
        console.log(this.teamDataX);
        this.init();
      });
    },
    teamEmotion(date) {
      this.server.teamEmotion({
        date,
      }).then((res) => {
        this.moodDataX = res.data.map((item) => `${item.weekBegin}至${item.weekEnd}`);
        this.moodDataY = res.data.map((item) => ({
          product: `${item.weekBegin}至${item.weekEnd}`,
          ...item.emotionList.map((li) => li.weeklyNumber),
        }));
        this.initMood();
      });
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('weeking'));
      const option = {
        tooltip: {},
        dataset: {
          dimensions: ['product', '2015', '2016'],
          source: that.teamDataX,
        },
        xAxis: { type: 'category' },
        yAxis: {
          min: 0,
          max: 100,
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: 'bar',
            barWidth: 30,
          },
          { type: 'bar', barWidth: 30 },
        ],
      };

      myChart.setOption(option);
    },
    initMood() {
      const that = this;
      const myChart = echarts.init(document.getElementById('mood'));
      const option = {
        tooltip: {
          trigger: 'item',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter(params) {
            let name = '';
            if (params.seriesName == 0) {
              name = '开心';
            }
            if (params.seriesName == 1) {
              name = '沮丧';
            }
            if (params.seriesName == 2) {
              name = '平常';
            }
            return `<span>${name}</span>`;
          },
        },
        dataset: {
          dimensions: ['product', '0', '50', '100'],
          source: that.moodDataY,
        },
        xAxis: { type: 'category' },
        yAxis: {
          min: 0,
          max: 100,
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          { type: 'bar', barWidth: 30 },
          { type: 'bar', barWidth: 30 },
          { type: 'bar', barWidth: 30 },
        ],
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
  width: 100%;
  height: 400px;
}
</style>