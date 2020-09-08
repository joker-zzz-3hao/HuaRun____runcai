<template>
  <div>
    <div class="operating-panel">
      <dl class="dl-item">
        <dt>目标周期</dt>
        <dd>
          <!-- multiple 多选属性 -->
          <!-- searchForm.periodId 单选 -->
          <!-- multperiod 多选 -->
          <el-select
            v-model="multperiod"
            multiple
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
    <div class="cont-panel">
      <!-- 状态为审批中需展示温馨提示 -->
      <div v-if="searchForm.status=='7'">
        <el-alert type="warning">
          <div slot="title">
            <i>温馨提示icon</i>
            <span>审批成功后才展示变更后的内容，请勿再次提交变更</span>
          </div>
        </el-alert>
      </div>
      <template v-if="okrList[0].tableList && okrList[0].tableList.length > 0">
        <div v-for="(item) in okrList" :key="item.id" class="tl-card-panel">
          <div class="card-panel-head">
            <div class="okr-title">{{okrCycle.periodName}}OKR</div>
            <dl class="okr-state">
              <dt>
                <i class="el-icon-set-up"></i>
                <em>状态</em>
              </dt>
              <dd>
                <i class="el-icon-sunny"></i>
                <em>{{CONST.STATUS_LIST_MAP[item.okrMain.status]}}</em>
                <!-- <em v-else>{{CONST.STATUS_LIST_MAP[searchForm.status]}}</em> -->
              </dd>
            </dl>
            <dl class="okr-responsible">
              <dt>
                <i class="el-icon-user"></i>
                <em>负责人</em>
              </dt>
              <dd>{{userInfo.userName}}</dd>
            </dl>
            <dl class="okr-progress">
              <dt>
                <i class="el-icon-odometer"></i>
                <em>OKR进度</em>
              </dt>
              <dd>
                <el-progress
                  type="circle"
                  :percentage="item.okrMain.okrProgress"
                  :width="60"
                  :stroke-width="5"
                  color="#4ccd79"
                  class="tl-progress-circle"
                ></el-progress>
              </dd>
            </dl>
            <dl>
              <dt>
                <div
                  v-if="['1',1].includes(item.okrMain.status)"
                  @click="goChangeOkr(item)"
                  class="okr-change"
                >
                  <i class="el-icon-edit-outline"></i>
                  <em>变更</em>
                </div>
                <div
                  v-if="['6'].includes(item.okrMain.status)"
                  @click="deleteDraft(item.id)"
                  class="okr-delete"
                >
                  <i class="el-icon-delete"></i>
                  <em>删除</em>
                </div>
              </dt>
            </dl>
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
              :status="item.okrMain.status"
              @openDialog="openDialog(item)"
              @goDraft="goDraft(item)"
              :expands="expands"
            >
              <template slot="head-undertake" slot-scope="props">
                <div
                  v-if="props.okritem.continueCount>0"
                  @click="goUndertakeMaps(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
                >
                  <i class="el-icon-link"></i>
                  <em>{{props.okritem.continueCount}}</em>
                </div>
              </template>
              <template slot="weight-bar" slot-scope="props">
                <div v-if="item.okrMain.status=='1'" @click="openUpdate(props.okritem)">
                  <i class="el-icon-refresh"></i>
                </div>
              </template>
              <template slot="body-bar" slot-scope="props">
                <div
                  v-if="props.okritem.continueCount>0"
                  @click="goUndertakeMaps(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
                >
                  <i class="el-icon-link"></i>
                  <em>{{props.okritem.continueCount}}</em>
                </div>
              </template>
            </tl-okr-table>
          </div>
        </div>
      </template>

      <div v-else class="tl-card-panel no-data">
        <div class="bg-no-data">暂无数据</div>
      </div>
    </div>

    <tl-writeokr
      ref="tl-writeokr"
      :exist.sync="writeokrExist"
      v-if="writeokrExist"
      :writeInfo="writeInfo"
      @success="searchOkr(item.okrMain.status)"
    ></tl-writeokr>
    <tl-changeokr
      ref="tl-changeokr"
      :exist.sync="changeokrExist"
      v-if="changeokrExist"
      :writeInfo="writeInfo"
      :drawerTitle="drawerTitle"
      @success="searchOkr('1')"
    ></tl-changeokr>
    <tl-okr-detail
      ref="tl-okr-detail"
      :exist.sync="detailExist"
      v-if="detailExist"
      :server="server"
      :okrId="okrId"
      :CONST="CONST"
      :okrItem="okrItem"
      :drawerTitle="drawerTitle"
    ></tl-okr-detail>
    <tl-okr-update
      ref="tl-okr-update"
      :exist.sync="updateExist"
      v-if="updateExist"
      :server="server"
      :okrId="okrId"
      :okrItem="okrItem"
      :periodId="okrCycle.periodId"
      @success="searchOkr(item.okrMain.status)"
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
        status: 'all',
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
      multperiod: [], // 多选周期
    };
  },
  computed: {
    ...mapState('common', {
      myokrDrawer: (state) => state.myokrDrawer,
      userInfo: (state) => state.userInfo,
      okrSuccess: (state) => state.okrSuccess,
    }),
    expands() {
      return [this.okrList[0].tableList[0].okrDetailId];
    },
  },
  created() {
    this.getOkrCycleList();
  },
  mounted() {
    // 状态
    const liWidth = document.querySelectorAll(' .tab-list li');
    const selfLeft = document.querySelectorAll('.tab-list li')[0].offsetLeft;
    const borderWidth = document.querySelector('.border-slip');
    borderWidth.style.left = `${selfLeft}px`;
    borderWidth.style.width = `${liWidth[0].offsetWidth}px`;
  },
  methods: {
    searchOkr(status) {
      this.searchForm.status = status || this.searchForm.status;
      this.okrList = [{
        tableList: [], // okr列表
        okrMain: {},
      }];
      this.server.getmyOkr({
        myOrOrg: 'my',
        periodId: this.okrCycle.periodId,
        status: this.searchForm.status,
      }).then((res) => {
        if (res.code == 200) {
          if (this.searchForm.status == 'all') {
            const totalList = res.data || [];
            if (totalList.length > 0) {
              this.okrList = [];
              totalList.forEach((allitem) => {
                if (['1', '2'].includes(allitem.okrStatus)) {
                // 处理draft
                  console.log(allitem.okrStatus, allitem.object);
                  this.handleJSON(allitem.okrStatus, allitem.object);
                } else {
                  this.handleNormal(allitem.object, allitem.okrStatus);
                }
              });
            }
          } else if (['6', '7', '8'].includes(this.searchForm.status)) {
            // 如果是草稿、退回、审批中回显json串
            const draftList = res.data || [];
            if (draftList.length > 0) {
              this.okrList = [];
              this.handleJSON(this.searchForm.status, draftList);
            }
          } else {
            this.okrList[0].tableList = res.data.okrDetails || [];
            this.okrList[0].okrMain = res.data.okrMain || {};
            this.okrId = this.okrList[0].okrMain.okrId || '';
          }
        }
      });
    },
    handleJSON(okrStatus, draftList) {
      draftList.forEach((item, index) => {
        let okrInfo = {};
        okrInfo = JSON.parse(item.paramJson);
        // 起草中默认展开第一个
        if (index == 0) {
          okrInfo.okrInfoList[0].okrDetailId = 'draft01';
        }
        // 状态
        let status = '';
        if (this.searchForm.status == 'all') {
          if (okrStatus == '1') {
            status = '6';
          } else if (item.approvalStatus == 2) {
            status = '7';
          } else {
            status = '8';
          }
        } else {
          status = this.searchForm.status;
        }
        this.okrList.push({
          tableList: okrInfo.okrInfoList,
          okrMain: {
            userName: item.updateBy || item.createBy,
            okrProgress: item.okrProgress || 0,
            updateTime: item.updateTime || item.createTime,
            okrBelongType: okrInfo.okrBelongType,
            status,
          },
          id: item.id || item.approvalId,
          params: item.paramJson,
        });
      });
    },
    handleNormal(object) {
      // object.okrMain.status = okrStatus;
      console.log('okrMain', object.okrMain);
      this.okrList.push({
        tableList: object.okrDetails || [],
        okrMain: object.okrMain || {},
      });
      console.log('okrList', this.okrList);
    },

    // 打开详情
    openDialog(val) {
      this.currentView = 'tl-okr-detail';
      this.okrItem = val;
      this.drawerTitle = `${this.okrCycle.periodName}`;
      this.detailExist = true;
      this.okrId = val.okrMain.okrId;
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
    goChangeOkr(val) {
      this.drawerTitle = `${this.okrCycle.periodName}`;
      this.okrId = val.okrMain.okrId;
      this.writeInfo = {
        canWrite: 'cannot',
        okrId: this.okrId,
        periodId: this.okrCycle.periodId,
      };
      this.currentView = 'tl-changeokr';
      this.changeokrExist = true;
      console.log('打开变更', this.okrId);
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
        okrStatus: item.okrMain.status,
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
    deleteDraft(draftId) {
      this.$xconfirm({
        content: '请问您是否确定删除？',
        title: '如果您要确定删除，该OKR将无法恢复',
      }).then(() => {
        // 提交确认弹窗
        this.server.deleteOkrDraft({ okrDraftId: draftId }).then((res) => {
          if (res.code == 200) {
            this.$message('删除成功');
            this.searchOkr('6');
            // 关闭抽屉
          }
        });
      }).catch(() => {});
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
    'multperiod.length': {
      handler() {
        this.okrCycle = this.periodList.filter(
          (citem) => citem.periodId === this.multperiod[0],
        )[0] || {};
        this.searchOkr();
      },
      deep: true,
    },
    okrSuccess: {
      handler(newVal) {
        if (newVal) {
          this.searchOkr();
        }
      },
    },
    '$route.name': {
      handler(newVal) {
        const routeIndex = newVal == 'myOkr' ? 0 : 1;
        const liWidth = document.querySelectorAll('.operating-area .tab-list li');
        const selfLeft = document.querySelectorAll('.operating-area .tab-list li')[routeIndex].offsetLeft;
        const borderWidth = document.querySelector('.operating-area .border-slip');
        borderWidth.style.left = `${selfLeft}px`;
        borderWidth.style.width = `${liWidth[routeIndex].offsetWidth}px`;
      },
      deep: true,
    },
  },
};
</script>