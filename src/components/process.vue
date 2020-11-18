<template>
  <div class="tl-progress-bar">
    <div
      class="progress-bg"
      v-for="(item, index) in testList"
      :key="item"
      ref="progressBg"
    >
      <div
        v-if="processList.length > 0"
        class="current-progress"
        :style="processList[index].width"
      ></div>
    </div>
    <div v-if="showNumber" class="progress-number">{{ data }}%</div>
  </div>
</template>

<script>
export default {
  name: 'process',
  data() {
    return {
      processList: [],
      testList: [1, 2, 3, 4, 5],
    };
  },
  components: {},
  props: {
    data: {
      type: Number,
      default: 0,
    },
    showNumber: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.test = this.$refs.progressBg;
      console.log(`testHeight:${this.test[0].clientHeight}`);
      console.log(`testWidth:${this.test[0].clientWidth}`);
      this.changeWidth();
    });
  },
  methods: {
    changeWidth() {
      const self = this;
      self.processList = [];
      const a = parseInt(self.data / 20, 10);
      const b = self.data % 20;
      const progressWidth = this.test[0].clientWidth;
      for (let i = 0; i < 5; i += 1) {
        if (i < a) {
          self.processList.push({
            width: `width: ${progressWidth}px;`,
          });
        } else if (i == a) {
          self.processList.push({
            width: `width: ${(b / 20) * progressWidth}px`,
          });
        } else {
          self.processList.push({
            width: 'width: 0px;',
          });
        }
      }
    },
  },
  watch: {
    data: {
      handler() {
        this.changeWidth();
      },
    },
  },
};
</script>