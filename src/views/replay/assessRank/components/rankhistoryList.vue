<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    :before-close="close"
    title="历史提交记录"
    :close-on-click-modal="false"
    class="tl-dialog check-judge"
    width="600px"
  >
    <el-table :data="tableData" row-key="id" class="tl-table">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.list">
            <el-table-column prop="date" label="序列"> </el-table-column>
            <el-table-column prop="name" label="部门"> </el-table-column>
            <el-table-column prop="address" label="负责人"> </el-table-column>
            <el-table-column prop="address" label="自评得分"> </el-table-column>
            <el-table-column prop="address" label="复合得分"> </el-table-column>
            <el-table-column prop="address" label="绩效系数分配">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="提交时间"> </el-table-column>
      <el-table-column prop="createUserName" label="负责人"> </el-table-column>
      <el-table-column prop="approvalStatus" label="复核结果">
      </el-table-column>
      <el-table-column prop="updateTime" label="复核时间"> </el-table-column>
      <el-table-column prop="updateUserName" label="复核人"> </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import Server from '../../server';

const server = new Server();

export default {
  name: 'repalyAssessList',
  data() {
    return {
      server,
      tableData: [],
      visible: false,
    };
  },
  methods: {
    show(periodId, resultId) {
      this.visible = true;
      this.server.queryAssessmentHistory({
        periodId,
        resultId,
      }).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data || [];
          this.tableData.forEach((item) => {
            item.list = [];
          });
        }
      });
    },
    close() {
      this.visible = false;
    },
  },

};
</script>

<style>
</style>