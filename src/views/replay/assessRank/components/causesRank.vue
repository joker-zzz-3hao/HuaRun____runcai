<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    :before-close="close"
    :close-on-click-modal="false"
    class="tl-dialog causes-rank"
    width="800px"
  >
    <el-scrollbar>
      <el-form ref="dataForm" :model="formData">
        <el-table :data="formData.tableData" row-key="orgId" class="tl-table">
          <el-table-column prop="sort" label="排序"> </el-table-column>
          <el-table-column prop="orgName" label="部门" min-width="150">
            <template slot-scope="props">
              <span>{{ props.row.orgName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="负责人" min-width="100">
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
            <template slot-scope="scope">
                <el-form-item
                  :prop="'tableData.' + scope.$index + '.adjustReason'"
                  :rules="[{required: true, message: '请输入调整原因', trigger: 'blur'}]"
                  >
                  <el-input
                    v-model="scope.row.adjustReason"
                    placeholder="请输入调整原因"
                    class="tl-input"
                  ></el-input>
                </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-scrollbar>
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
      formData: {
        tableData: [],
      },
    };
  },
  props: {
    ruleDetailContentList: {
      type: Array,
    },
    sourceTable: {
      type: Array,
    },

  },
  methods: {
    show(table) {
      this.visible = true;
      this.formData.tableData = table || [];
    },
    close() {
      this.visible = false;
      this.$refs.dataForm.resetFields();
    },

    submit() {
      // 校验
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          // 拼接
          this.sourceTable.forEach((sourceItem) => {
            this.formData.tableData.forEach((item) => {
              if (item.sourceId == sourceItem.sourceId) {
                sourceItem.adjustReason = item.adjustReason;
              }
            });
          });
          this.$emit('success', this.sourceTable);
          this.close();
        }
      });
    },
  },

};
</script>

<style>
.causes-rank .el-dialog__body {
  height: 500px;
}
.causes-rank .el-scrollbar__wrap {
  overflow-x: hidden;
}
.causes-rank .tl-input+.el-form-item__error {
  line-height: 2;
}
</style>