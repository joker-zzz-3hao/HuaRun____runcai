<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @closed="closed"
    :before-close="close"
    :close-on-click-modal="false"
    class="tl-dialog check-judge"
  >
    <el-table :data="tableData" row-key="id">
      <el-table-column prop="name" label="姓名(部门)"> </el-table-column>
      <el-table-column prop="address" label="绩效排序"> </el-table-column>
      <el-table-column prop="address" label="绩效系数分配"> </el-table-column>
      <el-table-column prop="address" label="调整原因">
        <template slot-scope="">
          <el-input placeholder="请输入调整原因"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-button type="primary" class="tl-btn amt-bg-slip">确认提交</el-button>
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'repalyAssessList',
  data() {
    return {
      tableData: [],
      visible: false,
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
  },

};
</script>

<style>
</style>