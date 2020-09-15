<template>
  <div>
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
    </div>
    <div v-if="tableList.length>0">
      <tl-okr-table
        :overview="true"
        :tableList="tableList"
        :disabled="false"
        :showOKRInfoLabel="true"
        :status="searchForm.status"
      >
        <template slot="head-bar" slot-scope="props">
          <el-button
            v-show="$route.name !== 'grassStaff'"
            v-if="props.okritem.continueCount>0"
            @click="goUndertakeMaps(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
          >承接地图icon{{props.okritem.continueCount}}</el-button>
        </template>
        <template slot="body-bar" slot-scope="props">
          <el-button
            v-if="props.okritem.continueCount>0"
            v-show="$route.name !== 'grassStaff'"
            @click="goUndertakeMaps(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
          >承接地图icon{{props.okritem.continueCount}}</el-button>
        </template>
      </tl-okr-table>
    </div>
    <div v-else class="tl-card-panel no-data">
      <span v-if="$route.query.id">暂无数据</span>
      <el-button v-else type="primary" @click="$router.push('myOkr')">创建OKR</el-button>
    </div>
    <div class="tl-card-panel">
      <div class="card-panel-head">
        <!-- <div class="pannel-title">
          <template v-if="orgUser&&this.$route.name!=='grassStaff'">
            <em>{{departmentName}}</em>
            <span>成员OKR</span>
          </template>
          <template v-if="orgTable">
            <em>{{departmentName}}</em>
          </template>
        </div>-->
      </div>
      <div class="card-panel-body img-list">
        <template v-if="orgUser">
          <dl v-for="(item,index) in orgUser" :key="item.userId+index" @click="getidentity(item)">
            <dt class="user-info">
              <!-- <img v-if="userInfo.headUrl" :src="userInfo.headUrl" alt /> -->
              <div class="user-name">
                <em>{{cutName(item.userName)}}</em>
              </div>
            </dt>
            <dd>{{item.userName}}</dd>
          </dl>
        </template>
        <template v-if="orgTable">
          <dl v-for="(item,index) in orgTable" :key="item.orgId+index" @click="getidentity(item)">
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
</template>

<script>
import { mapState } from 'vuex';
import okrTable from '@/components/okrTable';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'myOkr',
  components: {
    'tl-okr-table': okrTable,
  },
  props: ['periodId'],
  data() {
    return {
      showTable: false,
      server,
      CONST,
      okrMain: '',
      tableList: [],
      orgTable: [],
      orgUser: [],
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
  inject: ['reload'],
  computed: {
    ...mapState('common', {
      setOrgId: (state) => state.setOrgId,
    }),
  },
  created() {
    this.getOkrCycleList();
  },
  mounted() {
    this.$nextTick(() => {
      this.searchOkr();
    });
  },
  methods: {
    goUndertakeMaps(id, name) {
      this.$router.push({
        name: 'undertakeMaps',
        params: {
          okrDetailId: id, objectName: name, showOne: true, periodId: this.periodId, orgId: this.okrId,
        },
      });
    },
    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
    },
    searchOkr() { // 默认搜索进行时
      this.showTable = false;
      this.server.getmyOkr({
        periodId: this.periodId,
        status: this.searchForm.status,
        myOrOrg: this.$route.name !== 'grassStaff' ? 'org' : 'my',
        userId: this.$route.query.userId,
        tenantId: this.$route.query.tenantId,
        orgId: this.$route.query.id ? this.$route.query.id : this.setOrgId,
        type: 'INDEX',
      }).then((res) => {
        if (res.code == 200) {
          this.tableList = res.data.okrDetails || [];
          this.okrMain = res.data.okrMain || {};
          this.okrId = this.okrMain.okrId || '';
          this.orgUser = res.data.orgUser || [];
          this.orgTable = res.data.orgTable || [];
        }
      });
    },
    goToDep(id, name, userId, tenantId) {
      const chename = encodeURI(name);
      if (this.orgTable.length > 0) {
        this.$router.push({
          name: 'teamleader',
          query: {
            id, name: chename, userId, tenantId,
          },
        });
      }
      if (this.orgUser.length > 0) {
        this.$router.push({
          name: 'grassStaff',
          query: {
            id, name: chename, userId, tenantId,
          },
        });
      }
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
    // 认证身份跳转对应身份首页
    getidentity(user) {
      this.server.identity({
        user: user.userId,
        orgId: user.orgId,
      }).then((res) => {
        if (res.data.identityType == 'org') {
          const chename = encodeURI(user.orgName);
          this.$router.push({
            name: 'departleader',
            query: {
              id: user.orgId, name: chename, userId: user.userId, tenantId: user.tenantId,
            },
          });
          this.reload();
          return false;
        }
        if (res.data.identityType == 'team') {
          const chename = encodeURI(user.orgName || user.userName);
          this.$router.push({
            name: 'teamleader',
            query: {
              id: user.orgId, name: chename, userId: user.userId, tenantId: user.tenantId,
            },
          });
          this.reload();
          return false;
        }
        if (res.data.identityType == 'person') {
          const chename = encodeURI(user.userName);
          this.$router.push({
            name: 'grassStaff',
            query: {
              id: user.userId, name: chename, userId: user.userId, tenantId: user.tenantId,
            },
          });
        }
      });
    },
  },
  watch: {
    periodId: {
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
  },
};
</script>
<style  scoped>
[v-cloak] {
  display: none;
}
</style>