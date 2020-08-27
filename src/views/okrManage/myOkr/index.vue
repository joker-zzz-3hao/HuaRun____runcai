<template>
  <div class="my-okr">
    <div class="operating-area">
      <div class="operating-area-inside">
        <div>sdfasdfsa</div>
        <div>ghjrrt</div>
        <el-button @click="goWriteOkr">创建okr</el-button>
      </div>
    </div>
    <router-view class="cont-area"></router-view>
    <tl-writeokr></tl-writeokr>
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