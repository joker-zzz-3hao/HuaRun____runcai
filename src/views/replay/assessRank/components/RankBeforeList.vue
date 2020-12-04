<template>
<el-dialog
    :append-to-body="true"
    :visible="visible"
    @closed="closed"
    :before-close="close"
    title="历史提交记录"
    :close-on-click-modal="false"
  >
    <el-table
    :data="tableData"
    row-key="id"

  >
     <el-table-column type="expand">
      <template slot-scope="props">
          <el-table
    :data="props.row.list"

>
 <el-table-column
      prop="date"
      label="序列"

      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="部门"
      >
    </el-table-column>
    <el-table-column
      prop="address"
      label="负责人">
    </el-table-column>
       <el-table-column
      prop="address"
      label="自评得分">
    </el-table-column>
       <el-table-column
      prop="address"
      label="复合得分">
    </el-table-column>
       <el-table-column
      prop="address"
      label="绩效系数分配">
    </el-table-column>
      </el-table>
          </template>
      </el-table-column>
    <el-table-column
      prop="date"
      label="提交时间"

     >
    </el-table-column>
    <el-table-column
      prop="name"
      label="负责人"

     >
    </el-table-column>
    <el-table-column
      prop="address"
      label="复核结果">
    </el-table-column>
     <el-table-column
      prop="address"
      label="复核时间">
    </el-table-column>
      <el-table-column
      prop="address"
      label="复核人">
    </el-table-column>

  </el-table>
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