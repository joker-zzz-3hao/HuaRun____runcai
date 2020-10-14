<template>
  <div class="tenant-management">
    <div class="operating-area">
      <div class="page-title">过程管理</div>
      <div class="operating-box">
        <el-form ref="ruleForm" :inline="true" class="tl-form-inline">
          <el-form-item>
            <el-select
              v-model="keyWord"
              placeholder="请选择使用范围"
              @change="searchList"
              clearable
            >
              <el-option value="1" label="团队使用">团队使用</el-option>
              <el-option value="2" label="小范围使用">小范围使用</el-option>
              <el-option value="3" label="个人使用">个人使用</el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="tl-btn amt-bg-slip"
          @click="customProcess"
          >新建任务过程</el-button
        >
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
          <el-table v-loading="loading" :data="tableData">
            <el-table-column
              min-width="100px"
              align="left"
              prop="processName"
              label="任务过程"
            ></el-table-column>
            <el-table-column
              min-width="100px"
              align="left"
              prop="indexNumber"
              label="排序"
            ></el-table-column>
            <el-table-column
              min-width="100px"
              align="left"
              prop="processType"
              label="使用范围"
            >
              <template slot-scope="scope">
                <span>{{ processTypeMap[scope.row.processType] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              min-width="100px"
              align="left"
              prop="enable"
              label="状态"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model.trim="scope.row.enable"
                  :active-text="scope.row.enable == 1 ? '启用' : '禁用'"
                  :active-value="1"
                  :inactive-value="0"
                  @change="updateEnable(scope.row)"
                  class="tl-switch"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              min-width="100px"
              align="left"
              prop="createTime"
              label="创建时间"
            >
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
            <el-table-column
              width="130px"
              fixed="right"
              align="left"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="editProcess(scope.row)"
                  size="small"
                  >编辑</el-button
                >
              </template>
            </el-table-column>
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
    <tl-edit-process
      v-if="showEditProcessDialog"
      :exist.sync="showEditProcessDialog"
      :server="server"
      :processObj="processObj"
      :optionType="optionType"
      @closeDialog="closeDialog"
    ></tl-edit-process>
  </div>
</template>

<script>
import editProcess from './components/editProcess';
import tlAddProcess from './components/addProcess';
import Server from './server';

const server = new Server();

export default {
  name: 'dataDictionary',
  components: {
    tlAddProcess,
    tlEditProcess: editProcess,
  },
  data() {
    return {
      server,
      showCustomProcess: false,
      showEditProcessDialog: false,
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
      processTypeMap: {
        1: '团队使用',
        2: '小范围使用',
        3: '个人使用',
      },
    };
  },
  created() {
    this.searchList();
  },
  methods: {
    searchList() {
      const params = {};
      params.processType = this.keyWord;
      params.currentPage = this.currentPage;
      params.pageSize = this.pageSize;
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
      // 需要刷新则刷新页面;
      this.searchList();
      this.showCustomProcess = false;
    },
    editProcess(process) {
      this.processObj = process;

      this.showEditProcessDialog = true;
    },
    updateEnable(row) {
      this.server.updateEnable(row).then((res) => {
        if (res.code == 200) {
          if (res.data === false) {
            this.$xwarning({
              title: '您当前任务过程有任务项，不可禁用',
              content: '',
            });
          }
          this.searchList();
        }
      });
    },
    // *********************************************************

    closeDialog(data) {
      // 需要刷新则刷新页面;
      if (data.refreshPage) {
        this.searchList();
      }
      this.showCustomProcess = false;
      this.showEditProcessDialog = false;
      this.showinfo = false;
    },
    clear() {
      this.searchList();
    },
  },
};
</script>