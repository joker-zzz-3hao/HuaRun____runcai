<template>
  <div>
    <!-- 搜索条件 -->
    <div>
      <dl style="display:flex">
        <dd v-for="item in CONST.STATUS_LIST" :key="item.id" @click="searchOkr()">{{item.name}}</dd>
      </dl>
    </div>
    <!-- 用展开行表格 -->
    <div>
      <div class="collapsetitle">
        <span>权重</span>
        <span>进度条</span>
        <span>信心指数</span>
        <span>承接地图</span>
      </div>

      <el-collapse class="collapse">
        <el-collapse-item
          v-for="(item, index) in tableList"
          :key="item.detailId+index"
          @click.native="openDialog('okr-detail',item.okrDetailObjectKr)"
        >
          <template slot="title">
            <span>目标icon</span>
            <span>{{item.okrDetailObjectKr}}</span>
            <span>{{item.okrWeight}}%</span>
            <span class="progresswidth">
              <el-progress :stroke-width="10" :percentage="parseInt(item.okrDetailProgress, 10)"></el-progress>
            </span>

            <el-button @click.native.stop="openDialog('okr-history',item.detailId)">历史版本</el-button>
            <el-button @click.native.stop="openDialog('okr-update',item.detailId)">进度更新</el-button>
          </template>
          <div v-for="(kritem, index) in item.krList" :key="index">
            <span>KRicon</span>
            <span>{{kritem.okrDetailObjectKr}}</span>
            <span>{{kritem.okrWeight}}%</span>
            <div class="progresswidth">
              <el-progress :stroke-width="10" :percentage="parseInt(kritem.okrDetailProgress, 10)"></el-progress>
            </div>
            <span>信心指数{{kritem.confidence}}</span>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%"
      :modal-append-to-body="false"
    >
      <component ref="com" v-bind:is="currentView" :server="server" :okrId="okrId"></component>
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
      tableList: [], // okr列表
      searchForm: {
        status: '1',
        time: '',
      },
      dialogVisible: false, // 弹框是否显示
      currentView: 'okr-detail', // 弹框组件
      dialogTitle: 'OKR详情', // 弹框标题
      okrId: '',
    };
  },

  created() {
    this.init();
    this.searchOkr();
  },
  methods: {
    init() {
    },
    searchOkr() {
      this.server.getmyOkr({
        myOrOrg: 'my',
        periodId: 'periodId',
        status: this.searchForm.status,
        userId: 'user007',
      }).then((res) => {
        if (res.code == 200) {
          this.tableList = res.data.okrDetails;
          this.okrId = res.data.okrMain.okrId;
        }
      });
    },
    // 打开弹窗
    openDialog(componentName, val) {
      console.log('点击', val);
      this.currentView = componentName;
      this.dialogTitle = '更新进度';
      switch (componentName) {
        case 'okr-update':
          this.dialogTitle = '更新进度';
          break;
        case 'okr-history':
          this.dialogTitle = '历史版本';
          break;
        case 'okr-detail':
          this.dialogTitle = 'OKR详情';
          break;
        default:
          break;
      }
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