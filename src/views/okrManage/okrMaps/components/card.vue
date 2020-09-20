<template>
  <div class="maps-card">
    <dl class="okr-info">
      <dt @click.stop="goDetail(node.node.okrId)">
        <em>{{node.node.okrDetailObjectKr}}</em>
      </dt>
      <dd class="tag-kind">
        <span class="kind-child">KR</span>
        <span>关键成果</span>
        <em>{{node.node.krCount}}</em>
      </dd>
    </dl>
    <tl-process :data="node.node.okrProgress" :width="36" :marginLeft="6"></tl-process>
    <div class="department-info" @click.stop="takeOvierview(node.node)">
      <span>负责人</span>
      <em>{{node.node.userName}}</em>
      <el-button type="text" plain class="tl-btn btn-lineheight">{{node.node.orgName}}</el-button>
    </div>
    <div class="has-child" v-if="node.node.children">
      <div class="is-extend" v-if="node.node.open">
        <span></span>
      </div>
      <div v-else>{{node.node.children.length}}</div>
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