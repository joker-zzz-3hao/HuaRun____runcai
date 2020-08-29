<template>
  <div class="home">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" tab-position="top">
      <el-tab-pane label="标准版" name="first">
        <standard-Weekly></standard-Weekly>
      </el-tab-pane>
      <el-tab-pane label="简单版" name="second">
        <simple-weekly></simple-weekly>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import standardWeekly from './component/standardWeekly';
import simpleWeekly from './component/simpleWeekly';

export default {
  name: 'myWeekly',
  components: {
    'standard-Weekly': standardWeekly,
    'simple-weekly': simpleWeekly,
  },
  data() {
    return {
      activeName: 'first',
    };
  },
  methods: {
    handleClick() {},
  },
};
</script>