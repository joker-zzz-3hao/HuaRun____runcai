<template>
  <div class="home">
    <!-- <el-tabs v-model="activeName">
      <el-tab-pane name="standard"></el-tab-pane>
      <el-tab-pane name="simple"></el-tab-pane>
    </el-tabs>-->
    <standardWeekly></standardWeekly>
  </div>
</template>

<script>
import standardWeekly from './component/standardWeekly';

export default {
  name: 'myWeekly',
  components: {
    standardWeekly,
  },
};
</script>