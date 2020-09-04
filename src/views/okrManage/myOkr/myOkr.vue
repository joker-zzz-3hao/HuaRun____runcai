<template>
  <div>
    <div class="operating-panel">
      <dl class="dl-item">
        <dt>目标周期</dt>
        <dd>
          <el-select
            v-model="searchForm.periodId"
            placeholder="请选择目标周期"
            :popper-append-to-body="false"
            popper-class="tl-select-dropdown"
            class="tl-select"
          >
            <el-option
              v-for="item in periodList"
              :key="item.periodId"
              :label="item.periodName"
              :value="item.periodId"
            ></el-option>
          </el-select>
        </dd>
      </dl>
      <dl class="dl-item">
        <dt>状态</dt>
        <dd class="tl-diy-tabs">
          <ul class="tab-list">
            <li
              v-for="(item,idx) in CONST.STATUS_LIST"
              :key="item.id"
              @click="borderSlip(item,idx)"
              :class="{'is-focus': searchForm.status == item.id}"
            >
              <em @click="searchOkr(item.id)">{{item.name}}</em>
            </li>
          </ul>
          <div class="border-slip"></div>
        </dd>
      </dl>
    </div>
    <div v-for="(item) in okrList" :key="item.id" class="cont-panel">
      <!-- 状态为审批中需展示温馨提示 -->
      <div v-if="searchForm.status=='7'">
        <el-alert type="warning">
          <div slot="title">
            <i>温馨提示icon</i>
            <span>审批成功后才展示变更后的内容，请勿再次提交变更</span>
          </div>
        </el-alert>
      </div>
      <div v-if="item.tableList.length>0" class="tl-card-panel">
        <div class="card-panel-head">
          <div class="okr-title">{{okrCycle.periodName}}OKR</div>
          <dl class="okr-state">
            <dt>
              <i class="el-icon-set-up"></i>
              <em>状态</em>
            </dt>
            <dd>
              <i></i>
              <em>{{CONST.STATUS_LIST_MAP[searchForm.status]}}</em>
            </dd>
          </dl>
          <dl class="okr-responsible">
            <dt>
              <i class="el-icon-user"></i>
              <em>负责人</em>
            </dt>
            <dd>{{item.okrMain.userName}}</dd>
          </dl>
          <dl class="okr-progress">
            <dt>
              <i class="el-icon-odometer"></i>
              <em>OKR进度</em>
            </dt>
            <dd>
              <el-progress
                type="circle"
                :percentage="parseInt(item.okrMain.okrProgress, 10)"
                width="60"
                stroke-width="5"
                color="#4ccd79"
                class="tl-progress"
              ></el-progress>
            </dd>
          </dl>
          <dl>
            <dt>
              <div v-if="['1'].includes(searchForm.status)" @click="goChangeOkr" class="okr-change">
                <i class="el-icon-edit-outline"></i>
                <em>变更</em>
              </div>
              <div class="okr-delete">
                <i class="el-icon-delete"></i>
                <em>删除</em>
              </div>
            </dt>
          </dl>
          <!-- <dl class="okr-delete">
            <dt>

            </dt>
          </dl>-->
          <dl class="update-time">
            <dt>
              <i class="el-icon-timer"></i>
              <em>更新时间</em>
            </dt>
            <dd>
              <em>{{item.okrMain.updateTime || item.okrMain.createTime}}</em>
            </dd>
          </dl>
        </div>
        <div class="card-panel-body">
          <tl-okr-table
            :tableList="item.tableList"
            :disabled="false"
            :showOKRInfoLabel="true"
            :status="searchForm.status"
            @openDialog="openDialog(item)"
            @goDraft="goDraft(item)"
          >
            <template slot="head-undertake" slot-scope="props">
              <el-button
                v-if="props.okritem.continueCount>0"
                @click.stop="goUndertakeMaps(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
              >承接地图icon{{props.okritem.continueCount}}</el-button>
            </template>
            <template slot="weight-bar" slot-scope="props">
              <el-button v-if="searchForm.status=='1'" @click.stop="openUpdate(props.okritem)">更新进度</el-button>
            </template>
            <template slot="body-bar" slot-scope="props">
              <el-button
                v-if="props.okritem.continueCount>0"
                @click.stop="goUndertakeMaps(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
              >承接地图icon{{props.okritem.continueCount}}</el-button>
            </template>
          </tl-okr-table>
        </div>
      </div>
      <div v-else class="tl-card-panel no-data">
        <div class="bg-no-data">暂无数据</div>
      </div>
    </div>

    <tl-writeokr
      ref="tl-writeokr"
      :exist.sync="writeokrExist"
      :writeInfo="writeInfo"
      @success="searchOkr(searchForm.status)"
    ></tl-writeokr>
    <tl-changeokr
      ref="tl-changeokr"
      :exist.sync="changeokrExist"
      :writeInfo="writeInfo"
      @success="searchOkr(searchForm.status)"
    ></tl-changeokr>
    <tl-okr-detail
      ref="tl-okr-detail"
      :exist.sync="detailExist"
      :server="server"
      :okrId="okrId"
      :CONST="CONST"
      :okrItem="okrItem"
    ></tl-okr-detail>
    <tl-okr-update
      ref="tl-okr-update"
      :exist.sync="updateExist"
      :server="server"
      :okrId="okrId"
      :okrItem="okrItem"
      :periodId="okrCycle.periodId"
      @success="searchOkr(searchForm.status)"
    ></tl-okr-update>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import okrTable from '@/components/okrTable';
import okrDetail from '@/components/okrDetail';
import okrUpdate from './component/okrUpdate';
import changeOKR from './component/changeOKR';
import writeOkr from './component/writeOkr/index';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'myOkr',
  components: {
    'tl-okr-detail': okrDetail,
    'tl-okr-update': okrUpdate,
    'tl-okr-table': okrTable,
    'tl-writeokr': writeOkr,
    'tl-changeokr': changeOKR,
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
        status: '0',
        periodId: '',
      },
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
      writeokrExist: false,
      changeokrExist: false,
      detailExist: false,
      updateExist: false,
    };
  },
  computed: {
    ...mapState('common', {
      myokrDrawer: (state) => state.myokrDrawer,
      userInfo: (state) => state.userInfo,
      okrSuccess: (state) => state.okrSuccess,
    }),
  },
  created() {
    this.getOkrCycleList();
  },
  mounted() {
    const liWidth = document.querySelectorAll('.tab-list li');
    const borderWidth = document.querySelector('.border-slip');
    borderWidth.style.width = `${liWidth[0].offsetWidth}px`;
  },
  methods: {
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
            if (draftList.length > 0) {
              draftList.forEach((item) => {
                let okrInfo = {};
                okrInfo = JSON.parse(item.paramJson);
                this.okrList.push({
                  tableList: okrInfo.okrInfoList,
                  okrMain: {
                    userName: item.updateBy || item.createBy,
                    okrProgress: item.okrProgress || 0,
                    updateTime: item.updateTime || item.createTime,
                    okrBelongType: okrInfo.okrBelongType,
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
            }
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
      this.drawerTitle = `${this.okrCycle.periodName}OKR`;
      this.detailExist = true;
      this.$nextTick(() => {
        this.$refs[this.currentView].showOkrDialog();
      });
    },
    // 打开更新进度
    openUpdate(val) {
      this.okrItem = val;
      this.currentView = 'tl-okr-update';
      this.updateExist = true;
      this.$nextTick(() => {
        this.$refs[this.currentView].showOkrDialog();
      });
    },
    // 打开变更
    goChangeOkr() {
      this.drawerTitle = `${this.okrCycle.periodName}OKR`;
      this.writeInfo = {
        canWrite: 'cannot',
        okrId: this.okrId,
        periodId: this.okrCycle.periodId,
      };
      this.currentView = 'tl-changeokr';
      this.changeokrExist = true;
      this.$nextTick(() => {
        this.$refs[this.currentView].showOkrDialog();
      });
    },
    // 打开编辑
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
      this.writeokrExist = true;
      this.$nextTick(() => {
        this.$refs[this.currentView].showOkrDialog();
      });
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
          this.okrCycle = this.periodList.filter((item) => item.checkStatus == '1')[0] || {};
          this.searchForm.periodId = this.okrCycle.periodId;
        }
      });
    },
    borderSlip(item, index) {
      const borderWidth = document.querySelector('.border-slip');
      const selfLeft = document.querySelectorAll('.tab-list li')[index].offsetLeft;
      const liWidth = document.querySelectorAll('.tab-list li');
      borderWidth.style.left = `${selfLeft}px`;
      borderWidth.style.width = `${liWidth[index].offsetWidth}px`;
    },
  },
  watch: {
    'searchForm.periodId': {
      handler(newVal) {
        console.log('get', newVal);
        if (newVal) {
          this.okrCycle = this.periodList.filter(
            (citem) => citem.periodId == newVal,
          )[0] || {};
          this.searchOkr();
        }
      },
      immediate: true,
      deep: true,
    },
    okrSuccess: {
      handler(newVal) {
        if (newVal) {
          this.searchOkr();
        }
      },
    },
  },
};
</script>