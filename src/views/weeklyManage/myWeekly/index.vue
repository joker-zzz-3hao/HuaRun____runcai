<template>
  <div class="home">
    <el-tabs v-model="activeName">
      <el-tab-pane name="standard"></el-tab-pane>
      <el-tab-pane name="simple"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'myWeekly',
  components: {
  },
};
</script>