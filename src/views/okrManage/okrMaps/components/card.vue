<template>
  <div class="maps-card">
    <div @click.stop="goDetail(node.node.okrId)">
      <dl class="okr-info">
        <dd class="card-tag">
          <em>{{ node.node.periodName }}</em>
        </dd>
        <dt>
          <span>主要目标：</span>
          <em>{{ node.node.okrDetailObjectKr }}</em>
          <span>等</span>
        </dt>
        <dd class="tag-kind">
          <!-- <span class="kind-child">KR</span> -->
          <span>关键成果数：</span>
          <em>{{ node.node.krCount }}</em>
          <span>个</span>
        </dd>
      </dl>
      <tl-process
        @click.stop="goDetail(node.node.okrId)"
        :data="node.node.okrProgress"
        :width="38"
        :marginLeft="6"
      ></tl-process>
      <div class="department-info">
        <p>
          <span>负责人</span
          ><em @click.stop="takeOvierview(node.node)">{{
            node.node.userName
          }}</em>
        </p>
        <el-button type="text" plain class="tl-btn btn-lineheight">{{
          cutOrgName(node.node.orgName)
        }}</el-button>
      </div>
    </div>
    <div class="has-child" v-if="hasValue(node.node.children)">
      <div class="is-extend" v-if="hasValue(node.node.open)">
        <span></span>
      </div>
      <div v-else>{{ node.node.children.length }}</div>
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