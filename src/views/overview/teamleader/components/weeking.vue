<template>
  <div class="weeking">
    <div class="tl-card-panel">
      <div class="card-panel-head">
        <div class="panner-title">
          <em>周报动态</em>
          <em v-show="testModel">(示例数据)</em>
        </div>
      </div>
      <div class="card-panel-body">
        <div class="echart-operating">
          <el-date-picker
            format="yyyy-MM"
            value-format="yyyy-MM"
            v-model="teamTime"
            @change="getteamTime"
            :picker-options="pickerBeginDateBefore"
            :clearable="false"
            type="month"
            placeholder="选择日期"
            popper-class="tl-month-popper"
            class="tl-month-editor"
          ></el-date-picker>
        </div>
        <div id="weeking"></div>
      </div>
    </div>
    <div class="tl-card-panel">
      <div class="card-panel-head">
        <div class="panner-title">
          <em>周报互动记录</em>
          <em v-show="testModel">(示例数据)</em>
        </div>
      </div>
      <div class="card-panel-body">
        <div class="echart-operating">
          <el-date-picker
            format="yyyy-MM"
            value-format="yyyy-MM"
            v-model="dateTime"
            @change="getDate"
            type="month"
            :clearable="false"
            placeholder="选择日期"
            popper-class="tl-month-popper"
            class="tl-month-editor"
          ></el-date-picker>
        </div>
        <div id="mood"></div>
      </div>
      <el-table :data="tableData" class="tl-table">
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
import { mapState } from 'vuex';
import Server from '../../server';
import { teamData } from '../../testData';

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
      pickerBeginDateBefore: {
        disabledDate(time) {
          const times = new Date();
          const startValue = `${times.getFullYear()}-01`;
          const startTime = new Date(startValue);
          return time.getTime() < startTime.getTime();
        },
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      testModel: (state) => state.testModel,
    }),
  },
  methods: {
    fetchData() {
      const date = new Date();
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
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
        orgId: this.$route.query.id,
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
        orgId: this.$route.query.id,
      }).then((res) => {
        this.tableData = this.testModel ? teamData.okrData.data : res.data;
      });
    },
    teamEmotion(date) {
      this.server.teamEmotion({
        date,
        orgId: this.$route.query.id,
      }).then((res) => {
        this.moodDataX = res.data.map((item) => `${item.weekBegin}至${item.weekEnd}`);
        this.moodDataY = res.data.map((item) => ([
          `${item.weekBegin}至${item.weekEnd}`,
          ...item.emotionList.map((li) => li.weeklyNumber),
        ]));
        this.initMood();
      });
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('weeking'));
      console.log(that.moodDataY);
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
          source: that.testModel ? teamData.weekX : that.teamDataX,
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
              normal: { barBorderRadius: 5, color: '#4CCD79' },
            },
          },
          {
            type: 'bar',
            barWidth: 8,
            itemStyle: {
              normal: { barBorderRadius: 5, color: '#FFBC20' },
            },
          },
        ],
      };

      myChart.setOption(option);
      myChart.resize();
    },
    initMood() {
      const that = this;
      const myChart = echarts.init(document.getElementById('mood'));
      const option = {
        tooltip: {
          trigger: 'item',
          position: 'top',
          formatter(params) {
            console.log(params);
            return `<div>让我静静${params.data[1]}</div>
            <div>还行吧${params.data[2] ? params.data[2] : 0}</div>
            <div>有收获${params.data[3] ? params.data[3] : 0}</div>`;
          },
        },
        legend: {
          data: ['0', '50', '100'],
          formatter(params) {
            if (params == '0') {
              return '让我静静';
            }
            if (params == '50') {
              return '还行吧';
            }
            if (params == '100') {
              return '有收获';
            }
          },
        },

        dataset: {
          dimensions: ['product', '0', '50', '100'],
          source: that.testModel ? teamData.weekY : that.moodDataY,
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
              normal: { barBorderRadius: 5, color: '#FFBC20' },
            },
          },
          {
            type: 'bar',
            barWidth: 7,
            itemStyle: {
              normal: { barBorderRadius: 5, color: '#3F7DFF' },
            },
          },
          {
            type: 'bar',
            barWidth: 7,
            itemStyle: {
              normal: { barBorderRadius: 5, color: '#FB4C59' },
            },
          },
        ],
      };

      myChart.setOption(option);
      myChart.resize();
      window.addEventListener('resize', myChart.resize);
    },
  },
};
</script>