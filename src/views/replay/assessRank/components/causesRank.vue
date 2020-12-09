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
      tableData: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        list: [{
          id: 31,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        }, {
          id: 32,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        }],
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
      }],

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