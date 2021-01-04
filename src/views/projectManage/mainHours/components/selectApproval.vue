<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @close="close"
    title="工时确认后将不可再更改，请确认审批"
    :before-close="close"
    :close-on-click-modal="false"
    class="tl-dialog"
    width="820px"
  >
    <em class="mon-title">本次确认人力成本</em>
    <tl-crcloud-table :isPage="false">
      <div slot="tableContainer" class="table-container project-members">
        <el-table :data="tableData" row-key="sourceId" border>
          <el-table-column prop="submissionHours" label="投入工时">
            <template slot-scope="scope">
              {{ scope.row.timeSum || "--" }}
            </template>
          </el-table-column>
          <el-table-column prop="" label="共计人力成本(人民币)" width="180px">
            <template slot-scope="scope">
              {{
                scope.row.externalCurrentCost + scope.row.internalCurrentCost
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="内部顾问人力成本(人民币)"
            width="210px"
          >
            <template slot-scope="scope">
              <span v-if="hasValue(scope.row.internalCurrentCost)">{{
                scope.row.internalCurrentCost
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="外部顾问人力成本(人民币)"
            width="210px"
          >
            <template slot-scope="scope">
              <span v-if="hasValue(scope.row.externalCurrentCost)">{{
                scope.row.externalCurrentCost
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </tl-crcloud-table>
    <em class="mon-title">确认后，项目成本变化预估</em>
    <tl-crcloud-table :isPage="false">
      <div slot="tableContainer" class="table-container project-members">
        <el-table :data="tableData" row-key="sourceId" border>
          <el-table-column prop="workContent" label="共计预估人力成本">
            <template slot-scope="scope">
              <span
                v-if="
                  hasValue(
                    scope.row.externalConsultants + scope.row.internalConsultant
                  )
                "
                >{{
                  scope.row.externalConsultants + scope.row.internalConsultant
                }}</span
              >
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="内部顾问预估人力成本(人民币)"
            width="280px"
          >
            <template slot-scope="scope">
              <span v-if="hasValue(scope.row.internalConsultant)">{{
                scope.row.internalConsultant
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="外部顾问预估人力成本(人民币)"
            width="280px"
          >
            <template slot-scope="scope">
              <span v-if="hasValue(scope.row.externalConsultants)">{{
                scope.row.externalConsultants
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </tl-crcloud-table>
    <!-- <tl-crcloud-table
      :currentPage.sync="currentPage"
      :pageSize.sync="pageSize"
      @searchList="searchList"
      :total="total"
    >
      <div slot="tableContainer" class="table-container project-members">
        <el-table :data="tableData" class="tl-table" row-key="sourceId">
          <el-table-column prop="workContent" label="工作项">
            <template slot-scope="scope">
              {{ GetLength(scope.row.workContent, 20) }}
            </template>
          </el-table-column>
          <el-table-column prop="" label="投入工时" width="100px">
            <template slot-scope="scope">
              {{ scope.row.arrHide.length * 0.5 }}天
            </template>
          </el-table-column>
          <el-table-column prop="" label="工时日期" width="140px">
            <template slot-scope="scope">
              <span>{{ weekWorkListCheck(scope.row) || "--" }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </tl-crcloud-table> -->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="tl-btn amt-bg-slip" @click="approval"
        >确认审批</el-button
      >
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
// import process from '@/components/process';
import crcloudTable from '@/components/crcloudTable';
import CONST from '../../const';
import Server from '../../server';

const server = new Server();
export default {
  name: 'approval',
  data() {
    return {
      server,
      CONST,
      visible: false,
      popoverVisible: false,
      loading: false,
      timeSheet: 0.5,
      confirmSheet: 0.5,
      info: {},
      remark: '',
      editRemark: '',
      textDay: '',
      day: '',
      week: '',
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableDataRow: [],
      type: '',
      scope: {},
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
  },
  computed: {},
  mounted() {},
  methods: {
    queryProjectCost() {
      console.log(this.tableDataRow);
      const userList = this.tableDataRow.map((item) => ({
        userId: item.userId,
        timeSum: item.timeSheet,
        ldapType: item.ldapType,
      }));
      this.server.queryProjectCost({
        projectId: this.$route.query.projectId,
        userList,
      }).then((res) => {
        console.log(res);
        this.tableData = [res.data];
      });
    },
    show(row, type, time, scope) {
      this.type = type;
      this.scope = scope;
      if (type == 'change') {
        console.log(time);
        this.tableDataRow = row;
        this.tableDataRow[0].timeSheet = time.length * 0.5;
        console.log(this.tableDataRow);
      } else {
        this.tableDataRow = row;
      }

      // this.searchList();
      this.queryProjectCost();
      this.visible = true;
    },
    searchList() {
      const list = this.getPageTable(this.tableDataRow, this.currentPage, this.pageSize);
      this.tableData = list.list;
      this.total = list.total;
    },
    close() {
      this.visible = false;
    },
    GetLength(text, max) {
      if (this.getBLen(text) >= max) {
        const str = JSON.parse(JSON.stringify(text));
        return `${str.substring(0, max)}`;
      }
      return text;
    },
    getBLen(str) {
      if (str == null) return 0;
      if (typeof str != 'string') {
        str += '';
      }
      // eslint-disable-next-line no-control-regex
      return str.replace(/[^\x00-\xff]/g, '01').length;
    },
    weekWorkListCheck(row) {
      const listFiler = row.weekWorkList.filter((item) => item.weekTimeAfter != '0');
      const list = listFiler.map((item) => `${item.weekDate.split('-')[1]}月${item.weekDate.split('-')[2]}日`);
      const checkList = [...new Set(list)];
      return checkList.join(',');
    },
    approval() {
      const { type } = this;
      console.log(this.scope);
      if (type == 'change') {
        this.$emit('alertSelectChange', this.scope, this.scope.row.remark);
      } else if (type == 'one') {
        this.$emit('alertSelectOne', this.tableDataRow[0]);
      } else {
        this.$emit('alertSelectAll');
      }
    },
  },
  watch: {},
};
</script>
<style scoped="">
.mon-title {
  padding: 20px 0;
  display: block;
  font-weight: bold;
  font-size: 16px;
}
</style>