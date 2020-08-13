<template>
  <div>
    <!-- 搜索条件 -->
    <div>
      <dl style="display:flex">
        <dd v-for="item in CONST.STATUS_LIST" :key="item.id" @click="searchOkr()">{{item.name}}</dd>
      </dl>
    </div>
    <!-- 一些功能按钮 -->
    <div>
      <el-button @click="goChangeOkr">变更</el-button>
    </div>
    <!-- 用展开行表格 -->
    <div>
      <div class="collapsetitle">
        <span>权重</span>
        <span>进度条</span>
        <span>信心指数</span>
        <span>承接地图</span>
      </div>
      <tl-okr-collapse :tableList="tableList" :disabled="false" :activeList="[0]">
        <template slot="head-bar" slot-scope="props">
          <el-button @click.native.stop="openDialog('tl-okr-detail',props.okritem)">详情</el-button>
          <el-button @click.native.stop="openDialog('tl-okr-history',props.okritem)">历史版本</el-button>
          <el-button @click.native.stop="openDialog('tl-okr-update',props.okritem)">进度更新</el-button>
        </template>
      </tl-okr-collapse>
    </div>

    <component
      :ref="currentView"
      v-bind:is="currentView"
      :server="server"
      :okrId="okrId"
      :okrItem="okrItem"
      :dialogExist.sync="dialogExist"
    ></component>
    <!-- <okr-history ref="okr-history" :server="server" :okrId="okrId" :dialogExist.sync="dialogExist"></okr-history>
    <okr-detail ref="okr-detail" :server="server" :okrId="okrId" :dialogExist.sync="dialogExist"></okr-detail>
    <okr-update ref="okr-update" :server="server" :okrId="okrId" :dialogExist.sync="dialogExist"></okr-update>-->
  </div>
</template>

<script>
import okrCollapse from '@/components/okrCollapse';
import okrDetail from './okrDetail';
import okrUpdate from './okrUpdate';
import okrHistory from './okrHistory';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'myokrPage',
  components: {
    'tl-okr-detail': okrDetail,
    'tl-okr-update': okrUpdate,
    'tl-okr-history': okrHistory,
    'tl-okr-collapse': okrCollapse,
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
      dialogExist: false,
      currentView: '', // 弹框组件
      okrId: '',
      okrItem: {},
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
      }).then((res) => {
        if (res.code == 200) {
          this.tableList = res.data.okrDetails;
          this.okrId = res.data.okrMain.okrId;
        }
      });
    },
    // 打开弹窗
    openDialog(componentName, val) {
      console.log('点击', componentName, val);
      this.currentView = componentName;
      this.okrItem = val;
      // this.okrId = val.detailId;
      this.$nextTick(() => {
        this.$refs[this.currentView].showOkrDialog();
        this.dialogExist = true;
      });
    },
    goChangeOkr() {
      this.$router.push({ name: 'writeOkr', params: { canWrite: 'cannot', okrId: this.okrId } });
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