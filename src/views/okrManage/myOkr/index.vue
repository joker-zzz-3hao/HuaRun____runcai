<template>
  <div class="home">
    <el-button style="display:float" @click="goWriteOkr">创建okr</el-button>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="`${departmentName}OKR`" name="team">
        <department
          :data="cycleData"
          type="cycleListSelect"
          @handleData="handleorgCycleData"
          :defaultProps="cycleDefaultProps"
        ></department>
        <department-page ref="departmentpage" :okrCycle="okrorgCycle"></department-page>
      </el-tab-pane>
      <el-tab-pane label="我的OKR" name="myokr">
        <department
          :data="cycleData"
          type="cycleListSelect"
          @handleData="handleCycleData"
          :defaultProps="cycleDefaultProps"
        ></department>
        <myokr-page ref="myokrpage" :okrCycle="okrCycle"></myokr-page>
      </el-tab-pane>
    </el-tabs>
    <el-drawer
      :wrapperClosable="false"
      :modal-append-to-body="false"
      title="创建okr"
      :visible.sync="createokrDrawer"
      size="50%"
      :before-close="handleClose"
    >
      <div>
        <writeOkr v-if="createokrDrawer"></writeOkr>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import department from '@/components/department';
import departmentPage from './component/departmentPage';
import myokrPage from './component/myokrPage';
import writeOkr from './component/writeOkr/index';
import Server from './server';

const server = new Server();

export default {
  name: 'myOkr',
  components: {
    'department-page': departmentPage,
    'myokr-page': myokrPage,
    department,
    writeOkr,
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
      drawer: false,
    };
  },
  computed: {
    ...mapState('common', {
      createokrDrawer: (state) => state.createokrDrawer,
    }),
  },
  created() {
    this.init();
    // TODO:部门名
    this.departmentName = this.$store.state.common.userInfo.departmentName;
    this.activeName = this.$route.params.activeName || 'team';
  },
  methods: {
    ...mapMutations('common', ['setCreateokrDrawer']),
    init() {
      this.server.getOkrCycleList().then((res) => {
        if (res.data.length > 0) {
          res.data.forEach((item) => {
            // checkStatus为0时是历史周期，1为当前周期
            if (item.checkStatus == '0') {
              this.cycleObj.old.children.push(item);
            } else if (item.checkStatus == '1') {
              this.cycleObj.current.children.push(item);
              this.okrorgCycle = item;
              this.okrCycle = item;
              console.log('当前周期', item);
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
      this.setCreateokrDrawer(true);
      // this.drawer = true;
      // this.$router.push({ name: 'writeOkr', params: { canWrite: true, okrorgCycle: this.okrorgCycle } });
    },
    handleClose() {
      this.setCreateokrDrawer(false);
    },
  },
  watch: {
    createokrDrawer: {
      handler(newVal) {
        if (newVal === false) {
          this.$$refs.departmentpage.searchOkr();
          this.$$refs.myokrpage.searchOkr();
        }
      },
    },
  },
};
</script>