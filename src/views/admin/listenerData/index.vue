<template>
  <div class="monitor-data">
    <div class="operating-area">
      <div class="page-title">监控数据</div>
    </div>
    <div class="monitor-area">
      <div class="title">
        <span>在线总人数：</span>
        <em>{{ formData.total }}</em>
      </div>
      <div
        v-for="tenant in formData.tenantUserDtoList"
        :key="tenant.tenantDto.tenantId"
      >
        <dl>
          <dt class="title">
            <span>{{ tenant.tenantDto.tenantName }}</span>
            <span>在线人数：{{ tenant.sum }}</span>
          </dt>
          <dd>
            <el-table :data="tenant.userDtoList">
              <el-table-column
                label="所属部门"
                prop="orgName"
              ></el-table-column>
              <el-table-column label="姓名" prop="userName"></el-table-column>
            </el-table>
          </dd>
        </dl>
      </div>
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