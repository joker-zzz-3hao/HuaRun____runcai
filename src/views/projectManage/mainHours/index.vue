<template>
  <div class="role-type">
    <div class="operating-area">
      <div class="page-title">工时审批</div>
      <div class="operating-box">
        <el-form ref="ruleForm" :inline="true" class="tl-form-inline">
          <el-form-item>
            <el-select
              v-model="formData.projectCode"
              :popper-append-to-body="false"
              placeholder="请选择项目"
              @change="changeProject"
              clearable
              class="tl-select"
            >
              <el-option
                v-for="(item, index) in projectList"
                :key="index + item.projectCode"
                :label="item.projectName"
                :value="item.projectCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="formData.status"
              :popper-append-to-body="false"
              placeholder="请选择审批状态"
              @change="changeStatus"
              clearable
              class="tl-select"
            >
              <el-option
                v-for="(item, index) in statusList"
                :key="index + item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <span>项目总预算:</span>
            <span>324万</span>
            <span>人民币</span>
          </el-form-item>
          <el-form-item>
            <span>项目已确认人力成本:</span>
            <span>324万</span>
            <span>人民币</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="cont-area">
      <tl-crcloud-table
        :total="total"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="searchList"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table">
            <el-table-column prop="applyTime" label="填报人" min-width="180">
            </el-table-column>
            <el-table-column
              prop="startTime"
              label="开始时间"
              min-width="180"
            ></el-table-column>
            <el-table-column prop="endTime" label="工作项" min-width="180">
            </el-table-column>
            <el-table-column
              prop="projectName"
              label="项目名称"
              min-width="180"
            >
            </el-table-column>
            <el-table-column
              prop="totalAmount"
              label="提交日期"
              min-width="180"
            ></el-table-column>
            <el-table-column
              prop="totalAmount"
              label="审批日期"
              min-width="180"
            ></el-table-column>
            <el-table-column
              prop="totalAmount"
              label="审批人"
              min-width="180"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status == '0'"
                  @click="approval(scope.row)"
                  type="text"
                  class="tl-btn"
                  >审批</el-button
                >
                <el-button
                  v-if="scope.row.status == '1'"
                  @click="detail(scope.row)"
                  type="text"
                  class="tl-btn"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
    <tl-approval
      ref="approval"
      v-if="showApproval"
      :server="server"
      @approvalSuccess="approvalSuccess"
    ></tl-approval>
    <tl-approval-detail
      ref="approvalDetail"
      v-if="showApprovalDetail"
      :server="server"
    ></tl-approval-detail>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import approval from './components/approval';
import approvalDetail from './components/approvalDetail';
import Server from '../server';
import CONST from '../const';

const server = new Server();
export default {
  name: 'mainHours',
  data() {
    return {
      CONST,
      server,
      keyWord: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      showApproval: false,
      showApprovalDetail: false,
      statusList: [],
      tableData: [
        {
          applyTime: '陈翔',
          status: '0',
          totalAmount: '2020-09-09',
          projectName: '云门户',
          list: [
            {
              id: '0', workContent: '润才操作文档', status: '40', startDate: '2020-09-09', endDate: '2020-10-10', totalTime: '45', times: '42', remark: '撒打算打算打算的撒', content: '投入45天投入45天投入45天投入45天投入45天投入45天投入45天',
            },
            {
              id: '1', workContent: '润才操作文档', status: '40', startDate: '2020-09-09', endDate: '2020-10-10', totalTime: '45', times: '', remark: '撒打算打算打算的撒', content: '投入45天投入45天投入45天投入45天投入45天投入45天投入45天',
            },
          ],
        },
        {
          applyTime: '陈翔',
          status: '1',
          totalAmount: '2020-09-09',
          projectName: '行云',
          list: [
            {
              id: '0', workContent: '润才操作文档', status: '40', startDate: '2020-09-09', endDate: '2020-10-10', totalTime: '45', times: '42', remark: '撒打算打算打算的撒', content: '投入45天投入45天投入45天投入45天投入45天投入45天投入45天',
            },
            {
              id: '1', workContent: '润才操作文档', status: '40', startDate: '2020-09-09', endDate: '2020-10-10', totalTime: '45', times: '', remark: '撒打算打算打算的撒', content: '投入45天投入45天投入45天投入45天投入45天投入45天投入45天',
            },
          ],

        },
        {
          applyTime: '陈翔',
          status: '0',
          totalAmount: '2020-09-09',
          projectName: '云门户',
          list: [
            {
              id: '0', workContent: '润才操作文档', status: '40', startDate: '2020-09-09', endDate: '2020-10-10', totalTime: '45', times: '42', remark: '撒打算打算打算的撒', content: '投入45天投入45天投入45天投入45天投入45天投入45天投入45天',
            },
            {
              id: '1', workContent: '润才操作文档', status: '40', startDate: '2020-09-09', endDate: '2020-10-10', totalTime: '45', times: '42', remark: '撒打算打算打算的撒', content: '投入45天投入45天投入45天投入45天投入45天投入45天投入45天',
            },
          ],
        },
      ],
      projectList: [],
      formData: {
        projectCode: '',
        status: '',
      },
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-approval': approval,
    'tl-approval-detail': approvalDetail,
  },
  props: {},
  mounted() {},
  methods: {
    searchList() {},
    changeProject(data) {
      console.log(data);
    },
    changeStatus(data) {
      console.log(data);
    },
    approval(data) {
      this.showApproval = true;
      this.$nextTick(() => {
        this.$refs.approval.show(data);
      });
    },
    detail(data) {
      this.showApprovalDetail = true;
      this.$nextTick(() => {
        this.$refs.approvalDetail.show(data);
      });
    },
    approvalSuccess() {},
  },
  watch: {},
};
</script>