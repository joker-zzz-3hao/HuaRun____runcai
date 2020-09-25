<template>
  <div class="home">
    <div v-if="!showReal" class="show-pic">
      <div v-if="showpage == 'myTask'" class="pic-myTask">
        <div class="handle-assign" @click="handleAssign"></div>
        <div class="click-week" @click="showpage = 'allweekly'"></div>
        <div class="task-search" @click="showpage = 'tasksearch'"></div>
        <!-- <img src="~@/assets/images/demoPic/myTask.png" /> -->
      </div>
      <div @click="showpage = 'myTask'" v-else-if="showpage == 'allweekly'" class="pic-allweekly"></div>
      <div @click="showpage = 'myTask'" v-else-if="showpage == 'tasksearch'" class="pic-tasksearch"></div>
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
    </template>
    <tl-assignment
      ref="assignment"
      v-if="existAssignment"
      :existAssignment.sync="existAssignment"
      :server="server"
    ></tl-assignment>
    <tl-createtask
      ref="createtask"
      v-if="existCreatetask"
      :existAssignment.sync="existCreatetask"
      :server="server"
    ></tl-createtask>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import searchbar from './components/searchbar';
import assignment from './components/assignment';
import createTask from './components/createTask';
import Server from './server';

const server = new Server();

export default {
  name: 'myTask',
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-searchbar': searchbar,
    'tl-assignment': assignment,
    'tl-createtask': createTask,
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
      existCreatetask: false,
      showpage: 'myTask',
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
      this.existCreatetask = true;
      this.$nextTick(() => {
        this.$refs.createtask.show();
      });
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
  background-size: 100%;
  /* background-size: cover; */
  height: calc(100vh);
}
.pic-allweekly {
  background: url("~@/assets/images/demoPic/allweekly.png") no-repeat;
  background-size: 100%;
  height: calc(100vh);
}
.pic-tasksearch {
  background: url("~@/assets/images/demoPic/tasksearch.png") no-repeat;
  background-size: 101%;
  height: calc(100vh);
}
.handle-assign {
  position: absolute;
  right: 150px;
  top: 1px;
  width: 100px;
  height: 22px;
  cursor: pointer;
}
.click-week {
  position: absolute;
  right: 27px;
  top: 1px;
  width: 80px;
  height: 22px;
  cursor: pointer;
}
.task-search {
  position: absolute;
  right: 41px;
  top: 59px;
  width: 114px;
  height: 48px;
  cursor: pointer;
}
</style>