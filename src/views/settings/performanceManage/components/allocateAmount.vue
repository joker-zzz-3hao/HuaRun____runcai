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
    <dl v-show="step == 1">
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
          <dt>当前剩余可分配{{ remainAmount.ruleName }}数量：</dt>
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
              @blur="inputChange(item)"
            ></el-input
            ><span>个</span>
            <span v-if="item.showError">{{ item.errorText }}</span>
          </dd>
        </dl>
      </dd>
    </dl>
    <dl v-show="step == 2">
      <dd>
        <dl class="layout-flex">
          <dt>{{ amountData.ruleName }}数量：</dt>
          <dd
            v-for="item in amountData.periodRuleDetailList"
            :key="item.periodRuleDetailId"
            class="layout-flex dd-margin"
          >
            <span>{{ item.value + item.unit }}</span
            ><em>{{ Number(item.applyValue || 0) }}</em
            ><span>个</span>
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
        >{{ step == 1 ? "确认" : "提交" }}</el-button
      >
      <el-button
        :disabled="loading"
        plain
        class="tl-btn amt-border-fadeout"
        @click="cancel"
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
      step: 1,
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
                  data.periodRuleDetailId = detailChild.periodRuleDetailId;
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
      this.amountDataList.forEach((element) => {
        if (element.periodRuleId == periodRuleId) {
          this.amountData = { ...element };
          // 将数值复制一份;
          this.amountData.periodRuleDetailList.forEach((data) => {
            data.applyValueCopy = data.applyValue;
          });
          this.amountData.periodRuleId = '';
          // 如果是新增则提交的periodRuleId为空；否则赋值
          this.detailList.forEach((detail) => {
            if (detail.sourcePeriodRuleId == periodRuleId) {
              this.amountData.periodRuleId = detail.periodRuleId;
            }
          });
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
        if (!this.hasValue(element1.applyValue)) {
          element1.applyValue = 0;
        }
        element1.applyValue = Number(element1.applyValue);
        if (element1.ruleDetailId == amountItem.ruleDetailId) {
          this.remainAmount.periodRuleDetailList.forEach((element2) => {
            if (element2.ruleDetailId == amountItem.ruleDetailId) {
              // 1、正整数数字
              if (!(/(^[0-9]\d*$)/.test(Number(amountItem.applyValue)))) {
                element1.showError = true;
                element1.errorText = '请填写不小于零的整数';
              } else if (!element1.periodRuleId) {
                // 新增：分配的数值大小，不能大于剩余可用数量；
                if (amountItem.applyValue > element2.applyValue) {
                  element1.showError = true;
                  element1.errorText = '剩余数量不够';
                } else {
                  element1.showError = false;
                  element1.errorText = '';
                }
              } else if (element1.periodRuleId) {
                // 编辑：新增的数据不能大于剩余的数量
                if (amountItem.applyValue - amountItem.applyValueCopy > element2.applyValue) {
                  element1.showError = true;
                  element1.errorText = '剩余数量不够';
                } else {
                  element1.showError = false;
                  element1.errorText = '';
                }
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
      if (this.step == 2) {
        this.step = 1;
        this.title = `分配绩效名额（${this.rowData.orgName}）`;
        return;
      }
      if (this.step == 1) {
        this.close();
      }
    },
    close() {
      this.visible = false;
      this.$emit('update:showAllocateDialog', false);
    },
    submit() {
      this.amountData.applyType = 2;// 类型：部门
      this.amountData.applyId = this.rowData.orgId;// 部门id
      this.amountData.sourcePeriodRuleId = this.periodRuleId;

      // 校验表单
      let validateStatus = true;
      this.amountData.periodRuleDetailList.forEach((element1) => {
        this.remainAmount.periodRuleDetailList.forEach((element2) => {
          if (element1.ruleDetailId == element2.ruleDetailId) {
            // 1、正整数数字
            if (!(/(^[0-9]\d*$)/.test(Number(element1.applyValue)))) {
              element1.showError = true;
              element1.errorText = '请填写不小于零的整数';
              validateStatus = false;
            } else if (!element1.periodRuleId) {
              // 新增：分配的数值大小，不能大于剩余可用数量；
              if (element1.applyValue > element2.applyValue) {
                element1.showError = true;
                element1.errorText = '剩余数量不够';
                validateStatus = false;
              } else {
                element1.showError = false;
                element1.errorText = '';
              }
            } else if (element1.periodRuleId) {
              // 编辑：新增的数据不能大于剩余的数量
              if (element1.applyValue - element1.applyValueCopy > element2.applyValue) {
                element1.showError = true;
                element1.errorText = '剩余数量不够';
                validateStatus = false;
              } else {
                element1.showError = false;
                element1.errorText = '';
              }
            } else {
              element1.showError = false;
              element1.errorText = '';
            }
          }
        });
      });

      const params = this.deepCopy(this.amountData);
      // 新增
      if (!params.periodRuleId) {
        params.periodRuleDetailList.forEach((data) => {
          data.periodRuleDetailId = '';
          data.periodRuleId = '';
        });
      } else {
        params.periodRuleDetailList.forEach((data) => {
          data.periodRuleId = params.periodRuleId;
        });
      }
      // 编辑
      if (validateStatus) {
        if (this.step == 1) {
          this.step = 2;
          this.title = `确认后${this.rowData.orgName}将分配所填数量`;
          return;
        }
        if (this.step == 2) {
          this.server.addOrUpdateOrgAmount([params]).then((res) => {
            if (res.code == 200) {
              this.$message.success('成功');
              this.$emit('refreshPage');
              this.close();
            }
          });
        }
      } else {
        this.$message.error('填写数据错误，请修改后重试。');
      }
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>