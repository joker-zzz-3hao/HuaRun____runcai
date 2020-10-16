<template>
  <div class="row" style="display: flex">
    <!-- <draggable
      class="list-group parent"
      :list="rootData"
      :clone="cloneDog"
      @end="onMove"
      id="norun"
      :options="options"
    >-->
    <div class="col-4" v-for="stepData in rootData" :key="stepData.stepId">
      <div>
        <h3>{{ stepData.stepName }}</h3>
        <span v-if="stepData.stepTaskList.length">{{
          stepData.stepTaskList.length
        }}</span>
      </div>
      <!-- <el-button style="width:380px" @click="addTask(stepData)">
        <i class="el-icon-plus"></i>
      </el-button> -->
      <draggable
        class="list-group"
        :list="stepData.stepTaskList"
        :clone="cloneDog"
        @end="onMove"
        id="norun"
        :options="options"
      >
        <div
          class="list-group-item"
          v-for="element in stepData.stepTaskList"
          :key="element.taskId"
        >
          <div>
            <tl-levelblock :value="element.taskLevel"></tl-levelblock>
          </div>
          <div @click="openEdit(element)">
            {{ element.taskTitle }}
          </div>
          <tl-process
            :data="element.taskProgress"
            :width="36"
            :marginLeft="6"
          ></tl-process>
          <div>
            <i class="el-icon-time"></i>
            <span v-if="element.taskBegDate"
              >{{ element.taskBegDate }}-{{ element.taskEndDate }}</span
            >
            <span v-else>未设置起止时间</span>
          </div>
          <div>
            <el-avatar :size="30" :src="element.headerUrl">
              <div v-if="element.userName" class="user-name">
                <em>
                  {{ element.userName.substring(element.userName.length - 2) }}
                </em>
              </div>
            </el-avatar>
          </div>
        </div>
      </draggable>
      <!-- </draggable> -->
    </div>
    <tl-edittask
      ref="editTask"
      v-if="existEditTask"
      :existEditTask.sync="existEditTask"
      :server="server"
      @success="init()"
    ></tl-edittask>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import process from '@/components/process';
import levelblock from '@/components/levelblock';
import editTask from './editTask';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'two-lists',
  display: 'Two Lists',
  order: 2,
  components: {
    draggable,
    'tl-process': process,
    'tl-levelblock': levelblock,
    'tl-edittask': editTask,
  },
  props: {
    stepList: {
      type: Array,
      default() {
        return [];
      },
    },
    processObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      CONST,
      server,
      rootData: [],
      moveItem: {},
      options: {
        group: 'people',
        ghostClass: 'chosendiv', // 占位影子
        animation: 150, // ms动画排序速度
        // dragClass: 'dragitem', // 被拖拽元素
      },
      existEditTask: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init(typeId) {
      const self = this;
      self.rootData = [];
      const params = {
        currentPage: 1,
        pageSize: 10,
        processId: self.processObj.processId,
        typeId: typeId || '',
      };
      self.server.queryTaskList(params).then((res) => {
        if (res.code == 200) {
          for (let i = 0; i < self.stepList.length; i += 1) {
            self.rootData.push(
              {
                stepId: self.stepList[i].stepId,
                processId: self.processObj.processId,
                stepName: self.stepList[i].stepName,
                typeId: typeId || '',
                stepTaskList: [],
              },
            );
            res.data.content.forEach((task) => {
              if (task.stepId == self.stepList[i].stepId) {
                self.rootData[i].stepTaskList.push(task);
              }
            });
          }
        }
      });
    },
    cloneDog(evt) {
      this.moveItem = evt;
      return evt;
    },
    onMove() {
      // 找出被移动的任务到了哪个步骤中
      this.rootData.forEach((stepData) => {
        stepData.stepTaskList.forEach((task) => {
          if (this.moveItem.taskId == task.taskId) {
            this.moveItem.stepId = stepData.stepId;
            this.moveTask();
          }
        });
      });
    },
    addTask(stepData) {
      this.stepData = stepData;
      this.showAddTask = true;
      this.$nextTick(() => {
        this.$refs.addTask.show();
      });
    },
    moveTask() {
      this.server.createTask(this.moveItem).then((res) => {
        if (res.code == 200) {
          console.log('');
        }
      });
    },
    openEdit(row) {
      this.existEditTask = true;
      this.$nextTick(() => {
        this.$refs.editTask.show(row.taskId, false);
      });
    },
  },
};
</script>
<style  >
.list-group {
  height: 300px;
}
.list-group-item {
  border: 1px solid rgb(0, 0, 0);
  width: 80%;
  height: 120px;
  margin: 10px;
}

.parent {
  display: flex;
}
.child {
  margin-left: 300px;
}
.col-4 {
  width: 25%;
}

.chosendiv {
  opacity: 0.3;
  background: #c8ebfb;
}
</style>