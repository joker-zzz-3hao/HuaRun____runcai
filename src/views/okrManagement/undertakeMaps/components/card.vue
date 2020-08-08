<template>
  <div class="text">
    <div class="node_title">
      <span class="OKR">{{CONST.OKR_TYPE_MAP[node.okrDetailType]}}</span>
      <span class="label">{{node.okrDetailObjectKr}}</span>
    </div>
    <div class="node_des">
      <div></div>
      <div>{{node.okrDetailProgress}}</div>
      <div>{{node.userName}}</div>
      <div>{{node.open}}</div>
      <!-- <div>{{node.children}}</div> -->
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
    console.log(`node:${this.node}`);
  },
  computed: {},
  methods: {},
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
