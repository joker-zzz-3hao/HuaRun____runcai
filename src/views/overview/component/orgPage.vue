<template>
  <div class="tl-card-panel">
    <em v-show="testModel">示例数据</em>
    <template v-if="tableList.length>0">
      <div class="card-panel-head">
        <div class="okr-title">{{testModel?'2020年下半年的OKR':okrCycle.periodName}}</div>
        <dl class="okr-state">
          <dt>
            <em>状态</em>
          </dt>
          <dd>
            <i class="el-icon-sunny"></i>
            <em>{{CONST.STATUS_LIST_MAP[searchForm.status]}}</em>
          </dd>
        </dl>
        <dl class="okr-responsible">
          <dt>
            <em>OKR类型</em>
          </dt>
          <dd>{{CONST.OKR_TYPE_MAP[okrMain.okrBelongType || 1]}}</dd>
        </dl>
        <dl class="okr-responsible">
          <dt>
            <em>负责人</em>
          </dt>
          <dd>{{okrMain.userName}}</dd>
        </dl>
        <dl class="okr-progress">
          <dt>
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
      <div class="card-panel-body">
        <tl-okr-table
          :overview="true"
          :tableList="tableList"
          :disabled="false"
          :showOKRInfoLabel="true"
          :status="searchForm.status"
          :expands="expands"
        ></tl-okr-table>
      </div>
    </template>
    <template v-else>
      <div class="tl-card-panel no-data">
        <span v-if="$route.query.id" class="bg-no-data"></span>
        <el-button v-else type="primary" @click="$router.push('myOkr')">创建OKR</el-button>
      </div>
    </template>
    <div class="card-panel-body img-list" v-if="orgUser">
      <dl v-for="(item,index) in orgUser" :key="item.userId+index" @click="getidentity(item)">
        <dt class="user-info">
          <!-- <img v-if="userInfo.headUrl" :src="userInfo.headUrl" alt /> -->
          <div class="user-name">
            <em>{{cutName(item.userName)}}</em>
          </div>
        </dt>
        <dd>{{item.userName}}</dd>
      </dl>
    </div>
    <div class="card-panel-body img-list" v-if="orgTable">
      <dl v-for="(item,index) in orgTable" :key="item.orgId+index" @click="getidentity(item)">
        <dt class="user-info">
          <!-- <img v-if="userInfo.headUrl" :src="userInfo.headUrl" alt /> -->
          <div class="user-name">
            <em>{{cutName(item.orgName)}}</em>
          </div>
        </dt>
        <dd>{{item.orgName}}</dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import okrTable from '@/components/okrTableLittle';
import Server from '../server';
import CONST from '../const';
import { okrData, okrDataTeam, okrUser } from '../testData';

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
      showLoad: false,
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
      testModel: (state) => state.testModel,
    }),
    expands() {
      return [this.tableList[0].okrDetailId];
    },
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
          // eslint-disable-next-line no-unused-expressions
          if (this.$route.name == 'teamleader') {
            // eslint-disable-next-line no-unused-expressions
            this.testModel ? res = okrDataTeam : res;
          }
          if (this.$route.name == 'departleader') {
            // eslint-disable-next-line no-unused-expressions
            this.testModel ? res = okrData : res;
          }
          if (this.$route.name == 'grassStaff') {
            // eslint-disable-next-line no-unused-expressions
            this.testModel ? res = okrUser : res;
          }
          this.tableList = res.data.okrDetails || [];
          this.okrMain = res.data.okrMain || {};
          this.okrId = this.okrMain.okrId || '';
          this.orgUser = res.data.orgUser || [];
          this.orgTable = res.data.orgTable || [];
          this.showLoad = true;
        }
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
    // 认证身份跳转对应身份首页
    getidentity(user) {
      if (this.testModel) {
        return false;
      }
      if (this.$route.query.userId == user.userId) {
        this.$message.error('此为当前团队负责人');
        return false;
      }
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
          // eslint-disable-next-line no-unused-expressions
          this.$route.name == 'departleader' ? this.reload() : '';

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

          // eslint-disable-next-line no-unused-expressions
          this.$route.name == 'teamleader' ? this.reload() : '';

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