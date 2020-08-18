<template>
  <div>
    <!-- 搜索条件 -->
    <div>
      <!-- 选择状态 -->
      <dl style="display:flex">
        <dd
          v-for="item in CONST.STATUS_LIST"
          :key="item.id"
          @click="searchOkr(item.id)"
        >{{item.name}}</dd>
      </dl>
    </div>
    <!-- 一些功能按钮 根据状态判断-->
    <div>
      <el-button @click="goChangeOkr">变更</el-button>
    </div>
    <!-- okr模块 只有起草中是有多个 -->
    <div v-for="(item, index) in okrList" :key="index">
      <!-- 基本信息 -->
      <div>
        <ul>
          <li>
            <span>状态</span>
            <span>{{CONST.STATUS_LIST_MAP[searchForm.status]}}</span>
          </li>
          <li>
            <span>负责人</span>
            <span>{{item.okrMain.userName}}</span>
          </li>
          <li>
            <span>OKR进度</span>
            <el-progress :stroke-width="10" :percentage="parseInt(item.okrMain.okrProgress, 10)"></el-progress>
          </li>
          <li>
            <span>更新时间</span>
            <span>{{item.okrMain.updateTime || item.okrMain.createTime}}</span>
          </li>
        </ul>
      </div>
      <!-- okr面板 -->
      <tl-okr-collapse :tableList="item.tableList" :disabled="false" :activeList="[0]">
        <template slot="head-bar" slot-scope="props">
          <el-button
            v-if="searchForm.status=='1'"
            @click.native.stop="openDialog('tl-okr-detail',props.okritem)"
          >详情</el-button>
          <el-button
            v-if="searchForm.status=='1'"
            @click.native.stop="openDialog('tl-okr-history',props.okritem)"
          >历史版本</el-button>
          <el-button
            v-if="searchForm.status=='1'"
            @click.native.stop="openDialog('tl-okr-update',props.okritem)"
          >进度更新</el-button>
          <el-button v-if="searchForm.status=='6'" @click.native.stop="goDraft(item)">编辑</el-button>
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
import okrDetail from '@/components/okrDetail';
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
      okrList: [{
        tableList: [], // okr列表
        okrMain: { // okr公共信息
          userName: '',
          okrProgress: 0,
          updateTime: '',
        },
      }],
      searchForm: {
        status: '1',
      },
      dialogExist: false,
      currentView: '', // 弹框组件
      okrId: '',
      okrItem: {},

    };
  },
  props: {
    okrCycle: {
      type: Object,
      required: true,
    },
  },
  created() {
  },
  methods: {
    searchOkr(status) {
      this.searchForm.status = status || '1';
      this.server.getmyOkr({
        myOrOrg: 'my',
        periodId: 'periodId', // this.okrCycle.periodId
        status: this.searchForm.status,
      }).then((res) => {
        if (res.code == 200) {
          if (this.searchForm.status == '6') {
            this.okrList = [];
            const draftList = res.data || [];
            draftList.forEach((item) => {
              const okrInfo = JSON.parse(item.params);
              this.okrList.push({
                tableList: okrInfo.okrInfoList,
                okrMain: {
                  userName: item.updateBy || item.createBy,
                  okrProgress: 0,
                  updateDate: item.updateTime,
                },
                id: item.id,
                params: item.params,
              });
              console.log('草稿', this.tableList);
            });
          } else {
            this.okrList[0].tableList = res.data.okrDetails;
            this.okrList[0].okrMain = res.data.okrMain;
            this.okrId = res.data.okrMain.okrId;
            console.log('进行中', this.tableList);
          }
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
    goDraft(item) {
      const draftInfo = {
        draftParams: item.params,
        draftId: item.id,
        okrStatus: this.searchForm.status,
        okrorgCycle: this.okrorgCycle,
      };
      this.$router.push({ name: 'writeOkr', params: { canWrite: 'draft', draftInfo } });
    },
  },
  watch: {
    'okrCycle.periodId': {
      handler() {
        this.searchOkr();
      },
      immediate: true,
      deep: true,
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