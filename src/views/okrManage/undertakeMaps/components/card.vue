<template>
  <div class="text">
    <div class="node_title">
      <span
        :class="node.okrDetailType == 'o' ? 'kind-parent':'kind-child'"
      >{{CONST.OKR_TYPE_MAP[node.okrDetailType]}}</span>
      <em>{{node.okrDetailObjectKr}}</em>
      <span>
        <el-button
          v-if="!node.okrParentId && node.userId ===userInfo.userId"
          @click="goDetail(node)"
        >对齐</el-button>
      </span>
    </div>
    <div class="node_des">
      <div></div>
      <div>
        <span>进度</span>
        <tl-process :data="node.okrDetailProgress"></tl-process>
      </div>
      <div>
        <span>负责人</span>
        {{node.userName}}
      </div>
      <!-- okr类型 -->
      <div>{{CONST.OKR_KIND_MAP[node.okrBelongType]}}</div>
      <!-- 圆圈 -->
      <div v-if="node.open">-</div>
      <!-- 数量 -->
      <div v-else>{{node.children?node.children.length:0}}</div>
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
      percentage: 20,
      customColor: '#409eff',
    };
  },
  mounted() {
    console.log(`node:${this.node.userName}`);
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    ...mapMutations('common', ['undertakeMapsStep', 'setundertakeDetail']),
    goDetail(node) {
      this.undertakeMapsStep('2');
      this.setundertakeDetail(node);
    },
  },
  watch: {},
};
</script>
<style>
.vnode .text {
  padding: 0 10px;
}
.vnode .text {
  position: relative;
  height: 100%;
  max-width: 230px;
  min-width: 216px;
}

.vnode .text .showTips {
  position: absolute;
  left: 225px;
  top: 0px;
  opacity: 0;
}
.vnode .text .showTips a {
  display: inline-block;
}
.vnode .text .showTips .tips_icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  text-decoration: none;
  padding: 3px;
  background: #ffffff;
  box-shadow: 1px 2px 10px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.5s ease 0s;
  color: #777777;
}
.vnode .text .showTips .tips_icon:hover {
  color: #58c2ef;
}
.vnode .text:hover .showTips.havechild {
  color: #58c2ef;
  opacity: 1;
}
</style>
