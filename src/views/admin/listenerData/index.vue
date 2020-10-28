<template>
  <div class="monitor-data">
    <div class="operating-area">
      <div class="page-title">监控数据</div>
    </div>
    <div class="monitor-area">
      <div class="title">
        <span>在线总人数：</span>
        <em>{{ formData.total || 0 }}</em>
        <span>历史累计登录人数：</span>
        <em>{{ formData.historyVisitNumber || 0 }}</em>
      </div>

      <el-collapse v-if="formData.tenantUserDtoList.length > 0">
        <el-collapse-item
          v-for="tenant in formData.tenantUserDtoList"
          :key="tenant.tenantDto.tenantId"
        >
          <template slot="title">
            <span>{{ tenant.tenantDto.tenantName }}</span>
            <span>在线人数：{{ tenant.sum }}</span>
          </template>
          <el-table :data="tenant.userDtoList">
            <el-table-column label="所属部门" prop="orgName"></el-table-column>
            <el-table-column label="姓名" prop="userName"></el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import Server from './server';

const server = new Server();
export default {
  name: 'listenerData',
  data() {
    return {
      server,
      formData: {},
    };
  },
  components: {},
  props: {},
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.server.onlineUserInfo().then((res) => {
        if (res.code == '200') {
          this.formData = res.data;
          console.log(res);
        }
      });
    },
  },
  watch: {},
};
</script>