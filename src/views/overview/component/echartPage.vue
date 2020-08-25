<template>
  <div class="echartPage">
    <div :id="idName" :style="widthHeight"></div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'okrSchedule',
  props: {
    option: {
      type: [String, Object],
      require: true,
    },
    idName: {
      type: [String, Object],
      require: true,
    },
    widthHeight: {
      type: String,
      require: true,
    },
  },
  data() {
    return {

    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const myChart = echarts.init(document.getElementById(this.idName));
      const { option } = this;

      myChart.setOption(option);
    },
  },
};
</script>
