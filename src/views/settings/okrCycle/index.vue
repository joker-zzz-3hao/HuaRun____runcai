<template>
  <div class="okr-cycle">
    <div class="operating-area">
      <div class="operating-box">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addOkr"
          class="tl-btn amt-bg-slip"
          v-if="hasPower('tenant-period-add')"
          >添加周期</el-button
        >
      </div>
    </div>
    <div class="cont-area">
      <tl-crcloud-table
        :total="totalpage"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="getTableList"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table">
            <el-table-column
              prop="periodName"
              label="OKR周期名称"
              min-width="240"
            >
              <template slot-scope="scope">
                <em>{{ scope.row.periodName }}</em>
                <span v-if="scope.row.checkStatus == '1'">默认周期</span>
              </template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间" min-width="120">
              <template slot-scope="scope">
                <em v-if="scope.row.startTime">{{
                  dateFormat("YYYY-mm-dd", new Date(scope.row.startTime))
                }}</em>
                <em v-else>--</em>
              </template>
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间" min-width="120">
              <template slot-scope="scope">
                <em v-if="scope.row.endTime">{{
                  dateFormat("YYYY-mm-dd", new Date(scope.row.endTime))
                }}</em>
                <em v-else>--</em>
              </template>
            </el-table-column>
            <el-table-column
              prop="draftingStartTime"
              label="起草开始时间"
              min-width="120"
            >
              <template slot-scope="scope">
                <em v-if="scope.row.draftingStartTime">{{
                  dateFormat(
                    "YYYY-mm-dd",
                    new Date(scope.row.draftingStartTime)
                  )
                }}</em>
                <em v-else>--</em>
              </template>
            </el-table-column>
            <el-table-column
              prop="approvalEndTime"
              label="审批结束时间"
              min-width="120"
            >
              <template slot-scope="scope">
                <em v-if="scope.row.approvalEndTime">{{
                  dateFormat("YYYY-mm-dd", new Date(scope.row.approvalEndTime))
                }}</em>
                <em v-else>--</em>
              </template>
            </el-table-column>
            <el-table-column
              prop="selfAssessReminderTime"
              label="自评举证时间"
              min-width="120"
            >
              <template slot-scope="scope">
                <em v-if="scope.row.selfAssessReminderTime">{{
                  dateFormat(
                    "YYYY-mm-dd",
                    new Date(scope.row.selfAssessReminderTime)
                  )
                }}</em>
                <em v-else>--</em>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="checkStatus" label="状态" min-width="120">
              <template slot-scope="scope">
                <el-switch
                  v-model.trim="scope.row.periodType"
                  :active-text="scope.row.periodType==1?'启用':'禁用'"
                  active-value="1"
                  inactive-value="0"
                  @change="addOrUpdate(scope.row)"
                  class="tl-switch"
                ></el-switch>
              </template>
            </el-table-column>-->
            <el-table-column fixed="right" label="操作" width="60">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="updateOkr(scope.row)"
                  v-if="hasPower('tenant-period-add')"
                  class="tl-btn"
                  >编辑</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <tl-add-okr-cycle
            :exist.sync="exist"
            v-if="exist"
            :title="title"
            @getTableList="getTableList"
          ></tl-add-okr-cycle>
          <tl-put-okr-cycle
            :exist.sync="existPut"
            v-if="existPut"
            :title="title"
            :updateData.sync="updateData"
            @getTableList="getTableList"
          ></tl-put-okr-cycle>
        </div>
      </tl-crcloud-table>
    </div>
  </div>
</template>

<script>
import global from '@/mixin/global';
import crcloudTable from '@/components/crcloudTable';
import addOkrCycle from './components/addOkrCycle';
import putOkrCycle from './components/putOkrCycle';
import Server from './server';

const server = new Server();
export default {
  name: 'okrCycle',
  components: {
    'tl-add-okr-cycle': addOkrCycle,
    'tl-put-okr-cycle': putOkrCycle,
    'tl-crcloud-table': crcloudTable,
  },
  mixins: [global],
  data() {
    return {
      tableData: [],
      server,
      exist: false,
      existPut: false,
      title: '',
      updateData: '',
      pageSize: 10,
      currentPage: 1,
      pageSizes: 1,
      totalpage: 0,
    };
  },
  created() {
    this.getTableList();
  },
  methods: {
    addOrUpdate(row) {
      this.server.addOrUpdate({
        periodId: row.periodId,
        periodType: row.periodType,
      }).then((res) => {
        if (res.code == 200) {
          this.getTableList();
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getTableList() {
      this.server.okrQuery({
        pageSize: this.pageSize,
        currentPage: this.currentPage,
      }).then((res) => {
        this.tableData = res.data.content;
        this.totalpage = res.data.total;
      });
    },
    addOkr() {
      this.title = '添加周期';
      this.exist = true;
    },
    updateOkr(row) {
      this.title = '编辑周期';
      this.existPut = true;
      this.updateData = JSON.parse(JSON.stringify(row));
    },
    statusList(row) {
      this.$confirm('是否确认修改状态', '状态确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.addOrUpdate(row);
      }).catch(() => {
        this.getTableList();
      });
    },
  },

};
</script>