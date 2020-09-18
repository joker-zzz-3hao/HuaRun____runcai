<template>
  <div class="tl-progress-bar">
    <div
      class="progress-bg"
      :style="{width: `${width}px`,marginLeft: `${marginLeft}px`}"
      v-for="item in processList"
      :key="item.id"
    >
      <div class="current-progress" :style="item.width"></div>
    </div>
    <div class="progress-number">{{data}}%</div>
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
    width: {
      type: Number,
      default: 16,
    },
    marginLeft: {
      type: Number,
      default: 2,
    },
  },
  mounted() {
    this.changeWidth();
  },
  methods: {
    changeWidth() {
      const self = this;
      self.processList = [];
      const a = parseInt(self.data / 20, 10);
      const b = self.data % 20;
      for (let i = 0; i < 5; i += 1) {
        if (i < a) {
          self.processList.push({
            width: `width: ${this.width}px;`,
          });
        } else if (i == a) {
          self.processList.push({
            width: `width: ${(b / 20) * this.width}px`,
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