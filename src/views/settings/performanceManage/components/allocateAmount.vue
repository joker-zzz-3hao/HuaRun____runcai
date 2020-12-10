<!--
  功能：
  作者：王志任
  时间：2020年12月02日 15:22:31
  备注：
-->
<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @close="close"
    :title="title"
    :close-on-click-modal="false"
  >
    <dl>
      <dt>请选择评定方式：</dt>
      <dd>
        <el-select
          v-model="periodRuleId"
          placeholder="请选择目标周期"
          :popper-append-to-body="false"
          popper-class="tl-select-dropdown"
          class="tl-select"
          @change="dataChange"
          ><el-option
            v-for="item in amountDataList"
            :key="item.periodRuleId"
            :label="item.ruleName"
            :value="item.periodRuleId"
          ></el-option
        ></el-select>
        <dl class="layout-flex">
          <dt>当前剩余可分配'{{ amountData.ruleName }}'数量：</dt>
          <dd
            v-for="item in remainAmountList"
            :key="item.periodRuleDetailId"
            class="layout-flex dd-margin"
          >
            {{ item.value + "（" + item.applyValue + "个）" }}
          </dd>
        </dl>

        <dl class="layout-flex">
          <dt>设置'{{ amountData.ruleName }}'数量：</dt>
          <dd
            v-for="item in amountData.periodRuleDetailList"
            :key="item.periodRuleDetailId"
            class="layout-flex dd-margin"
          >
            <span>{{ item.value + item.unit }}</span
            ><el-input v-model="item.applyValue"></el-input><span>个</span>
          </dd>
        </dl>
      </dd>
    </dl>
    <div class="operating-box">
      <el-button
        :loading="loading"
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="submit"
        >确认</el-button
      >
      <el-button
        :disabled="loading"
        plain
        class="tl-btn amt-border-fadeout"
        @click="close"
        >取消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'addOrEditAmount',
  components: {},
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },

    rowData: {
      type: Object,
      default() {
        return {};
      },
    },
    amountDataList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
      title: '',
      periodRuleId: '',
      submitData: {

      },
      amountData: {
        ruleName: '',
        periodRuleDetailList: [],
      },
      remainAmountList: [],
    };
  },
  created() { },
  mounted() { this.init(); },
  computed: {},
  methods: {
    init() {
      this.title = `分配绩效名额（${this.rowData.orgName}）`;
      this.periodRuleId = this.amountDataList[0].periodRuleId;
      this.setamountList(this.periodRuleId);
      // this.getRemainAmountList();
    },
    getRemainAmountList() {
      this.server.getRemainAmountList().then((res) => {
        if (res.code == 200) {
          debugger;
        }
      });
    },
    dataChange(periodRuleId) {
      this.setamountList(periodRuleId);
    },
    setamountList(periodRuleId) {
      this.amountDataList.forEach((element) => {
        if (element.periodRuleId == periodRuleId) {
          this.amountData = element;
          // 如果非编辑状态
          this.amountData.periodRuleDetailList.forEach((data) => {
            data.applyValue = '';
          });
        }
      });
    },
    show(selectedRule, searchForm, tenantId) {
      // this.amountData.periodId = searchForm.periodId;
      // this.amountData.applyId = tenantId;
      // console.log(selectedRule);
      // this.selectedRule = { ...selectedRule };
      // if (selectedRule.periodRuleId) {
      //   this.amountData.ruleId = selectedRule.ruleId;
      //   this.selectedRule.ruleDetailList = [...selectedRule.periodRuleDetailList];
      // } else {
      //   this.amountData.ruleId = searchForm.ruleId;
      //   this.selectedRule.ruleDetailList.forEach((item) => {
      //     this.$set(item, 'applyValue', '');
      //   });
      // }
      this.$nextTick(() => {
        this.visible = true;
      });
      this.$forceUpdate();
    },
    cancel() {

    },
    close() {
      this.visible = false;
      this.$emit('update:showAllocateDialog', false);
    },
    submit() {
      this.amountData.applyType = 2;// 类型：部门
      this.amountData.applyId = this.rowData.orgId;// 部门id
      this.amountData.sourcePeriodRuleId = this.periodRuleId;// 部门
      this.amountData.periodRuleId = '';// 新增
      this.amountData.periodRuleDetailList.forEach((data) => {
        data.periodRuleDetailId = '';
        data.periodDetailId = '';
      });
      // // 编辑
      // if (this.selectedRule.periodRuleId) {
      //   this.selectedRule.ruleDetailList.forEach((item) => {
      //     this.amountData.periodRuleDetailList.push({
      //       applyValue: item.applyValue,
      //       ruleDetailId: item.ruleDetailId,
      //     });
      //   });
      // } else { // 新增
      // this.selectedRule.ruleDetailList.forEach((item) => {
      //   this.amountData.periodRuleDetailList.push({
      //     applyValue: item.applyValue,
      //     ruleDetailId: item.ruleDetailId,
      //   });
      // });
      // }

      this.server.addOrUpdateAmount([this.amountData]).then((res) => {
        if (res.code == 200) {
          console.log(res);
        }
      });
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>