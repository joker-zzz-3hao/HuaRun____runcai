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
      <!-- <div>
        <div>进行中工作项</div>
        <div>已完成工作项</div>
      </div>-->
    </div>
    <div class="model">
      <div>周报互动记录</div>
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
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="orgName" label="部门"></el-table-column>
        <el-table-column prop="orgNumber" label="部门人数"></el-table-column>
        <el-table-column label="标准/简单模式">
          <template slot-scope="scope">
            <span>{{scope.row.weeklyType0Number}}/{{scope.row.weeklyType1Number}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="visitSum" label="浏览次数"></el-table-column>
        <el-table-column prop="visitUserNumber" label="浏览人数"></el-table-column>
        <el-table-column prop="orgAdminUserName" label="负责人"></el-table-column>
      </el-table>
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
      this.getteamWeeklyCount(`${date}-01`);
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

        this.init();
      });
    },
    getteamWeeklyCount(date) {
      this.server.teamWeeklyCount({
        date,
      }).then((res) => {
        this.tableData = res.data;
      });
    },
    teamEmotion(date) {
      this.server.teamEmotion({
        date,
        userId: this.$route.query.id,
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
        tooltip: {
          trigger: 'item',
          position: 'top',
          formatter(params) {
            console.log(params);
            return `<div>进行中的工作项${params.data[1]}</div><div>已完成的工作项${params.data[2]}</div>`;
          },
        },
        legend: {
          data: ['进行中的工作项', '已完成的工作项'],
        },
        dataset: {
          dimensions: ['product', '进行中的工作项', '已完成的工作项'],
          source: that.teamDataX,
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
          },
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
          },
        },
        yAxis: {
          min: 0,
          max: 100,
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#F4F6F8'],
              width: 1,
              type: 'solid',
            },
          },
          axisLabel: {
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
          },
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: 'bar',
            barWidth: 8,
            itemStyle: {
              normal: { color: '#4CCD79' },
            },
          },
          {
            type: 'bar',
            barWidth: 8,
            itemStyle: {
              normal: { color: '#FFBC20' },
            },
          },
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
          position: 'top',
          formatter(params) {
            return `<div>沮丧${params.data['0']}</div>
            <div>平常${params.data['50'] ? params.data['50'] : 0}</div>
            <div>开心${params.data['100'] ? params.data['50'] : 0}</div>`;
          },
        },
        legend: {
          data: ['0', '50', '100'],
          formatter(params) {
            if (params == '0') {
              return '沮丧';
            }
            if (params == '50') {
              return '平常';
            }
            if (params == '100') {
              return '开心';
            }
          },
        },

        dataset: {
          dimensions: ['product', '0', '50', '100'],
          source: that.moodDataY,
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
          },
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
          },
        },
        yAxis: {
          min: 0,
          max: 50,
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#F4F6F8'],
              width: 1,
              type: 'solid',
            },
          },
          axisLabel: {
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
          },
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: 'bar',
            barWidth: 7,
            itemStyle: {
              normal: { color: '#FFBC20' },
            },
          },
          {
            type: 'bar',
            barWidth: 7,
            itemStyle: {
              normal: { color: '#3F7DFF' },
            },
          },
          {
            type: 'bar',
            barWidth: 7,
            itemStyle: {
              normal: { color: '#FB4C59' },
            },
          },
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