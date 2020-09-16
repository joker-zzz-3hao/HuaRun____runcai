<template>
  <div class="my-okr">
    <router-view class="cont-area"></router-view>
    <div class="operating-area">
      <div class="operating-area-inside">
        <div class="tl-custom-tabs">
          <div class="tab-menus">
            <ul class="tab-list">
              <li
                v-for="(item,idx) in tabsList"
                :key="item.menuTitle"
                @click="borderSlip(item,idx,item.toName)"
                :class="{'is-focus': currentIndex === idx}"
              >{{item.menuTitle}}</li>
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
          <dl class="dl-item" v-if="currentIndex===0">
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
                  v-for="(item) in CONST.STATUS_LIST"
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
            @click="goWriteOkr"
            class="tl-btn amt-bg-slip"
          >创建OKR</el-button>
        </div>
      </div>
    </div>
    <tl-writeokr
      ref="writeokr"
      :exist.sync="writeokrExist"
      v-if="writeokrExist"
      :userName="userInfo.userName"
      :writeInfo="writeInfo"
      @success="searchOkr(searchForm.status)"
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
    if (this.roleCode.includes('ORG_ADMIN') && this.userInfo.orgParentName) {
      this.departmentName = this.userInfo.orgParentName;
    } else if (this.roleCode.includes('ORG_ADMIN') && this.userInfo.orgId == 'CR0011000054') {
      this.departmentName = '润联科技';
    } else {
      this.departmentName = this.userInfo.orgName || '部门';
    }
    this.tabsList.forEach((item) => {
      if (item.toName == 'departmentOkr') {
        item.menuTitle = `${this.departmentName}OKR`;
      }
    });
    this.getOkrCycleList();
  },
  mounted() {
    this.currentIndex = this.$route.name == 'myOkr' ? 0 : 1;
    const borderWidth = document.querySelector('.operating-area .border-slip');
    const selfLeft = document.querySelectorAll('.operating-area .tab-list li')[this.currentIndex].offsetLeft;
    const liWidth = document.querySelectorAll('.operating-area .tab-list li');
    borderWidth.style.left = `${selfLeft}px`;
    borderWidth.style.width = `${liWidth[this.currentIndex].offsetWidth}px`;
  },
  methods: {
    ...mapMutations('common', ['setokrStatus', 'setokrCycle']),
    goWriteOkr() {
      // 调用接口校验是否可创建
      this.server.checkPrivilege({ operateType: 'add' }).then((res) => {
        if (res.code == 200 && res.data) {
          if (res.data.validFlag) {
            this.writeInfo = {
              canWrite: 'new',
            };
            this.writeokrExist = true;
            this.$nextTick(() => {
              this.$refs.writeokr.showOkrDialog();
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
          this.setokrPeriodId(this.searchForm.periodId);
        }
      });
    },
    borderSlip(item, index, name) {
      const borderWidth = document.querySelector('.border-slip');
      const selfLeft = document.querySelectorAll('.tab-list li')[index].offsetLeft;
      const liWidth = document.querySelectorAll('.tab-list li');
      borderWidth.style.left = `${selfLeft}px`;
      borderWidth.style.width = `${liWidth[index].offsetWidth}px`;
      this.currentIndex = index;
      this.go(name);
    },
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