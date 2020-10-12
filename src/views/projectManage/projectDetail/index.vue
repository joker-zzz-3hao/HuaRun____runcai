<template>
  <div class="role-type">
    <div class="operating-area">
      <el-button @click="backProjectManage">返回</el-button>
    </div>
    <div>
      <el-tabs v-model="projectTab" @tab-click="handleClick">
        <el-tab-pane label="项目信息" name="1">
          <tl-project-info
            :server="server"
            :baseInfo="baseInfo"
          ></tl-project-info>
        </el-tab-pane>
        <el-tab-pane label="项目统计数据" name="2">
          <tl-project-statistics :server="server"></tl-project-statistics>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import projectInfo from './components/projectInfo';
import projectStatistics from './components/projectStatistics';
import Server from '../server';

const server = new Server();

export default {
  name: 'projectDetail',
  data() {
    return {
      server,
      projectTab: '1',
      baseInfo: {},
    };
  },
  props: {},
  components: {
    'tl-project-info': projectInfo,
    'tl-project-statistics': projectStatistics,
  },
  mounted() {
    this.server.projectDetail({
      projectId: this.$route.query.projectId || '',
    }).then((res) => {
      if (res.code == '200') {
        this.baseInfo = res.data;
      }
    });
  },
  methods: {
    handleClick(data) {
      console.log(data);
    },
    backProjectManage() {
      this.$router.push({
        name: 'projectManage',
      });
    },
  },
};
</script>