<template>
  <div class="home">
    <!-- <el-tabs v-model="activeName">
      <el-tab-pane label="我的OKR" name="myOkr"></el-tab-pane>
      <el-tab-pane label="departmentOkrOKR" name="departmentOkr"></el-tab-pane>
    </el-tabs>-->
    <el-tabs v-model="activeName" @tab-click="goRoutesss">
      <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
import Server from './server';

const server = new Server();

export default {
  name: 'okr',
  components: {
  },
  data() {
    return {
      server,
      activeName: 'first',
    };
  },
  computed: {
  },
  created() {
  },
  methods: {
    goRoutesss(tab, event) {
      console.log(tab);
      console.log(event);
      this.go(tab);
    },
  },
  watch: {
  },
};
</script>