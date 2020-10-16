<template>
  <el-drawer
    :wrapperClosable="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    :before-close="close"
    @closed="closed"
    :visible.sync="visible"
    custom-class="custom-drawer supporting-values"
    class="tl-drawer"
  >
    <div slot="title" class="flex-sb">
      <div class="drawer-title">{{ drawerTitle }}</div>
    </div>
    <el-scrollbar>
      <div class="cont-box">
        <dl class="dl-list">
          <dt class="list-title">
            <em>团队目标</em>
            <el-select
              v-model="orgPeriodId"
              placeholder="请选择周期"
              :popper-append-to-body="false"
              popper-class="tl-select-dropdown"
              class="tl-select"
              @change="periodChange"
            >
              <el-option
                v-for="item in orgOkrPeriodList"
                :key="item.periodId"
                :label="item.periodName"
                :value="item.periodId"
              ></el-option>
            </el-select>
          </dt>
          <dd class="tag-kind">
            <el-radio-group v-model="orgSelectData">
              <el-radio
                class="tl-radio"
                v-for="(teamTarget, index) in thisPageOrgOkrList"
                :label="teamTarget.okrDetailId"
                :key="teamTarget.okrDetailId"
                @click.native="selectOrgOkr($event, index, teamTarget)"
              >
                <span
                  :class="
                    teamTarget.okrType == 'O' ? 'kind-parent' : 'kind-child'
                  "
                  >{{ teamTarget.indexText }}</span
                >
                <em>{{ teamTarget.okrDetailObjectKr }}</em>
              </el-radio>
            </el-radio-group>
          </dd>
          <dd class="tag-kind" v-if="thisPageOrgOkrList.length < 1">
            暂无可承接的团队目标
          </dd>
        </dl>
        <dl class="dl-list">
          <dt class="list-title">
            <em>个人目标</em>
          </dt>
          <dd class="tag-kind">
            <el-radio-group v-model="personalSelectData">
              <el-radio
                class="tl-radio"
                v-for="(personalTarget, index) in myOkrList"
                :label="personalTarget.okrDetailId"
                :key="personalTarget.okrDetailId"
                @click.native="selectMyOkr($event, index, personalTarget)"
              >
                <span
                  :class="
                    personalTarget.okrType == 'O' ? 'kind-parent' : 'kind-child'
                  "
                  >{{ personalTarget.indexText }}</span
                >
                <em>{{ personalTarget.okrDetailObjectKr }}</em>
              </el-radio>
            </el-radio-group>
          </dd>
          <dd class="tag-kind" v-if="myOkrList.length < 1">
            暂无可承接的个人目标
          </dd>
        </dl>
        <dl class="dl-list">
          <dt class="list-title">
            <em>公司价值观</em>
          </dt>
          <dd>
            <!-- <el-checkbox-group v-model="valueSelectData">
              <el-checkbox
                v-for="culture in cultureList"
                class="tl-checkbox"
                :label="culture.id"
                :key="culture.id"
                @change="cultureChange"
                >{{ culture.cultureName }}</el-checkbox
              >
            </el-checkbox-group> -->
            <el-radio-group v-model="valueSelectData">
              <el-radio
                class="tl-radio"
                v-for="(culture, index) in cultureList"
                :label="culture.id"
                :key="culture.id"
                @click.native="cultureChange($event, index, culture)"
              >
                <em>{{ culture.cultureName }}</em>
              </el-radio>
            </el-radio-group>
          </dd>
        </dl>
      </div>
    </el-scrollbar>
    <div class="operating-box">
      <el-button type="primary" class="tl-btn amt-bg-slip" @click="confirm"
        >确认</el-button
      >
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
  </el-drawer>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'addOkr',
  components: {
  },
  props: {
    server: {
      type: Object,
      default() {
        return { };
      },
    },
    currenItemrandomId: {
      type: String,
      default() {
        return '';
      },
    },
    selectedOkr: {
      type: Array,
      default() {
        return [];
      },
    },
    myOkrList: {
      type: Array,
      default() {
        return [];
      },
    },
    orgOkrList: {
      type: Array,
      default() {
        return [];
      },
    },
    orgOkrPeriodList: {
      type: Array,
      default() {
        return [];
      },
    },
    originalMyOkrList: {
      type: Array,
      default() {
        return [];
      },
    },
    originalOrgOkrList: {
      type: Array,
      default() {
        return [];
      },
    },
    cultureList: {
      type: Array,
      default() {
        return [];
      },
    },
    drawerTitle: {
      type: String,
      default: '支撑OKR/价值观',
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
      initUserAccount: '',
      selectedOkrList: [],
      selectOrgIndex: undefined,
      selectMyIndex: undefined,
      selectCultureIndex: undefined,
      supportMyOkrObj: {},
      selectOkrList: [],
      orgSelectData: '', // 团队目标
      personalSelectData: '', // 个人目标
      valueSelectData: '', // 价值观
      orgOkr: [],
      personalOkr: [],
      selectedCultureList: [],
      orgPeriodId: '',
      thisPageOrgOkrList: [],
    };
  },
  created() {

  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    init() {
      this.visible = true;
      this.orgPeriodId = this.orgOkrPeriodList[0].periodId;
      this.initSelectedData();
    },
    confirm() {
      this.visible = false;
      this.$emit('closeOkrDialog', {
        selectedOkrAndCulture: [...this.orgOkr, ...this.personalOkr, ...this.selectedCultureList],
        selectedOkr: [...this.orgOkr, ...this.personalOkr],
        selectedCulture: [...this.selectedCultureList],
        currenItemrandomId: this.currenItemrandomId,
        supportMyOkrObj: this.supportMyOkrObj,
      });
    },
    close() {
      this.visible = false;
    },
    closed() {
      this.$emit('update:showAddOkr', false);
    },
    initSelectedData() {
      this.valueSelectData = [];
      for (const item of this.selectedOkr) {
        // 匹配个人okr
        for (const okr of this.myOkrList) {
          if (item.okrDetailId == okr.okrDetailId) {
            // 反显
            this.personalSelectData = okr.okrDetailId;
            // 赋值已选项
            this.personalOkr = [okr];
            // ************支撑项初始化*****************
            for (const o of this.originalMyOkrList) {
              if (okr.okrDetailId == o.okrDetailId) {
                this.supportMyOkrObj = { o };
              }
              for (const kr of o.krList) {
                if (kr.okrDetailId == okr.okrDetailId) {
                  this.supportMyOkrObj = { o, kr };
                }
              }
            }
          }
        }
        // 匹配团队okr
        // 先确定是哪个团队okr周期；下拉框选中该周期；遍历该周期目标；勾选该目标
        // for (const okr of this.orgOkrList) {
        //   if (item.okrDetailId == okr.okrDetailId) {
        //     // 反显
        //     this.orgSelectData = okr.okrDetailId;
        //     // 赋值已选项
        //     this.orgOkr = [okr];
        //   }
        // }
        // 匹配价值观
        for (const culture of this.cultureList) {
          if (item.okrDetailId == culture.id) {
            // 反显
            this.valueSelectData = item.okrDetailId;
            // 赋值已选项
            this.selectedCultureList.push({
              okrDetailId: culture.id,
              okrDetailObjectKr: culture.cultureName,
            });
          }
        }
      }

      this.$forceUpdate();
    },
    // 选择关联的okr
    selectOrgOkr(e, index, okr) {
      this.supportMyOkrObj = {};
      this.personalSelectData = '';
      this.valueSelectData = '';
      this.personalOkr = [];
      this.selectedCultureList = [];
      // 原生click会执行两次，第一次在label等，第二次在input
      if (e.target.tagName != 'INPUT') return;
      if (this.selectOrgIndex === index) {
        this.selectOrgIndex = '';
        this.orgOkr = [];
        this.orgSelectData = '';
      } else {
        this.orgSelectData = okr.okrDetailId;// 单选控制
        this.thisPageOrgOkrList.forEach((element) => {
          if (element.okrDetailId == this.orgSelectData) {
            this.orgOkr = [element];
          }
        });
        this.selectOrgIndex = index;
      }
    },
    selectMyOkr(e, index, okr) {
      this.orgSelectData = '';
      this.valueSelectData = '';
      this.orgOkr = [];
      this.selectedCultureList = [];
      if (e.target.tagName != 'INPUT') return;
      if (this.selectMyIndex === index) { // 取消选中
        this.selectMyIndex = undefined;
        this.personalOkr = [];
        this.supportMyOkrObj = {};
        this.personalSelectData = '';
      } else { // 选中
        this.selectMyIndex = index;
        this.personalSelectData = okr.okrDetailId;// 单选控制
        this.myOkrList.forEach((element) => {
          if (element.okrDetailId == this.personalSelectData) {
            this.personalOkr = [element];
          }
        });
        // 如果是选中kr，则需要将父级目标带到周报页面，用于展示在个人okr完成度部分
        for (const o of this.originalMyOkrList) {
          if (this.personalOkr[0].okrDetailId == o.okrDetailId) {
            this.supportMyOkrObj = { o };
          }
          for (const kr of o.krList) {
            if (kr.okrDetailId == this.personalOkr[0].okrDetailId) {
              this.supportMyOkrObj = { o, kr };
            }
          }
        }
      }
    },
    cultureChange(e, index, culture) {
      this.supportMyOkrObj = {};
      this.orgSelectData = '';
      this.personalSelectData = '';
      this.orgOkr = [];
      this.personalOkr = [];
      if (e.target.tagName != 'INPUT') return;
      if (this.selectCultureIndex === index) { // 取消选中
        this.selectCultureIndex = undefined;
        this.selectedCultureList = [];
        this.valueSelectData = '';
      } else { // 选中
        this.selectCultureIndex = index;
        this.valueSelectData = culture.id;// 单选控制
        this.cultureList.forEach((element) => {
          if (element.id == this.valueSelectData) {
            this.selectedCultureList = [{
              okrDetailId: culture.id,
              okrDetailObjectKr: culture.cultureName,
            }];
          }
        });
        this.selectCultureIndex = index;
      }
      this.$forceUpdate();
    },
    periodChange(period) {
      console.log(period);
    },
  },
  watch: {
    orgPeriodId: {
      handler(newValue) {
        this.thisPageOrgOkrList = [];
        this.orgOkrList.forEach((okr) => {
          if (newValue == okr.periodId) {
            this.thisPageOrgOkrList.push(okr);
          }
        });
      },
    },
  },
  updated() {},
  beforeDestroy() {},
};
</script>
<style lang="css">
.el-avatar,
.el-drawer {
  overflow: auto;
}
</style>