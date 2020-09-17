<template>
  <div class="weeking">
    <div class="model">
      <div>OKR风险状态统计</div>
      <!-- <div>
        <el-select placeholder="请选择" class="selectTime" v-model="periodId" @change="changeTime">
          <el-option
            v-for="item in options"
            :key="item.id"
            :value="item.periodId"
            :label="item.periodName"
          ></el-option>
        </el-select>
      </div>-->
      <div class="echartFlex">
        <div style="width:50%">
          <div id="weeking"></div>
          <ul class="departList">
            <li
              v-for="(item,index) in orgTable"
              :key="index"
              :class="{'active':active[item.orgId] }"
              @click="changIdAction(item.orgId)"
            >
              {{
              item.orgName
              }}
            </li>
          </ul>
        </div>

        <div style="width:50%">
          <div>员工情绪大屏</div>
          <div>
            <el-date-picker
              format="yyyy-MM"
              value-format="yyyy-MM"
              v-model="mooddate"
              @change="getDateMood"
              :clearable="false"
              type="month"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
          <div id="mood"></div>
        </div>
      </div>
    </div>
    <div class="model">
      <div>周报动态</div>
      <el-date-picker
        format="yyyy-MM"
        value-format="yyyy-MM"
        v-model="dateTime"
        @change="getDate"
        :clearable="false"
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
  </div>
</template>

<script>
import echarts from 'echarts';
import { mapState } from 'vuex';
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
      active: {},
      orgTable: [],
      testModel: false,
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
      this.getDate(this.dateTime);
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
        console.log(new Date().getTime());
        const eq = dateArr.findIndex((item) => item[0] <= new Date().getTime() && new Date().getTime() <= item[1]);
        if (eq) {
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
        this.tableData = res.data;
      });
    },
    changIdAction(id) {
      this.orgId = id;
      if (this.active[id]) {
        this.$set(this.active, id, false);
      } else {
        this.$set(this.active, id, true);
      }

      this.getriskStatistics();
    },
    getqueryMyOkr() {
      this.server.queryMyOkr({
        myOrOrg: 'org', status: '1', orgId: this.$route.query.id ? this.$route.query.id : this.setOrgId, type: 'INDEX',
      }).then((res) => {
        if (res.code == 200) {
          this.orgTable = res.data.orgTable;
          this.changeTime();

          this.$watch('periodId', () => {
            this.changeTime();
          });
        }
      });
    },
    changeTime() {
      this.active = {};
      this.$set(this.active, this.orgTable[0].orgId, true);
      this.orgId = this.orgTable[0].orgId;
      this.echartDataY = [];
      this.getriskStatistics();
    },
    getriskStatistics() {
      if (!this.periodId) {
        return false;
      }
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

        // eslint-disable-next-line valid-typeof
        const array = res.data.datas ? res.data.datas.filter((item) => item) : [];
        const boolId = this.echartDataY.some((item) => item.orgId == this.orgId);
        if (!boolId) {
          this.echartDataY.push({
            orgId: this.orgId,
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
            data: res.data.datas ? array.map((li) => [li.createDate, li.allScore]) : [],
          });
        } else if (!this.active[this.orgId]) {
          this.echartDataY.forEach((item, index) => {
            if (item.orgId == this.orgId) {
              this.echartDataY[index] = {
                orgId: this.orgId,
                type: 'line',
                symbol: 'circle',
                symbolSize: 7,
                showAllSymbol: true,
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
              };
            }
          });
        } else {
          this.echartDataY.forEach((item, index) => {
            if (item.orgId == this.orgId) {
              this.echartDataY[index] = {
                orgId: this.orgId,
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
                data: res.data.datas ? array.map((li) => [li.createDate, li.allScore]) : [],
              };
            }
          });
        }
        this.$nextTick(() => {
          this.init();
        });
      });
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('weeking'));
      const option = {
        xAxis: {
          data: that.echartDataX,
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
        series: that.echartDataY,

      };

      myChart.setOption(option, true);
      myChart.resize();
    },
    initMood() {
      const that = this;
      const myChartmood = echarts.init(document.getElementById('mood'));
      const option = {
        dataset: {
          source: that.testModel ? mainData.moodData : that.moodDataY,
        },
        legend: {
          bottom: 'bottom',
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
            return `<div>沮丧${params.data[1]}</div>
            <div>平常${params.data[2] ? params.data[2] : 0}</div>
            <div>开心${params.data[3] ? params.data[3] : 0}</div>`;
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

      myChartmood.setOption(option);
      myChartmood.resize();
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
<style  scoped>
#weeking {
  width: 100%;
  height: 400px;
  display: block;
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
.echartFlex {
  display: flex;
  flex-direction: row;
}
#mood {
  width: 100%;
  height: 400px;
  display: block;
}
.departList {
  display: flex;
  flex-direction: row;
}
.departList li {
  margin-right: 10px;
}
</style>