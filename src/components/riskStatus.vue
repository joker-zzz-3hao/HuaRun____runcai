<template>
  <div
    :class="{'bg-green': status == '1','bg-yellow': status == '2','bg-red':status == '3'}"
    class="status"
  ></div>
</template>

<script>
export default {
  name: 'riskStatus',
  components: {},
  props: {
    status: {
      default: '1',
    },
  },
  data() {
    return {
    };
  },
  mounted() {
  },
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