<template>
  <div class="home">
    <div>
      <div>
        <div class="page-title">标准任务过程</div>
        <el-button type="primary" @click="customProcess">自定义过程</el-button>
        <div>
          <ul>
            <li
              style="cursor:pointer"
              @click="selectProcess(process)"
              v-for="process in taskProcessList"
              :key="process.processId"
            >
              {{process.processName}}
              <i @click="customProcess(process)" class="el-icon-edit"></i>
            </li>
          </ul>
        </div>
        <div class="operating-right">
          <el-button
            type="primary"
            @click="goCreateTask"
            class="tl-btn amt-bg-slip"
            icon="el-icon-s-claim"
          >添加任务</el-button>
          <el-button
            type="primary"
            @click="todo"
            class="tl-btn amt-bg-slip"
            icon="el-icon-s-cooperation"
          >查看归档任务</el-button>
        </div>
        <div class="operating-box" v-if="taskTypeList.length > 0">
          <div
            class="tl-custom-btn"
            v-for="item in taskTypeList"
            :key="item"
            :class="{'is-select': taskType == item,'is-version': taskTypeList.length == 1}"
            @click="settaskType(item)"
          >
            <em>{{item == '1' ? '列表':'看板'}}</em>
          </div>
        </div>
      </div>
      <div>
        <div class="operating-right">
          <div>
            <el-button
              type="primary"
              @click="queryTaskByClassify('')"
              class="tl-btn amt-bg-slip"
              icon="el-icon-s-claim"
            >全部分类</el-button>
            <el-button
              v-for="classify in processClassifyList"
              :key="classify.typeId"
              type="primary"
              @click="queryTaskByClassify(classify.typeId)"
              class="tl-btn amt-bg-slip"
              :disabled="classify.isEdit"
              :icon="!classify.isEdit?'el-icon-s-claim':''"
            >
              <!-- @click.capture.stop="dataChange(scope.row)" -->
              <el-input
                @blur="editClassifyName(classify)"
                @keyup.enter.native="editClassifyName(classify)"
                v-if="classify.isEdit"
                v-model="typeName"
              ></el-input>
              <span v-else>{{classify.typeName}}</span>
              <!-- <i class="el-icon-more"></i> -->
              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="el-icon-more el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="editClassify(classify)">重新命名分类</el-dropdown-item>
                  <el-dropdown-item @click.native="deleteClassify(classify)">删除分类</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>

            <i @click="addClassify" style="cursor:pointer" class="el-icon-circle-plus-outline"></i>
          </div>
          <el-input placeholder="输入任务标题" style="width:200px" clearable class="tl-input">
            <i class="el-icon-search el-input__icon" slot="prefix"></i>
          </el-input>
          <el-select
            v-model.trim="executorId"
            placeholder="执行者"
            :popper-append-to-body="false"
            popper-class="tl-select-dropdown"
            class="tl-select"
          >
            <el-option
              v-for="item in executorList"
              :key="item.executorId"
              :label="item.executorName"
              :value="item.executorId"
            ></el-option>
          </el-select>
          <el-select
            v-model.trim="creatorId"
            placeholder="创建人"
            :popper-append-to-body="false"
            popper-class="tl-select-dropdown"
            class="tl-select"
          >
            <el-option
              v-for="item in creatorList"
              :key="item.creatorId"
              :label="item.creatorName"
              :value="item.creatorId"
            ></el-option>
          </el-select>
        </div>
        <div>
          <tl-list :processObj="processObj" :stepList="stepList" v-if="taskType == 1"></tl-list>
          <tl-board
            ref="board"
            :processObj="processObj"
            :stepList="stepList"
            v-if="taskType == 2 && stepList.length > 0"
          ></tl-board>
        </div>
      </div>
    </div>
    <tl-custom-process
      ref="customProcess"
      :optionType="optionType"
      :processObj="processObj"
      @closeAddProcess="closeAddProcess"
      v-if="showCustomProcess"
    ></tl-custom-process>
    <tl-create-task
      ref="createtask"
      v-if="existCreatetask"
      :existCreatetask.sync="existCreatetask"
      :server="server"
      @success="getTableList"
    ></tl-create-task>
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
import tlList from './components/listPage';
import tlBoard from './components/boardPage';
import tlCustomProcess from './components/customProcess';
import tlCreateTask from '../myTask/components/createTask';
import tlEditTask from '../myTask/components/editTask';
import Server from './server';

const server = new Server();
export default {
  name: 'taskProcess',
  components: {
    tlList,
    tlBoard,
    tlCustomProcess,
    tlCreateTask,
    tlEditTask,
  },
  data() {
    return {
      server,
      processId: '',
      typeName: '',
      taskProcessList: [],
      stepList: [],
      processClassifyList: [],
      showReal: false, // 展示示例图片 false
      changeKanban: true,
      showCustomProcess: false,
      existCreatetask: false,
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

    };
  },
  created() {
    this.server.queryTaskProcessList().then((res) => {
      if (res.code == 200) {
        this.taskProcessList = res.data;
        this.processId = res.data[0].processId;
        // 初始化页面,默认查询第一个任务过程的步骤
        this.selectProcess(res.data[0]);
      }
    });
  },
  methods: {
    goback() {
      this.$router.go('-1');
    },
    queryProcessClassify() {
      this.server.queryProcessClassify({ processId: this.processId }).then((res) => {
        if (res.code == 200) {
          this.processClassifyList = res.data;
          this.processClassifyList.forEach((classify) => {
            this.$set(classify, 'isEdit', false);
          });
        }
      });
    },
    settaskType(type) {
      this.taskType = type;
    },
    customProcess(process) {
      this.optionType = 'create';
      if (process && process.processId) {
        this.optionType = 'edit';
        this.processObj = process;
        this.processId = process.processId;
      }
      this.showCustomProcess = true;
      this.$nextTick(() => {
        this.$refs.customProcess.show();
      });
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

    closeAddProcess() {
      this.showCustomProcess = false;
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
    getTableList() {},
    todo() {},
    queryTaskByClassify(typeId) {
      this.$refs.board.init(typeId);
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
    deleteClassify(classify) {
      this.server.updateClassify({
        available: 0,
        processId: this.processId,
        typeId: classify.typeId,
      }).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.queryProcessClassify({ processId: this.processId });
        }
      });
    },
  },
};
</script>
<style lang="css" stylus>
.show-pic {
  /* display: flex;
  flex-direction: column; */
}
.pic-taskprocess {
  background: url("~@/assets/images/demoPic/taskprocess.png") no-repeat;
  background-size: 100%;
  /* background-size: cover; */
  height: calc(100vh);
}
.pic-kanban {
  background: url("~@/assets/images/demoPic/kanban.png") no-repeat;
  background-size: 100%;
  height: calc(100vh);
}
.go-back {
  width: 200px;
  height: 300px;
  cursor: pointer;
}

.go-kanban {
  position: absolute;
  right: 41px;
  top: 7px;
  width: 114px;
  height: 68px;
  cursor: pointer;
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
</style>