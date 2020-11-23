<template>
  <div class="tl-custom-tabs">
    <el-date-picker
      v-model="monthDate"
      type="month"
      placeholder="选择月"
      value-format="yyyy-MM-dd"
      :picker-options="afterDisabled"
      @change="getWeek"
      :clearable="false"
      popper-class="tl-month-popper"
      class="tl-month-editor"
    ></el-date-picker>
    <div class="tab-menus">
      <ul class="weekly-select">
        <li
          v-for="(item, idx) in weekList"
          :key="item.id"
          @click="borderSlip(item, idx)"
          :class="{
            'is-submit': item.weeklyId,
            'is-unsubmit': !item.weeklyId && !item.noOpen,
            'is-unopen': item.noOpen,
            'is-curent': item.btnType == 'success',
            'is-focus': weekIndex === idx,
          }"
        >
          <div class="period-time">{{ getWeekItem(item, idx) }}</div>
          <div v-if="!isFromTeam">
            <div class="period-state">
              <div class="icon-bg">
                <i></i>
              </div>
              <em v-if="hasValue(item.weeklyId)">已提交</em>
              <em v-if="!hasValue(item.weeklyId) && !item.noOpen">未提交</em>
              <em v-if="item.noOpen">未开放</em>
            </div>
            <el-tooltip
              v-if="!hasValue(item.weeklyId) && !item.noOpen && !item.canEdit"
              class
              effect="dark"
              content="本周之前周报不可提交"
              placement="top"
              popper-class="tl-tooltip-popper"
            >
              <i></i>
            </el-tooltip>
          </div>
        </li>
      </ul>
      <div class="border-slip"></div>
    </div>
    <!-- <slot name="tab-cont"></slot> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'tabs',
  data() {
    return {
      newPage: false,
      noWrite: false,
      monthDate: this.dateFormat('YYYY-mm-dd', new Date()), // 初始化日期
      calendarId: '', // 日历Id
      weekIndex: undefined,
      currentMonthWeekList: [],
      afterDisabled: {
        disabledDate: (date) => {
          const now = new Date('2020-01-01');
          return date.getTime() > new Date().getTime() || now.getTime() > date.getTime();
        },
      },
      weeklyTypeListTemp: [],
    };
  },
  props: {
    tabMenuList: {
      type: Array,
      defalut() {
        return [];
      },
    },
    isFromTeam: {
      type: Boolean,
      default() {
        return false;
      },
    },
    server: {
      type: Object,
      default() {
        return false;
      },
    },
  },
  mounted() {
    // 状态
    // const liWidth = document.querySelectorAll('.custom-drawer .tab-list li');
    // const selfLeft = document.querySelectorAll('.custom-drawer .tab-list li')[0].offsetLeft;
    // const borderWidth = document.querySelector('.custom-drawer .border-slip');
    // borderWidth.style.left = `${selfLeft}px`;
    // borderWidth.style.width = `${liWidth[0].offsetWidth}px`;
  },
  created() {
    // 获取每月日历
    this.getWeek();
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      roleCode: (state) => state.roleCode,
    }),
    ...mapState('weekly', {
      weekList: (state) => state.weekList,
      weeklyDataList: (state) => state.weeklyDataList,
    }),
  },
  methods: {
    ...mapMutations('weekly', ['setSelectWeek', 'setWeeklyTypeList', 'setWeekList', 'setWeeklyType']),
    borderSlip(item, index) {
      if (!item.noOpen) {
        this.weekIndex = index;
        this.$emit('update:weekIndex', index);
        this.$set(item, 'btnType', 'success');
        const weekListTemp = [...this.weekList];
        weekListTemp.forEach((week) => {
          if (item.calendarId != week.calendarId) {
            week.btnType = '';
          }
        });
      }
      this.setSelectWeek(item);
      // 团队周报查询
      this.$emit('setCalendarId', item.calendarId);
      this.$emit('getWeeklyById', item);
    },
    getWeekItem(item, index) {
      if (item.calendarId) {
        return `第${index + 1}周`;
      }
    },
    getWeek(newMonth) {
      // 选择的月份
      if (newMonth) {
        this.monthDate = newMonth;
      }
      this.server.getCalendar({ date: this.monthDate }).then((res) => {
        if (res.code == 200) {
          this.setWeekList(res.data);
          // 设置日历的可点击状态以及周报可编辑状态
          this.setWeekClickOrEditStatus(this.monthDate);
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
          // 本月
          if (new Date(this.monthDate).getMonth() == new Date().getMonth()) {
            this.currentMonthWeekList = [...this.weekList];
            this.currentWeekIndex = this.weekList.indexOf(week);
          }
        }
      });
      // 1、本月：本周之后的周不可点击,上周之前不可编辑
      if (new Date().getMonth() == new Date(this.weekList[2].weekBegin).getMonth()) {
        this.setCurrentMonthData();
      }

      // 2、上个月以及更早,选择的是之前的月份
      if (new Date(newMonth).getMonth() < new Date(this.currentMonthWeekList[2].weekBegin).getMonth()) {
        this.setPreviousMonthData();
      }
      this.$forceUpdate();
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
          // 如果该周是两周前，且周报未填写，则需要提示该周报不能补写
          currentBelongsToSelectedMonth = true;
          // 选种本周按钮
          item.btnType = 'success';
          this.setSelectWeek(item);
          this.$emit('update:weekIndex', this.weekList.indexOf(item));
          // 团队周报查询
          this.$emit('setCalendarId', item.calendarId);
          this.$emit('getWeeklyById', item);
        }
      }
      if (!currentBelongsToSelectedMonth) {
        // 选中本周按钮
        this.weekList[this.weekList.length - 1].btnType = 'success';
        // 团队周报查询
        this.$emit('setCalendarId', this.weekList[this.weekList.length - 1].calendarId);
        this.$emit('getWeeklyById', this.weekList[this.weekList.length - 1]);
      }
    },
    setCurrentMonthData() {
      for (let i = 0; i < this.weekList.length; i += 1) {
        // 本周是第一周、第二周
        if (this.weekIndex < 2) {
          if (i > this.weekIndex) {
            this.weekList[i].canClick = false;
            this.weekList[i].canEdit = false;
            this.weekList[i].noOpen = true;
          } else {
            this.weekList[i].canClick = true;
            this.weekList[i].canEdit = true;
            this.weekList[i].noOpen = false;
          }
        } else { // 本周是第三周或以后的周
          // 本周、上周之前
          // eslint-disable-next-line no-lonely-if
          if (i < this.weekIndex - 1) {
            this.weekList[i].canClick = true;
            this.weekList[i].canEdit = false;
            this.weekList[i].noOpen = false;
          } else if (i > this.weekIndex) { // 本周、上周之后
            this.weekList[i].canClick = false;
            this.weekList[i].canEdit = false;
            this.weekList[i].noOpen = true;
          } else { // 本周、上周
            this.weekList[i].canClick = true;
            this.weekList[i].canEdit = true;
            this.weekList[i].noOpen = false;
          }
        }
      }
    },
    setPreviousMonthData() {
      // 一、选中月是上个月
      if (new Date(this.currentMonthWeekList[2].weekBegin).getMonth() - new Date(this.monthDate).getMonth() == 1) {
        // 1、 上个月最后一周是本月第一周
        // 被选择月份的最后一周的数据跟本月第一周数据相同
        if (this.weekList[this.weekList.length - 1].weekBegin
         == this.currentMonthWeekList[0].weekBegin) {
          // 1、如果本周是本月第三周及以后的周，则上个月以前的周都不可编辑
          if (this.currentWeekIndex > 1) {
            this.weekList.forEach((week) => {
              week.canEdit = false;
              week.canClick = true;
              week.noOpen = false;
            });
            // 2、如果本周是第一周，则上个月后两周可编辑
          } else if (this.currentWeekIndex == 0) {
            for (let i = 0; i < this.weekList.length; i += 1) {
              if (i == this.weekList.length - 1 || i == this.weekList.length - 2) {
                this.weekList[i].canEdit = true;
                this.weekList[i].canClick = true;
                this.weekList[i].noOpen = false;
              } else {
                this.weekList[i].canEdit = false;
                this.weekList[i].canClick = true;
                this.weekList[i].noOpen = false;
              }
            }
            // 3、如果本周是第二周，则上个月后两一周可编辑
          } else if (this.currentWeekIndex == 1) {
            for (let i = 0; i < this.weekList.length; i += 1) {
              if (i == this.weekList.length - 1) {
                this.weekList[i].canEdit = true;
                this.weekList[i].canClick = true;
                this.weekList[i].noOpen = false;
              } else {
                this.weekList[i].canEdit = false;
                this.weekList[i].canClick = true;
                this.weekList[i].noOpen = false;
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
              week.noOpen = false;
            });
          //  2、如果本周是第一周，则上个月最后一周可编辑
          } else {
            for (let i = 0; i < this.weekList.length; i += 1) {
              if (i == this.weekList.length - 1) {
                this.weekList[i].canEdit = true;
                this.weekList[i].canClick = true;
                this.weekList[i].noOpen = false;
              } else {
                this.weekList[i].canEdit = false;
                this.weekList[i].canClick = true;
                this.weekList[i].noOpen = false;
              }
            }
          }
        }
        // 二、被选择月份是上月以前的月份
      } else {
        this.weekList.forEach((week) => {
          week.canEdit = false;
          week.canClick = true;
          week.noOpen = false;
        });
      }
    },
  },
  watch: {

  },
};
</script>