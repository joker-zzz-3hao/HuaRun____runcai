<template>
  <div class="department-okr">
    <div class="cont-panel">
      <div v-if="tableList.length > 0" class="tl-card-panel">
        <el-button @click="handleOpen()">
          <span v-if="expands.length > 0">收起</span>
          <span v-else>展开</span></el-button
        >
        <div class="card-panel-head">
          <div class="okr-title">{{ okrMain.periodName }}</div>
          <dl class="okr-state">
            <dt>
              <!-- <i class="el-icon-set-up"></i> -->
              <em>状态</em>
            </dt>
            <dd class="is-highlighted">
              <em>{{ CONST.STATUS_LIST_MAP[searchForm.status] }}</em>
            </dd>
          </dl>
          <dl class="okr-responsible">
            <dt>
              <em>OKR类型</em>
            </dt>
            <dd>{{ CONST.OKR_TYPE_MAP[okrMain.okrBelongType || 1] }}</dd>
          </dl>
          <dl v-show="okrMain.userName" class="okr-responsible">
            <dt>
              <!-- <i class="el-icon-user"></i> -->
              <em>负责人</em>
            </dt>
            <dd>{{ okrMain.userName }}</dd>
          </dl>
          <dl class="okr-progress">
            <dt>
              <!-- <i class="el-icon-odometer"></i> -->
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
              <em>{{ okrMain.updateTime || okrMain.createTime }}</em>
            </dd>
          </dl>
        </div>
        <div class="card-panel-body">
          <tl-okr-table
            :tableList="tableList"
            :disabled="false"
            :showUpdate="false"
            :status="searchForm.status"
            @openDialog="openDialog"
            :expands.sync="expands"
          >
            <template slot="head-undertake" slot-scope="props">
              <div
                v-if="props.okritem.continueCount > 0"
                @click="
                  goUndertakeMaps(
                    props.okritem.okrDetailId,
                    props.okritem.okrDetailObjectKr
                  )
                "
              >
                <i
                  :class="{ 'has-undertake': props.okritem.continueCount > 0 }"
                  class="el-icon-link"
                ></i>
              </div>
              <div v-else>暂无</div>
            </template>
            <template slot="body-bar" slot-scope="props">
              <div
                v-if="props.okritem.continueCount > 0"
                @click="
                  goUndertakeMaps(
                    props.okritem.okrDetailId,
                    props.okritem.okrDetailObjectKr
                  )
                "
              >
                <i
                  :class="{ 'has-undertake': props.okritem.continueCount > 0 }"
                  class="el-icon-link"
                ></i>
              </div>
              <div v-else>暂无</div>
            </template>
            <!-- o的操作栏 -->
            <template slot="moreHandle-obar" slot-scope="props">
              <el-dropdown
                v-if="
                  [1, 2, 3, 4, 5].includes(okrMain.status) &&
                  props.okritem.continueCount > 0
                "
                trigger="click"
                class="tl-dropdown"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-more el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="props.okritem.continueCount > 0"
                    @click.native="
                      goUndertakeMaps(
                        props.okritem.okrDetailId,
                        props.okritem.okrDetailObjectKr
                      )
                    "
                  >
                    <span>承接地图</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <!-- kr的操作栏 -->
            <template slot="moreHandle-krbar" slot-scope="props">
              <el-dropdown
                v-if="[1, 2, 3, 4, 5].includes(okrMain.status)"
                trigger="click"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-more el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="openCheckjudge(props.okritem)"
                  >
                    <em>考核指标、衡量办法</em>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="props.okritem.continueCount > 0"
                    @click.native="
                      goUndertakeMaps(
                        props.okritem.okrDetailId,
                        props.okritem.okrDetailObjectKr
                      )
                    "
                  >
                    <span>承接地图</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </tl-okr-table>
        </div>
      </div>
      <!-- 加载中 -->
      <div v-else-if="loading" class="tl-card-panel no-data">
        <i class="el-icon-loading"></i>
        <em>加载中...</em>
      </div>
      <div v-else class="tl-card-panel no-data">
        <div class="bg-no-data"></div>
      </div>
      <div class="tl-card-panel">
        <div class="card-panel-head">
          <div class="pannel-title">
            <template v-if="memberList.length > 0">
              <em>{{ cutOrgName(departmentName) }}</em>
              <span>成员OKR</span>
            </template>
            <template v-if="orgTable.length > 0">
              <em>{{ cutOrgName(departmentName) }}</em>
            </template>
          </div>
        </div>
        <div class="card-panel-body img-list">
          <template v-if="memberList.length > 0">
            <dl
              v-for="(item, index) in memberList"
              :key="item.userId + index"
              @click="getidentity(item)"
            >
              <dt class="user-info">
                <img v-if="hasValue(item.headUrl)" :src="item.headUrl" alt />
                <div v-else class="user-name">
                  <em>{{ cutName(item.userName) }}</em>
                </div>
              </dt>
              <dd>{{ item.userName }}</dd>
            </dl>
          </template>
          <template v-if="orgTable.length > 0">
            <dl
              v-for="(item, index) in orgTable"
              :key="item.orgId + index"
              @click="getidentity(item)"
            >
              <dt class="user-info">
                <img v-if="hasValue(item.headUrl)" :src="item.headUrl" alt />
                <div v-else class="user-name">
                  <em>{{ cutName(item.orgName) }}</em>
                </div>
              </dt>
              <dd>{{ cutOrgName(item.orgName) }}</dd>
            </dl>
          </template>
        </div>
      </div>
    </div>

    <tl-okr-detail
      :exist.sync="detailExist"
      v-if="hasValue(detailExist)"
      ref="okrdetail"
      :server="server"
      :okrId="okrId"
      :CONST="CONST"
      :drawerTitle="drawerTitle"
    ></tl-okr-detail>
    <tl-checkjudge
      :exist.sync="checkjudgeExist"
      v-if="hasValue(checkjudgeExist)"
      ref="checkjudge"
      :checkjudgeData="checkjudgeData"
    ></tl-checkjudge>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import okrTable from '@/components/okrTable';
import okrDetail from '@/components/okrDetail';
import checkJudge from './component/checkJudge';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'departmentOkr',
  components: {
    'tl-okr-table': okrTable,
    'tl-okr-detail': okrDetail,
    'tl-checkjudge': checkJudge,
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
      detailExist: false,
      loading: true,
      checkjudgeExist: false,
      orgId: '',
      expands: [],
    };
  },
  props: {

  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      roleCode: (state) => state.roleCode,
      okrCycle: (state) => state.okrCycle,
    }),
    // expands() {
    //   return [this.tableList[0].okrDetailId];
    // },
  },
  created() {
    if (this.roleCode.includes('ORG_ADMIN') && this.userInfo.orgParentName) {
      this.departmentName = this.userInfo.orgParentName;
      this.orgId = this.userInfo.orgParentId;
    } else {
      this.departmentName = this.userInfo.orgName || '部门';
      this.orgId = this.userInfo.orgId;
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
      if (this.okrCycle.periodId) {
        this.loading = true;
        this.server.getorgOkr({
          myOrOrg: 'org',
          periodId: this.okrCycle.periodId,
          status: '1',
          orgId: this.orgId,
        }).then((res) => {
          if (res.code == 200) {
            this.memberList = res.data.orgUser || [];
            this.orgTable = res.data.orgTable || [];
            if (res.data.okrMain) {
              this.tableList = res.data.okrDetails || [];
              this.okrMain = res.data.okrMain || {};
              this.okrId = this.okrMain.okrId || '';
              this.searchForm.status = this.okrMain.status;
              this.expands = [this.tableList[0].okrDetailId];
            } else if (res.data.okrApprovalVo) {
              const okrInfo = JSON.parse(res.data.okrApprovalVo.paramJson) || {};
              this.tableList = okrInfo.okrInfoList || [];
              this.searchForm.status = res.data.okrApprovalVo.approvalStatus == 2 ? 8 : 7;
              this.okrMain = {
                userName: res.data.okrApprovalVo.userName,
                okrProgress: res.data.okrApprovalVo.okrProgress || 0,
                updateTime: res.data.okrApprovalVo.approveTime || res.data.okrApprovalVo.createTime || '--',
                okrBelongType: okrInfo.okrBelongType,
                status: this.searchForm.status,
                periodName: res.data.okrApprovalVo.periodName,
              };
              this.expands = [this.tableList[0].okrDetailId];
            } else {
              this.tableList = [];
            }
          }
          this.loading = false;
        });
      }
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
    openCheckjudge(item) {
      this.checkjudgeData = {
        checkQuota: item.checkQuota,
        judgeMethod: item.judgeMethod,
      };
      this.checkjudgeExist = true;
      this.$nextTick(() => {
        this.$refs.checkjudge.show();
      });
    },
    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
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
              id: user.orgId, name: chename, userId: user.userId, tenantId: user.tenantId,
            },
          });
        }
      });
    },

    openDialog(val) {
      this.okrItem = val;
      this.drawerTitle = this.okrCycle.periodName;
      this.detailExist = true;
      this.$nextTick(() => {
        this.$refs.okrdetail.showOkrDialog();
      });
    },
    // 展示收起
    handleOpen() {
      if (this.expands.length == 0) {
        this.tableList.forEach((item) => {
          this.expands.push(item.okrDetailId);
          console.log(item);
        });
      } else {
        this.expands = [];
      }
    },
  },
  watch: {
    okrCycle: {
      handler(newVal) {
        if (newVal) {
          this.searchForm.periodId = newVal.periodId;
          if (this.roleCode.includes('ORG_ADMIN') && this.userInfo.orgParentName) {
            this.departmentName = this.userInfo.orgParentName;
            this.orgId = this.userInfo.orgParentId;
            console.log('team');
          } else {
            this.departmentName = this.userInfo.orgName || '部门';
            this.orgId = this.userInfo.orgId;
          }
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