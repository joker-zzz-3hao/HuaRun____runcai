<template>
  <div class="maps-card">
    <dl class="okr-info">
      <dt class="tag-kind">
        <span :class="node.okrDetailType == 0 ? 'kind-parent' : 'kind-child'">{{
          CONST.OKR_TYPE_MAP[node.okrDetailType]
        }}</span>
        <em>{{ node.okrDetailObjectKr }}</em>
        <el-button
          :disabled="!hasPower('okr-continue-align')"
          type="text"
          plain
          class="tl-btn btn-lineheight"
          v-if="
            node.children &&
            node.children.length &&
            node.userId === userInfo.userId
          "
          @click.stop="goDetail(node)"
          >对齐</el-button
        >
      </dt>
    </dl>
    <tl-process
      :data="node.okrDetailProgress"
      :width="36"
      :marginLeft="6"
    ></tl-process>
    <div class="department-info" @click.stop="takeOvierview(node)">
      <span>负责人</span>
      <em>{{ node.userName }}</em>
      <el-button type="text" plain class="tl-btn btn-lineheight">{{
        CONST.OKR_KIND_MAP[node.okrBelongType]
      }}</el-button>
    </div>
    <div class="has-child" v-if="node.children">
      <div class="is-extend" v-if="node.open">
        <span></span>
      </div>
      <div v-else>{{ node.children.length }}</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import process from '@/components/process';
import CONST from '../const';

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
      CONST,
    };
  },
  mounted() {
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    ...mapMutations('common', ['setUndertakeMapsStep', 'setundertakeDetail']),
    goDetail(node) {
      this.setUndertakeMapsStep('2');
      this.setundertakeDetail(node);
    },
    takeOvierview(node) {
      this.$emit('takeOvierview', node);
    },
  },
  watch: {},
};
</script>
