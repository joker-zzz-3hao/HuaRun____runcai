<template>
  <div>
    <!-- KR -->
    <div class="display-flex">
      <div>KR</div>
      <div style="margin-left: 10px;">{{krData.okrDetailObjectKr}}</div>
    </div>
    <div class="display-flex" style="margin-top: 20px;justify-content:space-between;">
      <div>
        <span>权重</span>
        <span style="margin-left: 10px;">{{krData.okrWeight}}%</span>
      </div>
      <div class="display-flex">
        <div>进度</div>
        <div style="margin-left: 10px;">
          <!-- <el-progress :percentage="krData.okrDetailProgress"></el-progress> -->
          <tl-process :data="krData.okrDetailProgress"></tl-process>
        </div>
      </div>
      <div class="display-flex">
        <div>风险状态</div>
        <div v-for="item in new Array(3)" :key="item"></div>
        <span>{{CONST.CONFIDENCE_MAP[krData.okrDetailConfidence]}}</span>
      </div>
      <div>
        <span>考核指标</span>
        <em>{{krData.checkQuota}}</em>
      </div>
      <div>
        <span>衡量方法</span>
        <em>{{krData.judgeMethod}}</em>
      </div>
    </div>
  </div>
</template>

<script>
import process from '@/components/process';
import CONST from '../const';

export default {
  name: 'krComponent',
  data() {
    return {
      CONST,
    };
  },
  components: {
    'tl-process': process,
  },
  props: {
    krData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
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