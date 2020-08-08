<template>
  <div>
    <!-- okr折叠面板 -->
    <elcollapse class="collapse">
      <elcollapseitem ref="okrcoll" v-for="(item, index) in tableList" :key="item.detailId+index">
        <template slot="title">
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
        </template>
        <div v-for="(kritem, index) in item.krList" :key="kritem.detailId+index">
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
      canWrite: true, // true写okr false okr详情
    };
  },
  props: {
    tableList: {
      type: Array,
    },
    okrid: {
      type: String,
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