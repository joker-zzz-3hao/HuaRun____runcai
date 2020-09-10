<template>
  <div class="department-okr">
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
        <div class="card-panel-head">
          <div class="okr-title">{{okrCycle.periodName}}</div>
          <dl class="okr-state">
            <dt>
              <i class="el-icon-set-up"></i>
              <em>状态</em>
            </dt>
            <dd>
              <i class="el-icon-sunny"></i>
              <em>{{CONST.STATUS_LIST_MAP[searchForm.status]}}</em>
            </dd>
          </dl>
          <dl class="okr-responsible">
            <dt>
              <i class="el-icon-user"></i>
              <em>负责人</em>
            </dt>
            <dd>{{okrMain.userName}}</dd>
          </dl>
          <dl class="okr-progress">
            <dt>
              <i class="el-icon-odometer"></i>
              <em>OKR进度</em>
            </dt>
            <dd>
              <el-progress
                type="circle"
                :percentage="parseInt(okrMain.okrProgress, 10) || 0"
                :width="70"
                :stroke-width="5"
                color="#4ccd79"
                class="tl-progress-circle"
              ></el-progress>
            </dd>
          </dl>
          <dl class="update-time">
            <dt>
              <i class="el-icon-timer"></i>
              <em>更新时间</em>
            </dt>
            <dd>
              <em>{{okrMain.updateTime || okrMain.createTime}}</em>
            </dd>
          </dl>
        </div>
        <div class="card-panel-body">
          <tl-okr-table
            :tableList="tableList"
            :disabled="false"
            :showOKRInfoLabel="true"
            :status="searchForm.status"
            @openDialog="openDialog"
          >
            <template slot="head-undertake" slot-scope="props">
              <template
                v-if="props.okritem.continueCount>0"
                @click="goUndertakeMaps(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
              >
                <i class="el-icon-link"></i>
                <em>{{props.okritem.continueCount}}</em>
              </template>
            </template>
            <template slot="body-bar" slot-scope="props">
              <template
                v-if="props.okritem.continueCount>0"
                @click="goUndertakeMaps(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
              >
                <i class="el-icon-link"></i>
                <em>{{props.okritem.continueCount}}</em>
              </template>
            </template>
          </tl-okr-table>
        </div>
      </div>
      <div v-else class="tl-card-panel no-data">
        <div class="bg-no-data">暂无数据</div>
      </div>
      <div class="tl-card-panel">
        <div class="card-panel-head">
          <div class="pannel-title">
            <template v-if="memberList.length>0">
              <em>{{departmentName}}</em>
              <span>成员OKR</span>
            </template>
            <template v-if="orgTable.length>0">
              <em>{{departmentName}}</em>
            </template>
          </div>
        </div>
        <div class="card-panel-body img-list">
          <template v-if="memberList.length>0">
            <dl
              v-for="(item,index) in memberList"
              :key="item.userId+index"
              @click="goToDep(item.userId,item.userName)"
            >
              <dt class="user-info">
                <!-- <img v-if="userInfo.headUrl" :src="userInfo.headUrl" alt /> -->
                <div class="user-name">
                  <em>{{cutName(item.userName)}}</em>
                </div>
              </dt>
              <dd>{{item.userName}}</dd>
            </dl>
            <dl>
              <dt class="user-info">
                <!-- <img v-if="userInfo.headUrl" :src="userInfo.headUrl" alt /> -->
                <img src="@/assets/images/user/user3.jpg" alt />
                <!-- <div class="user-name">娜丽</div> -->
              </dt>
              <dd>欧阳娜丽</dd>
            </dl>
            <dl>
              <dt class="user-info">
                <!-- <img v-if="userInfo.headUrl" :src="userInfo.headUrl" alt /> -->
                <img src="@/assets/images/user/user8.jpg" alt />
                <!-- <div class="user-name">娜丽</div> -->
              </dt>
              <dd>西毒欧阳锋</dd>
            </dl>
            <dl>
              <dt class="user-info">
                <!-- <img v-if="userInfo.headUrl" :src="userInfo.headUrl" alt /> -->
                <img src="@/assets/images/user/user5.jpg" alt />
                <!-- <div class="user-name">娜丽</div> -->
              </dt>
              <dd>北丐洪七公</dd>
            </dl>
            <dl>
              <dt class="user-info">
                <!-- <img v-if="userInfo.headUrl" :src="userInfo.headUrl" alt /> -->
                <img src="@/assets/images/user/user2.jpg" alt />
                <!-- <div class="user-name">娜丽</div> -->
              </dt>
              <dd>南帝段正淳</dd>
            </dl>
          </template>
          <template v-if="orgTable.length>0">
            <dl
              v-for="(item,index) in orgTable"
              :key="item.orgId+index"
              @click="goToDep(item.orgId,item.orgName)"
            >
              <dt class="user-info">
                <!-- <img v-if="userInfo.headUrl" :src="userInfo.headUrl" alt /> -->
                <div class="user-name">
                  <em>{{cutName(item.orgName)}}</em>
                </div>
              </dt>
              <dd>{{item.orgName}}</dd>
            </dl>
          </template>
        </div>
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
import okrTable from '@/components/okrTable';
import okrDetail from '@/components/okrDetail';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'departmentOkr',
  components: {
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
  },
  mounted() {
    const liWidth = document.querySelectorAll('.tab-list li');
    const selfLeft = document.querySelectorAll('.tab-list li')[1].offsetLeft;
    const borderWidth = document.querySelector('.border-slip');
    borderWidth.style.left = `${selfLeft}px`;
    borderWidth.style.width = `${liWidth[1].offsetWidth}px`;
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

    goToDep(id, name) {
      const chename = encodeURI(name);
      if (this.orgTable.length > 0) {
        this.$router.push({ name: 'teamleader', query: { id, name: chename } });
      }
      if (this.memberList.length > 0) {
        this.$router.push({ name: 'grassStaff', query: { id, name: chename } });
      }
    },
    openDialog(val) {
      this.okrItem = val;
      this.drawerTitle = this.okrCycle.periodName;
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
        const selfLeft = document.querySelectorAll('.tab-list li')[routeIndex].offsetLeft;
        const borderWidth = document.querySelector('.border-slip');
        borderWidth.style.left = `${selfLeft}px`;
        borderWidth.style.width = `${liWidth[routeIndex].offsetWidth}px`;
      },
      deep: true,
    },
  },
};
</script>