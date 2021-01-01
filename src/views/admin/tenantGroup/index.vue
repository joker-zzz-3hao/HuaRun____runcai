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
      <crcloud-table @searchList="searchList" :isPage="false">
        <div slot="tableContainer" class="table-container">
          <el-table ref="dicTable" v-loading="loading" :data="tableData">
            <el-table-column
              min-width="100px"
              align="left"
              prop="groupName"
              label="租户群组"
            ></el-table-column>
            <el-table-column
              min-width="100px"
              align="left"
              prop="createTime"
              label="创建时间"
            ></el-table-column>
            <el-table-column
              width="150px"
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
                  @click="addOrEditGroup(scope.row)"
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
      @closeDialog="closeDialog"
    ></tl-add-edit-group>
    <tl-set-tenant
      ref="setTenant"
      v-if="showSetTenantDialog"
      :server="server"
      :codeId="codeId"
      :optionType="optionType"
      @closeDialog="closeDialog"
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
      showSetTenantDialog: false,
      showAddOrEditGroup: false,
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
            this.tableData = res.data;
          }
          this.loading = false;
        });
      }
    },
    addOrEditGroup(group) {
      this.showAddOrEditGroup = true;
      this.$nextTick(() => {
        this.$refs.addOrEditGroup.show(group);
      });
    },
    deleteGroup(grpup) {
      this.$confirm('是否确认删除该群组？').then(() => {
        this.server.deleteGroup({ groupId: grpup.groupId }).then((res) => {
          if (res.code == 200) {
            this.$message.success('删除成功');
            this.searchList();
          }
        });
      });
    },
    setTenant(group) {
      this.showSetTenantDialog = true;
      this.$nextTick(() => {
        this.$refs.setTenant.show(group);
      });
    },
    closeDialog(data) {
      // 需要刷新则刷新页面;
      if (data.refreshPage) {
        this.searchList();
      }
      this.showSetTenantDialog = false;
      this.showAddOrEditGroup = false;
    },
    clear() {
      this.searchList();
    },
  },
};
</script>