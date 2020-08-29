<template>
  <div class="home">
    <!-- 搜索框 -->
    <div>
      <tl-searchbar></tl-searchbar>
    </div>
    <!-- table -->
    <tl-crcloud-table
      :total="totalpage"
      :currentPage.sync="currentPage"
      :pageSize.sync="pageSize"
      @searchList="getTableList"
    >
      <div slot="tableContainer" class="table-container">
        <el-table :data="tableData" class="tl-table">
          <el-table-column min-width="100px" align="left" prop="title" label="内容"></el-table-column>
          <el-table-column align="left" prop="createUser" label="创建人"></el-table-column>
          <el-table-column min-width="100px" align="left" prop="createTime" label="创建时间"></el-table-column>
          <!-- <el-table-column min-width="100px" align="left">
            <template slot-scope="scope">
              <div>
                <span>创建人：</span>
                <span>{{scope.row.createUser}}</span>
              </div>
              <div>
                <span>创建时间：</span>
                <span>{{scope.row.createTime}}</span>
              </div>
            </template>
          </el-table-column>-->
          <el-table-column align="left" prop="status"></el-table-column>
          <el-table-column align="left" prop="executeUser"></el-table-column>
          <el-table-column fixed="right" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="handleAccept(scope.row)" class="tl-btn">确认接收</el-button>
              <el-button type="text" @click="handleAssign(scope.row)" class="tl-btn">确认指派</el-button>
              <el-button type="text" @click="handleMove(scope.row)" class="tl-btn">移动</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </tl-crcloud-table>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import searchbar from './components/searchbar';
import Server from './server';

const server = new Server();

export default {
  name: 'myTask',
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-searchbar': searchbar,
  },
  data() {
    return {
      server,
      pageSize: 10,
      currentPage: 1,
      pageSizes: 1,
      totalpage: 0,
      tableData: [],
    };
  },
  created() {
    this.getTableList();
  },
  methods: {
    getTableList() {
      this.server.searchTable().then((res) => {
        this.tableData = res.data;
      });
    },
    handleAccept() {

    },
    handleAssign() {

    },
    handleMove() {

    },
  },
};
</script>