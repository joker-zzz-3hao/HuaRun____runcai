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
        <el-collapse-item
          v-for="(item, index) in tableList"
          :key="item.objectId+index"
          @click.native="goDetail(item.objectId)"
        >
          <template slot="title">
            <span>目标icon</span>
            <span>{{item.objectName}}</span>
            <span>{{item.percent}}%</span>
            <span class="progresswidth">
              <el-progress :stroke-width="10" :percentage="parseInt(item.progress, 10)"></el-progress>
            </span>

            <el-button @click.native.stop="goHistory(item.objectId)">历史版本</el-button>
            <el-button @click.native.stop="goUpdate(item.objectId)">进度更新</el-button>
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
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="40%"
      :modal-append-to-body="false"
    >
      <component ref="com" v-bind:is="currentView"></component>

      <okrDetail :server="server"></okrDetail>
    </el-dialog>
  </div>
</template>

<script>
import okrDetail from './okrDetail';
import okrUpdate from './okrUpdate';
import okrHistory from './okrHistory';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'myokrPage',
  components: {
    'okr-detail': okrDetail,
    'okr-update': okrUpdate,
    'okr-history': okrHistory,
  },
  data() {
    return {
      server,
      CONST,
      tableList: [],
      searchForm: {},
      timelist: [],
      dialogVisible: false, // 弹框是否显示
      currentView: 'okr-detail', // 弹框组件
      dialogTitle: 'OKR详情', // 弹框标题
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
    // 更新进度
    goUpdate(val) {
      console.log('点击', val);
      this.currentView = 'okr-update';
      this.dialogTitle = '更新进度';
      this.dialogVisible = true;
    },
    // 历史版本
    goHistory(val) {
      console.log('点击', val);
      this.currentView = 'okr-history';
      this.dialogTitle = '历史版本';
      this.dialogVisible = true;
    },
    goDetail(val) {
      console.log('点击', val);
      this.currentView = 'okr-detail';
      this.dialogTitle = 'OKR详情';
      this.dialogVisible = true;
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