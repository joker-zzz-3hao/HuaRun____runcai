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

      <el-collapse class="collapse">
        <el-collapse-item v-for="(item, index) in tableList" :key="item.detailId+index">
          <template slot="title">
            <span>目标icon</span>
            <span>{{item.okrDetailObjectKr}}</span>
            <span>{{item.okrWeight}}%</span>
            <span class="progresswidth">
              <el-progress :stroke-width="10" :percentage="parseInt(item.okrDetailProgress, 10)"></el-progress>
            </span>
            <button @click="gocheng(item.detailId,item.okrDetailObjectKr)">承接地图</button>
          </template>
          <div v-for="(kritem, index) in item.krList" :key="index">
            <span>KRicon</span>
            <span>{{kritem.okrDetailObjectKr}}</span>
            <span>{{kritem.okrWeight}}%</span>
            <div class="progresswidth">
              <el-progress :stroke-width="10" :percentage="parseInt(kritem.okrDetailProgress, 10)"></el-progress>
            </div>
            <span>信心指数{{kritem.confidence}}</span>
          </div>
        </el-collapse-item>
      </el-collapse>
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
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'departmentPage',
  components: {
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
        userId: 'user007',
      }).then((res) => {
        if (res.code == 200) {
          this.tableList = res.data.okrDetails;
          this.okrId = res.data.okrMain.okrId;
          this.memberList = res.data.orgUser;
        }
      });
    },
    gocheng(id, name) {
      this.$message('要跳到承接地图啦~');
      this.$router.push({ name: 'supportMaps', params: { objectId: id, objectName: name } });
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