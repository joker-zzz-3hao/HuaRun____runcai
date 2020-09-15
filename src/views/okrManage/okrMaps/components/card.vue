<template>
  <div style="width: 216px">
    <div>
      <div @click.stop="goDetail(node.node.okrId)">
        <p>{{node.node.okrDetailObjectKr}}</p>
      </div>
      <div>
        <span>KR</span>
        <span>关键成果</span>
        <span>{{node.node.krCount}}</span>
      </div>
      <div>
        <tl-process :data="node.node.okrProgress"></tl-process>
      </div>
    </div>
    <div style="display: flex;justify-content: space-between;" @click="takeOvierview(node)">
      <div>负责人：{{node.node.userName}}</div>
      <div>{{node.node.orgName}} ></div>
    </div>
  </div>
</template>

<script>
import process from '@/components/process';

export default {
  name: 'card',
  components: {
    'tl-process': process,
  },
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
    },
    takeOvierview(node) {
      this.$emit('takeOvierview', node);
    },
  },
  watch: {},
};
</script>