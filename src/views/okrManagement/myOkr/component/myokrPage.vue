<template>
  <div>
    <!-- 搜索条件 -->
    <div>
      <el-select v-model="searchForm.time" placeholder="请选择时间" :popper-append-to-body="false">
        <el-option
          v-for="(item, index) in timelist"
          :key="item.timeid+index"
          :label="item.timecycle"
          :value="item.timeid"
        ></el-option>
      </el-select>
      <dl>
        <dd v-for="item in CONST.STATUS_LIST" :key="item.id">{{item.name}}</dd>
      </dl>
    </div>
    <!-- 用展开行表格 -->
    <div>
      <p>用折叠面板</p>
      <div class="collapsetitle">
        <span>权重</span>
        <span>进度条</span>
        <span>信心指数</span>
        <span>承接地图</span>
      </div>

      <el-collapse class="collapse">
        <el-collapse-item v-for="(item, index) in tableList" :key="item.objectId+index">
          <template slot="title">
            <span>目标icon</span>
            <span>{{item.objectName}}</span>
            <span>{{item.percent}}%</span>
            <span class="progresswidth">
              <el-progress :stroke-width="10" :percentage="parseInt(item.progress, 10)"></el-progress>
            </span>

            <button @click="gocheng(item.objectId,item.objectName)">承接地图</button>
          </template>
          <div v-for="(kritem, index) in item.krList" :key="kritem.krId+index">
            <span>KRicon</span>
            <span>{{kritem.krName}}</span>
            <span>{{kritem.percent}}%</span>
            <div class="progresswidth">
              <el-progress :stroke-width="10" :percentage="parseInt(kritem.progress, 10)"></el-progress>
            </div>
            <span>信心指数{{kritem.confidence}}</span>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 展示头像 -->
    <div>
      <p>头像or部门logo111111</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo</p>
      <p>头像or部门logo9999999</p>
    </div>
  </div>
</template>

<script>
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'myokrPage',
  data() {
    return {
      server,
      CONST,
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
    gocheng(id, name) {
      this.$message('要跳到承接地图啦~');
      this.$router.push({ name: 'supportMaps', params: { objectId: id, objectName: name } });
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