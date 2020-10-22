<template>
  <div class="task-process">
    <!-- <el-menu :default-active="'1'" class="el-menu-demo" mode="horizontal">
        <el-submenu index="1">
          <template slot="title">任务过程</template>
          <el-submenu index="1-1">
            <template slot="title">团队使用</template>
            <el-menu-item v-if="teamList.length == 0"
              >暂无任务过程</el-menu-item
            >
            <el-menu-item
              @click.native="selectProcessItem(team)"
              v-for="team in teamList"
              :index="team.processId"
              :key="team.processId"
              >{{ team.processName }}</el-menu-item
            >
          </el-submenu>
          <el-submenu index="1-2">
            <template slot="title">小范围使用</template>
            <el-menu-item v-if="littleRangeList.length == 0"
              >暂无任务过程</el-menu-item
            >
            <el-menu-item
              @click.native="selectProcessItem(littleRange)"
              v-for="littleRange in littleRangeList"
              :index="littleRange.processId"
              :key="littleRange.processId"
              >{{ littleRange.processName }}</el-menu-item
            >
          </el-submenu>
          <el-submenu index="1-3">
            <template slot="title">个人使用</template>
            <el-menu-item v-if="personList.length == 0"
              >暂无任务过程</el-menu-item
            >
            <el-menu-item
              @click.native="selectProcessItem(person)"
              v-for="person in personList"
              :index="person.processId"
              :key="person.processId"
              >{{ person.processName }}</el-menu-item
            >
          </el-submenu>
        </el-submenu>
      </el-menu> -->
    <div class="operating-area">
      <div class="page-title">
        <em>{{ processObj.processName }}</em>
      </div>
      <div class="operating-box">
        <el-button
          type="primary"
          @click="goCreateTask"
          class="tl-btn amt-bg-slip"
          icon="el-icon-s-claim"
          >创建任务</el-button
        >
        <el-dropdown class="tl-dropdown">
          <div class="el-dropdown-link">
            <el-button
              plain
              class="tl-btn amt-border-slip"
              icon="el-icon-s-cooperation"
            >
              <em>查看归档任务</em><span class="lines"></span
            ></el-button>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="filedAll">
              归档任务过程所有已完成的任务</el-dropdown-item
            >
            <el-dropdown-item
              @click.native="
                go('filedTaskList', {
                  query: { processId: processObj.processId },
                })
              "
            >
              查看任务归档</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <template v-if="taskTypeList.length > 0">
          <div
            class="tl-custom-btn"
            v-for="item in taskTypeList"
            :key="item"
            :class="{
              'is-select': taskType == item,
              'is-version': taskTypeList.length == 1,
            }"
            @click="settaskType(item)"
          >
            <em>{{ item == "1" ? "列表" : "看板" }}</em>
          </div>
        </template>
      </div>
    </div>
    <div class="cont-area">
      <div class="category-labels">
        <el-button
          plain
          class="tl-btn amt-border-fadeout"
          @click="queryTaskByClassify('')"
          :class="{ 'is-select': searchParams.typeId == '' }"
          >全部分类</el-button
        >
        <el-button
          v-for="classify in processClassifyList"
          :key="classify.typeId"
          plain
          class="tl-btn amt-border-fadeout"
          @click="queryTaskByClassify(classify.typeId)"
          :disabled="classify.isEdit"
          :class="{
            'is-select': searchParams.typeId == classify.typeId,
          }"
        >
          <!-- @click.capture.stop="dataChange(scope.row)" -->
          <el-input
            @blur="editClassifyName(classify)"
            @keyup.enter.native="$event.target.blur"
            v-if="classify.isEdit"
            v-model="typeName"
          ></el-input>
          <span v-else>{{ classify.typeName }}</span>
          <!-- <i class="el-icon-more"></i> -->
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="editClassify(classify)"
                >重新命名分类</el-dropdown-item
              >
              <el-dropdown-item @click.native="deleteClassify(classify)"
                >删除分类</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-button>
        <i
          @click="addClassify"
          style="cursor: pointer"
          class="el-icon-circle-plus-outline"
        ></i>
      </div>
      <div class="screening-condition">
        <el-input
          placeholder="输入任务标题"
          style="width: 200px"
          class="tl-input-search"
          v-model="searchParams.taskTitle"
          clearable
          @clear="getTableList"
          @keyup.enter.native="getTableList"
        >
          <i
            class="el-icon-search el-input__icon"
            slot="prefix"
            @click="getTableList"
          ></i>
        </el-input>
        <tl-personmultiple
          title="请选择执行人"
          :userList="userList"
          :userMap="userMap"
          v-model="searchParams.searchExecutor"
          @change="getTableList"
        ></tl-personmultiple>
        <tl-personmultiple
          title="请选择创建人"
          :userList="userList"
          :userMap="userMap"
          v-model="searchParams.searchCreator"
          @change="getTableList"
        ></tl-personmultiple>
      </div>
      <tl-list
        ref="list"
        :processClassifyList="processClassifyList"
        :processObj="processObj"
        :stepList="stepList"
        v-if="taskType == 1 && processObj.processId"
        :searchParams="searchParams"
      ></tl-list>
      <tl-board
        ref="board"
        :processObj="processObj"
        :stepList="stepList"
        v-if="taskType == 2 && stepList.length > 0 && processObj.processId"
        :searchParams="searchParams"
      ></tl-board>
    </div>
    <tl-edit-task
      ref="editTask"
      v-if="existEditTask"
      :existCreatetask.sync="existEditTask"
      :server="server"
      @success="getTableList"
    ></tl-edit-task>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import personMultiple from '@/components/personMultiple';
import tlList from './components/listPage';
import tlBoard from './components/boardPage';
import tlEditTask from '../myTask/components/editTask';
import Server from './server';

const server = new Server();
export default {
  name: 'taskProcess',
  components: {
    tlList,
    tlBoard,
    tlEditTask,
    'tl-personmultiple': personMultiple,
  },
  data() {
    return {
      server,
      processId: '',
      typeName: '',
      teamList: [],
      littleRangeList: [],
      personList: [],
      stepList: [],
      processClassifyList: [],
      showReal: false, // 展示示例图片 false
      changeKanban: true,
      existEditTask: false,
      processObj: {},
      taskTypeList: [1, 2],
      taskType: 1,
      executorList: [
        {
          executorId: '1',
          executorName: '张三',
        },

      ],
      creatorList: [
        {
          creatorId: '1',
          creatorName: '王二麻子',
        },

      ],
      executorId: '',
      creatorId: '',
      searchParams: {
        taskTitle: '',
        searchCreator: [],
        searchExecutor: [],
        typeId: '',
      },
      userList: [],
      userMap: {},
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      orgFullId: (state) => state.orgFullId,
    }),
  },
  created() {
    this.init('1');
    this.init('2');
    this.init('3');
  },
  methods: {
    init(processType) {
      // 搜索任务过程
      this.server.queryTaskProcessList({
        currentPage: 1,
        pageSize: 1000,
        processType: processType || '',
        enable: 1,
      }).then((res) => {
        if (res.code == 200) {
          if (processType == '1') {
            this.teamList = res.data.content;
            if (this.teamList.length > 0) {
              this.processId = this.teamList[0].processId;
              this.selectProcess(this.teamList[0]);
            }
          } else if (processType == '2') {
            this.littleRangeList = res.data.content;
          } else if (processType == '3') {
            this.personList = res.data.content;
          }
        }
      });
    },
    // 搜索部门成员
    queryUser() {
      this.server.listOrgUserPage({ orgFullId: this.orgFullId }).then((res) => {
        if (res.code == 200) {
          this.userList = res.data || [];
          this.userList.map(
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
    queryProcessClassify() {
      this.server.queryProcessClassify({ processId: this.processId }).then((res) => {
        if (res.code == 200) {
          this.processClassifyList = res.data;
          this.processClassifyList.forEach((classify) => {
            this.$set(classify, 'isEdit', false);
          });
        }
        this.queryTaskByClassify();
      });
    },
    settaskType(type) {
      this.taskType = type;
    },

    selectProcess(process) {
      this.processObj = process;
      this.queryProcessClassify();
      this.server.queryTaskStep({ processId: process.processId }).then((res) => {
        if (res.code == 200) {
          this.stepList = res.data;
        }
      });
    },

    goCreateTask() {
      this.go('myTask', { query: { openCreate: true } });
    },
    openEdit(id) {
      this.existEditTask = true;
      this.$nextTick(() => {
        this.$refs.editTask.show(id);
      });
    },
    getTableList() {
      this.queryTaskByClassify(this.searchParams.typeId);
    },
    todo() {},
    queryTaskByClassify(typeId) {
      this.searchParams.typeId = typeId || '';
      if (this.$refs.board) {
        this.$refs.board.init(typeId);
      }
      if (this.$refs.list) {
        this.$refs.list.init(typeId);
      }
    },
    addClassify() {
      const index = 0;
      this.server.addProcessType({
        available: 1,
        processId: this.processId,
        typeName: `新分类${index}`,
      }).then((res) => {
        if (res.code == 200) {
          this.queryProcessClassify({ processId: this.processId });
        }
      });
    },
    editClassify(classify) {
      classify.isEdit = true;
    },
    editClassifyName(classify) {
      this.server.updateClassify({
        available: 1,
        processId: this.processId,
        typeId: classify.typeId,
        typeName: this.typeName,
      }).then((res) => {
        if (res.code == 200) {
          this.typeName = '';
          this.queryProcessClassify({ processId: this.processId });
        }
      });
    },
    async  deleteClassify(classify) {
      const checkres = await this.server.deleteCheck({ typeId: classify.typeId });
      if (checkres.data) {
        this.$xconfirm({
          content: '',
          title: '当前分类有任务项，是否删除',
        }).then(() => {
          this.server.deleteProcess({
            typeId: classify.typeId,
          }).then((res) => {
            if (res.code == 200) {
              console.log(res);
              this.queryProcessClassify({ processId: this.processId });
            }
          }).catch(() => {});
        });
      } else {
        this.server.deleteProcess({
          typeId: classify.typeId,
        }).then((res) => {
          if (res.code == 200) {
            console.log(res);
            this.queryProcessClassify({ processId: this.processId });
          }
        });
      }
    },
    selectProcessItem(process) {
      this.processId = process.processId;
      this.selectProcess(process);
    },
    filedAll() {
      this.server.filedAll({ processId: this.processId }).then((res) => {
        if (res.code == 200) {
          this.$message.success('归档成功');
          this.getTableList();
        }
      });
    },
  },
  watch: {
    processId: {
      handler() {
        this.queryUser();
      },
      immediate: true,
    },
  },
};
</script>