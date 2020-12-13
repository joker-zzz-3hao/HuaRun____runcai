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
          <dt>当前剩余可分配'{{ remainAmount.ruleName }}'数量：</dt>
          <dd
            v-for="item in remainAmount.periodRuleDetailList"
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
            ><el-input
              v-model="item.applyValue"
              @input="inputChange(item)"
              @blur="inputChange(item)"
            ></el-input
            ><span>个</span>
            <span v-if="item.showError">{{ item.errorText }}</span>
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
    amountDataCopy: {
      type: Array,
      default() {
        return [];
      },
    },
    periodId: {
      type: String,
      default() {
        return '';
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
      remainAmount: {
        ruleName: '',
        periodRuleDetailList: [],
      },
      detailList: [],
    };
  },
  created() { },
  mounted() { this.init(); },
  computed: {},
  methods: {
    init() {
      this.title = `分配绩效名额（${this.rowData.orgName}）`;
      this.amountDataList = this.deepCopy(this.amountDataCopy);
      this.periodRuleId = this.amountDataList[0].periodRuleId;
      this.detailList = JSON.parse(this.rowData.detail);
      console.log('detailList', this.detailList);
      console.log('amountDataList', this.amountDataList);
      this.getUnApplyNumber();
      // 将设置过得列显示在页面中（未设置的，初始化为0）
      this.setInitData();
      this.setFirstList(this.periodRuleId);
      this.$forceUpdate();
    },
    setInitData() {
      this.amountDataList.forEach((element) => {
        element.periodRuleDetailList.forEach((data) => {
          data.applyValue = 0;
          data.showError = false;
          data.errorText = '';
        });
        this.detailList.forEach((detail) => {
          if (detail.sourcePeriodRuleId == element.periodRuleId) { // 列数据跟下拉框数据匹配 // 设置数量数据与下拉框选中项匹配
            element.periodRuleDetailList.forEach((data) => {
              detail.periodRuleDetailList.forEach((detailChild) => {
                if (data.ruleDetailId == detailChild.ruleDetailId) { // 已设置的数据赋值给输入框
                  data.applyValue = detailChild.applyValue || 0;// 已分配的数量赋值
                }
              });
            });
          }
        });
      });
    },
    getUnApplyNumber() {
      this.server.getUnApplyNumber({
        periodRuleId: this.periodRuleId,
        periodId: this.periodId,
      }).then((res) => {
        if (res.code == 200) {
          // eslint-disable-next-line prefer-destructuring
          this.remainAmount = res.data[0] || {
            ruleName: '',
            periodRuleDetailList: [],
          };
        }
      });
    },
    dataChange(periodRuleId) {
      this.periodRuleId = periodRuleId;
      this.setFirstList(this.periodRuleId);
      this.getUnApplyNumber();
    },
    setFirstList(periodRuleId) {
      this.amountData.periodRuleId = '';
      this.amountDataList.forEach((element) => {
        if (element.periodRuleId == periodRuleId) {
          this.amountData = { ...element };

          // this.amountDataList.forEach((item) => {
          //   this.detailList.forEach((detail) => {
          //     if (detail.sourcePeriodRuleId == item.periodRuleId && item.periodRuleId == periodRuleId) {
          //       debugger;
          //       this.amountData.periodRuleId = periodRuleId;
          //     }
          //   });
          // });
        }
      });
    },
    show() {
      this.$nextTick(() => {
        this.visible = true;
      });
      this.$forceUpdate();
    },
    inputChange(amountItem) {
      this.amountData.periodRuleDetailList.forEach((element1) => {
        if (element1.periodRuleDetailId == amountItem.periodRuleDetailId) {
          this.remainAmount.periodRuleDetailList.forEach((element2) => {
            if (element2.periodRuleDetailId == amountItem.periodRuleDetailId) {
              // 1、正整数数字
              if (!(/(^[0-9]\d*$)/.test(Number(amountItem.applyValue)))) {
                element1.showError = true;
                element1.errorText = '请填写正整数';
              } else if (amountItem.applyValue > element2.applyValue) { // 2、分配的数值大小，不能大于剩余可用数量
                element1.showError = true;
                element1.errorText = '数量不能大于剩余数量';
              } else {
                element1.showError = false;
                element1.errorText = '';
              }
            }
          });
        }
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
      this.amountData.sourcePeriodRuleId = this.periodRuleId;
      this.amountData.periodRuleDetailList.forEach((data) => {
        data.periodRuleDetailId = '';
        data.periodDetailId = '';
      });
      // 校验表单
      for (let i = 0; i < this.amountData.periodRuleDetailList.length; i += 1) {
        const element = this.amountData.periodRuleDetailList[i];
        if (element.showError) {
          this.$message.error('填写数据错误，请修改后重试。');
          return;
        }
      }
      this.server.addOrUpdateAmount([this.amountData]).then((res) => {
        if (res.code == 200) {
          this.$message.success('成功');
          this.$emit('refreshPage');
          this.close();
        }
      });
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>