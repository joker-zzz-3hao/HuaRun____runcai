<template>
  <div class="weeking">
    <div class="model">
      <div>OKR风险状态统计</div>
      <div>
        <el-select
          placeholder="请选择"
          class="selectTime"
          v-model="periodId"
          @change="getriskStatistics"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :value="item.periodId"
            :label="item.periodName"
          ></el-option>
        </el-select>
      </div>
      <div id="weeking"></div>
      <ul class="departList">
        <li
          v-for="(item,index) in orgTable"
          :key="index"
          :class="{ 'active':active==index }"
          @click="changIdAction(item.orgId,index)"
        >
          {{
          item.orgName
          }}
        </li>
      </ul>
    </div>
    <div class="model">
      <div>周报动态</div>
      <el-date-picker
        format="yyyy-MM"
        value-format="yyyy-MM"
        v-model="dateTime"
        @change="getDate"
        type="month"
        placeholder="选择日期"
      ></el-date-picker>

      <el-select v-model="calendarId" @change="orgWeekly" placeholder="请选择">
        <el-option
          :key="index"
          :value="item.calendarId"
          v-for="(item,index) in dateOption"
          :label="item.weekBegin+' 至 '+item.weekEnd"
        ></el-option>
      </el-select>
      <div>
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
    <div class="model">
      <div>员工情绪大屏</div>
      <div>
        <el-date-picker
          format="yyyy-MM"
          value-format="yyyy-MM"
          v-model="mooddate"
          @change="getDateMood"
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
import { mapState } from 'vuex';
import Server from '../../server';

const server = new Server();
export default {
  name: 'weeking',
  props: {
    orgTable: {
      type: [String, Object, Array],
    },
  },
  data() {
    return {
      mooddate: '',
      periodId: '',
      value: '',
      server,
      orgId: '',
      calendarId: '',
      dateTime: '',
      options: [],
      dateOption: [],
      echartDataY: [],
      echartDataX: [],
      tableData: [],
      moodDataX: [],
      moodDataY: [],
      active: 0,
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
    }),
  },
  mounted() {
    this.fetchData();
    this.getokrQuery();
  },
  methods: {
    fetchData() {
      const date = new Date();
      const y = date.getFullYear();
      const m = date.getMonth();
      const time = `${y}-${m}`;
      this.dateTime = time;
      this.mooddate = time;
      this.getDate(this.dateTime);
      this.getDateMood(this.mooddate);
    },
    getDate(date) {
      this.calendarQurey(`${date}-01`);
    },
    getDateMood(date) {
      this.orgEmotion(`${date}-01`);
    },
    calendarQurey(date) {
      this.server.calendarQurey(
        {
          date,
        },
      ).then((res) => {
        this.dateOption = res.data;
        this.calendarId = res.data[0].calendarId;
        this.$nextTick(() => {
          this.orgWeekly();
        });
      });
    },
    orgWeekly() {
      this.server.orgWeekly({
        calendarId: this.calendarId,
        date: this.dateTime,
        userId: this.$route.query.id ? this.$route.query.id : this.userInfo.userId,
      }).then((res) => {
        this.tableData = res.data;
      });
    },
    changIdAction(id, index) {
      this.orgId = id;
      // if (this.active[index]) {
      //   this.$set(this.active, index, false);
      // } else {
      //   this.$set(this.active, index, true);
      // }
      this.active = index;
      this.getriskStatistics();
    },
    getokrQuery() {
      this.server.okrQuery().then((res) => {
        this.options = res.data.content;
        this.periodId = this.options[0].periodId;
        this.orgId = this.orgTable[0].orgId;
        this.getriskStatistics();
      });
    },
    getriskStatistics() {
      this.server.riskStatistics({
        periodId: this.periodId,
        orgId: this.orgId,
        personOrOrg: 'org',
      }).then((res) => {
        this.echartDataX = [];
        const startDate = `${res.data.months[0]}-01`;
        const endtDate = `${res.data.months.pop()}-31`;
        const cheTime = new Date(endtDate).getTime() - new Date(startDate).getTime();
        const oneDay = 24 * 3600 * 1000;
        let startche = +new Date(startDate);
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < cheTime / oneDay; i++) {
          // eslint-disable-next-line no-const-assign
          startche += oneDay;
          const now = new Date(startche);
          let months = '';
          let day = '';
          if (now.getMonth() < 9) {
            months = `0${now.getMonth() + 1}`;
          } else {
            months = now.getMonth() + 1;
          }
          if (now.getDate() < 10) {
            day = `0${now.getDate()}`;
          } else {
            day = now.getDate();
          }
          this.echartDataX.push([now.getFullYear(), months, day].join('-'));
        }
        if (res.data.datas) {
          this.echartDataY = {
            type: 'line',
            symbol: 'circle',
            showAllSymbol: true,
            data: res.data.datas.map((item) => [item.createDate, item.allScore]),
          };
        } else {
          this.echartDataY = {
            type: 'line',
            symbol: 'circle',
            showAllSymbol: true,
            data: [],
          };
        }
        this.init();
      });
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('weeking'));
      const option = {
        xAxis: {
          data: that.echartDataX,
        },
        legend: {
          data: that.orgTable.map((item) => item.orgName),
        },

        yAxis: {
          min: 0,
          max: 7,
          axisLabel: {
            formatter(value) {
              const texts = [];
              if (value == 0) {
                console.log(1);
              } else if (value == 1) {
                texts.push('无风险');
              } else if (value == 4) {
                texts.push('风险可控');
              } else if (value == 7) {
                texts.push('失控');
              }
              return texts;
            },
          },
        },
        dataZoom: { show: true },
        tooltip: {},
        series: [
          that.echartDataY,
        ],

      };

      myChart.setOption(option);
    },
    initMood() {
      const that = this;
      const myChart = echarts.init(document.getElementById('mood'));
      const option = {
        dataset: {
          source: that.moodDataY,
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
        tooltip: {
          trigger: 'item',
          position: 'top',
          formatter(params) {
            console.log(params);
            return `<div>沮丧${params.data[1]}</div>
            <div>平常${params.data[2] ? params.data[2] : 0}</div>
            <div>开心${params.data[3] ? params.data[3] : 0}</div>`;
          },
        },
        xAxis: { type: 'category' },
        yAxis: {
          min: 0,
          max: 50,
        },
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
    orgEmotion(date) {
      this.server.orgEmotion({
        date,
      }).then((res) => {
        this.moodDataX = res.data.map((item) => item.orgName);
        this.moodDataY = res.data.map((item) => ([
          item.orgName,
          ...item.emotionList.map((li) => (li.weeklyNumber)),
        ]));
        this.moodDataY = [['product', '0', '50', '100'], ...this.moodDataY];
        this.initMood();
      });
    },
  },
};
</script>
<style  scoped>
#weeking {
  width: 70%;
  height: 400px;
  display: inline-block;
}

.model {
  width: 100%;
  min-height: 200px;
  background: white;
  margin-bottom: 30px;
}
.active {
  color: blue;
}
#mood {
  width: 100%;
  height: 400px;
}
.departList {
  display: inline-block;
}
</style>