<template>
  <div class="home">
    <el-form class="form-w415">
      <el-form-item>
        <el-date-picker
          v-model.trim="formData.mounthValue"
          :picker-options="pickerBeginDateBefore"
          type="monthrange"
          :range-separator="$tt('module.bill.to', '至')"
          :start-placeholder="$tt('module.bill.startMonth', '开始月份')"
          :end-placeholder="$tt('module.bill.endMonth', '结束月份')"
          @change="changeDate"
          format="yyyy-MM"
          value-format="yyyy-MM"
          :clearable="false"
          class="crc-date-picker"
        ></el-date-picker>
      </el-form-item>
      <!-- 选择周 -->
      <div>
        <ul>
          <li></li>
        </ul>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'standardWeekly',
  components: {
  },
};
</script>