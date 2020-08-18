<template>
  <div class="home">
    <el-tabs v-model="activeName">
      <el-button @click="goWriteOkr">创建okr</el-button>

      <el-tab-pane :label="`${departmentName}OKR`" name="team">
        <department
          :data="cycleData"
          type="cycleListSelect"
          @handleData="handleorgCycleData"
          :defaultProps="cycleDefaultProps"
        ></department>
        <department-page :okrCycle="okrorgCycle"></department-page>
      </el-tab-pane>
      <el-tab-pane label="我的OKR" name="myokr">
        <department
          :data="cycleData"
          type="cycleListSelect"
          @handleData="handleCycleData"
          :defaultProps="cycleDefaultProps"
        ></department>
        <myokr-page :okrCycle="okrCycle"></myokr-page>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import department from '@/components/department';
import departmentPage from './component/departmentPage';
import myokrPage from './component/myokrPage';
import Server from './server';

const server = new Server();

export default {
  name: 'myOkr',
  components: {
    'department-page': departmentPage,
    'myokr-page': myokrPage,
    department,
  },
  data() {
    return {
      server,
      activeName: 'team',
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
      departmentName: '',
      okrorgCycle: {}, // 当前选择的周期-部门
      okrCycle: {}, // 当前选择的周期
    };
  },
  created() {
    this.init();
    this.departmentName = this.$store.state.common.userInfo.departmentName;
    this.activeName = this.$route.params.activeName || 'team';
  },
  methods: {
    init() {
      this.server.getOkrCycleList().then((res) => {
        if (res.data.length > 0) {
          res.data.forEach((item) => {
            // checkStatus为0时是历史周期，1为当前周期
            if (item.checkStatus == '0') {
              this.cycleObj.old.children.push(item);
            } else if (item.checkStatus == '1') {
              this.cycleObj.current.children.push(item);
            }
          });
          this.pushCycleObj('current');
          this.pushCycleObj('old');
        }
      });
    },
    pushCycleObj(key) {
      if (this.cycleObj[key].children.length > 0) {
        this.cycleData.push(this.cycleObj[key]);
      }
    },
    handleorgCycleData(data) {
      this.okrorgCycle = data;
      console.log(data);
    },
    handleCycleData(data) {
      this.okrCycle = data;
      console.log(data);
    },
    goWriteOkr() {
      this.$router.push({ name: 'writeOkr', params: { canWrite: true } });
    },
  },
};
</script>