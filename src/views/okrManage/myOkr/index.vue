<template>
  <div class="home">
    <!-- <el-tabs v-model="activeName">
      <el-tab-pane label="我的OKR" name="myOkr"></el-tab-pane>
      <el-tab-pane label="departmentOkrOKR" name="departmentOkr"></el-tab-pane>
    </el-tabs>-->
    <el-tabs v-model="activeName" @tab-click="goRoutesss">
      <el-tab-pane label="我的OKR" name="myOkr"></el-tab-pane>
      <el-tab-pane :label="departmentName+'OKR'" name="departmentOkr"></el-tab-pane>
    </el-tabs>
    <el-button style="display:float" @click="goWriteOkr">创建okr</el-button>

    <router-view></router-view>
    <el-drawer
      :wrapperClosable="false"
      :modal-append-to-body="false"
      title="创建okr"
      :visible.sync="createokrDrawer"
      :before-close="handleClose"
      class="tl-drawer"
    >
      <div>
        <tl-writeokr v-if="createokrDrawer" :userName="userName"></tl-writeokr>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import writeOkr from './component/writeOkr/index';
import Server from './server';

const server = new Server();

export default {
  name: 'okr',
  components: {
    'tl-writeokr': writeOkr,
  },
  data() {
    return {
      server,
      activeName: 'myOkr',
    };
  },
  computed: {
    ...mapState('common', {
      createokrDrawer: (state) => state.createokrDrawer,
      userInfo: (state) => state.userInfo,
    }),
  },
  created() {
    this.departmentName = this.userInfo.orgParentName || '部门';
  },
  methods: {
    ...mapMutations('common', ['setCreateokrDrawer']),
    goRoutesss(tab, event) {
      console.log(tab);
      console.log(event);
      this.go(this.activeName);
    },
    goWriteOkr() {
      this.setCreateokrDrawer(true);
    },
    handleClose() {
      this.setCreateokrDrawer(false);
    },
  },
  watch: {
  },
};
</script>