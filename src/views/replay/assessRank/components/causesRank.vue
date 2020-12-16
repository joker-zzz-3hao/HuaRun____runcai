<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    :before-close="close"
    :close-on-click-modal="false"
    class="tl-dialog check-judge"
    width="800px"
  >
    <el-table :data="tableData" row-key="orgId" class="tl-table">
      <el-table-column prop="sort" label="排序"> </el-table-column>
      <el-table-column prop="orgName" label="部门" min-width="200">
        <template slot-scope="props">
          <span>{{ props.row.orgName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="负责人" min-width="200">
      </el-table-column>
      <!-- 动态 -->
      <el-table-column
        v-for="rule in ruleDetailContentList"
        :key="rule.applyId"
        :prop="rule.ruleId"
        :label="rule.ruleName"
        min-width="100"
      >
      </el-table-column>
      <el-table-column prop="address" label="调整原因" min-width="200">
        <template slot-scope="">
          <el-input placeholder="请输入调整原因"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="tl-btn amt-bg-slip" @click="submit"
        >确认提交</el-button
      >
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'replayAssessList',
  data() {
    return {
      visible: false,
    };
  },
  props: {
    ruleDetailContentList: {
      type: Array,
    },
    tableData: {
      type: Array,
    },

  },
  methods: {
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    submit() {
      this.$emit('success');
      this.close();
    },
  },

};
</script>

<style>
</style>