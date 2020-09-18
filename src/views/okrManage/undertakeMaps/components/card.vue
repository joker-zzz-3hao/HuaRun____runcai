<template>
  <div class="maps-card">
    <dl class="okr-info">
      <dt class="tag-kind">
        <span
          :class="node.okrDetailType == 'o' ? 'kind-parent':'kind-child'"
        >{{CONST.OKR_TYPE_MAP[node.okrDetailType]}}</span>
        <em>{{node.okrDetailObjectKr}}</em>
      </dt>
      <dd>
        <el-button
          v-if="!node.okrParentId && node.userId ===userInfo.userId"
          @click="goDetail(node)"
        >对齐</el-button>
      </dd>
    </dl>
    <div class="department-info">
      <span>负责人</span>
      <em>{{node.userName}}</em>
    </div>
    <tl-process :data="node.okrDetailProgress"></tl-process>
    <!-- okr类型 -->
    <div>{{CONST.OKR_KIND_MAP[node.okrBelongType]}}</div>
    <!-- 圆圈 -->
    <div v-if="node.children">
      <!-- 展开时显示减号 -->
      <div v-if="node.open">-</div>
      <!-- 收起时显示数量 -->
      <div v-else>{{node.children.length}}</div>
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
  },
  watch: {},
};
</script>
