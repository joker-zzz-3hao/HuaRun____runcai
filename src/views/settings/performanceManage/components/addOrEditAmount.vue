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
    :close-on-click-modal="false"
  >
    <span>{{
      "请线下确认“" + selectedRule.ruleName + "”总数量，再进行设置"
    }}</span>
    <div>
      <div v-for="item in selectedRule.ruleDetailList" :key="item.ruleDetailId">
        <span>{{ item.value + item.unit }}</span
        ><el-input v-model="item.applyValue"></el-input><span>个</span>
      </div>
    </div>
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

  },
  data() {
    return {
      visible: false,
      loading: false,
      formData: {
        // ruleId: '',
        // applyId: '1', // 1-租户；2-部门；3-个人
        // periodId: '',
        periodRuleDetailList: [

        ],
      },
    };
  },
  created() { },
  mounted() {},
  computed: {},
  methods: {
    show(selectedRule, searchForm, tenantId) {
      this.formData.periodId = searchForm.periodId;
      this.formData.applyId = tenantId;
      console.log(selectedRule);
      this.selectedRule = { ...selectedRule };
      if (selectedRule.periodRuleId) {
        this.formData.ruleId = selectedRule.ruleId;
        this.selectedRule.ruleDetailList = [...selectedRule.periodRuleDetailList];
      } else {
        this.formData.ruleId = searchForm.ruleId;
        this.selectedRule.ruleDetailList.forEach((item) => {
          this.$set(item, 'applyValue', '');
        });
      }
      this.$nextTick(() => {
        this.visible = true;
      });
      this.$forceUpdate();
    },
    cancel() {

    },
    close() {
      this.visible = false;
      this.$emit('update:showDialog', false);
    },
    submit() {
      this.formData.applyType = 1;
      this.selectedRule.ruleDetailList.forEach((item) => {
        this.formData.periodRuleDetailList.push({
          applyValue: item.applyValue,
          ruleDetailId: item.ruleDetailId,
        });
      });
      this.server.addOrUpdateAmount([this.formData]).then((res) => {
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