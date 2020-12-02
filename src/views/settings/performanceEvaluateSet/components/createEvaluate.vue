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
    width="70%"
  >
    <el-form
      ref="dicForm"
      v-for="evaluateItem in evaluateFormList"
      :model="evaluateItem"
      :key="evaluateItem.randomId"
      label-width="90px"
    >
      <el-button type="text" @click="deleteEvaluateItem(evaluateItem)"
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
          v-for="ruleItem in evaluateItem.ruleDetailList"
          :key="ruleItem.detailRandomId"
        >
          <el-input v-model.trim="ruleItem.value"></el-input>
          <el-input v-model.trim="ruleItem.unit"></el-input>
          说明
          <el-input v-model.trim="ruleItem.description"></el-input>
          <el-button type="text" @click="addRuleItem">添加</el-button>
          <el-button type="text" @click="deleteRuleItem(ruleItem)"
            >删除</el-button
          >
        </div>
      </el-form-item>
    </el-form>
    <el-button type="text" @click="addEvaluateItem">添加评定体系</el-button>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      visible: false,
      evaluateFormList: [],
    };
  },
  created() { this.init(); },
  mounted() {},
  computed: {},
  methods: {
    init() {
      this.addEvaluateItem();
    },
    addEvaluateItem() {
      this.evaluateFormList.push({
        ruleRandomId: this.getRandomId(),
        ruleName: '我是自定义名称',
        ruleDetailList: [{
          // level: 0,
          // ruleDetailId: 0,
          // ruleId: 'string',
          unit: '单位',
          value: '值',
          description: '我是说明',
          detailRandomId: this.getRandomId(),
        }],

      });
    },
    deleteEvaluateItem(evaluateItem) {
      console.log(evaluateItem);
    },
    addRuleItem() {
    },
    deleteRuleItem(ruleItem) {
      console.log(ruleItem);
    },
    show() {
      this.visible = true;
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