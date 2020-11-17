<template>
  <div class="tl-progress-bar">
    <div
      class="progress-bg"
      v-for="item in processList"
      :key="item.id"
      ref="progressBg"
    >
      <div class="current-progress" :style="item.width"></div>
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
    };
  },
  components: {},
  props: {
    data: {
      type: Number,
      default: 0,
    },
    // width: {
    //   type: Number,
    //   default: 16,
    // },
    // marginLeft: {
    //   type: Number,
    //   default: 2,
    // },
    showNumber: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    this.changeWidth();
  },
  computed: {
    // progressWidth() {
    //   console.log(this.$refs.progressBg);
    //   return this.$refs.progressBg[0].offsetWidth;
    // },
  },
  methods: {
    changeWidth() {
      const self = this;
      self.processList = [];
      const a = parseInt(self.data / 20, 10);
      const b = self.data % 20;
      const progressWidth = this.refs.progressBg.clientWidth;
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
      console.log(self.processList);
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