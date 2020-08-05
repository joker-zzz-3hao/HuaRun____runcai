<template>
  <el-scrollbar class="console-layout">
    <tl-header></tl-header>
    <tl-main-area></tl-main-area>
  </el-scrollbar>
</template>

<script>
import tlHeader from '@/components/layout/header';
import tlMainArea from '@/components/layout/mainArea';

export default {
  name: 'consoleIndex',
  components: {
    tlHeader,
    tlMainArea,
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