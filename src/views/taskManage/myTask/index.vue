<template>
  <div class="home">
    <!-- 按钮组 -->
    <div>
      <el-button @click="goCreateTask">添加任务</el-button>
    </div>
    <!-- 搜索框 -->
    <div class="tl-custom-tabs">
      <div class="tab-menus">
        <ul class="tab-list">
          <li
            v-for="(item, idx) in tabMenuList"
            :key="item.id"
            @click="borderSlip(item, idx)"
            :class="{ 'is-focus': currentIndex === idx }"
          >
            {{ item.menuName }}
          </li>
        </ul>
        <div class="border-slip"></div>
      </div>
      <slot name="tab-cont"></slot>
    </div>
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
          <el-table-column width="80px">
            <template slot-scope="scope">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <i class="el-icon-more el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="deleteTask(scope.row.taskId)"
                    >删除</el-dropdown-item
                  >
                  <el-dropdown-item>任务归档</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown></template
            >
          </el-table-column>
          <el-table-column
            min-width="100px"
            align="left"
            prop="taskTitle"
            label="内容"
          >
            <template slot-scope="scope">
              <a @click="openEdit(scope.row.taskId)">{{
                scope.row.taskTitle
              }}</a>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="createByUserName"
            label="创建人"
          ></el-table-column>
          <el-table-column
            min-width="100px"
            align="left"
            prop="createTime"
            label="创建时间"
          ></el-table-column>
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
          <el-table-column align="left" prop="userName"></el-table-column>
          <el-table-column fixed="right" width="200">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleAccept(scope.row)"
                class="tl-btn"
                >确认接收</el-button
              >
              <el-button
                type="text"
                @click="handleAssign(scope.row)"
                class="tl-btn"
                >确认指派</el-button
              >
              <el-button
                type="text"
                @click="handleMove(scope.row)"
                class="tl-btn"
                >移动</el-button
              >
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
      @success="getTableList"
    ></tl-assignment>
    <tl-createtask
      ref="createtask"
      v-if="existCreatetask"
      :existCreatetask.sync="existCreatetask"
      :server="server"
      @success="getTableList"
    ></tl-createtask>
    <tl-edittask
      ref="editTask"
      v-if="existEditTask"
      :existCreatetask.sync="existEditTask"
      :server="server"
      @success="getTableList"
    ></tl-edittask>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import searchbar from './components/searchbar';
import assignment from './components/assignment';
import createTask from './components/createTask';
import editTask from './components/editTask';
import Server from './server';

const server = new Server();

export default {
  name: 'myTask',
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-searchbar': searchbar,
    'tl-assignment': assignment,
    'tl-createtask': createTask,
    'tl-edittask': editTask,
  },
  data() {
    return {
      server,
      pageSize: 10,
      currentPage: 1,
      totalpage: 0,
      tableData: [],
      showAssignment: false,
      existAssignment: false,
      existEditTask: false,
      showReal: true, // 展示示例图片 false
      existCreatetask: false,
      showpage: 'myTask',
      tabMenuList: [
        { menuName: '全部' },
        { menuName: '我收到的' },
        { menuName: '我创建的' },
        { menuName: '我的草稿' },
      ],
      currentIndex: 0,
    };
  },
  created() {
    this.getTableList();
  },
  mounted() {
    // 状态
    const liWidth = document.querySelectorAll('.tab-list li');
    const selfLeft = document.querySelectorAll('.tab-list li')[0].offsetLeft;
    const borderWidth = document.querySelector('.border-slip');
    borderWidth.style.left = `${selfLeft}px`;
    borderWidth.style.width = `${liWidth[0].offsetWidth}px`;
  },
  methods: {
    getTableList() {
      const params = {

        currentPage: this.currentPage,
        pageSize: this.pageSize,
        selectType: this.currentIndex,
        taskTitle: '',

      };
      this.server.searchMyTask(params).then((res) => {
        this.tableData = res.data.content;
        this.totalpage = res.data.total;
        this.currentPage = res.data.currentPage;
        this.pageSize = res.data.pageSize;
      });
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
    openEdit(id) {
      this.existEditTask = true;
      this.$nextTick(() => {
        this.$refs.editTask.show(id);
      });
    },
    deleteTask(id) {
      this.server.deleteTask({ taskId: id }).then((res) => {
        if (res.code == 200) {
          this.$message.success('删除成功');
          this.getTableList();
        }
      });
    },
    borderSlip(item, index) {
      const borderWidth = document.querySelector('.border-slip');
      const selfLeft = document.querySelectorAll('.tab-list li')[index].offsetLeft;
      const liWidth = document.querySelectorAll('.tab-list li');
      borderWidth.style.left = `${selfLeft}px`;
      borderWidth.style.width = `${liWidth[index].offsetWidth}px`;
      this.currentIndex = index;
      this.getTableList();
    },
  },
};
</script>