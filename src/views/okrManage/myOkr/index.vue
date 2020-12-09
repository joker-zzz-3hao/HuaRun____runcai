<template>
  <div class="my-okr">
    <router-view class="cont-area"></router-view>
    <div class="operating-area">
      <div class="operating-area-inside">
        <div class="tl-custom-tabs">
          <div class="tab-menus">
            <ul class="tab-list">
              <li
                v-for="(item, idx) in tabsList"
                :key="item.menuTitle"
                @click="borderSlip(item, idx)"
                :class="{ 'is-focus': currentIndex === idx }"
              >
                {{ item.menuTitle }}
              </li>
            </ul>
            <div class="border-slip"></div>
          </div>
        </div>
        <div class="operating-box">
          <dl class="dl-item">
            <dt>目标周期</dt>
            <dd>
              <!-- multiple 多选属性 -->
              <!-- searchForm.periodId 单选 -->
              <!-- multperiod 多选 -->
              <el-select
                :disabled="periodList.length == 0"
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
            </dd>
          </dl>
          <dl class="dl-item" v-if="currentIndex === 0">
            <dt>状态</dt>
            <dd>
              <el-select
                v-model="searchForm.status"
                placeholder="请选择okr状态"
                :popper-append-to-body="false"
                popper-class="tl-select-dropdown"
                class="tl-select"
              >
                <el-option
                  v-for="item in CONST.STATUS_LIST"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </dd>
          </dl>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="goWriteOkr()"
            class="tl-btn amt-bg-slip"
            :disabled="!hasPower('okr-create')"
            >创建OKR</el-button
          >
        </div>
      </div>
    </div>
    <tl-writeokr
      ref="writeokr"
      :exist.sync="writeokrExist"
      v-if="hasValue(writeokrExist)"
      :userName="userInfo.userName"
      :writeInfo="writeInfo"
    ></tl-writeokr>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import writeOkr from './component/writeOkr/index';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'okr',
  components: {
    'tl-writeokr': writeOkr,
  },
  data() {
    return {
      CONST,
      server,
      currentIndex: 0,
      tabsList: [
        {
          menuTitle: '我的OKR',
          toName: 'myOkr',
        },
        {
          menuTitle: '部门OKR',
          toName: 'departmentOkr',
        },
        {
          menuTitle: '全局OKR',
          toName: 'okrTable',
        },
        // {
        //   menuTitle: '历史部门OKR',
        //   toName: '',
        // },
      ],
      writeokrExist: false,
      writeInfo: {},
      searchForm: {
        status: 'all',
        periodId: '',
      },
      periodList: [], // 周期列表
      okrCycle: {}, // 当前选择的周期
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      roleCode: (state) => state.roleCode,
      periodId: (state) => state.periodId,
    }),
  },
  created() {
    // 如果是负责人并且有上级，则展示上级
    if (this.roleCode.includes('ORG_ADMIN')
    && this.userInfo.orgParentName) {
      this.departmentName = this.cutOrgName(this.userInfo.orgParentName);
      // 如果是负责人并且是根节点
    } else if (this.roleCode.includes('ORG_ADMIN') && this.userInfo.orgId == 'CR0011000054') {
      this.departmentName = '润联科技';
      // 普通用户
    } else {
      this.departmentName = this.cutOrgName(this.userInfo.orgName) || '部门';
    }

    // TODO: 加orgId
    // 实体部门名
    this.tabsList.forEach((item) => {
      if (item.toName == 'departmentOkr') {
        item.menuTitle = `${this.departmentName}OKR`;
      }
    });
    // 如果是“根级组织人”，只展示“我的okr”
    if (!this.userInfo.orgParentId) {
      this.tabsList = [
        {
          menuTitle: '我的OKR',
          toName: 'myOkr',
        },
      ];
    }
    // 有虚线汇报需展示虚线部门和实体部门
    // this.tabsList.push( {menuTitle: '部门OKR',toName: 'departmentOkr',},);
    this.getOkrCycleList();
  },
  mounted() {
    if (this.$route.query) {
      if (this.$route.query.openWriteOkr) {
        this.goWriteOkr(this.$route.query.periodId);
      }
    }
    this.currentIndex = this.$route.name == 'myOkr' ? 0 : 1;
    const borderWidth = document.querySelector('.operating-area .border-slip');
    const selfLeft = document.querySelectorAll('.operating-area .tab-list li')[this.currentIndex].offsetLeft;
    const liWidth = document.querySelectorAll('.operating-area .tab-list li');
    borderWidth.style.left = `${selfLeft}px`;
    borderWidth.style.width = `${liWidth[this.currentIndex].offsetWidth}px`;
  },
  methods: {
    ...mapMutations('common', ['setokrStatus', 'setokrCycle']),
    goWriteOkr(periodId = '') {
      this.$router.replace('myOkr');
      // 调用接口校验是否可创建
      this.server.checkPrivilege({ operateType: 'add' }).then((res) => {
        if (res.code == 200 && res.data) {
          if (res.data.validFlag) {
            this.writeInfo = {
              canWrite: 'new',
            };
            this.writeokrExist = true;
            this.$nextTick(() => {
              this.$refs.writeokr.showOkrDialog(periodId);
            });
          } else {
            this.$message.error(res.data.remark);
          }
        }
      });
    },
    // 周期
    getOkrCycleList() {
      this.server.getOkrCycleList().then((res) => {
        if (res.code == 200) {
          this.periodList = res.data || [];
          this.okrCycle = this.periodList.filter((item) => item.checkStatus == '1')[0] || {};
          this.searchForm.periodId = this.okrCycle.periodId;
          this.setokrCycle(this.okrCycle);
        }
      });
    },
    borderSlip(item, index) {
      const borderWidth = document.querySelector('.border-slip');
      const selfLeft = document.querySelectorAll('.tab-list li')[index].offsetLeft;
      const liWidth = document.querySelectorAll('.tab-list li');
      borderWidth.style.left = `${selfLeft}px`;
      borderWidth.style.width = `${liWidth[index].offsetWidth}px`;
      this.currentIndex = index;
      console.log('qieh', item);
      this.go(item.toName);
      // if name == 虚线
    },
  },
  beforeDestroy() {
    this.setokrCycle();
  },
  watch: {
    'searchForm.periodId': {
      handler(newVal) {
        if (newVal) {
          this.okrCycle = this.periodList.filter(
            (citem) => citem.periodId == newVal,
          )[0] || {};
          this.setokrCycle(this.okrCycle);
        }
      },
      immediate: true,
      deep: true,
    },
    'searchForm.status': {
      handler(newVal) {
        if (newVal) {
          console.log('searchForm.status', newVal);
          this.setokrStatus(newVal);
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>