<template>
  <div class="create-okr">
    <div v-if="canWrite" class="allocation-info">
      <dl>
        <dt>目标周期</dt>
        <dd>
          <el-select
            v-model="searchForm.periodId"
            placeholder="请选择目标周期"
            :popper-append-to-body="false"
            popper-class="tl-select-dropdown"
            class="tl-select"
          >
            <el-option-group v-for="group in cycleList" :key="group.label" :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.periodId"
                :label="item.periodName"
                :value="item.periodId"
              ></el-option>
            </el-option-group>
          </el-select>
          <!-- <tl-periodselect :periodList="periodList" @handleData="handleCycleData"></tl-periodselect> -->
        </dd>
      </dl>
      <dl>
        <dt>OKR类型</dt>
        <dd>
          <el-select
            v-model="searchForm.okrType"
            placeholder="请选择类型"
            :popper-append-to-body="false"
            popper-class="tl-select-dropdown"
            class="tl-select"
          >
            <el-option
              v-for="(item, index) in CONST.OKR_TYPE_LIST"
              :key="item.id+index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </dd>
      </dl>
      <dl class="user-info">
        <dt>负责人</dt>
        <dd v-if="true">
          <img src="@/assets/images/user/user.jpg" alt />
        </dd>
        <dd v-else class="user-name">{{cutName(userName)}}</dd>
        <dd>{{userName}}</dd>
      </dl>
    </div>
    <okr-form v-if="canWrite" :searchForm="searchForm" :server="server" :canWrite="canWrite"></okr-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import okrForm from './component/okrForm';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'writeOkr',
  components: {
    'okr-form': okrForm,
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
      periodList: [],
      cycleList: [{
        label: '当前的OKR周期',
        options: [],
      }, {
        label: '历史OKR周期',
        options: [],
      }],
      periodId: '',
      okrCycle: {},
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
    }
    // else if (this.writeInfo.canWrite == 'cannot') {
    //   this.canWrite = false;
    //   this.okrId = this.writeInfo.okrId || '';
    //   this.searchForm.periodId = this.writeInfo.periodId || '';
    // }
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
          // 分组
          this.periodList.forEach((item) => {
            // checkStatus为0时是历史周期，1为当前周期
            if (item.checkStatus == '0') {
              this.cycleList.forEach((citem) => {
                if (citem.label == '历史OKR周期') {
                  citem.options.push(item);
                }
              });
            } else if (item.checkStatus == '1') {
              this.cycleList.forEach((citem) => {
                if (citem.label == '当前的OKR周期') {
                  citem.options.push(item);
                }
                if (!this.searchForm.periodId) {
                  this.searchForm.periodId = item.periodId;
                  this.okrCycle = item;
                }
              });
            }
          });
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
    'searchForm.periodId': {
      handler(newVal) {
        if (newVal) {
          this.okrCycle = this.periodList.filter(
            (citem) => citem.periodId === newVal,
          )[0] || this.okrCycle;
          // this.$emit('handleData', this.okrCycle);
          this.handleData(this.okrCycle);
        }
      },
    },
  },
};
</script>