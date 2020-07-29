<template>
  <div>
    <el-scrollbar>
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
          <el-menu-item index="tree">树</el-menu-item>
          <el-menu-item index="elementTree">饿了么树</el-menu-item>
          <el-menu-item index="svgtree">svg树</el-menu-item>
          <el-menu-item index="d3tree">d3树</el-menu-item>
          <el-menu-item index="menu">菜单组件</el-menu-item>
        </el-submenu>
        <el-submenu index="standardTable">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>标准组件</span>
          </template>
          <el-menu-item index="standardTable">表格</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-scrollbar>
    <router-view class="routerview"></router-view>
  </div>
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

<style scoped>
.el-scrollbar {
  float: left;
}
.routerview {
  margin-left: 210px;
  overflow: scroll;
}
</style>