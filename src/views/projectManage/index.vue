<template>
  <div class="role-type">
    <div class="operating-area">
      <div class="page-title">项目管理</div>
      <div class="operating-box">
        <el-form ref="ruleForm" :inline="true" class="tl-form-inline">
          <el-form-item>
            <el-input
              maxlength="64"
              @keyup.enter.native="searchManage"
              v-model="keyWord"
              placeholder="请输入项目名称"
              class="tl-input-search"
            >
              <i class="el-icon-search" slot="prefix" @click="searchManage"></i>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addProject"
          class="tl-btn amt-bg-slip"
          >创建虚拟项目</el-button
        >
      </div>
    </div>
    <div class="cont-area">
      <tl-crcloud-table
        :total="total"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="searchManage"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table">
            <el-table-column
              prop="projectName"
              label="项目名称"
              min-width="140"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.projectName">{{
                  scope.row.projectName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="projectName"
              label="所在部门"
              min-width="160"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.projectName">{{
                  scope.row.projectName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="projectStatus"
              label="项目状态"
              min-width="120"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.projectStatus">{{
                  CONST.PROJECT_STATUS_MAP[scope.row.projectStatus]
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="projectType"
              label="项目类型"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.projectType">{{
                  CONST.PROJECT_TYPE_MAP[scope.row.projectType]
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="projectType"
              label="投入类型"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.projectType">{{
                  CONST.PROJECT_TYPE_MAP[scope.row.projectType]
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="applyTime" label="申请时间" min-width="180">
            </el-table-column>
            <el-table-column
              prop="startTime"
              label="开始时间"
              min-width="180"
            ></el-table-column>
            <el-table-column prop="endTime" label="结束时间" min-width="180">
            </el-table-column>
            <el-table-column
              prop="totalAmount"
              label="项目总预算(万)"
              min-width="180"
            ></el-table-column>
            <el-table-column
              prop="totalAmount"
              label="项目成员"
              min-width="180"
            ></el-table-column>
            <el-table-column
              prop="totalAmount"
              label="项目经理"
              min-width="180"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-button @click="manage(scope.row)" type="text" class="tl-btn"
                  >管理</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
    <tl-create-manage
      ref="createUser"
      v-if="showCreateManage"
      :server="server"
    ></tl-create-manage>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import createManage from './components/createManage';
import Server from './server';
import CONST from './const';

const server = new Server();
export default {
  name: 'projectManage',
  data() {
    return {
      CONST,
      server,
      keyWord: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      showCreateManage: false,
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-create-manage': createManage,
  },
  mounted() {},
  methods: {
    searchManage() {},
    addProject() {
      this.showCreateManage = true;
      this.$nextTick(() => {
        this.$refs.createUser.show();
      });
    },
    manage() {},
  },
};
</script>