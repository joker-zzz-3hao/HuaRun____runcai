<template>
  <div class="home">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" tab-position="top">
      <el-tab-pane label="标准版" name="first">
        <standardWeekly></standardWeekly>
      </el-tab-pane>
      <el-tab-pane label="简单版" name="second">简单版</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import standardWeekly from './component/standardWeekly';

export default {
  name: 'myWeekly',
  components: {
    standardWeekly,
  },
  data() {
    return {
      activeName: 'first',
    };
  },
  methods: {
    handleClick() {},
  },
};
</script>