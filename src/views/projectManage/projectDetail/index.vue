<template>
  <div class="project-detail">
    <el-tabs v-model="projectTab" @tab-click="handleClick" class="tl-tabs">
      <el-tab-pane label="项目信息" name="1">
        <tl-project-info
          :server="server"
          :baseInfo="baseInfo"
        ></tl-project-info>
      </el-tab-pane>
      <el-tab-pane label="项目统计数据" name="2">
        <tl-project-statistics
          :summaryList="summaryList"
          :server="server"
        ></tl-project-statistics>
      </el-tab-pane>
      <div class="tabs-other-panel">
        <el-button
          plain
          @click="backProjectManage"
          v-if="!showDepartmentSelect"
          class="tl-btn amt-border-slip"
        >
          返回
          <span class="lines"></span>
        </el-button>
      </div>
    </el-tabs>
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
      summaryList: [],
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
    this.server.summaryList({
      projectId: this.$route.query.projectId || '',
    }).then((res) => {
      if (res.code == '200') {
        this.summaryList = res.data;
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