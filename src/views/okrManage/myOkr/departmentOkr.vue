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
    </div>
    <div class="cont-panel">
      <div v-if="tableList.length>0" class="tl-card-panel">
        <!-- 公共信息 -->
        <div class="card-panel-head">
          <div>{{okrCycle.periodName}}OKR</div>
          <ul class="okrMain">
            <li>
              <span>状态：</span>
              <span>{{CONST.STATUS_LIST_MAP[searchForm.status]}}</span>
            </li>
            <li>
              <span>负责人</span>
              <span>{{okrMain.userName}}</span>
            </li>
            <li>
              <span>OKR进度</span>
              <el-progress type="circle" :percentage="parseInt(okrMain.okrProgress, 10) || 0"></el-progress>
            </li>
          </ul>
        </div>
        <div class="card-panel-body">
          <tl-okr-table
            :tableList="tableList"
            :disabled="false"
            :showOKRInfoLabel="true"
            :status="searchForm.status"
            @openDialog="openDialog()"
          >
            <template slot="head-undertake" slot-scope="props">
              <el-button
                v-if="props.okritem.continueCount>0"
                @click="goUndertakeMaps(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
              >承接地图icon{{props.okritem.continueCount}}</el-button>
            </template>
            <template slot="body-bar" slot-scope="props">
              <el-button
                v-if="props.okritem.continueCount>0"
                @click="goUndertakeMaps(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
              >承接地图icon{{props.okritem.continueCount}}</el-button>
            </template>
          </tl-okr-table>
        </div>
      </div>
      <div v-else class="tl-card-panel no-data">
        <div class="bg-no-data">暂无数据</div>
      </div>
    </div>

    <!-- 展示头像 -->
    <div>
      <!-- 基层员工视图 -->
      <div v-if="memberList.length>0">
        <span>{{departmentName}}成员OKR</span>
        <ul style="display:flex">
          <li class="user-info" v-for="(item,index) in memberList" :key="item.userId+index">
            <div class="user-name">{{cutName(item.userName)}}</div>
            <div>{{item.userName}}</div>
          </li>
        </ul>
      </div>

      <!-- 部门负责人视图 -->
      <div v-if="orgTable.length>0">
        <span>{{departmentName}}</span>
        <ul style="display:flex">
          <li class="user-info" v-for="(item,index) in orgTable" :key="item.orgId+index">
            <div class="user-name">{{cutName(item.orgName)}}</div>
            <div>{{item.orgName}}</div>
          </li>
        </ul>
      </div>
    </div>

    <tl-okr-detail
      :exist.sync="detailExist"
      v-if="detailExist"
      ref="okrdetail"
      :server="server"
      :okrId="okrId"
      :CONST="CONST"
      :drawerTitle="drawerTitle"
    ></tl-okr-detail>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import periodSelect from '@/components/periodSelect';
import okrTable from '@/components/okrTable';
import okrDetail from '@/components/okrDetail';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'departmentOkr',
  components: {
    // 'tl-periodselect': periodSelect,
    'tl-okr-table': okrTable,
    'tl-okr-detail': okrDetail,
  },
  data() {
    return {
      server,
      CONST,
      searchForm: {
        status: '1',
        periodId: '',
      },
      tableList: [], // okr列表
      memberList: [], // 成员列表
      orgTable: [], // 部门列表
      okrMain: { // okr公共信息
        userName: '',
        okrProgress: 0,
      },
      okrId: '',
      myokrDrawer: false,
      drawerTitle: 'OKR详情',
      okrCycle: {}, // 当前选择的周期
      periodList: [], // 周期列表
      detailExist: false,
    };
  },
  props: {

    departmentName: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      roleCode: (state) => state.roleCode,
    }),
  },
  created() {
    this.getOkrCycleList();
    if (this.roleCode.includes('ORG_ADMIN') && this.userInfo.orgParentName) {
      this.departmentName = this.userInfo.orgParentName;
    } else {
      this.departmentName = this.userInfo.orgName || '部门';
    }
    console.log(this.departmentName);
  },
  methods: {
    searchOkr() { // 默认搜索进行时
      this.server.getmyOkr({
        myOrOrg: 'org',
        periodId: this.okrCycle.periodId,
        status: this.searchForm.status,
        orgId: this.userInfo.orgId,
      }).then((res) => {
        if (res.code == 200) {
          this.tableList = res.data.okrDetails || [];
          this.okrMain = res.data.okrMain || {};
          this.okrId = this.okrMain.okrId || '';
          this.memberList = res.data.orgUser || [];
          this.orgTable = res.data.orgTable || [];
        }
      });
    },
    goUndertakeMaps(id, name) {
      // this.$message('要跳到承接地图啦~');
      this.$router.push({
        name: 'undertakeMaps',
        params: {
          okrDetailId: id, objectName: name, showOne: true, periodId: this.okrCycle.periodId, orgId: this.okrMain.orgId,
        },
      });
    },
    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
    },
    openDialog(val) {
      this.okrItem = val;
      this.drawerTitle = `${this.okrCycle.periodName}OKR`;
      this.detailExist = true;
      this.$nextTick(() => {
        this.$refs.okrdetail.showOkrDialog();
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
    // handleCycleData(data) {
    //   this.okrCycle = data;
    // },
  },
  watch: {
    'searchForm.periodId': {
      handler(newVal) {
        console.log('get', newVal);
        if (newVal) {
          this.okrCycle = this.periodList.filter(
            (citem) => citem.periodId === newVal,
          )[0] || {};
          this.searchOkr();
        }
      },
      immediate: true,
      deep: true,
    },
    '$route.name': {
      handler(newVal) {
        const routeIndex = newVal == 'myOkr' ? 0 : 1;
        const liWidth = document.querySelectorAll('.tab-list li');
        const borderWidth = document.querySelector('.border-slip');
        borderWidth.style.width = `${liWidth[routeIndex].offsetWidth}px`;
      },
      immediate: true,
    },
  },
};
</script>