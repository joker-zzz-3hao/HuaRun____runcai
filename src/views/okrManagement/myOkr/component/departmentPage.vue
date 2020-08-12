<template>
  <div>
    <!-- 用展开行表格 -->
    <div>
      <p>用折叠面板</p>
      <div class="collapsetitle">
        <span>权重</span>
        <span>进度条</span>
        <span>信心指数</span>
        <span>承接地图</span>
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
      <ul style="display:flex">
        <li v-for="(item,index) in memberList" :key="item.userId+index">{{item.userName}}</li>
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
        time: '',
      },
      tableList: [], // okr列表
      memberList: [], // 成员列表
      cycleData: [], // 周期列表
      cycleDefaultProps: { // 周期数据类型
        children: 'children',
        label: 'periodName',
        id: 'periodId',
      },
      cycleObj: { // 周期数据格式
        old: {
          checkStatus: 0,
          children: [],
          periodName: '历史OKR周期',
          okrCycleType: '0',
          periodId: '0',
        },
        current: {
          checkStatus: 1,
          children: [],
          periodName: '当前的OKR周期',
          okrCycleType: '0',
          periodId: '1',
        },
      },
    };
  },

  created() {
    this.searchOkr();
    this.init();
  },
  methods: {
    init() {
    },
    searchOkr() { // 默认搜索进行时
      this.server.getmyOkr({
        myOrOrg: 'org',
        periodId: 'periodId',
        status: this.searchForm.status,
      }).then((res) => {
        if (res.code == 200) {
          this.tableList = res.data.okrDetails;
          this.okrId = res.data.okrMain && res.data.okrMain.okrId;
          this.memberList = res.data.orgUser;
        }
      });
    },
    goUndertakeMaps(id, name) {
      // this.$message('要跳到承接地图啦~');
      this.$router.push({ name: 'undertakeMaps', params: { okrDetailId: '111122', objectName: name, showOne: true } });
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