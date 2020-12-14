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
  <tl-crcloud-table
          :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="searchList"
            :total="total"
      >
      <div slot="tableContainer" class="table-container project-members">
         <el-table
            :data="tableData"
            class="tl-table"
            row-key="sourceId"
          >

                   <el-table-column prop="workContent" label="工作项" >
                     <template slot-scope="scope">
                      {{GetLength(scope.row.workContent,20)}}
                      </template>
                </el-table-column>
                 <el-table-column prop="" label="投入工时" width="100px">
                    <template slot-scope="scope">
                     {{ scope.row.arrHide.length * 0.5 }}天
                           </template>
                </el-table-column>
                 <el-table-column prop="" label="工时日期" width="140px">
                    <template slot-scope="scope">
                     <span>{{
                    weekWorkListCheck(scope.row) || "--"
                  }}</span>
                   </template>
                </el-table-column>
            </el-table>
             </div>
      </tl-crcloud-table>
        <div slot="footer" class="dialog-footer ">
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

export default {
  name: 'approval',
  data() {
    return {
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
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
  },
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {},
  mounted() {},
  methods: {
    show(row) {
      this.tableDataRow = row;
      this.searchList();
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
      this.$emit('alertSelectAll');
    },
  },
  watch: {},
};
</script>
