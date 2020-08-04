<template>
  <div>
    <!-- 搜索条件 -->
    <div>
      <el-select v-model="searchForm.time" placeholder="请选择时间" @change="searchOkr">
        <el-option
          v-for="(item, index) in timelist"
          :key="item.timeid+index"
          :label="item.timecycle"
          :value="item.timeid"
        ></el-option>
      </el-select>
      <dl>
        <dd
          v-for="item in CONST.STATUS_LIST"
          :key="item.id"
          @click="searchOkr(item.id)"
        >{{item.name}}</dd>
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
      <p>头像or部门logo</p>
    </div>
  </div>
</template>

<script>
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'departmentPage',
  data() {
    return {
      server,
      CONST,
      searchForm: {
        status: '',
        time: '',
      },
      tableList: [], // okr列表
      timelist: [], // 周期列表
      memberList: [], // 成员列表
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.server.getTimeCycle().then((response) => {
        // console.log(response.data);
        this.timelist = response.data;
        // 默认选中当前周期
        this.searchForm.time = this.timelist[0].timeid;
        this.searchOkr();
        this.searchMember();
      });
    },
    searchOkr(status = '01') { // 默认搜索进行时
      this.searchForm.status = status;
      this.server.getokrdata(this.searchForm).then((res) => {
        console.log('搜索条件', this.searchForm);
        this.tableList = res.data;
      });
    },
    // 搜索团队成员
    searchMember() {

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