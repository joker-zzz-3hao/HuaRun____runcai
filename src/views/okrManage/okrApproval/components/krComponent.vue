<template>
  <div>
    <!-- KR -->
    <div class="display-flex">
      <div>KR</div>
      <div style="margin-left: 10px;">收入100万</div>
    </div>
    <div class="display-flex" style="margin-top: 20px;justify-content:space-between;">
      <div>
        <span>权重</span>
        <span style="margin-left: 10px;">30%</span>
      </div>
      <div class="display-flex">
        <div>进度</div>
        <div style="margin-left: 10px;width: 150px;">
          <el-progress :percentage="50"></el-progress>
        </div>
      </div>
      <div class="display-flex">
        <div>风险状态</div>
        <div v-for="item in new Array(3)" :key="item">
          <tl-riskStatus></tl-riskStatus>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import riskStatus from '@/components/riskStatus';

export default {
  name: 'krComponent',
  data() {
    return {
    };
  },
  components: {
    'tl-riskStatus': riskStatus,
  },
  props: {},
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>
<style scoped>
.status {
  width: 20px;
  height: 20px;
  border: 1px solid #999;
}
.display-flex {
  display: flex;
}
.bg-green {
  background-color: chartreuse;
}
.bg-yellow {
  background-color: gold;
}
.bg-red {
  background-color: red;
}
</style>