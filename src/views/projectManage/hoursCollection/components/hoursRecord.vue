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
  <tl-crcloud-table :isPage="false">
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table">
            <el-table-column prop="userName" label="姓名" min-width="140">

            </el-table-column>
            <el-table-column label="级别" min-width="120">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.projectUserType == '1'"
                  :class="{ 'is-focus': scope.row.projectUserType == '1' }"
                >
                  <i class="el-icon-medal"></i>
                  <span>项目经理</span>
                </div>
                <div
                  v-else-if="scope.row.projectUserType == '0'"
                  @click="setManager(scope.row)"
                >
                  <el-tooltip
                    effect="dark"
                    placement="top"
                    popper-class="tl-tooltip-popper"
                  >
                    <div slot="content">设置项目经理</div>
                    <span class="can-click">
                      <i class="el-icon-medal"></i>
                      <span>--</span>
                    </span>
                  </el-tooltip>
                </div>
                <div v-else>--</div>
              </template>
            </el-table-column>
            <el-table-column prop="userLevelName" label="职能" min-width="120">
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.userLevelName)">{{
                  scope.row.userLevelName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="orgName" label="所属公司" min-width="160">
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.orgName)">{{
                  scope.row.orgName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="userPostName" label="工时时间范围" min-width="180">
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.userPostName)">{{
                  scope.row.userPostName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="createDate" label="补录工时(天)" min-width="180">
              <template >
               <el-input style="width:50px"></el-input>
              </template>
            </el-table-column>
   <el-table-column prop="createDate" label="工时内容" min-width="180">
              <template >
               <el-input placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100"

            >
              <template >
                <el-button

                  type="text"
                  class="tl-btn"
                  >移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button type="text" >添加成员</el-button>
        </div>
    </tl-crcloud-table>
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
      <el-button type="primary" class="tl-btn amt-bg-slip" @click="approval"
        >提交</el-button
      >

  </el-dialog>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import CONST from '../../const';

export default {
  name: 'approval',
  comments: {
    'tl-crcloud-table': crcloudTable,
  },
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
      tableData: [],
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
  mounted() {},
  methods: {
    show() {
      this.visible = true;
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
