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
    title="设置绩效评定体系"
    :close-on-click-modal="false"
  >
    <div>
      <el-form ref="dicForm" :model="formData" label-width="90px">
        <el-form-item
          label="自定义名称"
          v-for="item in formData.amountList"
          :key="item"
        >
          <span>{{ item.ruleName }}</span>
          <el-input
            v-model.trim="item.value"
            maxlength="50"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
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

  },
  data() {
    return {
      visible: false,
      loading: false,
      ruleId: '',
      formData: {
        ruleName: '',
      },
    };
  },
  created() { },
  mounted() {},
  computed: {},
  methods: {
    show(ruleId) {
      this.ruleId = ruleId;
      if (ruleId) {
        this.server.getAmountData({
          ruleId: this.ruleId,
        }).then((res) => {
          if (res.code == 200) {
            this.formData = res.data;
          }
        });
      }
      this.$nextTick(() => {
        this.visible = true;
      });
    },
    cancel() {

    },
    close() {
      this.visible = false;
      this.$emit('update:showDialog', false);
    },
    submit() {
      this.server.addOrUpdateAmount({
        ruleId: '',
      }).then((res) => {
        if (res.code == 200) {
          debugger;
        }
      });
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>