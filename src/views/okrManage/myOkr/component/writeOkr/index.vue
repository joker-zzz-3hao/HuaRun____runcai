<template>
  <div class="home">
    <!-- 创建OKR -->
    <div v-if="canWrite">
      <dl style="display:flex">
        <dd>
          <span>目标周期</span>
          <department
            :data="cycleData"
            type="cycleListSelect"
            @handleData="handleCycleData"
            :defaultProps="cycleDefaultProps"
            :defaultData="searchForm.periodId"
          ></department>
        </dd>
        <dd>
          <span>OKR类型</span>
          <el-select
            v-model="searchForm.okrType"
            placeholder="请选择类型"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="(item, index) in CONST.OKR_TYPE_LIST"
              :key="item.id+index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </dd>
        <dd class="user-info">
          <span>负责人</span>
          <div class="user-name">{{cutName(userName)}}</div>
          <span>{{userName}}</span>
        </dd>
      </dl>
    </div>
    <okr-form v-if="canWrite" :searchForm="searchForm" :server="server" :canWrite="canWrite"></okr-form>
    <change-okr :periodId="searchForm.periodId" v-else :server="server" :okrId="okrId"></change-okr>
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
    userName: {
      type: String,
      default: '',
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
      this.searchForm.periodId = this.writeInfo.periodId || '';
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
    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
    },
  },
  watch: {
  },
};
</script>