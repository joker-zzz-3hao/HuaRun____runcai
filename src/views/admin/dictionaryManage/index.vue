<template>
  <div class="data-dictionary">
    <div>数据字典</div>
    <crcloud-table
      :total="total"
      :pageSize.sync="pageSize"
      :currentPage.sync="currentPage"
      @searchList="searchList"
    >
      <div slot="searchBar">
        <el-form @keyup.enter.native="searchList()">
          <el-form-item>
            <el-input v-model="keyWord" placeholder="输入字典编号/名称" maxlength="50" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="actionBar">
        <div>
          <el-button @click="createDic">新增字典</el-button>
        </div>
        <div>
          <el-button @click="searchList">查询</el-button>
        </div>
      </div>
      <div slot="tableContainer">
        <el-table ref="dicTable" v-loading="loading" :data="tableData">
          <el-table-column min-width="100px" align="left" prop="code" label="字典编号"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="name" label="字典名称"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="enabledFlag" label="状态">
            <template slot-scope="scope">
              <div>{{scope.row.enabledFlag == "Y" ? '启用' : '停用'}}</div>
            </template>
          </el-table-column>
          <el-table-column min-width="100px" align="left" prop="description" label="备注"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="createTime" label="创建时间"></el-table-column>
          <el-table-column width="100px" align="left" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editDic(scope.row)">修改</el-button>
              <el-button type="text" @click="deleteDic(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </crcloud-table>
    <tl-create-dic
      ref="createDic"
      v-if="showDicDialog"
      :server="server"
      :codeId="codeId"
      :optionType="optionType"
      @closeDicDialog="closeDicDialog"
    ></tl-create-dic>
    <el-drawer
      :modal="false"
      :append-to-body="false"
      :visible.sync="showEditDicDialog"
      v-if="showEditDicDialog"
      title="编辑字典"
      :before-close="closeDicDialog"
    >
      <tl-edit-dic
        v-if="showEditDicDialog"
        :server="server"
        :codeId="codeId"
        :optionType="optionType"
        @closeDicDialog="closeDicDialog"
      ></tl-edit-dic>
    </el-drawer>
  </div>
</template>

<script>
import createDic from './components/createDic';
import editDic from './components/editDic';
import Server from './server';

const server = new Server();

export default {
  name: 'dataDictionary',
  components: {
    'tl-create-dic': createDic,
    'tl-edit-dic': editDic,
  },
  data() {
    return {
      server,
      showDicDialog: false,
      showEditDicDialog: false,
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
    searchList(params = { currentPage: 1 }) {
      params.currentPage = this.currentPage;
      params.pageSize = this.pageSize;
      params.keyWord = this.keyWord;
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
    },
  },
};
</script>