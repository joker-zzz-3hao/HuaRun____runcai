<template>
  <div class="home">
    <div v-if="!showReal" class="show-pic">
      <div v-if="changeZhoubao==true" class="pic-myTask" @click="changeZhoubao = false">
        <!-- <img src="~@/assets/images/demoPic/myTask.png" /> -->
      </div>
      <div v-else class="pic-zhoubao" @click="changeZhoubao = true"></div>
    </div>
    <template v-if="showReal">
      <!-- 按钮组 -->
      <div>
        <el-button @click="goCreateTask">添加任务</el-button>
      </div>
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
      <tl-assignment
        ref="assignment"
        v-if="existAssignment"
        :existAssignment.sync="existAssignment"
        :server="server"
      ></tl-assignment>
    </template>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import searchbar from './components/searchbar';
import assignment from './components/assignment';
import Server from './server';

const server = new Server();

export default {
  name: 'myTask',
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-searchbar': searchbar,
    'tl-assignment': assignment,
  },
  data() {
    return {
      server,
      pageSize: 10,
      currentPage: 1,
      pageSizes: 1,
      totalpage: 0,
      tableData: [],
      showAssignment: false,
      existAssignment: false,
      showReal: false, // 展示示例图片 false
      changeZhoubao: true,
    };
  },
  created() {
    this.getTableList();
  },
  methods: {
    getTableList() {
      // this.server.searchTable().then((res) => {
      //   this.tableData = res.data;
      // });
    },
    handleAccept() {

    },
    handleAssign() {
      this.existAssignment = true;
      this.$nextTick(() => {
        this.$refs.assignment.show();
      });
    },
    handleMove() {

    },
    goCreateTask() {
      this.go('goCreateTask');
    },
  },
};
</script>
<style lang="css">
.show-pic {
  /* display: flex;
  flex-direction: column; */
}
/* .pic-one,
.pic-two,
.pic-three {
  flex: 1;
} */
/* .pic-one img,
.pic-two img,
.pic-three img {
  display: inline-block;
  height: auto;
  max-width: 100%;
} */
.pic-myTask {
  background: url("~@/assets/images/demoPic/myTask.png") no-repeat;
  background-size: cover;
  height: 642px;
}
.pic-zhoubao {
  background: url("~@/assets/images/demoPic/zhoubao.png") no-repeat;
  background-size: cover;
  height: 984px;
}
</style>