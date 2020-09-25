<template>
  <div class="row">
    <div class="col-4">
      <h3>最外层</h3>
      <!-- <el-button style="width:380px" @click="addTask">
        <i class="el-icon-plus"></i>
      </el-button>-->
      <draggable
        class="list-group parent"
        :list="rootData"
        :clone="cloneDog"
        @end="onMove"
        id="norun"
        :options="options"
      >
        <!-- <div class="list-group-item" v-for="stepData in rootData" :key="stepData.stepId">
     <div class="col-4">
          <h3>待进行</h3>
          <el-button style="width:380px" @click="addTask">
            <i class="el-icon-plus"></i>
          </el-button>
          <draggable
            class="list-group"
            :list="stepData.stepList"
            :clone="cloneDog"
            @end="onMove"
            id="norun"
            :options="options"
          >
            <div class="list-group-item" v-for="(element, index) in stepData.stepList" :key="element.name">
              <p>序号：{{index}}</p>
              {{ element.name }} {{ element.id }}
              <p>{{element.okr}}</p>
              <p>{{element.status}}</p>
            </div>
          </draggable>
        </div>
        </div>-->
        <div class="col-4">
          <h3>待进行</h3>
          <el-button style="width:380px" @click="addTask">
            <i class="el-icon-plus"></i>
          </el-button>
          <draggable
            class="list-group"
            :list="list1"
            :clone="cloneDog"
            @end="onMove"
            id="norun"
            :options="options"
          >
            <div class="list-group-item" v-for="(element, index) in list1" :key="element.name">
              <p>序号：{{index}}</p>
              {{ element.name }} {{ element.id }}
              <p>{{element.okr}}</p>
              <p>{{element.status}}</p>
            </div>
          </draggable>
        </div>

        <div class="col-4 child">
          <h3>进行中</h3>
          <el-button style="width:380px" @click="addTask">
            <i class="el-icon-plus"></i>
          </el-button>
          <draggable
            class="list-group"
            :list="list2"
            id="running"
            :clone="cloneDog"
            @end="onMove"
            :options="options"
          >
            <div class="list-group-item" v-for="(element, index) in list2" :key="element.name">
              <p>序号：{{index}}</p>
              {{ element.name }} {{ element.id }}
              <p>{{element.okr}}</p>
              <p>{{element.status}}</p>
            </div>
          </draggable>
        </div>

        <div class="col-4 child">
          <h3>已完成</h3>
          <el-button style="width:380px" @click="addTask">
            <i class="el-icon-plus"></i>
          </el-button>
          <draggable
            class="list-group"
            :list="list3"
            id="end"
            :clone="cloneDog"
            @end="onMove"
            :options="options"
          >
            <div class="list-group-item" v-for="(element, index) in list3" :key="element.name">
              <p>序号：{{index}}</p>
              {{ element.name }} {{ element.id }}
              <p>{{element.okr}}</p>
              <p>{{element.status}}</p>
            </div>
          </draggable>
        </div>
      </draggable>
    </div>

    <!-- <rawDisplayer class="col-3" :value="list1" title="List 1" />
    <rawDisplayer class="col-3" :value="list2" title="List 2" />
    <rawDisplayer class="col-3" :value="list3" title="List 3" />-->
    <tl-add-task v-if="showAddTask" :exist.sync="showAddTask" ref="addTask"></tl-add-task>
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
  data() {
    return {
      server,
      rootData: [],
      showAddTask: false,
      list1: [
        {
          name: 'John', okr: '迭代16前端开发', status: '未开始', id: 1,
        },
        {
          name: 'Joao', okr: '销售额18w', status: '未开始', id: 2,
        },
        {
          name: 'Jean', okr: '迭代16后端开发', status: '未开始', id: 3,
        },
        {
          name: 'Gerard', okr: '迭代16产品设计', status: '未开始', id: 4,
        },
      ],
      list2: [
        {
          name: 'Juan', okr: '营业额29w', status: '进行中', id: 5,
        },
        {
          name: 'Edgard', okr: 'UI设计', status: '进行中', id: 6,
        },
        {
          name: 'Johnson', okr: '迭代16测试', status: '进行中', id: 7,
        },
      ],
      list3: [
        {
          name: 'Juan', okr: '迭代15研发', status: '已完成', id: 8,
        },
      ],
      changeid: '',
      removeid: '',
      item: {},
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

    init() {
      const params = {
        currentPage: 1,
        pageSize: 10,
      };
      this.server.queryTaskList(params).then((res) => {
        if (res.code == 200) {
        }
      });
    },
    cloneDog(evt) {
      // console.log(this.removeid);
      this.item = evt;
      return evt;
    },
    // changeDog(evt) {
    //   this.changeid = evt.to.id;
    //   console.log(evt.to.id);
    // },
    onMove(evt) {
      this.removeid = evt.to.id;
      // console.log(evt.to.id);
      // console.log(evt.clone);
      if (evt.to.id == 'norun') {
        this.item.status = '未开始';
      } else if (evt.to.id == 'running') {
        this.item.status = '进行中';
      } else if (evt.to.id == 'end') {
        this.item.status = '已完成';
      }
    },
    addTask() {
      this.showAddTask = true;
      this.$nextTick(() => {
        this.$refs.addTask.show();
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