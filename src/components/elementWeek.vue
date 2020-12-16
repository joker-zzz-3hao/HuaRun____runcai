<template>
  <el-date-picker
    :clearable="true"
    v-model="queryParam.value"
    :format="' yyyy 年 MM 月 第 ' + queryParam.week + ' 周'"
    @change="weekChange"
    value-format="yyyy/M/d"
    size="medium"
    type="week"
    placeholder=" 请选择周"
    :picker-options="{ firstDayOfWeek: 1 }"
    popper-class="tl-date-popper"
    class="tl-date-editor"
  ></el-date-picker>
</template>

<script>
export default {
  data() {
    return {
      queryParam: {
        value: '',
        week: '',
        defValue: '',
      },
      dayweek: '',
    };
  },
  created() {
    // this.getDay();
  },
  methods: {
    // 初始化日期
    getDay(val) {
      const date = new Date(val);
      const oneDate = 24 * 60 * 60 * 1000;
      const dateTimeWeek = date.getTime() + (oneDate * 6);
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let dayweek = new Date(dateTimeWeek).getDate();
      if (month < 10) {
        month = `0${month}`;
      }
      if (day < 10) {
        day = `0${day}`;
      }
      if (dayweek < 10) {
        dayweek = `0${dayweek}`;
      }
      const nowDay = `${year}/${month}/${day}`;
      this.dayweek = dayweek;
      this.queryParam.week = this.getWeekInMonth(new Date(nowDay));
      this.queryParam.defValue = `${year}/${month}/${day}`;
    },
    weekChange(val) {
      if (val) {
        this.getDay(val);
        // eslint-disable-next-line no-unused-vars
        const arr = val.split('/');
        this.queryParam.week = this.getWeekInMonth(new Date(val));
        const oneDate = 24 * 60 * 60 * 1000;
        const valueTime = new Date(val).getTime() - oneDate;
        const valueTimeEnd = (new Date(val).getTime() - oneDate) + 6 * oneDate;
        const startTime = this.dateFormat('YYYY-mm-dd', valueTime);
        const endTime = this.dateFormat('YYYY-mm-dd', valueTimeEnd);
        this.queryParam.value = this.queryParam.defValue;
        this.$emit('weekSelect', startTime, endTime);
      } else {
        this.$emit('weekSelect', '', '');
      }
    },
    // 根据日期判断是月的第几周
    getWeekInMonth(t) {
      if (t == undefined || t == '' || t == null) {
        t = new Date();
      } else {
        const _t = new Date();
        _t.setYear(t.getFullYear());
        _t.setMonth(t.getMonth());
        _t.setDate(t.getDate());

        const date = _t.getDate(); // 给定的日期是几号

        _t.setDate(1);
        const d = _t.getDay(); // 1. 得到当前的1号是星期几。
        let fisrtWeekend = d;
        if (d == 0) {
          fisrtWeekend = 1;
          // 1号就是星期天
        } else {
          fisrtWeekend = 7 - d + 1; // 第一周的周未是几号
        }
        if (date <= fisrtWeekend) {
          return 1;
        }
        return 1 + Math.ceil((date - fisrtWeekend) / 7);
      }
    },
  },
};
</script>