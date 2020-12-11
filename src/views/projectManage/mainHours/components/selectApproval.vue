<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @close="close"
    :before-close="close"
    :close-on-click-modal="false"
    custom-class="approval"
    class="tl-dialog"
    width="620px"
  >
  <tl-crcloud-table
        :total="total"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="searchList"
      >
         <el-table
            :data="tableData"
            class="tl-table"
            @select="selectList"
            @select-all="selectList"
            row-key="sourceId"
          >
            <el-table-column
              :reserve-selection="true"
              type="selection"
              width="55"
              :selectable="
                (row) => {
                  return row.approvalStatus == '1';
                }
              "
            >
                </el-table-column>
                   <el-table-column prop="workContent" label="工作项">
                </el-table-column>
                 <el-table-column prop="" label="投入工时">
                </el-table-column>
                 <el-table-column prop="" label="工时日期">
                </el-table-column>
            </el-table>
      </tl-crcloud-table>
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
      tableData: [{

      }],
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
      this.tableData = row;
      console.log(this.tableData);
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
  },
  watch: {},
};
</script>
