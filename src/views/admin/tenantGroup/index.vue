<template>
  <div class="dictionary-management">
    <div class="operating-area">
      <div class="operating-box">
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="tl-btn amt-bg-slip"
          @click="addOrEditGroup"
          >创建租户群组</el-button
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
          <el-table ref="dicTable" v-loading="loading" :data="tableData">
            <el-table-column
              min-width="100px"
              align="left"
              prop="code"
              label="租户群组"
            ></el-table-column>
            <el-table-column
              min-width="100px"
              align="left"
              prop="name"
              label="创建时间"
            ></el-table-column>
            <el-table-column
              width="130px"
              fixed="right"
              align="left"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="setTenant(scope.row)"
                  size="small"
                  >管理租户</el-button
                >
                <el-button
                  type="text"
                  @click="editGroup(scope.row)"
                  size="small"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="deleteGroup(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcloud-table>
    </div>
    <tl-add-edit-group
      ref="addOrEditGroup"
      v-if="showAddOrEditGroup"
      :exist.sync="showAddOrEditGroup"
      :server="server"
      :codeId="codeId"
      :optionType="optionType"
      @closeAddEditDialog="closeAddEditDialog"
    ></tl-add-edit-group>
    <tl-set-tenant
      ref="setTenant"
      v-if="showDicDialog"
      :server="server"
      :codeId="codeId"
      :optionType="optionType"
      @closeDicDialog="closeDicDialog"
    ></tl-set-tenant>
  </div>
</template>

<script>
import setTenant from './components/setTenant';
import addOrEditGroup from './components/addOrEditGroup';
import Server from './server';

const server = new Server();

export default {
  name: 'dataDictionary',
  components: {
    'tl-add-edit-group': addOrEditGroup,
    'tl-set-tenant': setTenant,
  },
  data() {
    return {
      server,
      showDicDialog: false,
      showAddOrEditGroup: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      loading: false,
      codeId: '',
      optionType: 'add',
    };
  },
  created() {
    this.searchList();
  },
  methods: {
    searchList(page) {
      const params = {};
      if (this.hasPower('sys-dictionary-list')) {
        params.currentPage = this.currentPage;
        params.pageSize = this.pageSize;
        if (page == 'newPage') {
          params.currentPage = 1;
        }
        this.loading = true;
        this.server.queryOfPage(params).then((res) => {
          if (res.code == 200) {
            this.total = res.data.total;
            this.currentPage = res.data.currentPage;
            this.pageSize = res.data.pageSize;
            this.tableData = res.data.content;
          }
          this.loading = false;
        });
      }
    },
    addOrEditGroup(dic) {
      if (dic.codeId) {
        this.codeId = String(dic.codeId);
        this.optionType = 'edit';
      } else {
        this.optionType = 'add';
      }
      this.showAddOrEditGroup = true;
      this.$nextTick(() => {
        this.$refs.addOrEditGroup.show();
      });
    },
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
    closeAddEditDialog(data) {
      // 需要刷新则刷新页面;
      if (data.refreshPage) {
        this.searchList();
      }
      this.showDicDialog = false;
      this.showAddOrEditGroup = false;
    },
    clear() {
      this.searchList();
    },
  },
};
</script>