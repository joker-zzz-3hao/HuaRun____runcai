<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    :before-close="close"
    :close-on-click-modal="false"
    class="tl-dialog check-judge"
    width="1000px"
  >
    <div class="dl-list-group">
      <!-- 第一次提交 -->
      <dl class="dl-item">
        <dt>组织</dt>
        <dd>{{ row.orgName }}</dd>
      </dl>
      <dl>
        <dt>负责人</dt>
        <dd>{{ row.userName }}</dd>
      </dl>
      <dl>
        <dt>提交时间</dt>
        <dd>{{ row.submitTime }}</dd>
      </dl>
      <dl>
        <dt>是否已线下沟通</dt>
        <dd>{{ CONST.COMMUN_MAP[row.enableCommunicate || 1] }}</dd>
      </dl>
      <!-- 第二次提交  -->
      <template v-if="row.reviewTime">
        <dl>
          <dt>复核结果</dt>
          <dd>
            {{
              CONST.APPROVAL_SCORE_STATUS_MAP[row.approvalStatus || "1"].name
            }}
          </dd>
        </dl>
        <dl>
          <dt>复核人</dt>
          <dd>{{ row.updateBy || "--" }}</dd>
        </dl>
        <dl>
          <dt>绩效复核时间</dt>
          <dd>{{ row.reviewTime || "--" }}</dd>
        </dl>
        <dl v-if="row.approvalMsg" class="dismiss-reason">
          <dt>驳回原因</dt>
          <dd>{{ row.approvalMsg }}</dd>
        </dl>
        <dl class="open-history">
          <dt @click="openHistory">历史提交记录》</dt>
        </dl>
      </template>
    </div>

    <el-table :data="tableData" class="tl-table">
      <el-table-column prop="sort" label="序号"> </el-table-column>
      <el-table-column prop="orgName" label="部门"> </el-table-column>
      <el-table-column prop="userName" label="负责人"> </el-table-column>
      <el-table-column prop="selfAssessmentScore" label="自评得分">
      </el-table-column>
      <el-table-column prop="finalScore" label="复核得分"> </el-table-column>
      <!-- 动态 -->
      <el-table-column
        v-for="rule in ruleDetailContentList"
        :key="rule.applyId"
        :prop="rule.ruleId"
        :label="rule.ruleName"
        min-width="100"
      >
      </el-table-column>
      <el-table-column prop="adjustReason" label="调整原因" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.adjustReason || "--" }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer" v-if="row.approvalStatus == 2">
      <el-button type="primary" @click="sumbit" class="tl-btn amt-bg-slip"
        >确定</el-button
      >
      <el-button plain @click="refuse" class="tl-btn amt-border-fadeout"
        >驳回</el-button
      >
    </div>
    <tl-assess-refuse
      ref="assessrefuse"
      @success="sumbitAssess"
    ></tl-assess-refuse>
    <rank-history-list ref="beforeList"></rank-history-list>
  </el-dialog>
</template>

<script>
import assessRefuse from './assessRefuse';
import rankhistoryList from './rankhistoryList';
import CONST from '../../const';
import Server from '../../server';

const server = new Server();
export default {
  name: 'replayAssessList',
  data() {
    return {
      CONST,
      server,
      visible: false,
      dialogType: 'detail',
      row: {
        approvalStatus: 1,
      },
      sortMsg: {},
      ruleDetailContentList: [],
      tableData: [],
      propList: [],
      propData: '',
    };
  },
  props: {
    periodId: {
      type: String,
      default: '',
    },
  },
  components: {
    'tl-assess-refuse': assessRefuse,
    'rank-history-list': rankhistoryList,
  },
  mounted() {
  },
  methods: {
    show(row, type) {
      this.visible = true;
      this.dialogType = type;
      this.row = row;
      this.queryList();
    },
    close() {
      this.visible = false;
    },
    sumbit() {
      this.$xconfirm({
        title: '',
        content: '确认后，部门将按照当前绩效结果分配',
      }).then(() => {
        this.sumbitAssess('', 3);
      });
    },
    refuse() {
      this.$nextTick(() => {
        this.$refs.assessrefuse.show();
      });
    },
    sumbitAssess(remark, status) {
      console.log('sumbitAssess', remark, status);
      this.server.submitApproval({
        approvalMsg: remark,
        approvalStatus: status,
        resultId: this.row.resultId,
        periodId: this.periodId,
        orgId: this.row.orgId,
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success(status == 3 ? '已同意' : '已驳回');
          this.$emit('success');
          this.close();
        }
      });
    },
    queryList() {
      this.server.querySort({
        periodId: this.periodId,
        orgId: this.row.orgId,
      }).then((res) => {
        if (res.code == 200) {
          this.sortMsg = res.data;
          this.ruleDetailContentList = this.sortMsg.ruleDetailContentList || [];
          this.tableData = res.data.orgResultDetailMapList;
          this.propList = this.ruleDetailContentList.map((rule) => rule.ruleId);
          // eslint-disable-next-line max-len
          this.propData = res.data.orgResultDetailDynamicColumns;
          console.log(this.propData);
        }
      });
    },
    openHistory() {
      this.$refs.beforeList.show(this.periodId, this.sortMsg.resultId);
    },
  },
};
</script>

<style>
</style>