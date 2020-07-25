<template>
  <el-scrollbar class="console-layout">
    <router-view class="view-wrap" />
  </el-scrollbar>
</template>

<script>
export default {
  name: 'consoleIndex',
  components: {
  },
  data() {
    return {
    };
  },
};
</script>

<style>
@import "~@/assets/styles/layouts.css";
@import "~@/assets/styles/modules.css";
@import "~@/assets/styles/pages.css";
@import "~@/assets/styles/icons.css";
@import "~@/assets/styles/animations.css";
@import "~@/assets/styles/browser.css";
@import "~@/assets/styles/themes.css";
</style>