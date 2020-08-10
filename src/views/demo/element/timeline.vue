<template>
  <div class="block">
    <!-- <div class="radio">
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
    </el-timeline>-->
    <ul>
      <li v-for="(item,index) in cycleList" :key="index" style="position: relative;display:flex; ">
        <div style="height: 100%;width: 150px;">
          <span>2020-08-01</span>
          <span style="padding-left:10px;">16:14</span>
        </div>
        <div class="cycle"></div>
        <div
          v-if="index < cycleList.length-1"
          style="position: absolute;left: 154px;height: 100%;border-left: 2px solid #e4e7ed;"
        ></div>
        <div style="margin-left: 20px;width:330px;display: flex;">
          <div style="width: 50px;">张三</div>
          <div style="width: 80px;">通过</div>
          <div style="width: 200px;">内内容内容内容内容内容内容内容内容容</div>
        </div>
      </li>
    </ul>
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
      cycleList: [1, 2, 3, 4],
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
<style scoped>
.cycle {
  background-color: #e4e7ed;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 149px;
  width: 12px;
  height: 12px;
  position: absolute;
}
</style>