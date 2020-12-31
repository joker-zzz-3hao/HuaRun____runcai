<template>
  <div class="project-detail">
    <el-tabs v-model="projectTab" @tab-click="handleClick" class="tl-tabs">
      <el-tab-pane label="项目信息" name="1">
        <tl-project-info
          :queryList="queryList"
          :server="server"
          @changeTab="changeTab"
          :baseInfo="baseInfo"
          :summaryList="summaryList"
        ></tl-project-info>
      </el-tab-pane>
      <el-tab-pane label="项目统计数据" name="2">
        <tl-project-statistics
          :summaryList="summaryList"
          :server="server"
        ></tl-project-statistics>
      </el-tab-pane>
      <el-tab-pane label="项目小组" name="3">
        <tl-hour-group
          @queryProjectTeam="queryProjectTeam"
          :summaryList="summaryList"
          :queryList="queryList"
          :server="server"
        ></tl-hour-group>
      </el-tab-pane>
      <div class="tabs-other-panel">
        <el-button
          plain
          @click="backProjectManage"
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
import hourGroup from './components/hourGroup';
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
      First: true,
      Second: false,
      queryList: [],
    };
  },
  props: {},
  components: {
    'tl-project-info': projectInfo,
    'tl-project-statistics': projectStatistics,
    'tl-hour-group': hourGroup,
  },
  mounted() {
    this.changeTab();
  },
  methods: {
    changeTab() {
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
      this.queryProjectTeam();
    },
    queryProjectTeam() {
      this.server.queryProjectTeam({
        projectId: this.$route.query.projectId,
      }).then((res) => {
        this.queryList = res.data;
      });
    },
    handleClick(data) {
      console.log(data);
      if (data.name === '1') {
        this.First = true;

        this.Second = false;
      } else if (data.name === '2') {
        this.First = false;

        this.Second = true;
      }
      this.changeTab();
    },
    backProjectManage() {
      this.$router.push({
        name: 'projectManage',
      });
    },
  },
};
</script>