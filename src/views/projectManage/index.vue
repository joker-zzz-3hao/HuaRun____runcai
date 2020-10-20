<template>
  <div class="project-manage">
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
              prop="projectNameCn"
              label="项目名称"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.projectNameCn">{{
                  scope.row.projectNameCn
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="projectManager"
              label="项目经理"
              min-width="160"
            ></el-table-column>
            <el-table-column
              prop="projectBudget"
              label="项目总预算(元)"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="projectCurrency"
              label="币种"
              min-width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.projectCurrency">{{
                  projectCurrency
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="projectBeginDate"
              label="开始时间"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="projectEndDate"
              label="结束时间"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              prop="projectApplyDepName"
              label="申请部门"
              min-width="160"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.projectApplyDepName">{{
                  scope.row.projectApplyDepName
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
                  scope.row.projectType
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
                <span v-if="scope.row.projectStatus">
                  <i
                    :class="{
                      'el-icon-basketball': scope.row.projectStatus == '0',
                      'el-icon-basketball': scope.row.projectStatus == '1',
                    }"
                  ></i>
                  {{ CONST.PROJECT_STATUS_MAP[scope.row.projectStatus] }}</span
                >
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="projectInputType"
              label="投入类型"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.projectInputType">{{
                  scope.row.projectInputType
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="projectApplyDate"
              label="申请时间"
              min-width="180"
            >
            </el-table-column>

            <el-table-column
              prop="projectUserCount"
              label="项目成员(位)"
              min-width="120"
            ></el-table-column>

            <el-table-column fixed="right" label="操作" width="50">
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
      @success="addSuccess"
    ></tl-create-manage>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
      isTalent: false,
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-create-manage': createManage,
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  mounted() {
    this.searchManage();
  },
  methods: {
    searchManage() {
      this.isTalent = false;
      this.userInfo.roleList.forEach((item) => {
        if (item.roleCode == 'TENANT_ADMIN') {
          this.isTalent = true;
        }
      });
      const param = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        projectName: this.keyWord,
        userAccount: this.isTalent ? '' : this.userInfo.userAccount,
      };
      this.server.projectPageList(param).then((res) => {
        if (res.code == '200') {
          this.tableData = res.data.content;
          this.total = res.data.total;
        }
      });
    },
    addProject() {
      this.showCreateManage = true;
      this.$nextTick(() => {
        this.$refs.createUser.show();
      });
    },
    addSuccess() {
      this.showCreateManage = false;
      this.currentPage = 1;
      this.searchManage();
    },
    manage(data) {
      this.$router.push({
        name: 'projectDetail',
        query: {
          projectId: data.projectId,
        },
      });
    },
  },
};
</script>