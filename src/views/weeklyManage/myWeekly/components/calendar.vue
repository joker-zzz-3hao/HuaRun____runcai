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
      >
        {{getWeekItem(item,index)}}
        <el-checkbox
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

  },
  data() {
    return {
      server,
      monthDate: this.dateFormat('YYYY-mm-dd', new Date()), // 初始化日期
      weekList: [], // 周
      calendarId: '', // 日历Id
    };
  },
  created() {
    // 获取每月日历
    this.getWeek();
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
      if (val) {
        this.monthDate = val;
      }
      this.server.getCalendar({ date: this.monthDate }).then((res) => {
        if (res.code == 200) {
          this.weekList = res.data;
          this.weekList.forEach((week) => {
            week.btnType = '';
          });
          // 初始化页面时，自动定位到本周,如果周报写过了，则需要查询本周周报详情
          this.selectCurrentWeek();
        }
      });
    },
    selectCurrentWeek() {
      // 先定位本周是第几周，然后选中本周的按钮
      const current = new Date();
      for (const item of this.weekList) {
        // 由于精确到日的日期格式化之后是上午八点，所以beg应该减去8小时，end加上16小时
        let beg = new Date(item.weekBegin);
        let end = new Date(item.weekEnd);
        beg = beg.setHours(beg.getHours() - 8);
        end = end.setHours(end.getHours() + 16);
        if (current >= beg && current <= end) {
          // 选种本周按钮
          item.btnType = 'success';
          this.$emit('setCalendarId', item.calendarId);
          // 是否要初始化页面
          this.$emit('getWeeklyById', item);
        }
        this.$forceUpdate();
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