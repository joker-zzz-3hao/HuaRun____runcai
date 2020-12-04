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
    <div v-show="step == 1">
      <el-form
        ref="dicForm"
        v-for="evaluateItem in evaluateFormList"
        :model="evaluateItem"
        :key="evaluateItem.randomId"
        label-width="90px"
      >
        <el-button
          v-if="this.rowData.ruleId"
          type="text"
          @click="
            evaluateFormList.length > 1 ? deleteEvaluateItem(evaluateItem) : ''
          "
          >删除整个体系</el-button
        >

        <el-form-item label="自定义名称" prop="ruleName">
          <el-input
            v-model.trim="evaluateItem.ruleName"
            maxlength="50"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="自定义体系" prop="ruleName">
          <div
            v-for="(ruleItem, index) in evaluateItem.ruleDetailList"
            :key="ruleItem.detailRandomId"
          >
            <el-input v-model.trim="ruleItem.value"></el-input>
            <el-input v-model.trim="ruleItem.unit"></el-input>
            说明
            <el-input v-model.trim="ruleItem.description"></el-input>
            <el-button
              type="text"
              v-show="evaluateItem.ruleDetailList.length - 1 == index"
              @click="addRuleItem(evaluateItem)"
              >添加</el-button
            >
            <el-button
              type="text"
              @click="
                evaluateItem.ruleDetailList.length > 1
                  ? deleteRuleItem(evaluateItem, ruleItem)
                  : ''
              "
              >删除</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <el-button v-if="this.rowData.ruleId" type="text" @click="addEvaluateItem"
        >添加评定体系</el-button
      >
    </div>
    <div v-show="step == 2">
      <dl v-for="evaluateItem in evaluateFormList" :key="evaluateItem.randomId">
        <dt>{{ evaluateItem.ruleName }}</dt>
        <dd
          v-for="ruleItem in evaluateItem.ruleDetailList"
          :key="ruleItem.detailRandomId"
        >
          <span>{{ ruleItem.value }}</span>
          <span>{{ ruleItem.unit }}</span>
          说明
          <span>{{ ruleItem.description }}</span>
        </dd>
      </dl>
    </div>
    <div class="operating-box">
      <el-button
        :loading="loading"
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="addEvaluate"
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
  name: 'addOrEditEvaluate',
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
    // optionType: {
    //   type: String,
    //   default() {
    //     return 'add';
    //   },
    // },
  },
  data() {
    return {
      visible: false,
      loading: false,
      evaluateFormList: [],
      step: '1',
    };
  },
  created() { this.init(); },
  mounted() {},
  computed: {},
  methods: {
    init() {
      if (this.rowData.ruleId) {
        this.setInitData();
      } else {
        this.addEvaluateItem();
      }
    },
    setInitData() {
      this.evaluateFormList.push(this.rowData);
    },
    addEvaluateItem() {
      this.evaluateFormList.push({
        ruleRandomId: this.getRandomId(),
        ruleName: '',
        ruleDetailList: [{
          // level: 0,
          // ruleDetailId: 0,
          // ruleId: 'string',
          unit: '',
          value: '',
          description: '',
          detailRandomId: this.getRandomId(),
        }],

      });
    },
    deleteEvaluateItem(evaluateItem) {
      this.evaluateFormList = this.evaluateFormList.filter((item) => item.ruleRandomId != evaluateItem.ruleRandomId);
    },
    addRuleItem(evaluateItem) {
      this.evaluateFormList.forEach((item) => {
        if (evaluateItem.ruleRandomId == item.ruleRandomId) {
          item.ruleDetailList.push({
            unit: '',
            value: '',
            description: '',
            detailRandomId: this.getRandomId(),
          });
        }
      });
    },
    deleteRuleItem(evaluateItem, ruleItem) {
      // 编辑时删除的数据需要传给后端TODO:
      this.evaluateFormList.forEach((item) => {
        if (evaluateItem.ruleRandomId == item.ruleRandomId) {
          item.ruleDetailList = item.ruleDetailList.filter((detail) => detail.detailRandomId != ruleItem.detailRandomId);
        }
      });
    },
    addEvaluate() {
      if (this.step == 1) {
        this.step = 2;
      } else {
        this.loading = true;
        let requestName = 'addEvaluate';
        if (this.rowData.ruleId) {
          requestName = 'updateEvaluate';
        }
        this.server[requestName](this.evaluateFormList).then((res) => {
          this.loading = false;
          if (res.code == 200) {
            this.$message.success('成功');
            this.close();
          }
        });
      }
    },
    show() {
      this.visible = true;
    },
    cancel() {
      if (this.step == 1) {
        this.close();
      } else {
        this.step = 1;
      }
    },
    close() {
      this.visible = false;
      this.$emit('update:showDialog', false);
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>