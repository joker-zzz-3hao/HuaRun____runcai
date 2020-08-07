<template>
  <div>
    <!-- okr折叠面板 -->
    <elcollapse class="collapse">
      <elcollapseitem v-for="(item, index) in tableList" :key="item.objectId+index">
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
        <div v-for="(kritem, index) in item.krList" :key="kritem.krId+index">
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
    server: {
      type: Object,
      required: true,
    },
    okrid: {
      type: String,
    },
  },
  created() {

  },
  methods: {

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