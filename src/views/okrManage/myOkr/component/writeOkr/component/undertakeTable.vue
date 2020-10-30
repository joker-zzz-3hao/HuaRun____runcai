<template>
  <el-scrollbar>
    <div class="cont-box">
      <dl class="dl-list">
        <dt class="operating-area-inside">
          <em>父目标周期</em>
          <el-select
            v-model="searchForm.periodId"
            placeholder="请选择目标周期"
            :popper-append-to-body="false"
            popper-class="tl-select-dropdown"
            class="tl-select"
          >
            <el-option
              v-for="item in periodList"
              :key="item.periodId"
              :label="item.periodName"
              :value="item.periodId"
            ></el-option>
          </el-select>
        </dt>
        <dd
          class="tag-kind"
          v-for="pItem in parentUndertake[searchForm.periodId]"
          :key="pItem.periodName"
        >
          <el-radio-group v-model="modelDepart" v-if="pItem.isupdate">
            <el-radio
              @click.native="selectDepartokr($event, index, item)"
              class="tl-radio"
              :label="item.okrDetailId + item.okrDetailVersion"
              v-for="(item, index) in departokrList"
              :key="item.okrDetailId + index"
            >
              <div
                v-if="currentOption.includes(item.okrDetailId)"
                class="undertake-change"
              >
                <span
                  :class="item.okrKind == 'o' ? 'kind-parent' : 'kind-child'"
                  >{{ item.typeName }}</span
                >
                <em v-if="item.currentOption">
                  <em>「历史版本{{ item.okrDetailVersion }}」</em>
                  <em>(当前选择)</em>
                </em>
                <em v-else-if="currentOption.includes(item.okrDetailId)"
                  >「最新版本」</em
                >
                <div>
                  <p>{{ item.okrDetailObjectKr }}</p>
                  <p v-if="item.modifyReason">
                    <span>变更原因</span>
                    {{ item.modifyReason }}
                  </p>
                </div>
              </div>
              <template v-else>
                <span
                  :class="item.okrKind == 'o' ? 'kind-parent' : 'kind-child'"
                  >{{ item.typeName }}</span
                >
                <em>{{ item.okrDetailObjectKr }}</em>
              </template>
            </el-radio>
          </el-radio-group>
          <el-radio-group v-model="modelDepart" v-else>
            <el-radio
              @click.native="selectDepartokr($event, index, item)"
              class="tl-radio"
              :label="item.okrDetailId + item.okrDetailVersion"
              v-for="(item, index) in pItem.departokrList"
              :key="item.okrDetailId"
            >
              <span
                :class="item.okrKind == 'o' ? 'kind-parent' : 'kind-child'"
                >{{ item.typeName }}</span
              >
              <em>{{ item.okrDetailObjectKr }}</em>
            </el-radio>
          </el-radio-group>
        </dd>
        <!-- 无数据 -->
        <dd class="no-data" v-if="!hasParent || periodList.length == 0">
          暂无可关联的父目标
        </dd>
      </dl>
      <!-- 价值观 -->
      <dl class="dl-list">
        <dt class="list-title">
          <em>公司价值观</em>
          <span>(单选)</span>
        </dt>
        <dd>
          <el-radio-group v-model="modelPhil">
            <el-radio
              @click.native="selectphilosophy($event, index, item)"
              class="tl-radio"
              :label="item.id"
              v-for="(item, index) in philosophyList"
              :key="item.id"
              >{{ item.cultureName }}</el-radio
            >
          </el-radio-group>
        </dd>
        <dd v-if="philosophyList.length == 0" class="no-data">暂无数据</dd>
      </dl>
    </div>
  </el-scrollbar>
</template>

<script>
import tabs from '@/components/tabs';
import { mapState } from 'vuex';

export default {
  name: 'undertakeTable',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    'tl-tabs': tabs,
  },
  props: {
    departokrList: {
      type: Array,
    },
    showPhil: {
      type: Boolean,
      default: true,
    },
    periodName: {
      type: String,
      default: '',
    },
    selectRadioDepart: {
      type: String,
      default: '',
    },
    selectRadioPhil: {
      type: String,
      default: '',
    },
    currentOption: {
      type: String,
      default: '',
    },
    okrBelongType: {
      type: Number,
      default: 1,
    },
    server: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectDepartRow: {}, // 选择的部门okr
      selectDepartIndex: '', // 当前选择的序号
      selectPhilRow: {}, // 选择的价值观
      selectPhilIndex: '', // 当前价值观序号
      departmentName: '',
      modelDepart: '', // 中转prop
      modelPhil: '', // 中转prop
      parentUndertake: [],
      philosophyList: [],
      currentIndex: 0,
      periodList: [],
      searchForm: {
        okrCycle: {},
        periodId: '',
      },
      tabMenuList: [{
        menuName: '实体组织',
      },
      {
        menuName: '虚拟汇报',
      }],
      hasParent: true,

    };
  },
  created() {
    if (this.roleCode.includes('ORG_ADMIN') || this.roleCode.includes('TEAM_ADMIN')) {
      this.departmentName = this.userInfo.orgParentName || '部门';
    } else {
      this.departmentName = this.userInfo.orgName || '部门';
    }
    if (!this.userInfo.orgParentName) {
      this.hasParent = false;
    }
    // this.getCycle();
    this.getUndertakeOkr();
    this.getCultureList();
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      roleCode: (state) => state.roleCode,
    }),
  },
  methods: {
    // getCycle() {
    //   // 周期
    //   this.server.getOkrCycleList().then((res) => {
    //     if (res.code == 200) {
    //       this.periodList = res.data || [];
    //       this.searchForm.okrCycle = this.periodList.filter((item) => item.checkStatus == '1')[0] || {};
    //       this.searchForm.periodId = this.searchForm.okrCycle.periodId;
    //       this.getUndertakeOkr();
    //     }
    //   });
    // },
    getUndertakeOkr() {
      this.server.getUndertakeOkr({ okrBelongType: this.okrBelongType }).then((res) => {
        if (res.code == 200) {
          this.parentUndertake = [];
          this.periodList = [];
          if (res.data.parentUndertakeOkrInfoResults) {
            this.searchForm.periodId = 0;
            res.data.parentUndertakeOkrInfoResults.forEach((pItem, pindex) => {
              this.periodList.push({ periodId: pindex, periodName: `${pItem.okrPeriodEntity.periodName}（${this.cutOrgName(pItem.orgName)}）` });
              const departokrList = [];
              pItem.okrList.forEach((item) => {
                if (this.selectRadioDepart == item.o.okrDetailId
                || this.selectRadioDepart == item.o.okrDetailId + item.o.okrDetailVersion) {
                  console.log(this.selectRadioDepart);
                  this.selectDepartRow = {
                    typeName: '目标',
                    okrKind: 'o',
                    okrDetailObjectKr: item.o.okrDetailObjectKr,
                    okrDetailId: item.o.okrDetailId,
                    okrDetailVersion: item.o.okrDetailVersion,
                  };
                }
                departokrList.push({
                  typeName: '目标',
                  okrKind: 'o',
                  okrDetailObjectKr: item.o.okrDetailObjectKr,
                  okrDetailId: item.o.okrDetailId,
                  okrDetailVersion: item.o.okrDetailVersion,
                });
                if (item.krList && item.krList.length > 0) {
                  item.krList.forEach((krItem) => {
                    if (this.selectRadioDepart == krItem.okrDetailId
                || this.selectRadioDepart == krItem.okrDetailId + krItem.okrDetailVersion) {
                      this.selectDepartRow = {
                        typeName: 'KR',
                        okrKind: 'k',
                        okrDetailObjectKr: krItem.okrDetailObjectKr,
                        okrDetailId: krItem.okrDetailId,
                        okrDetailVersion: krItem.okrDetailVersion,
                      };
                    }
                    departokrList.push({
                      typeName: 'KR',
                      okrKind: 'k',
                      okrDetailObjectKr: krItem.okrDetailObjectKr,
                      okrDetailId: krItem.okrDetailId,
                      okrDetailVersion: krItem.okrDetailVersion,
                    });
                  });
                }
              });
              console.log(this.periodName, pItem.okrPeriodEntity.periodName);
              if (this.periodName == pItem.okrPeriodEntity.periodName && this.departokrList) {
                console.log('isupdate');
                this.parentUndertake.push({
                  pindex: {
                    isupdate: true,
                    periodName: this.periodName,
                    departokrList: this.departokrList,
                  },
                });
              } else {
                this.parentUndertake.push({
                  pindex: {
                    periodName: pItem.okrPeriodEntity.periodName,
                    departokrList,
                  },
                });
              }
            });
            if (this.departokrList && this.selectRadioDepart) {
              console.log('这是变更');
              this.selectDepartRow = this.departokrList.filter(
                (item) => item.okrDetailId + item.okrDetailVersion == this.selectRadioDepart,
              )[0] || {};
            }
          }
        }
      });
    },
    // 查公司价值观
    getCultureList() {
      this.server.queryCultureList().then((res) => {
        if (res.code == 200) {
          this.philosophyList = res.data || [];
          if (this.selectRadioPhil) {
            this.selectPhilRow = this.philosophyList.filter(
              (item) => item.id == this.selectRadioPhil,
            )[0] || {};
          }
        }
      });
    },
    // 选择关联的okr
    selectDepartokr(e, index, row) {
      // 原生click会执行两次，第一次在label等，第二次在input
      console.log('选择关联的okr', this.selectDepartIndex, index);
      if (e.target.tagName != 'INPUT') return;
      if (this.selectDepartIndex === index) {
        this.selectDepartIndex = '';
        this.modelDepart = '';
        this.selectDepartRow = '';
      } else {
        this.selectDepartIndex = index;
        this.selectDepartRow = row;
      }
      console.log(this.selectRadioDepart, this.modelDepart, this.selectDepartRow);
    },
    // 选择关联的价值观
    selectphilosophy(e, index, row) {
      // 原生click会执行两次，第一次在label等，第二次在input
      if (e.target.tagName != 'INPUT') return;
      if (this.selectPhilIndex === index) {
        this.selectPhilIndex = '';
        this.modelPhil = '';
        this.selectPhilRow = '';
      } else {
        this.selectPhilIndex = index;
        this.selectPhilRow = row;
      }
    },
  },
  watch: {
    selectRadioDepart: {
      handler(newVal) {
        this.modelDepart = newVal;
      },
      immediate: true,
    },
    selectRadioPhil: {
      handler(newVal) {
        this.modelPhil = newVal;
      },
      immediate: true,
    },
    currentIndex: {
      handler() {
        this.getUndertakeOkr();
      },
    },
  },
};
</script>