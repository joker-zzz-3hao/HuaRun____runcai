<template>
  <div>
    <div v-if="tableList.length>0">
      <!-- 公共信息 -->
      <div>
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
      <!-- 表头 -->
      <div>
        <ul style="display:flex">
          <li>权重</li>
          <li>进度</li>
          <li>风险状态</li>
          <li>承接地图</li>
        </ul>
      </div>
      <tl-okr-table
        :tableList="tableList"
        :disabled="false"
        :activeList="[0]"
        :showOKRInfoLabel="true"
        :status="searchForm.status"
        @openDialog="openDialog()"
        :showParentOkr="false"
      >
        <template slot="head-bar" slot-scope="props">
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
    <div v-else>暂无数据~</div>
    <!-- 展示头像 -->
    <div>
      <!-- 基层员工视图 -->
      <div v-if="memberList.length>0">
        <span>{{departmentName}}成员OKR</span>
        <ul style="display:flex">
          <li class="user-info" v-for="(item,index) in memberList" :key="item.userId+index">
            <div class="user-name">{{cutName(item.userName)}}</div>
          </li>
        </ul>
      </div>

      <!-- 部门负责人视图 -->
      <div v-if="orgTable.length>0">
        <span>{{departmentName}}</span>
        <ul style="display:flex">
          <li class="user-info" v-for="(item,index) in orgTable" :key="item.orgId+index">
            <div class="user-name">{{cutName(item.orgName)}}</div>
          </li>
        </ul>
      </div>
    </div>
    <el-drawer
      :wrapperClosable="false"
      :modal-append-to-body="false"
      :title="drawerTitle"
      :visible.sync="myokrDrawer"
      size="50%"
      :before-close="handleClose"
    >
      <tl-okr-detail
        v-if="myokrDrawer"
        ref="okrdetail"
        :server="server"
        :okrId="okrId"
        :CONST="CONST"
      ></tl-okr-detail>
    </el-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import okrTable from '@/components/okrTable';
import okrDetail from './okrDetail';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'departmentPage',
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
    };
  },
  props: {
    okrCycle: {
      type: Object,
      required: true,
    },
    departmentName: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  created() {
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
      this.drawerTitle = 'OKR详情';
      this.myokrDrawer = true;
      this.$nextTick(() => {
        this.$refs.okrdetail.showOkrDialog();
      });
    },
    handleClose() {
      this.myokrDrawer = false;
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

.okrMain {
  display: flex;
}
.okrMain li {
  margin: 20px;
}
</style>