<template>
  <div>
    <!-- 搜索条件 -->
    <div>
      <!-- 选择状态 -->
      <dl style="display:flex">
        <dd v-for="item in CONST.STATUS_LIST" :key="item.id">
          <el-button @click="searchOkr(item.id)">{{item.name}}</el-button>
        </dd>
      </dl>
    </div>
    <!-- 一些功能按钮 根据状态判断-->
    <div>
      <el-button v-if="['1'].includes(searchForm.status)" @click="goChangeOkr">变更</el-button>
    </div>
    <!-- okr模块 只有起草中是有多个 -->
    <div v-for="(item, index) in okrList" :key="index">
      <!-- 基本信息 -->
      <div v-if="item.okrMain">
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
      <tl-okr-table
        :tableList="item.tableList"
        :disabled="false"
        :activeList="[0]"
        :showOKRInfoLabel="true"
      >
        <template slot="head-bar" slot-scope="props">
          <el-button
            v-if="searchForm.status=='1'"
            @click.native.stop="openDialog('tl-okr-detail',props.okritem)"
          >详情</el-button>
          <!-- <el-button
            v-if="searchForm.status=='1'"
            @click.native.stop="openDialog('tl-okr-history',props.okritem)"
          >历史版本</el-button>-->
          <el-button
            v-if="searchForm.status=='1'"
            @click.native.stop="openDialog('tl-okr-update',props.okritem)"
          >进度更新</el-button>
          <el-button
            v-if="['6',  '8'].includes(searchForm.status)"
            @click.native.stop="goDraft(item)"
          >编辑</el-button>
        </template>
      </tl-okr-table>
    </div>
    <el-drawer
      :wrapperClosable="false"
      :modal-append-to-body="false"
      :title="drawerTitle"
      :visible.sync="myokrDrawer"
      size="50%"
      :before-close="handleClose"
    >
      <div>
        <tl-writeokr
          v-if="myokrDrawer && writeInfo.canWrite"
          @handleClose="handleClose"
          :writeInfo="writeInfo"
        ></tl-writeokr>
        <tl-okr-history
          v-if="currentView=='tl-okr-history'"
          ref="tl-okr-history"
          :server="server"
          :okrId="okrId"
        ></tl-okr-history>
        <tl-okr-detail
          v-if="currentView=='tl-okr-detail'"
          ref="tl-okr-detail"
          :server="server"
          :okrId="okrId"
        ></tl-okr-detail>
        <tl-okr-update
          v-if="currentView=='tl-okr-update'"
          ref="tl-okr-update"
          :server="server"
          :okrId="okrId"
          :okrItem="okrItem"
        ></tl-okr-update>
        <!-- <component
          v-else
          :ref="currentView"
          v-bind:is="currentView"
          :server="server"
          :okrId="okrId"
          :okrItem="okrItem"
        ></component>-->
      </div>
    </el-drawer>

    <!-- <okr-history ref="okr-history" :server="server" :okrId="okrId" :dialogExist.sync="dialogExist"></okr-history>
    <okr-detail ref="okr-detail" :server="server" :okrId="okrId" :dialogExist.sync="dialogExist"></okr-detail>
    <okr-update ref="okr-update" :server="server" :okrId="okrId" :dialogExist.sync="dialogExist"></okr-update>-->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import okrTable from '@/components/okrTable';
import okrDetail from './okrDetail';
import okrUpdate from './okrUpdate';
import okrHistory from './okrHistory';
import writeOkr from './writeOkr/index';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'myokrPage',
  components: {
    'tl-okr-detail': okrDetail,
    'tl-okr-update': okrUpdate,
    'tl-okr-history': okrHistory,
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
    };
  },
  props: {
    okrCycle: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('common', {
      myokrDrawer: (state) => state.myokrDrawer,
    }),
  },
  created() {
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
                  updateDate: item.updateTime,
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
            this.okrList[0].tableList = res.data.okrDetails;
            this.okrList[0].okrMain = res.data.okrMain;
            this.okrId = res.data.okrMain.okrId;
            console.log('进行中', this.tableList);
          }
        }
      });
    },
    // 打开抽屉
    openDialog(componentName, val) {
      console.log('点击', componentName, val);
      this.writeInfo.canWrite = false;
      this.currentView = componentName;
      this.okrItem = val;
      // this.okrId = val.detailId;
      switch (this.currentView) {
        case 'tl-okr-detail':
          this.drawerTitle = 'OKR详情';
          break;
        case 'tl-okr-update':
          this.drawerTitle = '更新进度';
          break;
        case 'tl-okr-history':
          this.drawerTitle = '历史记录';
          break;
        default:
          break;
      }
      this.setMyokrDrawer(true);
      this.$nextTick(() => {
        this.$refs[componentName].showOkrDialog();
      });
    },
    goChangeOkr() {
      this.writeInfo = {
        canWrite: 'cannot',
        okrId: this.okrId,
      };
      // this.$router.push({ name: 'writeOkr', params: { canWrite: 'cannot', okrId: this.okrId } });
      this.setMyokrDrawer(true);
      // this.drawer = true;
    },
    goDraft(item) {
      console.log('goDraft', item.params);
      this.writeInfo = {
        canWrite: 'draft',
        draftParams: item.params,
        draftId: item.id,
        okrStatus: this.searchForm.status,
        okrorgCycle: this.okrorgCycle,
      };
      // this.$router.push({ name: 'writeOkr', params: { canWrite: 'draft', writeInfo } });
      this.setMyokrDrawer(true);
      // this.drawer = true;
    },
    handleClose() {
      this.setMyokrDrawer(false);
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