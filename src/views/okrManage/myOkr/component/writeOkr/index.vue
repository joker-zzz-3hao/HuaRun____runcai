<template>
  <div class="home">
    <!-- 写okr选择时间和okr类型 -->
    <div v-if="canWrite">
      <department
        :data="cycleData"
        type="cycleListSelect"
        @handleData="handleCycleData"
        :defaultProps="cycleDefaultProps"
        :defaultData="searchForm.periodId"
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
import department from '@/components/department';
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
    department,
  },
  props: {
    writeInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      server,
      CONST,
      timelist: [],
      okrmain: {},
      searchForm: {
        periodId: '',
        userId: '',
        tenantId: '',
        timecycle: '',
        okrCycle: '',
        okrType: 2,
        okrStatus: '',
        draftParams: '',
        draftId: '',
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
        okrId: '',
      },
    };
  },
  mounted() {
    if (this.writeInfo.canWrite == 'draft') {
      this.searchForm.okrStatus = this.writeInfo.okrStatus || '';
      this.searchForm.draftParams = this.writeInfo.draftParams || '';
      this.searchForm.draftId = this.writeInfo.draftId || '';
      this.searchForm.okrType = JSON.parse(this.searchForm.draftParams).okrBelongType;
      this.searchForm.periodId = JSON.parse(this.searchForm.draftParams).periodId;
    } else if (this.writeInfo.canWrite == 'cannot') {
      this.canWrite = false;
      this.okrId = this.writeInfo.okrId || '';
    }
  },
  created() {
    this.init();
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
              this.searchForm.okrCycle = item;
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
      // this.okrCycle = data;
      this.searchForm.okrCycle = data;
      // this.getmaps();
    },
  },
  watch: {
  },
};
</script>