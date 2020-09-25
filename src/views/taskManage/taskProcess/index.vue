<template>
  <div class="home">
    <!-- <div v-if="!showReal" class="show-pic">
      <div v-if="changeKanban" class="pic-taskprocess" @click="changeKanban = false">
        <div class="go-back" @click="goback"></div>
      </div>
      <div v-else class="pic-kanban">
        <div class="go-back" @click="goback"></div>
        <div class="go-kanban" @click="changeKanban = true"></div>
      </div>
    </div>-->
    <div>
      <div>
        <div>
          <ul>
            <li
              style="cursor:pointer"
              @click="selectProcess(process)"
              v-for="process in taskProcessList"
              :key="process.processId"
            >{{process.processName}}</li>
          </ul>
        </div>
        <div class="page-title">标准任务过程</div>
        <el-button type="primary" @click="customProcess">自定义过程</el-button>
        <div class="operating-right">
          <el-button
            type="primary"
            @click="createTask"
            class="tl-btn amt-bg-slip"
            icon="el-icon-s-claim"
          >添加任务</el-button>
          <el-button
            type="primary"
            @click="createTask"
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
          <el-button
            type="primary"
            @click="createTask"
            class="tl-btn amt-bg-slip"
            icon="el-icon-s-claim"
          >全部分类</el-button>
          <el-button
            type="primary"
            @click="createTask"
            class="tl-btn amt-bg-slip"
            icon="el-icon-s-cooperation"
          >无分类</el-button>
          <el-button
            type="primary"
            @click="createTask"
            class="tl-btn amt-bg-slip"
            icon="el-icon-s-cooperation"
          >新分类</el-button>
          <i class="el-icon-circle-plus-outline"></i>
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
          <tl-list v-if="taskType == 1"></tl-list>
          <tl-board v-else></tl-board>
        </div>
      </div>
    </div>
    <tl-custom-process ref="customProcess" v-if="showCustomProcess"></tl-custom-process>
  </div>
</template>

<script>
import tlList from './components/listPage';
import tlBoard from './components/boardPage';
import tlCustomProcess from './components/customProcess';
import Server from './server';

const server = new Server();
export default {
  name: 'taskProcess',
  components: {
    tlList,
    tlBoard,
    tlCustomProcess,
  },
  data() {
    return {
      server,
      taskProcessList: [],
      showReal: false, // 展示示例图片 false
      changeKanban: true,
      showCustomProcess: false,
      taskTypeList: [1, 2],
      taskType: 2,
      executorList: [
        {
          executorId: '1',
          executorName: '张三',
        },
        {
          executorId: '2',
          executorName: '李四',
        },
        {
          executorId: '3',
          executorName: '王五',
        },
      ],
      creatorList: [
        {
          creatorId: '1',
          creatorName: '王二麻子',
        },
        {
          creatorId: '2',
          creatorName: 'tony老师',
        },
        {
          creatorId: '3',
          creatorName: '张学友',
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
      }
    });
  },
  methods: {
    createTask() {

    },
    goback() {
      this.$router.go('-1');
    },
    settaskType(type) {
      this.taskType = type;
    },
    customProcess() {
      this.showCustomProcess = true;
      this.$nextTick(() => {
        this.$refs.customProcess.show();
      });
    },
    selectProcess(process) {
      this.server.queryTaskStep({ processId: process.processId }).then((res) => {
        if (res.code == 200) {

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