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
      currentWeekIndex: undefined,
      // currentWeekList: [],
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
    getWeek(val) {
      // 选择的月份
      if (val) {
        this.monthDate = val;
      }
      this.server.getCalendar({ date: this.monthDate }).then((res) => {
        if (res.code == 200) {
          this.weekList = res.data;
          // 初始化页面时，自动定位到本周,如果周报写过了，则需要查询本周周报详情
          this.selectCurrentWeek();
          // 设置日历的可点击状态以及周报可编辑状态
          this.setWeekClickOrEditStatus(val, res.data);
        }
      });
    },
    setWeekClickOrEditStatus(newMonth) {
      this.currentWeekIndex = undefined;
      const current = new Date();
      this.weekList.forEach((week) => {
        // 由于精确到日的日期格式化之后是上午八点，所以beg应该减去8小时，end加上16小时
        let beg = new Date(week.weekBegin);
        let end = new Date(week.weekEnd);
        beg = beg.setHours(beg.getHours() - 8 + 24 * 7);
        end = end.setHours(end.getHours() + 16 + 24 * 7);
        if (current >= beg && current <= end) {
          // 当前周
          this.currentWeekIndex = this.weekList.indexOf(week); // 月份是本月
        }
      });
      // 1、本月：本周之后的周不可点击,上周之前不可编辑
      for (let i = 0; i < this.weekList.length; i += 1) {
        if (i > this.currentWeekIndex) { // 今天之后
          this.weekList[i].canClick = false;
          this.weekList[i].canEdit = false;
        } else if (i < this.currentWeekIndex - 1) { // 两周之前
          this.weekList[i].canClick = true;
          this.weekList[i].canEdit = false;
        } else { // 本周 上周
          this.weekList[i].canClick = true;
          this.weekList[i].canEdit = true;
        }
      }
      // 2、下个月以及之后,月份不可选,组件已配置
      // 3、上个月以及更早
      if (new Date(newMonth) < new Date()) { // 点击了月份,且是本月以前的月份
        // 当前周是本月第一周，是上个月最后一周
        if (this.currentWeekIndex != undefined) {
          for (let i = 0; i < this.weekList.length; i += 1) {
            if (i < this.weekList.length - 2) { // 前面几个不可编辑
              this.weekList[i].canClick = true;
              this.weekList[i].canEdit = false;
            } else { // 后面俩可编辑
              this.weekList[i].canClick = true;
              this.weekList[i].canEdit = true;
            }
          }
        } else { // 无交集 全不能编辑
          for (let i = 0; i < this.weekList.length; i += 1) {
            this.weekList[i].canClick = true;
            this.weekList[i].canEdit = false;
          }
        }
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
        beg = beg.setHours(beg.getHours() - 8 + 24 * 7);
        end = end.setHours(end.getHours() + 16 + 24 * 7);
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
        // 选种本周按钮
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
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>