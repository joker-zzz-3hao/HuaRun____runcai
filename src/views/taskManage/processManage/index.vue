<template>
  <div class="tenant-management">
    <div class="operating-area">
      <div class="page-title">任务管理</div>
      <div class="operating-box">
        <el-form ref="ruleForm" :inline="true" class="tl-form-inline">
          <el-form-item>
            <el-input
              v-model="keyWord"
              placeholder="输入字典编号/名称"
              maxlength="50"
              class="tl-input-search"
              @keyup.enter.native="searchList"
              clearable
              @clear="clear"
            >
              <i class="el-icon-search" slot="prefix" @click="searchList"></i>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="tl-btn amt-bg-slip"
          @click="customProcess"
        >新建任务过程</el-button>
      </div>
    </div>
    <div class="cont-area">
      <crcloud-table
        :total="total"
        :pageSize.sync="pageSize"
        :currentPage.sync="currentPage"
        @searchList="searchList"
      >
        <div slot="tableContainer" class="table-container">
          <el-table ref="dicTable" v-loading="loading" :data="tableData">
            <el-table-column min-width="100px" align="left" prop="processName" label="任务过程"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="indexNumber" label="排序"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="processType" label="使用范围"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="available" label="状态"></el-table-column>
            <el-table-column min-width="100px" align="left" prop="createTime" label="创建时间">
              <template slot-scope="scope">
                <div>
                  {{
                  scope.row.createTime
                  ? dateFormat(
                  "YYYY-mm-dd HH:MM:SS",
                  new Date(scope.row.createTime)
                  )
                  : "--"
                  }}
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column width="130px" fixed="right" align="left" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="editProcess(scope.row)" size="small">编辑</el-button>
              </template>
            </el-table-column>-->
          </el-table>
        </div>
      </crcloud-table>
    </div>
    <tl-add-process
      ref="customProcess"
      :optionType="optionType"
      :processObj="processObj"
      @closeAddProcess="closeAddProcess"
      v-if="showCustomProcess"
    ></tl-add-process>
    <!-- <tl-edit-process
      v-if="showEditProcessDialog"
      :exist.sync="showEditProcessDialog"
      :server="server"
      :processObj="processObj"
      :optionType="optionType"
      @closeDicDialog="closeDicDialog"
    ></tl-edit-process>-->
  </div>
</template>

<script>
// import editProcess from './components/editProcess';
import tlAddProcess from './components/addProcess';
import Server from './server';

const server = new Server();

export default {
  name: 'dataDictionary',
  components: {
    tlAddProcess,
    // tlEditProcess: editProcess,
  },
  data() {
    return {
      server,
      showCustomProcess: false,
      // showEditProcessDialog: false,
      processObj: {},
      showinfo: false,
      keyWord: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      loading: false,
      // codeId: '',
      optionType: 'create',
    };
  },
  created() {
    this.searchList();
  },
  methods: {
    searchList(params = { currentPage: 1 }) {
      params.currentPage = this.currentPage;
      params.pageSize = this.pageSize;
      params.keyWord = this.keyWord;
      this.loading = true;
      this.server.queryTaskProcessList(params).then((res) => {
        if (res.code == 200) {
          this.total = res.data.total;
          this.currentPage = res.data.currentPage;
          this.pageSize = res.data.pageSize;
          this.tableData = res.data.content;
        }
        this.loading = false;
      });
    },
    customProcess(process) {
      this.optionType = 'create';
      if (process && process.processId) {
        this.optionType = 'edit';
        this.processObj = process;
        this.processId = process.processId;
      }
      this.showCustomProcess = true;
      this.$nextTick(() => {
        this.$refs.customProcess.show();
      });
    },
    closeAddProcess() {
      this.showCustomProcess = false;
    },
    // editProcess(dic) {
    //   if (dic.codeId) {
    //     this.codeId = String(dic.codeId);
    //     this.optionType = 'edit';
    //   } else {
    //     this.optionType = 'add';
    //   }
    //   this.showEditProcessDialog = true;
    // },

    // *********************************************************

    deleteDic(dic) {
      this.$confirm('是否确认删除该数据？，删除将无法恢复').then(() => {
        this.server.deleteDic({ codeId: dic.codeId }).then((res) => {
          if (res.code == 200) {
            this.$message.success('删除成功');
            this.searchList();
          }
        });
      });
    },
    closeDicDialog(data) {
      // 需要刷新则刷新页面;
      if (data.refreshPage) {
        this.searchList();
      }
      this.showCustomProcess = false;
      // this.showEditProcessDialog = false;
      this.showinfo = false;
    },
    clear() {
      this.searchList();
    },
  },
};
</script>