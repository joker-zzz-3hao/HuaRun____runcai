<template>
  <div class="weeking">
    <div class="model">
      <div>OKR风险状态统计</div>
      <el-select v-model="value" placeholder="请选择">
        <el-option>2020年07月 第三周</el-option>
      </el-select>
      <div id="weeking"></div>
    </div>
    <div class="model">
      <div>周报动态</div>
      <el-select v-model="value" placeholder="请选择">
        <el-option>2020年07月 第三周</el-option>
      </el-select>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="部门"></el-table-column>
        <el-table-column prop="desc" label="部门人数"></el-table-column>
        <el-table-column prop="date" label="标准/简单模式"></el-table-column>
        <el-table-column prop="name" label="浏览次数"></el-table-column>
        <el-table-column prop="desc" label="浏览人数"></el-table-column>
        <el-table-column prop="date" label="负责人"></el-table-column>
      </el-table>
    </div>
    <div class="model">
      <div>员工情绪大屏</div>
      <div>
        <el-select v-model="value" placeholder="请选择">
          <el-option>2020年07月 第三周</el-option>
        </el-select>
      </div>
      <div id="mood"></div>
      <ul>
        <li>开心</li>
        <li>沮丧</li>
        <li>平常</li>
      </ul>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'weeking',
  data() {
    return {
      tableData: [
        {
          name: '陆涛',
          desc: '1111',
          date: '2020年7月21日',
        },
        {
          name: '陆涛',
          desc: '1111',
          date: '2020年7月21日',
        },
        {
          name: '陆涛',
          desc: '1111',
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
          data: ['2020-7-10', '2020-7-11', '2020-7-12', '2020-7-13', '2020-7-14', '2020-7-15', '2020-7-16'],
        },
        yAxis: {
          min: 0,
          max: 4,
          axisLabel: {
            formatter(value) {
              const texts = [];
              if (value == 0) {
                console.log(1);
              } else if (value <= 1) {
                texts.push('无风险');
              } else if (value <= 2) {
                texts.push('风险可控');
              } else if (value <= 3) {
                texts.push('失控');
              }
              return texts;
            },
          },
        },
        series: [{
          name: '风险',
          type: 'line',
          data: [1, 3, 2, 3, 2, 1],
        },
        ],
      };

      myChart.setOption(option);
    },
    initMood() {
      const myChart = echarts.init(document.getElementById('mood'));
      const option = {
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ['product', '2015', '2016', '2017'],
          source: [
            {
              product: '行云', 2015: 43.3, 2016: 85.8, 2017: 93.7,
            },
            {
              product: '门户', 2015: 83.1, 2016: 73.4, 2017: 55.1,
            },
            {
              product: '盘云', 2015: 86.4, 2016: 65.2, 2017: 82.5,
            },
            {
              product: '大云', 2015: 72.4, 2016: 53.9, 2017: 39.1,
            },
            {
              product: '天云', 2015: 72.4, 2016: 53.9, 2017: 39.1,
            },
            {
              product: '容云', 2015: 72.4, 2016: 53.9, 2017: 39.1,
            },
            {
              product: '多云', 2015: 72.4, 2016: 53.9, 2017: 39.1,
            },
          ],
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' },
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