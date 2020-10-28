<template>
  <el-scrollbar class="demo">
    <section class="main-wrap">
      <el-menu
        :default-active="routeName"
        @select="selectMenu"
        class="el-menu-vertical-demo"
        @open="handleOpen"
      >
        <el-submenu index="demo">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>DEMO展示</span>
          </template>
          <el-menu-item index="table">拖拽表格</el-menu-item>
          <el-menu-item index="simplelist">拖拽列表</el-menu-item>
          <el-menu-item index="nested">拖拽嵌套</el-menu-item>
          <el-menu-item index="tabletree">表格树</el-menu-item>
          <el-menu-item index="elementTree">饿了么树</el-menu-item>
          <el-menu-item index="svgtree">svg树</el-menu-item>
          <el-menu-item index="menu">菜单组件</el-menu-item>
          <el-menu-item index="rate">评分</el-menu-item>
          <el-menu-item index="timeline">时间线</el-menu-item>
          <el-menu-item index="echarts">echarts饼图</el-menu-item>
          <el-menu-item index="myokrdemo">我的okr</el-menu-item>
        </el-submenu>
        <el-submenu index="standardTable">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>标准组件</span>
          </template>
          <el-menu-item index="standardTable">表格</el-menu-item>
        </el-submenu>
      </el-menu>
      <router-view class="view-cont"></router-view>
    </section>
  </el-scrollbar>
</template>

<script>
export default {
  name: 'demoIndex',
  data() {
    return { routeName: this.$route.path.split('/')[1] };
  },
  components: {
  },
  created() {
    this.routeName = this.$route.name;
  },
  mounted() {
    console.log(this.$router);
  },
  methods: {
    handleOpen(index) {
      this.closeItem = index;
    },
    selectMenu(index) {
      if (this.$route.name == index) {
        this.$router.go(0);
      } else {
        this.$router.push({
          name: index,
        });
      }
    },
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