<template>
  <div style="display: flex;">
    <div class="parent-class" v-for="item in processList" :key="item.id">
      <div class="children-class" :style="item.width"></div>
    </div>
    <div>{{data}}%</div>
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
      type: Array,
      default() {
        return [];
      },
    },
  },
  mounted() {
    const self = this;
    self.processList = [];
    const a = parseInt(self.data / 20, 10);
    const b = self.data % 20;
    for (let i = 0; i < 5; i += 1) {
      if (i < a) {
        self.processList.push({
          width: 'width: 30px;',
        });
      } else if (i == a) {
        self.processList.push({
          width: `width: ${(b / 20) * 30}px`,
        });
      } else {
        self.processList.push({
          width: 'width: 0px;',
        });
      }
    }
  },
  methods: {},
  watch: {},
};
</script>
<style scoped>
.parent-class {
  width: 30px;
  height: 10px;
  position: relative;
  margin-left: 10px;
}
.children-class {
  height: 10px;
  position: absolute;
  top: 0;
  left: 0px;
  background-color: slateblue;
}
</style>