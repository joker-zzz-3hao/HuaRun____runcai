<template>
  <div class="home">
    <el-tabs v-model="activeName">
      <el-button @click="goWriteOkr">创建okr</el-button>

      <el-tab-pane :label="`${$store.state.common.userInfo.departmentName}OKR`" name="team">
        <department-page></department-page>
      </el-tab-pane>
      <el-tab-pane label="我的OKR" name="myokr">
        <myokr-page></myokr-page>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import departmentPage from './component/departmentPage';
import myokrPage from './component/myokrPage';

export default {
  name: 'myOkr',
  components: {
    'department-page': departmentPage,
    'myokr-page': myokrPage,
  },
  data() {
    return {
      activeName: 'team',
    };
  },
  methods: {
    goWriteOkr() {
      this.$router.push({ name: 'writeOkr', params: { canWrite: true } });
    },
  },
};
</script>