<template>
  <div style="width: 216px" @click.stop="goDetail(node.node.okrId)">
    <div>
      <div>
        <p>{{node.node.okrDetailObjectKr}}</p>
      </div>
      <div>
        <span>KR</span>
        <span>关键成果</span>
        <span>{{node.node.krCount}}</span>
      </div>
      <div>
        <el-progress :percentage="node.node.okrProgress" :color="customColor"></el-progress>
      </div>
    </div>
    <div style="display: flex;justify-content: space-between;">
      <div>负责人：{{node.node.userName}}</div>
      <div>{{node.node.orgName}} ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'card',
  components: {},
  props: {
    node: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      percentage: 20,
      customColor: '#409eff',
    };
  },
  mounted() {
    console.log(`node:${this.node}`);
  },
  computed: {},
  methods: {
    goDetail(okrid) {
      this.$emit('showDetail', okrid);
      this.$emit('takeOvierview');
    },

  },
  watch: {},
};
</script>