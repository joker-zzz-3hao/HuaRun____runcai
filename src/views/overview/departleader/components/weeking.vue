<template>
  <div class="tl-card-panel">
    <div class="card-panel-inside">
      <div class="card-panel-head">
        <div class="panner-title">
          <em>OKR风险状态统计</em>
          <span v-show="testModel">示例数据</span>
        </div>
      </div>
      <div class="card-panel-body">
        <div id="week-depart"></div>
        <ul class="data-list">
          <li
            v-for="(item, index) in orgTable"
            :key="index"
            :class="{ active: active[item.orgId] }"
            @click="changIdAction(item.orgId, index)"
          >
            {{ item.orgName }}
          </li>
        </ul>
      </div>
    </div>
    <div class="card-panel-inside">
      <div class="card-panel-head">
        <div class="panner-title">
          <em>员工情绪大屏</em>
          <span v-show="testModel">示例数据</span>
        </div>
      </div>
      <div class="card-panel-body flex-column">
        <div class="flex-end">
          <el-date-picker
            format="yyyy-MM"
            value-format="yyyy-MM"
            v-model="mooddate"
            :editable="false"
            @change="getDateMood"
            :clearable="false"
            type="month"
            placeholder="选择日期"
          ></el-date-picker>
        </div>
        <div id="mood-depart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import { mapState } from 'vuex';
import Bus from '../bus';
import Server from '../../server';
import { mainData } from '../../testData';

const server = new Server();
export default {
  props: {
    periodId: {
      type: [String, Number],
    },
  },
  name: 'weeking',
  data() {
    return {
      mooddate: '',
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
      myChartmood: '',
      myChart: '',
      active: {},
      orgTable: [],
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

  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
      testModel: (state) => state.testModel,
    }),
  },
  mounted() {
    this.fetchData();
    this.getqueryMyOkr();
  },

  methods: {
    fetchData() {
      const date = new Date();
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const time = `${y}-${m}`;
      this.dateTime = time;
      this.mooddate = time;
      // this.getDate(this.dateTime);
      this.getDateMood(this.mooddate);
    },
    getDate(date) {
      this.calendarQurey(`${date}-01`);
    },
    getDateMood(date) {
      this.$nextTick(() => {
        this.orgEmotion(`${date}-01`);
      });
    },
    calendarQurey(date) {
      this.server.calendarQurey(
        {
          date,
        },
      ).then((res) => {
        this.dateOption = res.data;
        // eslint-disable-next-line max-len
        const dateArr = this.dateOption.map((item) => [new Date(item.weekBegin).getTime(), new Date(item.weekEnd).getTime()]);
        const eq = dateArr.findIndex((item) => item[0] <= new Date().getTime() && new Date().getTime() <= item[1]);
        if (eq >= 0) {
          this.calendarId = res.data[eq].calendarId;
        } else {
          this.calendarId = res.data[0].calendarId;
        }

        this.$nextTick(() => {
          this.orgWeekly();
        });
      });
    },
    orgWeekly() {
      this.server.orgWeekly({
        calendarId: this.calendarId,
        date: `${this.dateTime}-01`,
        orgId: this.$route.query.id ? this.$route.query.id : this.userInfo.orgId,
      }).then((res) => {
        this.tableData = this.testModel ? mainData.tableData.data : res.data;
      });
    },
    async changIdAction(id, index) {
      this.orgId = id;
      const departData = await this.getDepartData(id);
      if (this.active[id]) {
        this.$set(this.active, id, false);
        this.$set(this.echartDataY[index], 'data', []);
      } else {
        this.$set(this.active, id, true);
        this.$set(this.echartDataY[index], 'data', departData);
      }

      await this.init();
    },
    getqueryMyOkr() {
      Bus.$once('getOrgTable', (orgTable) => {
        this.orgTable = this.testModel ? mainData.orkData.data : orgTable;
        this.active = {};
        this.echartDataY = [];
        this.orgId = this.orgTable[0].orgId;
        this.getInit(this.orgTable);
        this.$watch('periodId', () => {
          this.changIdAction(this.orgTable[0].orgId, 0);
        }, { immediate: true });
      });
    },
    getDepartData(orgId) {
      if (!this.periodId) {
        this.init();
        return false;
      }
      return new Promise((reslove) => {
        this.server.riskStatistics({
          periodId: this.periodId,
          orgId,
          personOrOrg: 'org',
        }).then((res) => {
          const datasY = res.data.datas ? res.data.datas.map((item) => [item.createDate, item.allScore]) : [];
          // eslint-disable-next-line no-unused-expressions
          this.echartDataX = [];
          this.listTime(res.data);
          reslove(datasY);
        });
      });
    },
    getInit(orgTable) {
      this.echartDataY = orgTable.map(() => ({
        type: 'line',
        symbol: 'circle',
        showAllSymbol: true,
        symbolSize: 7,
        itemStyle: {
          normal: {
            color(params) {
              if (params.value[1] == 1) {
                return '#4CCD79';
              }
              if (params.value[1] == 4) {
                return '#FFBC20';
              }
              if (params.value[1] == 7) {
                return '#FB4C59 ';
              }
            },

          },
        },
        data: [],
      }));
    },
    listTime(dateTime) {
      const startDate = `${dateTime.months[0]}-01`;
      const endtDate = `${dateTime.months.pop()}-31`;
      const cheTime = new Date(endtDate).getTime() - new Date(startDate).getTime();
      const oneDay = 24 * 3600 * 1000;
      let startche = +new Date(startDate) - oneDay;
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
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('week-depart'));
      const option = {
        xAxis: {
          data: that.testModel ? mainData.timeData : that.echartDataX,
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
          },
          axisLabel: {
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
          },
        },
        legend: {
          data: that.orgTable.map((item) => item.orgName),
        },

        yAxis: {
          min: 0,
          max: 7,
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },

          },
          axisLabel: {
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
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
        tooltip: {
          formatter(params) {
            if (params.value[1] == 1) {
              return `${params.value[0]},无风险`;
            } if (params.value[1] == 4) {
              return `${params.value[0]},风险可控`;
            } if (params.value[1] == 7) {
              return `${params.value[0]},失控`;
            }
          },
        },
        series: that.testModel ? mainData.lineData : that.echartDataY,

      };

      myChart.setOption(option, true);
      myChart.resize();
      window.addEventListener('resize', myChart.resize);
    },
    initMood() {
      const that = this;
      const myChartmood = echarts.init(document.getElementById('mood-depart'));
      const option = {
        dataset: {
          source: that.testModel ? mainData.moodData : that.moodDataY,
        },
        legend: {
          bottom: 'bottom',
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
        tooltip: {
          trigger: 'item',
          position: 'top',
          formatter(params) {
            return `<div>让我静静${params.data[1]}</div>
            <div>还行吧${params.data[2] ? params.data[2] : 0}</div>
            <div>有收获${params.data[3] ? params.data[3] : 0}</div>`;
          },
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
            formatter(value) {
              let ret = '';// 拼接加\n返回的类目项
              const maxLength = 4;// 每项显示文字个数
              const valLength = value.length;// X轴类目项的文字个数
              const rowN = Math.ceil(valLength / maxLength); // 类目项需要换行的行数
              if (rowN > 1)// 如果类目项的文字大于3,
              // eslint-disable-next-line brace-style
              {
                // eslint-disable-next-line no-plusplus
                for (let i = 0; i < rowN; i++) {
                  let temp = '';// 每次截取的字符串
                  const start = i * maxLength;// 开始截取的位置
                  const end = start + maxLength;// 结束截取的位置
                  // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  temp = `${value.substring(start, end)}...`;
                  ret = temp; // 拼接最终的字符串
                }
                return ret;
              }
              return value;
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
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小

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

      myChartmood.setOption(option);
      myChartmood.resize();
      window.addEventListener('resize', myChartmood.resize);
    },
    orgEmotion(date) {
      this.server.orgEmotion({
        date,
        orgId: this.$route.query.id ? this.$route.query.id : this.setOrgId,
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