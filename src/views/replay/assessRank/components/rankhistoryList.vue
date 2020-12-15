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
    <el-table :data="tableData" row-key="resultHistoryId" class="tl-table">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.list">
            <el-table-column prop="sort" label="序号"> </el-table-column>
            <el-table-column prop="orgName" label="部门"> </el-table-column>
            <el-table-column prop="userName" label="负责人"> </el-table-column>
            <el-table-column prop="selfAssessmentScore" label="自评得分">
            </el-table-column>
            <el-table-column prop="finalScore" label="复核得分">
            </el-table-column>
            <!-- 动态 -->
            <el-table-column
              v-for="rule in props.row.ruleDetailContentList"
              :key="rule.applyId"
              :prop="rule.ruleId"
              :label="rule.ruleName"
              min-width="100"
            >
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="提交时间"> </el-table-column>
      <el-table-column prop="createUserName" label="负责人"> </el-table-column>
      <el-table-column prop="approvalStatus" label="复核结果">
        <template slot-scope="props">
          <span>{{
            CONST.APPROVAL_SCORE_STATUS_MAP[props.row.approvalStatus].name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="复核时间">
        <template slot-scope="props">
          <span>{{ props.row.updateTime || "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateUserName" label="复核人">
        <template slot-scope="props">
          <span>{{ props.row.updateUserName || "--" }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import CONST from '../../const';
import Server from '../../server';

const server = new Server();

export default {
  name: 'repalyAssessList',
  data() {
    return {
      CONST,
      server,
      tableData: [],
      visible: false,
      ruleDetailContentList: [],
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
            const summitForm = JSON.parse(item.contentJson);
            item.ruleDetailContentList = summitForm.ruleDetailContentList || [];
            item.list = summitForm.orgResultDetailMapList || [];
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