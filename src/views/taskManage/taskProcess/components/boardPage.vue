<template>
  <div class="row">
    <!-- <draggable
      class="list-group parent"
      :list="rootData"
      :clone="cloneDog"
      @end="onMove"
      id="norun"
      :options="options"
    >-->
    <div class="col-4" v-for="stepData in rootData" :key="stepData.stepId">
      <h3>{{stepData.stepName}}</h3>
      <el-button style="width:380px" @click="addTask(stepData)">
        <i class="el-icon-plus"></i>
      </el-button>
      <draggable
        class="list-group"
        :list="stepData.stepTaskList"
        :clone="cloneDog"
        @end="onMove"
        id="norun"
        :options="options"
      >
        <div class="list-group-item" v-for="element in stepData.stepTaskList" :key="element.taskId">
          <p>{{element.taskLevel}}</p>
          <p>{{ element.taskTitle }}</p>
          <p>{{element.taskProgress}}</p>
          <p>{{element.taskBegDate}}-{{element.taskEndDate}}</p>
        </div>
      </draggable>
      <!-- </draggable> -->
    </div>
    <tl-add-task :stepData="stepData" v-if="showAddTask" :exist.sync="showAddTask" ref="addTask"></tl-add-task>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import tlAddTask from './addTask';
import Server from '../server';

const server = new Server();

export default {
  name: 'two-lists',
  display: 'Two Lists',
  order: 2,
  components: {
    draggable,
    tlAddTask,
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
      server,
      rootData: [],
      showAddTask: false,
      moveItem: {},
      options: {
        group: 'people',
        ghostClass: 'chosendiv', // 占位影子
        animation: 150, // ms动画排序速度
        // dragClass: 'dragitem', // 被拖拽元素
      },
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
      console.log(this.moveItem);
      // debugger;
      this.server.createTask(this.moveItem).then((res) => {
        if (res.code == 200) {
          console.log('');
        }
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