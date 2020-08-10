<template>
  <div>
    <!-- okr折叠面板 -->
    <elcollapse class="collapse" v-model="activeList">
      <elcollapseitem
        ref="okrcoll"
        v-for="(item, index) in tableList"
        :key="item.detailId+index"
        :name="index"
        :disabled="disabled"
      >
        <template slot="title">
          <div v-if="showOKRInfoLabel">目标O：</div>
          <div>{{item.okrDetailObjectKr}}</div>
          <ul class="detail">
            <li>
              <span>权重</span>
              <span>{{item.okrWeight}}%</span>
            </li>
            <li>
              <span>当前进度</span>
              <span class="progresswidth">
                <el-progress :stroke-width="10" :percentage="parseInt(item.okrDetailProgress, 10)"></el-progress>
              </span>
            </li>
            <li>
              <span>目标承接自</span>
              <span>{{item.parentObjectKr}}</span>
            </li>
          </ul>
          <!-- 可在折叠面板title处添加内容 -->
          <slot name="head-bar" :okritem="item"></slot>
        </template>
        <div v-for="(kritem, index) in item.krList" :key="kritem.detailId+index">
          <div v-if="showOKRInfoLabel">关键行动KR：</div>
          <div>
            <span>{{index+1}}</span>
            {{kritem.okrDetailObjectKr}}
          </div>
          <ul class="detail">
            <li>
              <span>分权重</span>
              <span>{{kritem.okrWeight}}%</span>
            </li>
            <li>
              <span>当前进度</span>
              <span class="progresswidth">
                <el-progress
                  :stroke-width="10"
                  :percentage="parseInt(kritem.okrDetailProgress, 10)"
                ></el-progress>
              </span>
            </li>
            <li>
              <span>信心状态</span>
              <span>{{kritem.confidence}}</span>
            </li>
          </ul>
          <!-- 可在折叠面板body处添加内容 -->
          <slot name="body-bar" :okritem="kritem"></slot>
        </div>
      </elcollapseitem>
    </elcollapse>
  </div>
</template>

<script>
import elcollapse from '@/components/collapse/collapse';
import elcollapseitem from '@/components/collapse/collapse-item';

export default {
  name: 'okrCollapse',
  components: {
    elcollapse, elcollapseitem,
  },
  data() {
    return {
      okrmain: {},
    };
  },
  props: {
    tableList: {
      type: Array,
    },
    okrid: {
      type: String,
    },
    // 默认展开的序号数组
    // 如果 disabled为true，需传入activeList
    activeList: {
      type: Array,
      default() {
        return [0];
      },
    },
    // disabled(不能收起：true;能收起展开：false)
    disabled: {
      type: Boolean,
      default: false,
    },
    // true写okr false okr详情
    canWrite: {
      type: Boolean,
      default: true,
    },
    // 是否显示label
    showOKRInfoLabel: {
      type: Boolean,
      default: false,
    },
  },
  created() {

  },
  methods: {
    zhankai(ref) {
      console.log('在组件中点了', this.$refs[`okrcoll${ref}`]);
      this.$refs.okrcoll[ref].handleHeaderClick();
    },
  },
  watch: {

  },
};
</script>

<style>
.collapse span,
.collapsetitle span {
  margin-left: 10px;
}

.collapsetitle {
  margin-left: 250px;
}
.progresswidth {
  width: 150px;
  display: inline-block;
}
.detail {
  display: flex;
}
</style>