<template>
  <div class="maps-card">
    <dl class="okr-info">
      <dt class="tag-kind">
        <span :class="node.okrDetailType == 0 ? 'kind-parent' : 'kind-child'">{{
          CONST.OKR_KIND_MAP[node.okrDetailType]
        }}</span>
        <em>{{ node.okrDetailObjectKr }}</em>
        <el-button
          :disabled="!hasPower('okr-continue-align')"
          type="text"
          plain
          class="tl-btn btn-lineheight"
          v-if="
            showbutton &&
            node.children &&
            node.children.length &&
            node.userId === userInfo.userId
          "
          @click.stop="goDetail(node)"
          >对齐</el-button
        >
      </dt>
    </dl>
    <tl-process ref="process" :data="node.okrDetailProgress"></tl-process>
    <div class="department-info">
      <p>
        <span>负责人</span>
        <em @click.stop="takeOvierview(node)">{{ node.userName }}</em>
      </p>
      <el-button type="text" plain class="tl-btn btn-lineheight">{{
        CONST.OKR_TYPE_MAP[node.okrBelongType]
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
      showbutton: false,
    };
  },
  created() {
    if (this.roleCode.includes('ORG_ADMIN')) {
      this.showbutton = true;
    }
  },
  mounted() {
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      roleCode: (state) => state.roleCode,
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
  watch: {
    'node.show': {
      handler() {
        // 重新触发进度条计算
        this.$refs.process.changeWidth();
      },
    },
  },
};
</script>
