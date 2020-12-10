<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @close="close"
    :before-close="close"
    :title="info.projectNameCn"
    :close-on-click-modal="false"
    class="tl-dialog"
    width="900px"
  >

      <tl-crcloud-table
        :total="total"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="searchList"
      >
        <div slot="tableContainer" class="table-container project-members">
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
            >
            </el-table-column>
            <el-table-column prop="applyTime" label="提交人" min-width="170">
              <template slot-scope="scope">
                <span>{{ scope.row.userName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="部门" min-width="200px">
            </el-table-column>
               <el-table-column label="工作项" min-width="200px">
            </el-table-column>
            <el-table-column label="工时投入(天)" min-width="200px">

            </el-table-column>

           <el-table-column
              prop="projectNameCn"
              label="级别"
              min-width="180"
            >

            </el-table-column>

           <el-table-column
              prop="projectNameCn"
              label="职能"
              min-width="180"
            >

            </el-table-column>

           <el-table-column
              prop="projectNameCn"
              label="所属公司"
              min-width="180"
            >
                </el-table-column>

             <el-table-column
              prop="projectNameCn"
              label="部门"
              min-width="180"
            >
                </el-table-column>

             <el-table-column
              prop="projectNameCn"
              label="提交时间"
              min-width="180"
            >

            </el-table-column>

          </el-table>
        </div>
      </tl-crcloud-table>
    <div slot="footer" class="dialog-footer">
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
      <el-button type="primary" class="tl-btn amt-bg-slip" @click="approval"
        >提交</el-button
      >
    </div>
  </el-dialog>
</template>

<script>

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
    };
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
  components: {
    'tl-crcloud-table': crcloudTable,
  },
  mounted() {},
  methods: {
    show() {
      this.visible = true;
    },
    confirmTimeSheet() {
      this.popoverVisible = false;
      this.timeSheet = this.confirmSheet;
      this.remark = this.editRemark;
    },
    approval() {
      this.$xconfirm({
        title: '工时确认后将不可再更改，请确认',
        content: '',
      }).then(() => {
        this.server.approvaledTimeSheetList({
          projectId: this.info.projectId,
          timeSheet: this.timeSheet,
          remark: this.remark,
          sourceId: this.info.sourceId,
          sourceType: this.info.sourceType,
          projectApprovalId: this.info.projectApprovalId,
        }).then((res) => {
          if (res.code == '200') {
            this.$emit('success');
            this.close();
          }
        });
      });
    },
    close() {
      this.visible = false;
    },
  },
  watch: {},
};
</script>
