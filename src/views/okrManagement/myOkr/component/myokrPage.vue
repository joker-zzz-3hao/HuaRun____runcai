<template>
  <div>
    <!-- 搜索条件 -->
    <div>
      <el-select v-model="searchForm.time" placeholder="请选择时间">
        <el-option
          v-for="item in timelist"
          :key="item.timeid"
          :label="item.timecycle"
          :value="item.timeid"
        ></el-option>
      </el-select>
      <dl>
        <dd>状态</dd>
      </dl>
    </div>
    <!-- 用折叠面板 -->
    <div>
      <p>用折叠面板</p>
      <div class="collapsetitle">
        <span>权重</span>
        <span>进度条</span>
        <span>信心指数</span>
        <span>承接地图</span>
      </div>

      <el-collapse class="collapse">
        <el-collapse-item v-for="item in tableList" :key="item.objectId">
          <template slot="title">
            <span>目标icon</span>
            <span>{{item.objectName}}</span>
            <span>{{item.percent}}%</span>
            <span class="progresswidth">
              <el-progress :stroke-width="10" :percentage="item.progress"></el-progress>
            </span>

            <span @click="gocheng">承接地图</span>
          </template>
          <div v-for="kritem in item.krList" :key="kritem.krId">
            <span>KRicon</span>
            <span>{{kritem.krName}}</span>
            <span>{{kritem.percent}}%</span>
            <div class="progresswidth">
              <el-progress :stroke-width="10" :percentage="kritem.progress"></el-progress>
            </div>
            <span>信心指数{{kritem.confidence}}</span>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import Server from '../server';

const server = new Server();

export default {
  name: 'crcloudTable',
  data() {
    return {
      server,
      tableList: [],
      searchForm: {},
      timelist: [],
    };
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
      this.server.getTimeCycle().then((response) => {
        console.log(response.data);
        this.timelist = response.data;
      });
    },
    gocheng() {
      this.$message('要跳到承接地图啦~');
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
</style>