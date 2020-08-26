<template>
  <div class="home">
    <!-- 选择日历月 -->
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
          :checked="item.weklyId"
          :label="item.weeklyId ? '已提交' : '未提交'"
          disabled
        ></el-checkbox>
      </el-button>
    </div>
    <!-- 表格 -->
  </div>
</template>

<script>
export default {
  name: 'teamWeekly',
  components: {
  },
};
</script>