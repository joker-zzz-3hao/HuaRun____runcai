<template>
  <div class="home">
    <el-form class="form-w415">
      <el-form-item>
        <el-date-picker v-model="monthDate" type="month" placeholder="选择月"></el-date-picker>
      </el-form-item>
      <!-- 选择周 -->
      <div>
        <ul>
          <li v-for="(item,index) in weekList" :key="index"></li>
        </ul>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'standardWeekly',
  data() {
    return { monthDate: '', weekList: [{}] };
  },

  components: {

  },
};
</script>