<template>
  <div class="worth-manage">
    <el-tabs v-model="worthType" @tab-click="handleClick" class="tl-tabs">
      <el-tab-pane label="价值观事件薄" name="1">
        <tl-worth-manage></tl-worth-manage>
      </el-tab-pane>
      <el-tab-pane label="价值观统计" name="2">
        <tl-worth-statistics :worthType="worthType"></tl-worth-statistics>
      </el-tab-pane>
      <el-tab-pane
        label="设置价值观"
        name="3"
        v-if="hasPower('culture-create')"
      >
        <tl-set-worth></tl-set-worth>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import worthManage from './worthManage/index';
import worthStatistics from './worthStatistics/index';
import setWorth from '../settings/setWorth/index';

export default {
  name: 'worth',
  data() {
    return {
      worthType: '1',
    };
  },
  components: {
    'tl-worth-manage': worthManage,
    'tl-worth-statistics': worthStatistics,
    'tl-set-worth': setWorth,
  },
  props: {},
  mounted() {},
  computed: {},
  methods: {
    handleClick() {},
  },
  watch: {},
};
</script>