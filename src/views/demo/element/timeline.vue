<template>
  <div class="block">
    <div class="radio">
      排序：
      <el-radio-group v-model="reverse">
        <el-radio :label="true">倒序</el-radio>
        <el-radio :label="false">正序</el-radio>
      </el-radio-group>
    </div>

    <el-timeline :reverse="reverse">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :timestamp="activity.timestamp"
      >
        <span class="left">{{activity.name}}</span>
        <span class="right">{{activity.comments}}</span>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
import Server from '../server';

const server = new Server();

export default {
  name: 'timeline',
  data() {
    return {
      server,
      reverse: true,
      activities: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.server.getHistory().then((res) => {
        console.log(res);
        this.activities = res.data;
      });
    },
  },
};
</script>