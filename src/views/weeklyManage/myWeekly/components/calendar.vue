<!--
  功能：
  作者：王志任
  时间：2020年08月31日 10:41:36
  备注：
-->
<template>
  <div>
    <div style="display: inline; list-style-type:none;padding: 5px 5px;">
      <el-date-picker
        v-model="monthDate"
        type="month"
        placeholder="选择月"
        value-format="yyyy-MM-dd"
        :picker-options="afterDisabled"
        @change="getWeek"
        :clearable="false"
      ></el-date-picker>
    </div>
    <!-- 选择周 -->
    <div
      v-if="weekList.length > 0 "
      style="display: inline; list-style-type:none;padding: 5px 5px;"
    >
      <el-button
        style="display: inline; list-style-type:none;padding: 5px 5px;"
        v-for="(item,index) in weekList"
        :key="index"
        @click="seclectBtn(item)"
        :type="item.btnType"
        :disabled="!item.canClick"
      >
        {{getWeekItem(item,index)}}
        <el-checkbox
          v-if="!isFromTeam"
          type="success"
          :checked="isChecked(item.weeklyId)"
          :label="item.weeklyId ? '已提交' : '未提交'"
          disabled
        ></el-checkbox>
      </el-button>
      <el-button @click="goCurrentWeek">回到本周</el-button>
    </div>
  </div>
</template>

<script>
import Server from '../server';

const server = new Server();
export default {
  name: '',
  components: {},
  props: {
    isFromTeam: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      server,
      monthDate: this.dateFormat('YYYY-mm-dd', new Date()), // 初始化日期
      weekList: [], // 周
      calendarId: '', // 日历Id
      weekIndex: undefined,
      currentMonthWeekList: [],
      afterDisabled: {
        disabledDate: (date) => date.getTime() > new Date().getTime(),
      },
    };
  },
  created() {
    // 获取每月日历
    this.getWeek();
    this.$busOn('refreshCalendar', () => {
      this.getWeek();
    });
  },
  mounted() {},
  computed: {
    isChecked() {
      return (weeklyId) => {
        if (weeklyId) {
          return true;
        }
        return false;
      };
    },
  },
  methods: {
    getWeek(newMonth) {
      // 选择的月份
      if (newMonth) {
        this.monthDate = newMonth;
      }
      this.server.getCalendar({ date: this.monthDate }).then((res) => {
        if (res.code == 200) {
          this.weekList = res.data;
          // 设置日历的可点击状态以及周报可编辑状态
          this.setWeekClickOrEditStatus(newMonth);
          // 初始化页面时，自动定位到本周,如果周报写过了，则需要查询本周周报详情
          this.selectCurrentWeek();
        }
      });
    },
    setWeekClickOrEditStatus(newMonth) {
      this.weekIndex = undefined;
      const current = new Date();
      this.weekList.forEach((week) => {
        // 由于精确到日的日期格式化之后是上午八点，所以beg应该减去8小时，end加上16小时
        let beg = new Date(week.weekBegin);
        let end = new Date(week.weekEnd);
        beg = beg.setHours(beg.getHours() - 8);
        end = end.setHours(end.getHours() + 16);
        if (current >= beg && current <= end) {
          // 当前周
          this.weekIndex = this.weekList.indexOf(week); // 月份是本月
          // 如果查询的月份是本月，则将数据保存给currentMonthWeekList，并确认本周是本月第几周
          // 1、选择月份是当前月份；
          // 2、选择月份是当前月份，但是跟最后一条数据的最后一天不是一个月。需要兼容
          // 当前时间落在了最后一周内 this.weekIndex == this.weekList.length - 1
          // 最后一周是跨了两个月new Date(this.weekList[this.weekList.length-1].weekEnd).getMonth()
          // - new Date(this.weekList[this.weekList.length-1].weekEnd).weekBegin() == 1
          // 且是时间所在月跟该周的最后一天是同一个月份 new Date().getMonth()
          // == new Date(this.weekList[this.weekList.length-1].weekEnd).weekBegin()
          if (new Date(this.monthDate).getMonth() == new Date().getMonth()
          || (this.weekIndex == this.weekList.length - 1
           && new Date(this.weekList[this.weekList.length - 1].weekEnd).getMonth()
            - new Date(this.weekList[this.weekList.length - 1].weekEnd).weekBegin() == 1
           && new Date().getMonth() == new Date(this.weekList[this.weekList.length - 1].weekEnd).weekBegin())) {
            this.currentMonthWeekList = [...this.weekList];
            this.currentWeekIndex = this.weekList.indexOf(week);
          }
        }
      });
      // 1、本月：本周之后的周不可点击,上周之前不可编辑
      if (new Date().getMonth() == new Date(this.weekList[2].weekBegin).getMonth()) {
        this.setCurrentMonthData();
      }
      // 2、下个月以及之后,月份不可选,组件已配置
      // 3、上个月以及更早,选择的是之前的月份
      if (new Date(newMonth).getMonth() < new Date(this.currentMonthWeekList[2].weekBegin).getMonth()) {
        this.setPreviousMonthData();
      }
      this.$forceUpdate();
    },
    setCurrentMonthData() {
      for (let i = 0; i < this.weekList.length; i += 1) {
        if (i > this.weekIndex) { // 本周之后
          this.weekList[i].canClick = false;
          this.weekList[i].canEdit = false;
        } else if (i < this.weekIndex - 1) { // 两周之前
          this.weekList[i].canClick = true;
          this.weekList[i].canEdit = false;
        } else { // 本周 上周
          this.weekList[i].canClick = true;
          this.weekList[i].canEdit = true;
        }
      }
    },
    setPreviousMonthData() { // 1、选中月是上个月
      if (new Date(this.currentMonthWeekList[2].weekBegin).getMonth() - new Date(this.monthDate).getMonth() == 1) {
        // 1、 上个月最后一周是本月第一周
        // 被选择月份的最后一周的数据跟本月第一周数据相同
        if (this.weekList[this.weekList.length - 1].weekBegin == this.currentMonthWeekList[0].weekBegin) {
          // 1、如果本周是本月第三周及以后的周，则上个月以前的周都不可编辑
          if (this.currentWeekIndex > 1) {
            this.weekList.forEach((week) => {
              week.canEdit = false;
              week.canClick = true;
            });
            // 2、如果本周是第二周，则上个月最后一周可编辑
          } else if (this.currentWeekIndex == 1) {
            for (let i = 0; i < this.weekList.length; i += 1) {
              if (i == this.weekList.length - 1) {
                this.weekList[i].canEdit = true;
                this.weekList[i].canClick = true;
              } else {
                this.weekList[i].canEdit = false;
                this.weekList[i].canClick = true;
              }
            }
            // 3、如果本周是第一周，则上个月后两周可编辑
          } else if (this.currentWeekIndex == 0) {
            for (let i = 0; i < this.weekList.length; i += 1) {
              if (i > this.weekList.length - 3) {
                this.weekList[i].canEdit = true;
                this.weekList[i].canClick = true;
              } else {
                this.weekList[i].canEdit = false;
                this.weekList[i].canClick = true;
              }
            }
          }
          // 2、 上个月最后一周不是本月第一周
        } else {
          //  1、如果本周是本月第二周及以后的周，则上个月以前的周都不可编辑
          // eslint-disable-next-line no-lonely-if
          if (this.currentWeekIndex > 0) {
            this.weekList.forEach((week) => {
              week.canEdit = false;
              week.canClick = true;
            });
            //  2、如果本周是第一周，则上个月最后一周可编辑
          } else {
            for (let i = 0; i < this.weekList.length; i += 1) {
              if (i == this.weekList.length - 1) {
                this.weekList[i].canEdit = true;
                this.weekList[i].canClick = true;
              } else {
                this.weekList[i].canEdit = false;
                this.weekList[i].canClick = true;
              }
            }
          }
        }
        // 被选择月份的最后一周的数据跟本月第一周数据不相同
      } else {
        this.weekList.forEach((week) => {
          week.canEdit = false;
          week.canClick = true;
        });
      }
    },
    // 本周不落在选择月份中，默认选择选择月份的最后一周
    selectCurrentWeek() {
      let currentBelongsToSelectedMonth = false;
      // 先定位本周是第几周，然后选中本周的按钮
      const current = new Date();
      for (const item of this.weekList) {
        // 由于精确到日的日期格式化之后是上午八点，所以beg应该减去8小时，end加上16小时
        let beg = new Date(item.weekBegin);
        let end = new Date(item.weekEnd);
        beg = beg.setHours(beg.getHours() - 8);
        end = end.setHours(end.getHours() + 16);
        if (current >= beg && current <= end) {
          currentBelongsToSelectedMonth = true;
          // 选种本周按钮
          item.btnType = 'success';
          this.$emit('setCalendarId', item.calendarId);
          // 是否要初始化页面
          this.$emit('getWeeklyById', item);
        }
        this.$forceUpdate();
      }
      if (!currentBelongsToSelectedMonth) {
        // 选中本周按钮
        this.weekList[this.weekList.length - 1].btnType = 'success';
        this.$emit('setCalendarId', this.weekList[this.weekList.length - 1].calendarId);
        // 是否要初始化页面
        this.$emit('getWeeklyById', this.weekList[this.weekList.length - 1]);
      }
    },
    seclectBtn(item) {
      this.$emit('setCalendarId', item.calendarId);
      this.weekList.forEach((week) => {
        week.btnType = '';
      });
      item.btnType = 'success';
      this.$forceUpdate();
      this.$emit('getWeeklyById', item);
    },

    getWeekItem(item, index) {
      if (item.calendarId) {
        const beg = item.weekBegin.split('-').splice(1, 2).join('/');
        const end = item.weekEnd.split('-').splice(1, 2).join('/');
        return `第${index + 1}周(${beg}-${end})`;
      }
    },
    goCurrentWeek() {
      window.location.reload();
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>