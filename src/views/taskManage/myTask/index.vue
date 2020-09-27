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
      <el-input
        placeholder="输入任务标题"
        v-model="searchMsg"
        maxlength="50"
        clearable
        class="tl-input-search"
        @keyup.enter.native="getTableList"
      >
        <i class="el-icon-search" slot="prefix" @click="getTableList"></i
      ></el-input>
      <!-- 更多筛选 -->
      <div @click="showSearchBar">
        展开更多筛选
        <i :class="arrowClass"></i>
      </div>
      <div v-show="arrowClass == 'el-icon-caret-bottom'">
        <!-- 筛选标签 -->
        <div style="display: flex">
          <span>所有筛选</span>
          <div
            class="searchblock"
            v-for="(item, index) in searchList"
            :key="index"
          >
            <span>{{ item.name }}</span>
            <i class="el-icon-error" @click.stop="clearNode(index)"></i>
          </div>
        </div>
        <dl style="display: flex">
          <dt>任务过程</dt>
          <dd
            class="searchblock"
            :class="{ selected: item.isSelected }"
            v-for="(item, index) in taskProcessList"
            :key="index"
          >
            <span @click="switchParent(item)">{{ item.label }}</span>
          </dd>
        </dl>
        <dl style="display: flex">
          <dt>任务步骤</dt>
          <dd
            class="searchblock"
            :class="{ selected: item.isSelected }"
            v-for="(item, index) in childCateList"
            :key="index"
          >
            <span @click="selectStatus(item)">{{ item.label }}</span>
          </dd>
        </dl>
        <dl>
          <dt>确认接收</dt>
          <dd>
            <el-radio-group v-model="accept" @change="getTableList">
              <el-radio-button :label="true">已确认</el-radio-button>
              <el-radio-button :label="false">未确认</el-radio-button>
            </el-radio-group>
          </dd>
        </dl>
      </div>
    </div>
    <!-- <div>
      <tl-searchbar></tl-searchbar>
    </div> -->
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
                @click="handleAssign(scope.row.taskId)"
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
import assignment from './components/assignment';
import createTask from './components/createTask';
import editTask from './components/editTask';
import Server from './server';

const server = new Server();

export default {
  name: 'myTask',
  components: {
    'tl-crcloud-table': crcloudTable,
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
      // 筛选
      tabMenuList: [
        { menuName: '全部' },
        { menuName: '我收到的' },
        { menuName: '我创建的' },
        { menuName: '我的草稿' },
      ],
      currentIndex: 0,
      searchMsg: '',
      arrowClass: 'el-icon-caret-top',
      searchList: [],
      taskProcessList: [],
      taskProcess: {}, // 选择的任务过程
      taskStatus: {}, // 选择的任务状态
      processList: [], // 过程列表
      childCateList: [{
        label: '全部', value: null, isSelected: true,
      }],
      accept: null,
    };
  },
  created() {
    this.getTableList();
    this.getProcess();
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
        taskTitle: this.searchMsg,
        psList: this.searchList,
        accept: this.accept,
      };
      this.server.searchMyTask(params).then((res) => {
        this.tableData = res.data.content;
        this.totalpage = res.data.total;
        this.currentPage = res.data.currentPage;
        this.pageSize = res.data.pageSize;
      });
    },
    getProcess() {
      this.server.queryProcess().then((res) => {
        if (res.code == 200) {
          this.processList = res.data;
          this.taskProcessList.push({
            label: '全部',
            value: 'all',
            isSelected: true,
            childCateList: [
              { label: '全部', value: null, isSelected: true },
            ],
          });
          this.processList.forEach((item) => {
            this.taskProcessList.push({
              label: item.processName,
              value: item.processId,
              isSelected: false,
              childCateList: [],
            });
          });
        }
      });
    },
    handleAccept() {

    },
    handleAssign(id) {
      this.existAssignment = true;
      this.$nextTick(() => {
        this.$refs.assignment.show(id);
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
    // 筛选栏
    borderSlip(item, index) {
      const borderWidth = document.querySelector('.border-slip');
      const selfLeft = document.querySelectorAll('.tab-list li')[index].offsetLeft;
      const liWidth = document.querySelectorAll('.tab-list li');
      borderWidth.style.left = `${selfLeft}px`;
      borderWidth.style.width = `${liWidth[index].offsetWidth}px`;
      this.currentIndex = index;
      this.getTableList();
    },
    showSearchBar() {
      if (this.arrowClass == 'el-icon-caret-top') {
        this.arrowClass = 'el-icon-caret-bottom';
      } else {
        this.arrowClass = 'el-icon-caret-top';
      }
    },
    clearNode(index) {
      this.searchList.splice(index, 1);
    },
    switchParent(parentCate) {
      // 查任务步骤
      this.childCateList = [];
      const params = {
        available: 1,
        processId: parentCate.value,
      };
      this.server.queryProcessStep(params).then((res) => {
        if (res.code == 200 && res.data) {
          const stepList = res.data;
          this.childCateList.push(
            { label: '全部', value: null, isSelected: true },
          );
          stepList.forEach((item) => {
            this.childCateList.push({
              label: item.stepName,
              value: item.stepId,
              isSelected: false,
            });
          });
        }
      });
      this.taskProcess = parentCate;
      this.resetIsSelected(this.taskProcessList);
      parentCate.isSelected = true;
      for (const item of this.taskProcessList) {
        if (item.value == parentCate.value) {
          this.resetIsSelected(item.childCateList, 'init');
        }
      }
    },
    selectStatus(childCate) {
      this.resetIsSelected(this.childCateList);
      childCate.isSelected = true;
      if (this.taskProcess.value == 'all') {
        this.searchList = [];
      } else {
        this.searchList.push({
          name: `${this.taskProcess.label}-${childCate.label}`,
          processId: this.taskProcess.value,
          processName: this.taskProcess.label,
          stepId: childCate.value,
          stepName: childCate.label,
        });
      }
    },
    resetIsSelected(list, init) {
      if (init == 'init') {
        for (let i = 0; i < list.length; i += 1) {
          if (i == 0) {
            list[i].isSelected = true;
          } else {
            list[i].isSelected = false;
          }
        }
      } else {
        for (const item of list) {
          item.isSelected = false;
        }
      }
    },
  },
  watch: {
    searchList: {
      handler() {
        this.getTableList();
      },
      deep: true,
    },
  },
};
</script>
<style scoped>
.searchblock {
  background-color: #f4f6f8;
  margin: 0px 16px;
}
</style>