<template>
  <div class="dictionary-management">
    <div class="operating-area">
      <div class="operating-box">
        <el-form
          v-if="hasPower('sys-dictionary-list')"
          ref="ruleForm"
          :inline="true"
          class="tl-form-inline"
          @submit.native.prevent="searchList('newPage')"
        >
          <el-form-item>
            <el-input
              v-model.trim="keyWord"
              placeholder="输入字典编号/名称"
              maxlength="50"
              class="tl-input-search"
              clearable
              @clear="clear"
            >
              <i
                class="el-icon-search"
                slot="prefix"
                @click="searchList('newPage')"
              ></i>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button
          v-if="hasPower('sys_dictionary_update')"
          type="primary"
          icon="el-icon-plus"
          class="tl-btn amt-bg-slip"
          @click="createDic"
          >新增字典</el-button
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
              label="字典编号"
            ></el-table-column>
            <el-table-column
              min-width="100px"
              align="left"
              prop="name"
              label="字典名称"
            ></el-table-column>
            <el-table-column
              min-width="100px"
              align="left"
              prop="enabledFlag"
              label="状态"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.enabledFlag == "Y" ? "启用" : "停用" }}</div>
              </template>
            </el-table-column>
            <el-table-column
              min-width="100px"
              align="left"
              prop="description"
              label="备注"
            ></el-table-column>
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
                  v-if="hasPower('sys_dictionary_update')"
                  type="text"
                  @click="editDic(scope.row)"
                  size="small"
                  >修改</el-button
                >
                <el-button
                  v-if="hasPower('sys-dictionary-detail')"
                  type="text"
                  @click="info(scope.row)"
                  size="small"
                  >详情</el-button
                >
                <el-button
                  v-if="hasPower('sys_dictionary_delete')"
                  type="text"
                  size="small"
                  @click="deleteDic(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcloud-table>
    </div>
    <tl-create-dic
      ref="createDic"
      v-if="showDicDialog"
      :server="server"
      :codeId="codeId"
      :optionType="optionType"
      @closeDicDialog="closeDicDialog"
    ></tl-create-dic>
    <tl-edit-dic
      v-if="showEditDicDialog"
      :exist.sync="showEditDicDialog"
      :server="server"
      :codeId="codeId"
      :optionType="optionType"
      @closeDicDialog="closeDicDialog"
    ></tl-edit-dic>
    <tl-info
      v-if="showinfo"
      :exist.sync="showinfo"
      :title="'详情'"
      :server="server"
      :codeId="codeId"
      @closeDicDialog="closeDicDialog"
    ></tl-info>
  </div>
</template>

<script>
import createDic from './components/createDic';
import editDic from './components/editDic';
import info from './components/info';
import Server from './server';

const server = new Server();

export default {
  name: 'dataDictionary',
  components: {
    'tl-create-dic': createDic,
    'tl-edit-dic': editDic,
    'tl-info': info,
  },
  data() {
    return {
      server,
      showDicDialog: false,
      showEditDicDialog: false,
      showinfo: false,
      keyWord: '',
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
        params.keyWord = this.keyWord;
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
    createDic(dic) {
      if (dic.codeId) {
        this.codeId = String(dic.codeId);
        this.optionType = 'edit';
      } else {
        this.optionType = 'add';
      }
      this.showDicDialog = true;
      this.$nextTick(() => {
        this.$refs.createDic.show();
      });
    },
    editDic(dic) {
      if (dic.codeId) {
        this.codeId = String(dic.codeId);
        this.optionType = 'edit';
      } else {
        this.optionType = 'add';
      }
      this.showEditDicDialog = true;
    },
    info(dic) {
      if (dic.codeId) {
        this.codeId = String(dic.codeId);
      }
      this.showinfo = true;
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
    closeDicDialog(data) {
      // 需要刷新则刷新页面;
      if (data.refreshPage) {
        this.searchList();
      }
      this.showDicDialog = false;
      this.showEditDicDialog = false;
      this.showinfo = false;
    },
    clear() {
      this.searchList();
    },
  },
};
</script>