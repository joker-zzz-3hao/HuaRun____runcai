<template>
  <el-drawer
    :wrapperClosable="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    :visible.sync="createokrDrawer"
    custom-class="custom-drawer create-okr"
    class="tl-drawer"
    :before-close="close"
    @closed="closed"
  >
    <div slot="title" class="flex-sb">
      <div v-if="writeInfo.canWrite == 'draft'" class="drawer-title">
        编辑OKR
      </div>
      <div v-else class="drawer-title">创建OKR</div>
      <div class="icon-save" v-if="showAuto">
        <i></i>
        <em>已自动保存</em>
      </div>
    </div>
    <el-scrollbar>
      <div class="cont-box">
        <template v-if="searchForm.modifyReason">
          <el-alert type="warning" class="tl-alert">
            <div slot="title">
              <div class="alert-title">审批退回原因：</div>
              <div class="alert-cont">{{ searchForm.modifyReason }}</div>
            </div>
          </el-alert>
        </template>
        <div class="allocation-info">
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
                <el-option
                  v-for="item in periodList"
                  :key="item.periodId"
                  :label="item.periodName"
                  :value="item.periodId"
                ></el-option>
              </el-select>
            </dd>
          </dl>
          <dl>
            <dt>OKR类型</dt>
            <dd>
              {{ CONST.OKR_TYPE_MAP[searchForm.okrType] }}
              <!-- <el-select
                v-model="searchForm.okrType"
                placeholder="请选择类型"
                :popper-append-to-body="false"
                popper-class="tl-select-dropdown"
                class="tl-select"
              >
                <el-option
                  v-for="(item, index) in okrTypeList"
                  :key="item.id+index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>-->
            </dd>
          </dl>
          <dl class="user-info">
            <dt>负责人</dt>
            <dd v-if="true">
              <img src="@/assets/images/user/user.jpg" alt />
            </dd>
            <dd v-else class="user-name">
              <em>{{ cutName(userName) }}</em>
            </dd>
            <dd>{{ userName }}</dd>
          </dl>
        </div>
        <okr-form
          v-if="createokrDrawer"
          ref="okrform"
          :searchForm="searchForm"
          :server="server"
        ></okr-form>
      </div>
    </el-scrollbar>
    <div class="operating-box">
      <div class="flex-auto" v-if="writeInfo.okrStatus != '8'">
        <el-button
          :disabled="!hasPower('okr-draft-save')"
          plain
          @click="saveDraft"
          class="tl-btn amt-border-fadeout"
          >保存为草稿</el-button
        >
      </div>
      <el-button
        :disabled="!hasPower('okr-create')"
        type="primary"
        @click="summit"
        class="tl-btn amt-bg-slip"
        :loading="createokrDrawer && okrLoading"
        >创建目标</el-button
      >
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
  </el-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
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
        okrCycle: {},
        okrType: null,
        okrStatus: '',
        draftParams: '',
        draftId: '',
      },
      canWrite: true, // true写okr false changeokr
      periodList: [],
      temPeriod: '',
      selectPeriod: '',
    };
  },
  computed: {
    ...mapState('common', {
      roleCode: (state) => state.roleCode,
      showAuto: (state) => state.showAuto,
      createokrDrawer: (state) => state.createokrDrawer,
      okrLoading: (state) => state.okrLoading,
    }),
    okrTypeList() {
      if (this.roleCode.includes('ORG_ADMIN')) {
        return this.CONST.OKR_TYPE_LIST.filter(
          (item) => item.id == 1,
        );
      } return this.CONST.OKR_TYPE_LIST.filter(
        (item) => item.id == 2,
      );
    },
  },
  mounted() {
  },
  created() {
  },
  methods: {
    ...mapMutations('common', ['setokrSuccess', 'setCreateokrDrawer', 'setShowAuto']),
    showOkrDialog(periodId = '') {
      this.selectPeriod = periodId;
      this.init();
      this.setCreateokrDrawer(true);
      this.setokrSuccess(false);
    },
    closed() {
      if (this.showAuto) {
        this.setokrSuccess(true);
      }
      this.$emit('update:exist', false);
      this.setShowAuto(false);
    },
    close() {
      this.setCreateokrDrawer(false);
    },
    init() {
      // okr类型
      if (this.roleCode.includes('ORG_ADMIN') || this.roleCode.includes('TENANT_ADMIN')) {
        this.searchForm.okrType = 1;
      } else { this.searchForm.okrType = 2; }
      if (this.writeInfo.canWrite == 'draft') {
        this.searchForm.okrStatus = this.writeInfo.okrStatus || '';
        this.searchForm.draftParams = this.writeInfo.draftParams || '';
        this.searchForm.draftId = this.writeInfo.draftId || '';
        this.searchForm.approvalId = this.writeInfo.approvalId || '';
        this.searchForm.modifyReason = this.writeInfo.modifyReason || '';
        this.searchForm.approvalType = this.writeInfo.approvalType || '';
        this.searchForm.okrType = JSON.parse(this.searchForm.draftParams).okrBelongType;
        this.temPeriod = JSON.parse(this.searchForm.draftParams).periodId;
      }
      // 周期
      this.server.getOkrCycleList().then((res) => {
        if (res.code == 200) {
          this.periodList = res.data || [];
          this.searchForm.okrCycle = this.periodList.filter((item) => item.checkStatus == '1')[0] || {};
          if (this.temPeriod) {
            this.searchForm.periodId = this.temPeriod;
          } else {
            this.searchForm.periodId = this.selectPeriod || this.searchForm.okrCycle.periodId;
          }
        }
      });
    },

    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
    },
    saveDraft() {
      this.$refs.okrform.saveDraft();
    },
    summit() {
      this.$refs.okrform.summit();
    },
  },
  watch: {
    'searchForm.periodId': {
      handler(newVal) {
        if (newVal) {
          this.searchForm.okrCycle = this.periodList.filter(
            (citem) => citem.periodId === newVal,
          )[0] || {};
        }
      },
    },
  },
};
</script>