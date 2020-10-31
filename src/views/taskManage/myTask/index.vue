<template>
  <div v-if="showpic" class="no-data">
    <div class="task-wait-bg"></div>
    <div class="task-wait-txt">更多功能敬请期待~</div>
  </div>
  <div v-else class="my-task">
    <div class="operating-area">
      <div class="page-title">
        <em v-show="showTask">我的任务</em>
        <em v-show="!showTask">任务汇总</em>
      </div>
      <div class="operating-box">
        <el-button
          type="primary"
          icon="el-icon-folder-checked"
          @click="goCreateTask"
          v-show="showTask"
          class="tl-btn amt-bg-slip"
          >创建任务</el-button
        >
        <el-button
          plain
          @click="toggleState"
          v-show="showTask"
          icon="el-icon-document-add"
          class="tl-btn amt-border-slip"
        >
          <em>任务汇总</em><span class="lines"></span>
        </el-button>
        <el-button
          @click="toggleState"
          plain
          class="tl-btn amt-border-slip"
          v-show="!showTask"
          >返回<span class="lines"></span
        ></el-button>
      </div>
    </div>
    <div class="cont-area" :class="{ 'small-padding': showTask }">
      <div class="tl-custom-tabs" v-show="showTask">
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
          <el-input
            class="tl-input-search"
            placeholder="输入任务标题"
            v-model="searchMsg"
            maxlength="50"
            clearable
            @clear="getTableList"
            @keyup.enter.native="getTableList"
          >
            <i class="el-icon-search" slot="prefix" @click="getTableList"></i
          ></el-input>
          <div @click="showSearchBar" class="unfold-more">
            <span v-if="arrowClass == 'el-icon-caret-bottom'"
              >展开更多筛选</span
            >
            <span v-else>收起更多筛选</span>

            <i :class="arrowClass"></i>
          </div>
          <div class="border-slip"></div>
        </div>
      </div>
      <div class="tl-condition-screening" v-show="showTask">
        <dl
          class="condition-lists tag-lists"
          v-show="arrowClass == 'el-icon-caret-top'"
        >
          <dt>任务过程</dt>
          <dd
            :class="{ 'is-selected': item.isSelected }"
            v-for="(item, index) in taskProcessList"
            :key="index"
          >
            <em @click="switchParent(item)">{{ item.label }}</em>
          </dd>
        </dl>
        <dl
          class="condition-lists tag-lists"
          v-show="arrowClass == 'el-icon-caret-top'"
        >
          <dt>任务步骤</dt>
          <!-- 为了不闪 -->
          <dd v-if="childCateList.length == 0" class="tag-item is-selected">
            全部
          </dd>
          <dd
            class="tag-item"
            :class="{ 'is-selected': item.isSelected }"
            v-for="(item, index) in childCateList"
            :key="index"
          >
            <em @click="selectStatus(item)">{{ item.label }}</em>
          </dd>
        </dl>
        <dl
          class="condition-lists tag-lists"
          v-show="arrowClass == 'el-icon-caret-top'"
        >
          <dt>确认接收</dt>
          <dd
            :class="{ 'is-selected': accept === null }"
            @click="changeAccept(null)"
          >
            全部
          </dd>
          <dd
            :class="{ 'is-selected': accept === true }"
            @click="changeAccept(true)"
          >
            已确认
          </dd>
          <dd
            :class="{ 'is-selected': accept === false }"
            @click="changeAccept(false)"
          >
            待确认
          </dd>
        </dl>
        <dl
          class="condition-lists tag-lists"
          v-show="arrowClass == 'el-icon-caret-top'"
        >
          <dt>执行人</dt>
          <dd v-for="p in searchTaskUser.slice(0, 8)" :key="p">
            <em> {{ userMap[p] }}</em>
            <i
              class="el-icon-close"
              @click.stop="clearPersonNode(searchTaskUser, p)"
            ></i>
          </dd>
          <tl-personmultiple
            :userList="userList"
            v-model="searchTaskUser"
            :showSelect="false"
          ></tl-personmultiple>
        </dl>
        <dl
          class="condition-lists tag-lists"
          v-show="arrowClass == 'el-icon-caret-top'"
        >
          <dt>创建人</dt>
          <dd v-for="p in searchCreateUser.slice(0, 8)" :key="p">
            <em> {{ userMap[p] }}</em>
            <i
              class="el-icon-close"
              @click.stop="clearPersonNode(searchCreateUser, p)"
            ></i>
          </dd>
          <tl-personmultiple
            :userList="userList"
            v-model="searchCreateUser"
            :showSelect="false"
          ></tl-personmultiple>
        </dl>
      </div>
      <tl-crcloud-table
        :total="totalpage"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="getTableList"
        v-show="showTask"
        layout="prev, pager, next, jumper"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table">
            <el-table-column
              align="left"
              prop="taskTitle"
              label="任务"
              min-width="180"
            >
              <template slot-scope="scope">
                <a @click="openEdit(scope.row)">{{ scope.row.taskTitle }}</a>
              </template>
            </el-table-column>
            <el-table-column width="220" align="left" label="创建信息">
              <template slot-scope="scope">
                <div>
                  <p>
                    <i class="el-icon-user"></i>
                    <span>{{ scope.row.createByUserName }}</span>
                  </p>
                  <p>
                    <i class="el-icon-date"></i>
                    <span>{{ scope.row.createTime }}</span>
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              prop="processName"
              label="过程"
              min-width="180"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.processName && scope.row.stepName">
                  <span>{{ scope.row.processName }}</span>
                  <span>-</span>
                  <span>{{ scope.row.stepName }}</span>
                </div>
                <div v-else>未设置任务过程</div>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              prop="taskStatus"
              label="状态"
              width="80"
            >
              <template slot-scope="scope">
                <i
                  :class="
                    ({ 'is-draft': scope.row.taskStatus == '0' },
                    { 'not-confirm': scope.row.taskStatus == '10' },
                    { 'is-confirm': scope.row.taskStatus == '20' })
                  "
                ></i>
                <span>{{ CONST.TASK_STATUS_MAP[scope.row.taskStatus] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="220px"
              align="left"
              prop="userName"
              label="执行信息"
            >
              <template slot-scope="scope">
                <div>
                  <p>
                    <i class="el-icon-user"></i>
                    <span>{{ scope.row.userName || "无执行人" }}</span>
                  </p>
                  <p>
                    <i class="el-icon-date"></i>
                    <span v-if="scope.row.taskBegDate"
                      >{{
                        dateFormat(
                          "YYYY-mm-dd",
                          new Date(scope.row.taskBegDate)
                        )
                      }}~{{
                        dateFormat(
                          "YYYY-mm-dd",
                          new Date(scope.row.taskEndDate)
                        )
                      }}</span
                    >
                    <span v-else>未设置起止时间</span>
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="200" label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button
                  :disabled="
                    !(
                      scope.row.taskStatus == 10 &&
                      scope.row.taskUserId == userInfo.userId
                    )
                  "
                  @click="acceptTask(scope.row.taskId)"
                  plain
                  class="tl-btn amt-border-fadeout"
                  >确认接收</el-button
                >
                <!-- 已确认且执行人不是我 不能编辑-->
                <!-- 未确认且创建人不是我 不能编辑 -->
                <el-button
                  :disabled="canEdit(scope.row)"
                  plain
                  class="tl-btn amt-border-fadeout"
                  @click="openEdit(scope.row)"
                  >编辑</el-button
                >
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      :disabled="scope.row.taskStatus !== 0"
                      @click.native="deleteTask(scope.row.taskId)"
                      >删除</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click.native="filedTask(scope.row.taskId)"
                      :disabled="scope.row.taskProgress != 100"
                      >任务归档</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
      <tl-tasksum
        v-if="!showTask"
        :exist.sync="showTask"
        ref="tasksum"
      ></tl-tasksum>
    </div>
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
      :existEditTask.sync="existEditTask"
      :server="server"
      @success="getTableList"
    ></tl-edittask>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import crcloudTable from '@/components/crcloudTable';
import personMultiple from '@/components/personMultiple';
import assignment from './components/assignment';
import createTask from './components/createTask';
import editTask from './components/editTask';
import taskSum from './components/taskSum';
import CONST from './const';
import Server from './server';

const server = new Server();

export default {
  name: 'myTask',
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-assignment': assignment,
    'tl-createtask': createTask,
    'tl-edittask': editTask,
    'tl-tasksum': taskSum,
    'tl-personmultiple': personMultiple,
  },
  data() {
    return {
      CONST,
      server,
      pageSize: 10,
      currentPage: 1,
      totalpage: 0,
      tableData: [],
      showAssignment: false,
      existAssignment: false,
      existEditTask: false,
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
      arrowClass: 'el-icon-caret-bottom',
      searchList: [],
      taskProcessList: [],
      taskProcess: {}, // 选择的任务过程
      taskStatus: {}, // 选择的任务状态
      processList: [], // 过程列表
      stepList: [],
      childCateList: [],
      accept: null,
      moveProcessId: null,
      showTask: true,
      processVisible: false,
      userList: [], // 执行人列表
      // CreateuserList: [], // 创建人列表
      searchTaskUser: [],
      searchCreateUser: [],
      reformattedArray: [],
      userMap: {},
      keyword: '',
      psList: '',
      weekList: [],
      weekBegin: '',
      weekEnd: '',
      weekName: '',
      showpic: process.env.VUE_APP_PORTAL == 'https://talent.crcloud.com', // 展示图片
    };
  },
  created() {
    if (process.env.VUE_APP_PORTAL != 'https://talent.crcloud.com') {
      this.getTableList();
      this.getProcess();
      this.getUserList();
      this.getWeek();
      if (this.$route.query && this.$route.query.openCreate) {
        this.goCreateTask();
      }
    }
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      orgFullId: (state) => state.orgFullId,
    }),
    filterTask() {
      return this.userList.filter(
        (data) => !this.keyword || data.userName.toLowerCase().includes(this.keyword.toLowerCase()),
      ) || [];
    },
    filterCreate() {
      return this.userList.filter(
        (data) => !this.keyword || data.userName.toLowerCase().includes(this.keyword.toLowerCase()),
      ) || [];
    },

  },
  mounted() {
    // 状态
    if (document.querySelectorAll('.tab-list li')) {
      const liWidth = document.querySelectorAll('.tab-list li');
      const selfLeft = document.querySelectorAll('.tab-list li')[0].offsetLeft;
      const borderWidth = document.querySelector('.border-slip');
      borderWidth.style.left = `${selfLeft}px`;
      borderWidth.style.width = `${liWidth[0].offsetWidth}px`;
    }
  },
  methods: {
    canEdit(row) {
      return (row.taskStatus == 20
                      && row.taskUserId != this.userInfo.userId)
                      || (row.taskStatus == 10
                      && row.createBy != this.userInfo.userId);
    },
    toggleState() {
      this.showTask = !this.showTask;
      this.$nextTick(() => {
        if (this.showTask == false) {
          this.$refs.tasksum.show(this.weekBegin, this.weekEnd);
        }
      });
    },
    handleAssign(id) {
      this.existAssignment = true;
      this.$nextTick(() => {
        this.$refs.assignment.show(id);
      });
    },
    goCreateTask() {
      this.existCreatetask = true;
      this.$nextTick(() => {
        this.$refs.createtask.show();
      });
    },
    openEdit(row) {
      if (row.taskStatus === 0) {
        this.existCreatetask = true;
        this.$nextTick(() => {
          this.$refs.createtask.show(row);
        });
        return;
      }
      this.existEditTask = true;
      this.$nextTick(() => {
        this.$refs.editTask.show(row.taskId, this.canEdit(row));
      });
    },
    getUserList() {
      this.server.listOrgUserPage({ orgFullId: this.orgFullId }).then((res) => {
        if (res.code == 200) {
          this.userList = res.data || [];
          // 生成团队map对象
          this.reformattedArray = this.userList.map(
            (obj) => {
              const rObj = {};
              rObj[obj.userId] = obj.userName;
              Object.assign(this.userMap, rObj);
              return rObj;
            },
          );
        }
      });
    },

    errorHandler() {
      return true;
    },
    getTableList(params = { currentPage: 1 }) {
      params.pageSize = this.pageSize;
      params.selectType = this.currentIndex;
      params.taskTitle = this.searchMsg;
      // params.psList = this.searchList.concat(this.psList || []);
      params.psList = this.searchList;
      params.accept = this.accept;
      params.taskUserIds = this.searchTaskUser.toString();
      params.createByIds = this.searchCreateUser.toString();

      this.server.searchMyTask(params).then((res) => {
        this.tableData = res.data.content;
        this.totalpage = res.data.total;
        this.currentPage = res.data.currentPage;
        this.pageSize = res.data.pageSize;
      });
    },
    queryStep(row) {
      const params = {
        available: 1,
        processId: row.processId || '1',
      };
      this.server.queryProcessStep(params).then((res) => {
        if (res.code == 200 && res.data) {
          this.stepList = res.data;
          row.processVisible = true;
        }
      });
    },
    deleteTask(id) {
      this.$xconfirm({
        content: '',
        title: '确定要删除该任务吗？',
      }).then(() => {
        // 提交确认弹窗
        this.server.deleteTask({ taskId: id }).then((res) => {
          if (res.code == 200) {
            this.$message.success('删除成功');
            this.getTableList();
          }
        });
      }).catch(() => {});
    },
    filedTask(id) {
      this.$xconfirm({
        content: '',
        title: '确定要将该任务归档吗？',
      }).then(() => {
        this.server.filedTask({ taskId: id }).then((res) => {
          if (res.code == 200) {
            this.$message.success('归档成功');
            this.getTableList();
          }
        });
      }).catch(() => {});
    },
    acceptTask(id) {
      this.server.acceptTask({ taskId: id }).then((res) => {
        if (res.code == 200) {
          this.$message.success('已确认接收');
          this.getTableList();
        }
      });
    },
    moveTask(row) {
      const params = {
        stepIdAfter: row.stepId,
        taskId: row.taskId,
      };
      this.server.move(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('移动成功');
          row.processVisible = false;
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
    // 更换
    showSearchBar() {
      if (this.arrowClass == 'el-icon-caret-top') {
        this.arrowClass = 'el-icon-caret-bottom';
      } else {
        this.arrowClass = 'el-icon-caret-top';
      }
    },
    // 查任务过程
    getProcess() {
      this.server.queryProcess({
        currentPage: 1,
        pageSize: 1000,
        enable: 1,
      }).then((res) => {
        if (res.code == 200) {
          this.processList = res.data.content || [];
          this.taskProcessList.push({
            label: '全部',
            value: 'all',
            isSelected: true,
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

    // 选择任务过程
    switchParent(parentCate) {
      console.log(parentCate);
      // 查任务步骤
      this.childCateList = [];
      this.taskProcess = parentCate;
      this.resetIsSelected(this.taskProcessList);
      parentCate.isSelected = true;
      // 如果选择全部，清空选择
      if (parentCate.value == 'all') {
        this.selectStatus({ label: '全部', value: null, isSelected: true });
        this.resetIsSelected(this.taskProcessList, 'init');
      } else {
        this.searchList = [{ processId: parentCate.value }];
        this.getTableList();
      }
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
      for (const item of this.taskProcessList) {
        if (item.value == parentCate.value) {
          this.resetIsSelected(item.childCateList, 'init');
        }
      }
    },
    // 选择任务步骤
    selectStatus(childCate) {
      this.resetIsSelected(this.childCateList);
      this.psList = '';
      childCate.isSelected = true;
      if (this.taskProcess.value == 'all') {
        this.searchList = [];
      } else {
        // 验重
        const stepList = this.searchList.map((item) => item.stepId) || [];
        console.log(stepList.toString());
        if (stepList.includes(childCate.value)) {
          console.log(stepList.toString());
          return;
        }
        this.searchList = [{
          name: `${this.taskProcess.label}-${childCate.label}`,
          processId: this.taskProcess.value,
          processName: this.taskProcess.label,
          stepId: childCate.value,
          stepName: childCate.label,
        }];
        // this.searchList = Array.from(new Set(this.searchList));
      }
    },
    // 删除单个条件
    clearNode(index) {
      this.searchList.splice(index, 1);
      // 如果全清空了要把select切回全部
      if (this.searchList.length === 0) {
        const selectAll = {
          label: '全部',
          value: 'all',
          isSelected: true,
        };
        this.switchParent(selectAll);
      }
    },
    // 删除单个执行人
    clearPersonNode(userList, pId) {
      const index = userList.indexOf(pId);
      if (index >= 0) {
        userList.splice(index, 1);
        // this.getTableList();
      }
    },
    // 删除全部执行人
    clearAllPerson(listType) {
      if (listType == 'task') {
        this.searchTaskUser.splice(0, this.searchTaskUser.length);
      } else {
        this.searchCreateUser.splice(0, this.searchCreateUser.length);
      }
      // this.getTableList();
    },
    // 重置
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
    // 切换确认筛选
    changeAccept(isAccept) {
      this.accept = isAccept;
      this.getTableList();
    },
    // 清除确认筛选
    clearaccept() {
      this.accept = null;
      this.getTableList();
    },
    // 任务汇总事件统计
    getWeek() {
      this.server.getCalendar({ date: this.monthDate }).then((res) => {
        if (res.code == 200) {
          this.weekList = res.data;
          const current = new Date();
          this.weekList.forEach((item, index) => {
            // 由于精确到日的日期格式化之后是上午八点，所以beg应该减去8小时，end加上16小时
            let beg = new Date(item.weekBegin);
            let end = new Date(item.weekEnd);
            beg = beg.setHours(beg.getHours() - 8);
            end = end.setHours(end.getHours() + 16);
            if (current >= beg && current <= end) {
              this.weekBegin = item.weekBegin;
              this.weekEnd = item.weekEnd;
              this.weekName = `${this.dateFormat('mm', new Date())}月第${index + 1}周`;
              // go
              // this.getTableList();
            }
          });
        }
      });
    },
  },
  watch: {
    searchList: {
      handler() {
        this.getTableList();
      },
      deep: true,
    },
    searchTaskUser: {
      handler() {
        this.getTableList();
      },
      deep: true,
    },
    searchCreateUser: {
      handler() {
        this.getTableList();
      },
      deep: true,
    },
  },
};
</script>