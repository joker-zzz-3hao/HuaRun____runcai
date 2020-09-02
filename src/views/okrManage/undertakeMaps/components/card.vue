<template>
  <div class="text">
    <div class="node_title">
      <span>{{CONST.OKR_TYPE_MAP[node.okrDetailType]}}</span>
      <span>{{node.okrDetailObjectKr}}</span>
      <span>
        <el-button
          v-if="!node.okrParentId && node.userName ===userInfo.userName"
          @click="goDetail(node)"
        >对齐</el-button>
      </span>
    </div>
    <div class="node_des">
      <div></div>
      <div>
        <span>进度</span>
        <span>{{node.okrDetailProgress}}%</span>
      </div>
      <div>
        <span>负责人</span>
        {{node.userName}}
      </div>
      <div>{{node.open}}</div>
      <div>{{node.children?node.children.length:0}}</div>
    </div>
    <!-- <div class="showTips" :class="node.children ? 'havechild' : ''">
      <a class="tips_icon icon_edit">
        <i v-if="node.open" class="el-icon-minus"></i>
        <i v-else class="el-icon-plus"></i>
      </a>
    </div>-->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import CONST from '../const';

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
