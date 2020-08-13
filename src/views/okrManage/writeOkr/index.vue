<template>
  <div class="home">
    <!-- 写okr选择时间和okr类型 -->
    <div v-if="canWrite">
      <department
        :data="cycleData"
        type="cycleListSelect"
        @handleData="handleCycleData"
        :defaultProps="cycleDefaultProps"
      ></department>
      <el-select v-model="searchForm.okrType" placeholder="请选择类型" :popper-append-to-body="false">
        <el-option
          v-for="(item, index) in CONST.OKR_TYPE_LIST"
          :key="item.id+index"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>
    <okr-form v-if="canWrite" :searchForm="searchForm" :server="server" :canWrite="canWrite"></okr-form>
    <change-okr v-else :server="server" :okrId="okrId"></change-okr>
  </div>
</template>

<script>
import okrForm from './component/okrForm';
import changeOKR from './component/changeOKR';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'writeOkr',
  components: {
    'okr-form': okrForm,
    'change-okr': changeOKR,
  },
  data() {
    return {
      server,
      CONST,
      timelist: [],
      okrmain: {},
      searchForm: {
        periodId: 'periodId',
        userId: 'user066',
        tenantId: '88888888',
        timecycle: '',
        time: '',
        okrType: 2,
      },
      canWrite: true, // true写okr false changeokr
      cycleData: [],
      cycleDefaultProps: {
        children: 'children',
        label: 'periodName',
        id: 'periodId',
      },
      cycleObj: {
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
    this.init();
    this.canWrite = this.$route.params.canWrite != 'cannot';
    this.okrId = this.$route.params.okrId || '';
    console.log('can', this.canWrite);
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
    handleCycleData(data) {
      this.okrCycle = data;
      console.log(data);
      // this.getmaps();
    },
  },
  watch: {
    'searchForm.time': {
      handler(newVal) {
        const timeInfo = this.timelist.filter(
          (item) => item.timeid == newVal,
        )[0] || {};
        this.searchForm.timecycle = timeInfo.timecycle;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>