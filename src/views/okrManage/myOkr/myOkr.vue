<template>
  <div>
    <div>
      <!-- 选择状态 -->
      <dl>
        <dd v-for="item in CONST.STATUS_LIST" :key="item.id">
          <el-button @click="searchOkr(item.id)">{{item.name}}</el-button>
        </dd>
      </dl>
      <!-- 选择周期 -->
      <tl-periodselect :periodList="periodList" @handleData="handleCycleData"></tl-periodselect>
    </div>
    <!-- 状态为审批中需展示温馨提示 -->
    <div v-if="searchForm.status=='7'">
      <el-alert type="warning">
        <div slot="title">
          <i>温馨提示icon</i>
          <span>审批成功后才展示变更后的内容，请勿再次提交变更</span>
        </div>
      </el-alert>
    </div>
    <!-- okr模块 只有起草中是有多个 -->
    <div v-for="(item, index) in okrList" :key="index">
      <!-- 基本信息 -->
      <div v-if="item.tableList.length>0">
        <div>{{okrCycle.periodName}}OKR</div>
        <ul class="okrMain" style>
          <li>
            <span>更新时间</span>
            <span>{{item.okrMain.updateTime || item.okrMain.createTime}}</span>
          </li>
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
            <el-progress type="circle" :percentage="parseInt(item.okrMain.okrProgress, 10)"></el-progress>
          </li>
        </ul>
        <el-button v-if="['1'].includes(searchForm.status)" @click="goChangeOkr">变更</el-button>
      </div>
      <!-- 表头 -->
      <div v-if="item.tableList.length>0">
        <ul class="tablehead">
          <li>权重</li>
          <li>进度</li>
          <li>风险状态</li>
          <li>承接地图</li>
        </ul>
      </div>
      <!-- okr面板 -->
      <tl-okr-table
        :tableList="item.tableList"
        :disabled="false"
        :activeList="[0]"
        :showOKRInfoLabel="true"
        :status="searchForm.status"
        @openDialog="openDialog(item)"
        @goDraft="goDraft(item)"
      >
        <template slot="head-bar" slot-scope="props">
          <el-button
            v-if="props.okritem.continueCount>0"
            @click="goUndertakeMaps(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
          >承接地图icon{{props.okritem.continueCount}}</el-button>
          <el-button
            v-if="searchForm.status=='1'"
            @click.stop="openUpdate('tl-okr-update',props.okritem)"
          >更新进度</el-button>
        </template>
        <template slot="body-bar" slot-scope="props">
          <el-button
            v-if="props.okritem.continueCount>0"
            @click.stop="goUndertakeMaps(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
          >承接地图icon{{props.okritem.continueCount}}</el-button>
        </template>
      </tl-okr-table>
    </div>
    <!-- 无数据时展示 -->
    <div v-if="okrList.length == 0">暂无数据</div>
    <el-drawer
      :title="drawerTitle"
      :visible.sync="myokrDrawer"
      :before-close="handleClose"
      :wrapperClosable="false"
      :append-to-body="true"
      class="tl-drawer"
    >
      <div>
        <tl-writeokr
          v-if="currentView=='tl-writeokr' && myokrDrawer && writeInfo.canWrite"
          @handleClose="handleClose"
          :writeInfo="writeInfo"
        ></tl-writeokr>
        <tl-okr-detail
          v-else-if="currentView=='tl-okr-detail' && myokrDrawer"
          ref="tl-okr-detail"
          :server="server"
          :okrId="okrId"
          :CONST="CONST"
        ></tl-okr-detail>
        <tl-okr-update
          v-else-if="currentView=='tl-okr-update' && myokrDrawer"
          ref="tl-okr-update"
          :server="server"
          :okrId="okrId"
          :okrItem="okrItem"
          :periodId="okrCycle.periodId"
        ></tl-okr-update>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import periodSelect from '@/components/periodSelect';
import okrTable from '@/components/okrTable';
import okrDetail from '@/components/okrDetail';
import okrUpdate from './component/okrUpdate';
import writeOkr from './component/writeOkr/index';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'myOkr',
  components: {
    'tl-periodselect': periodSelect,
    'tl-okr-detail': okrDetail,
    'tl-okr-update': okrUpdate,
    'tl-okr-table': okrTable,
    'tl-writeokr': writeOkr,
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
      drawer: false,
      writeInfo: {
        canWrite: '',
      },
      drawerTitle: '创建okr',
      okrCycle: {}, // 当前选择的周期
      periodList: [], // 周期列表
    };
  },
  computed: {
    ...mapState('common', {
      myokrDrawer: (state) => state.myokrDrawer,
    }),
  },
  created() {
    this.getOkrCycleList();
  },
  methods: {
    ...mapMutations('common', ['setMyokrDrawer']),
    searchOkr(status) {
      this.searchForm.status = status || this.searchForm.status;

      this.server.getmyOkr({
        myOrOrg: 'my',
        periodId: this.okrCycle.periodId,
        status: this.searchForm.status,

      }).then((res) => {
        if (res.code == 200) {
          // 如果是草稿、退回、审批中回显json串
          if (['6', '7', '8'].includes(this.searchForm.status)) {
            this.okrList = [];
            const draftList = res.data || [];
            draftList.forEach((item) => {
              let okrInfo = {};
              okrInfo = JSON.parse(item.paramJson);
              this.okrList.push({
                tableList: okrInfo.okrInfoList,
                okrMain: {
                  userName: item.updateBy || item.createBy,
                  okrProgress: 0,
                  updateDate: item.updateTime || item.createTime,
                },
                id: item.id || item.approvalId,
                params: item.paramJson,
              });
            });
          } else {
            this.okrList = [{
              tableList: [], // okr列表
              okrMain: { // okr公共信息
                userName: '',
                okrProgress: 0,
                updateTime: '',
              },
            }];
            this.okrList[0].tableList = res.data.okrDetails || [];
            this.okrList[0].okrMain = res.data.okrMain || {};
            this.okrId = this.okrList[0].okrMain.okrId || '';
          }
        }
      });
    },
    // 打开详情
    openDialog(val) {
      this.writeInfo.canWrite = false;
      this.currentView = 'tl-okr-detail';
      this.okrItem = val;
      this.drawerTitle = 'OKR详情';

      this.setMyokrDrawer(true);
      this.$nextTick(() => {
        this.$refs[this.currentView].showOkrDialog();
      });
    },
    // 打开更新进度
    openUpdate(componentName, val) {
      this.okrItem = val;
      this.drawerTitle = '更新进度';
      this.currentView = componentName;
      this.setMyokrDrawer(true);
      this.$nextTick(() => {
        this.$refs[componentName].showOkrDialog();
      });
    },
    goChangeOkr() {
      // TODO: 弹框标题
      this.drawerTitle = '华润云第三季度OKR';
      this.writeInfo = {
        canWrite: 'cannot',
        okrId: this.okrId,
        periodId: this.okrCycle.periodId,
      };
      this.currentView = 'tl-writeokr';
      this.setMyokrDrawer(true);
    },
    goDraft(item) {
      this.drawerTitle = '编辑';
      this.writeInfo = {
        canWrite: 'draft',
        draftParams: item.params,
        draftId: item.id,
        okrStatus: this.searchForm.status,
        okrCycle: this.okrCycle,
      };
      this.currentView = 'tl-writeokr';
      this.setMyokrDrawer(true);
    },
    handleClose() {
      this.currentView = '';
      this.setMyokrDrawer(false);
    },
    // 跳到承接地图
    goUndertakeMaps(id, name) {
      this.$router.push({
        name: 'undertakeMaps',
        params: {
          okrDetailId: id, objectName: name, showOne: true, periodId: this.okrCycle.periodId, orgId: this.okrId,
        },
      });
    },
    // 周期
    getOkrCycleList() {
      this.server.getOkrCycleList().then((res) => {
        if (res.code == 200) {
          this.periodList = res.data || [];
        }
      });
    },
    handleCycleData(data) {
      this.okrCycle = data;
    },
  },
  watch: {
    'okrCycle.periodId': {
      handler(newVal) {
        console.log('get', newVal);
        if (newVal) {
          this.searchOkr();
        }
      },
      immediate: true,
      deep: true,
    },
    myokrDrawer: {
      handler(newVal) {
        if (newVal === false) {
          this.searchOkr();
        }
      },
    },
  },
};
</script>