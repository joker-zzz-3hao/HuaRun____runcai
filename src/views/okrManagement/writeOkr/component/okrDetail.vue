<template>
  <div>
    <el-collapse class="collapse">
      <el-collapse-item v-for="(item, index) in tableList" :key="item.objectId+index">
        <template slot="title">
          <div>{{item.objectName}}</div>
          <ul class="detail">
            <li>
              <span>权重</span>
              <span>{{item.percent}}%</span>
            </li>
            <li>
              <span>当前进度</span>
              <span class="progresswidth">
                <el-progress :stroke-width="10" :percentage="parseInt(item.progress, 10)"></el-progress>
              </span>
            </li>
            <li>
              <span>目标承接自</span>
              <span>{{item.percent}}</span>
            </li>
          </ul>
        </template>
        <div v-for="(kritem, index) in item.krList" :key="kritem.krId+index">
          <div>{{index+1}}{{kritem.krName}}</div>
          <ul class="detail">
            <li>
              <span>分权重</span>
              <span>{{kritem.percent}}%</span>
            </li>
            <li>
              <span>当前进度</span>
              <span class="progresswidth">
                <el-progress :stroke-width="10" :percentage="parseInt(kritem.progress, 10)"></el-progress>
              </span>
            </li>
            <li>
              <span>信心指数</span>
              <span>{{kritem.confidence}}</span>
            </li>
          </ul>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import CONST from '../const';

export default {
  name: 'okrDetail',
  data() {
    return {
      CONST,
      tableList: [],
    };
  },
  props: {

    server: {
      type: Object,
      required: true,
    },

  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.server.getokrdata().then((res) => {
        console.log(res);
        this.tableList = res.data;
      });
    },

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