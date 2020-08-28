<template>
  <div class="home">
    <!-- 创建OKR -->
    <div v-if="canWrite">
      <dl style="display:flex">
        <dd>
          <span>目标周期</span>
          <tl-periodselect :periodList="periodList" @handleData="handleCycleData"></tl-periodselect>
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
import { mapState } from 'vuex';
import periodSelect from '@/components/periodSelect';
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
    'tl-periodselect': periodSelect,
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
        okrType: null,
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
      periodList: [],
    };
  },
  computed: {
    ...mapState('common', {
      roleCode: (state) => state.roleCode,
    }),
    // okrTypeList() {
    //   console.log('roleCode', this.roleCode);
    //   if (this.roleCode.includes('ORG_ADMIN')) {
    //     return this.CONST.OKR_TYPE_LIST.filter(
    //       (item) => item.id != 3,
    //     );
    //   } return this.CONST.OKR_TYPE_LIST.filter(
    //     (item) => item.id == 2,
    //   );
    // },
  },
  mounted() {
    if (this.writeInfo.canWrite == 'draft') {
      this.searchForm.okrStatus = this.writeInfo.okrStatus || '';
      this.searchForm.draftParams = this.writeInfo.draftParams || '';
      this.searchForm.draftId = this.writeInfo.draftId || '';
      this.searchForm.okrType = JSON.parse(this.searchForm.draftParams).okrBelongType;
      this.searchForm.periodId = JSON.parse(this.searchForm.draftParams).periodId;
      console.log('this.searchForm.periodId', this.searchForm.periodId);
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
      // okr类型
      if (this.roleCode.includes('ORG_ADMIN')) {
        this.searchForm.okrType = 1;
      } else { this.searchForm.okrType = 2; }
      // 周期
      this.server.getOkrCycleList().then((res) => {
        if (res.code == 200) {
          this.periodList = res.data || [];
        }
      });
    },

    handleCycleData(data) {
      this.searchForm.okrCycle = data;
      console.log('writeokrCycle', data);
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