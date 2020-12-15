<template>
  <div class="replay-list">
    <div class="operating-box">
      <dl class="dl-item">
        <dt>周期</dt>
        <dd>
          <el-select
            :disabled="periodIdList.length == 0"
            v-model.trim="periodId"
            placeholder="请选择目标周期"
            :popper-append-to-body="false"
            @change="assessment"
            popper-class="tl-select-dropdown"
            class="tl-select"
          >
            <el-option
              :label="item.periodName"
              :value="item.periodId"
              v-for="(item, index) in periodIdList"
              :key="index"
            ></el-option>
          </el-select>
        </dd>
      </dl>
    </div>
    <div class="cont-area">
      <div>
        <span>部门总数</span>
        <em>{{ sortMsg.orgSum || 0 }}</em>
        <span>待复核</span>
        <em>{{ sortMsg.orgSum - sortMsg.reviewedOrgSum || 0 }}</em>
        <dl v-for="rule in ruleDetailContentList" :key="rule.applyId">
          <dt>{{ rule.ruleName }}</dt>
          <dd
            v-for="item in rule.periodRuleDetailList"
            :key="item.ruleDetailId"
          >
            <span>{{ item.value }}{{ item.unit }} </span>
            <em v-if="item.applyValue">（{{ item.applyValue }}个）</em>
          </dd>
        </dl>
      </div>
      <div>
        <span>绩效复核状态</span>
        <em v-if="sortMsg.approvalStatus">{{
          CONST.APPROVAL_SCORE_STATUS_MAP[sortMsg.approvalStatus].name
        }}</em>
        <span>绩效复核时间</span>
        <em>{{ sortMsg.reviewTime || "--" }}</em>
        <span>驳回原因</span>
        <em>{{ sortMsg.approvalMsg || "--" }}</em>
      </div>
      <el-button type="text" @click="showbeforeList"
        >查看历史提交记录</el-button
      >
    </div>
    <div>
      <span>调整绩效排名</span>
      <em
        >你好，部门绩效需等到整体复核结束后，您才可以进行调整，请等待，谢谢！</em
      >
    </div>
    <div class="cont-area">
      <tl-crcloud-table :isPage="false">
        <div slot="tableContainer" class="table-container">
          <el-table
            :data="tableData"
            class="tl-table tableSort"
            row-key="orgId"
          >
            <el-table-column prop="sort" label="排序" min-width="105">
              <template slot-scope="scope">
                <el-button type="text" @click="upGo(tableData, scope.$index)"
                  >向上</el-button
                >
                <el-button type="text" @click="downGo(tableData, scope.$index)"
                  >向下</el-button
                >
              </template>
            </el-table-column>

            <el-table-column
              prop="sort"
              label="序号"
              min-width="65"
            ></el-table-column>
            <el-table-column
              prop="orgName"
              label="部门"
              min-width="170"
            ></el-table-column>

            <el-table-column prop="userName" label="负责人" min-width="100">
            </el-table-column>
            <el-table-column
              prop="selfAssessmentScore"
              label="自评得分"
              min-width="100"
            >
            </el-table-column>
            <el-table-column prop="finalScore" label="复核得分" min-width="100">
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
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
    <div>
      <span>*是否已经确认沟通 </span>
      <el-radio-group v-model.trim="sortMsg.enableCommunicate">
        <el-radio class="tl-radio" v-model="radio" :label="1">已沟通</el-radio>
        <el-radio class="tl-radio" v-model="radio" :label="2">未沟通</el-radio>
      </el-radio-group>
    </div>
    <div>
      <el-button
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="assessmentSave"
        >暂存</el-button
      >

      <!-- :disabled="sortMsg.orgSum != sortMsg.reviewedOrgSum" -->
      <el-button type="primary" class="tl-btn amt-bg-slip" @click="submit"
        >提交</el-button
      >
    </div>
    <rank-history-list ref="beforeList"></rank-history-list>
    <causes-rank ref="causesRank" @success="assessmentSubmit"></causes-rank>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
// eslint-disable-next-line import/no-extraneous-dependencies
import Sortable from 'sortablejs';
import CONST from '../const';
import Server from '../server';
import rankhistoryList from './components/rankhistoryList';
import causesRank from './components/causesRank';

const server = new Server();
export default {
  name: 'replayAssessList',
  components: {
    'tl-crcloud-table': crcloudTable,
    'causes-rank': causesRank,
    'rank-history-list': rankhistoryList,
  },
  data() {
    return {
      CONST,
      radio: '',
      periodIdList: [],
      server,
      periodId: '',
      tableData: [],
      assessmentList: [],
      assessmentMsg: {},
      sortMsg: {},
      ruleDetailContentList: [],
      propList: [],
    };
  },
  mounted() {
    this.getSort();
    this.getOkrCycleList();
  },
  methods: {
    // 查询排名列表接口
    assessment() {
      this.server.assessment({
        periodId: this.periodId,
      }).then((res) => {
        if (res.code == 200) {
          this.queryList();
        }
      });
    },
    queryList() {
      this.server.querySort({
        periodId: this.periodId,
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
    // 调用暂存接口
    assessmentSave() {
      const resultDetailList = this.tableData.map((item) => ({
        resultDetailId: item.resultDetailId,
        type: item.type,
        sourceId: item.orgId,
        periodRuleDetailId: item.periodRuleDetailId,
        sort: item.sort,
      }));
      this.server.assessmentSave({
        resultId: this.sortMsg.resultId,
        periodId: this.periodId,
        enableCommunicate: this.sortMsg.enableCommunicate,
        resultDetailList,
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success('暂存成功');
          this.queryList();
        }
      });
    },
    // 调用提交接口
    assessmentSubmit() {
      this.tableData.forEach((item) => {
        item.sourceId = item.orgId;
      });
      const ruleDetailContentList = this.ruleDetailContentList.map((rule) => ({
        ruleId: rule.ruleId,
        ruleName: rule.ruleName,
      }));
      console.log({
        resultDetailList: this.tableData,
        orgResultDetailMapList: this.tableData,
        ruleDetailContentList,
        resultId: this.sortMsg.resultId,
        periodId: this.periodId,
        enableCommunicate: this.sortMsg.enableCommunicate,
      });
      this.server.assessmentSubmit({
        resultDetailVoList: this.tableData,
        orgResultDetailMapList: this.tableData,
        ruleDetailContentList,
        resultId: this.sortMsg.resultId,
        periodId: this.periodId,
        enableCommunicate: this.sortMsg.enableCommunicate,
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success('提交成功');
          this.queryList();
        }
      });
    },
    getSort() {
      const table = document.querySelector('.el-table__body-wrapper tbody');
      const self = this;
      Sortable.create(table, {
        onEnd({ newIndex, oldIndex }) {
        //  console.log(newIndex, oldIndex);
          const targetRow = self.tableData.splice(oldIndex, 1)[0];
          self.tableData.splice(newIndex, 0, targetRow);

          self.setNewList(self.tableData);
        },
      });
    },
    // 获取后端为数据重新排序
    setNewList(tableData) {
      tableData.forEach((item, index) => {
        this.$set(tableData[index], 'sort', index + 1);
        // 重新赋值系数
        this.$set(tableData[index], this.propList[0], this.propData[index].content);
        this.$set(tableData[index], 'periodRuleDetailId', this.propData[index].periodRuleDetailId);
      });
    },
    setSort() {
      // 表格中需要实现行拖动，所以选中tr的父级元素
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]; // table
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData(dataTransfer) {
          dataTransfer.setData('Text', '');
        },
        onEnd: (evt) => {
          // console.log(this.data) //:data="data" 所有数据
          const targetRow = this.data.splice(evt.oldIndex, 1)[0]; // this.data是表格所有数据
          // console.log(targetRow) // 挪动是单个数据
          this.data.splice(evt.newIndex, 0, targetRow);
          console.log(this.tableData);
        },
      });
    },
    // 获取周期列表数据
    getOkrCycleList() {
      this.server.getOkrCycleList().then((res) => {
        this.periodIdList = res.data;
        this.periodId = this.periodIdList.filter((item) => item.checkStatus == 1)[0].periodId || {};
        this.assessment();
      });
    },
    // 向上移动
    upGo(fieldData, index) {
      if (index != 0) {
        // eslint-disable-next-line prefer-destructuring
        fieldData[index] = fieldData.splice(index - 1, 1, fieldData[index])[0];
      } else {
        fieldData.push(fieldData.shift());
      }
      this.setNewList(fieldData);
    },
    // 向下移动
    downGo(fieldData, index) {
      if (index != fieldData.length - 1) {
        // eslint-disable-next-line prefer-destructuring
        fieldData[index] = fieldData.splice(index + 1, 1, fieldData[index])[0];
      } else {
        fieldData.unshift(fieldData.splice(index, 1)[0]);
      }
      this.setNewList(fieldData);
    },
    // 显示历史列表
    showbeforeList() {
      this.$refs.beforeList.show(this.periodId, this.sortMsg.resultId);
    },
    // 提交
    submit() {
      this.$refs.causesRank.show();
    },
  },

};
</script>

<style>
</style>