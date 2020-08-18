<template>
  <div>
    <!-- 用展开行表格 -->
    <div>
      <div>
        <div>{{okrCycle.periodDesc}}OKR</div>
        <ul>
          <li>
            <span>状态</span>
            <span>{{CONST.STATUS_LIST_MAP[searchForm.status]}}</span>
          </li>
          <li>
            <span>负责人</span>
            <span>{{okrMain && okrMain.userName}}</span>
          </li>
          <li>
            <span>OKR进度</span>
            <el-progress
              :stroke-width="10"
              :percentage="parseInt(okrMain && okrMain.okrProgress, 10) || 0"
            ></el-progress>
          </li>
        </ul>
      </div>
      <okrCollapse :tableList="tableList" :disabled="false" :activeList="[0]">
        <template slot="head-bar" slot-scope="props">
          <button
            @click="goUndertakeMaps(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
          >承接地图</button>
        </template>
        <template slot="body-bar" slot-scope="props">
          <button
            @click="goUndertakeMaps(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
          >承接地图</button>
        </template>
      </okrCollapse>
    </div>
    <!-- 展示头像 -->
    <div>
      头像
      <ul style="display:flex" v-if="memberList.length">
        <li class="user-info" v-for="(item,index) in memberList" :key="item.userId+index">
          <div class="user-name">{{cutName(item.userName)}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import okrCollapse from '@/components/okrCollapse';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'departmentPage',
  components: {
    okrCollapse,
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
      okrMain: { // okr公共信息
        userName: '',
        okrProgress: 0,
      },
    };
  },
  props: {
    okrCycle: {
      type: Object,
      required: true,
    },
  },
  computed: {
  },
  created() {
  },
  methods: {
    searchOkr() { // 默认搜索进行时
      this.server.getmyOkr({
        myOrOrg: 'org',
        periodId: 'periodId', // this.okrCycle.periodId
        status: this.searchForm.status,
      }).then((res) => {
        if (res.code == 200) {
          this.tableList = res.data.okrDetails;
          this.okrMain = res.data.okrMain;
          this.okrId = res.data.okrMain && res.data.okrMain.okrId;
          this.memberList = res.data.orgUser || [];
        }
      });
    },
    goUndertakeMaps(id, name) {
      // this.$message('要跳到承接地图啦~');
      this.$router.push({ name: 'undertakeMaps', params: { okrDetailId: '111122', objectName: name, showOne: true } });
    },
    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
    },
  },
  watch: {
    'okrCycle.periodId': {
      handler() {
        this.searchOkr();
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
</style>