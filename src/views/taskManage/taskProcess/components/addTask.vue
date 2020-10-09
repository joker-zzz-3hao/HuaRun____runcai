<!--
  功能：
  作者：王志任
  时间：2020年09月24日 09:46:22
  备注：
-->
<template>
  <div>
    <el-dialog
      :before-close="close"
      @closed="closed"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="visible"
      title="创建任务"
    >
      <div>
        <el-form ref="addTask" :model="formData">
          <el-form-item prop="taskTitle">
            <el-input maxlength="100" placeholder="请输入任务标题" v-model.trim="formData.taskTitle"></el-input>
          </el-form-item>
          <el-form-item prop="taskUserId">
            <el-select
              v-model.trim="formData.taskUserId"
              filterable
              placeholder="请输入成员姓名"
              remote
              :remote-method="remoteMethod"
              @visible-change="visibleChange"
              @change="userChange"
              clearable
            >
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              >
                <span style="float:left">
                  <el-avatar :size="30" :src="item.headUrl" @error="errorHandler">
                    <div v-if="item.userName" class="user-name">
                      <em>{{item.userName.substring(item.userName.length-2)}}</em>
                    </div>
                  </el-avatar>
                </span>
                <span style="float:left;marginLeft:5px">{{item.userName}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="taskBegDate">
            <!-- TODO:时间精确到分 -->
            <el-date-picker
              placeholder="开始时间"
              :picker-options="dateBegRange"
              v-model="formData.taskBegDate"
              format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="taskEndDate">
            <el-date-picker
              placeholder="截止时间"
              :picker-options="dateEndRange"
              v-model="formData.taskEndDate"
              format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="taskLevel">
            <el-select v-model="formData.taskLevel" placeholder="优先级">
              <el-option
                :label="item.name"
                :value="item.taskLevel"
                v-for="item in taskLevelList"
                :key="item.taskLevel"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="taskProgress">
            <el-slider
              v-model="formData.taskProgress"
              @change="processChange"
              :step="1"
              show-input
              style="width:60%"
            ></el-slider>
          </el-form-item>
          <el-form-item label="当前进度更新原因说明" prop="taskProgressRemark">
            <el-input
              maxlength="220"
              placeholder="请输入当前进度更新原因"
              type="textarea"
              v-model="formData.taskProgressRemark"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="operating-box">
          <el-button type="primary" class="tl-btn amt-bg-slip" :loading="loading" @click="create">确定</el-button>
          <el-button class="tl-btn amt-border-fadeout" :disabled="loading" @click="closed">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Server from '../server';

const server = new Server();
export default {
  name: '',
  components: {},
  props: {
    stepData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      server,
      visible: false,
      loading: false,
      formData: {
        processId: this.stepData.processId,
        stepId: this.stepData.stepId,
        typeId: this.stepData.typeId,
        taskTitle: '',
        taskUserId: '',
        userName: '',
        taskBegDate: '',
        taskEndDate: '',
        taskLevel: '',
        taskProgress: 0,
        taskProgressRemark: '',
      },
      userList: [],
      taskLevelList: [
        {
          taskLevel: '1',
          name: '低',
        },
        {
          taskLevel: '10',
          name: '中',
        },
        {
          taskLevel: '20',
          name: '高',
        },
      ],
      dateBegRange: {
        // disabledDate(time) {
        //   const now = new Date();
        //   return time.getTime() < now.getTime();
        // },
      },
      dateEndRange: {
        // disabledDate(time) {
        //   return time.getTime() < new Date(this.formData.taskBegDate).getTime();
        // },
      },
    };
  },
  created() { this.remoteMethod(); },
  mounted() {},
  computed: {},
  methods: {
    remoteMethod(name) {
      this.server.getUserListByOrgId({
        currentPage: 1,
        pageSize: 20,
        userName: name ? name.trim() : '',
      }).then((res) => {
        if (res.code == 200) {
          this.userList = res.data.content;
        }
      });
    },
    visibleChange(name) {
      if (!name) {
        this.remoteMethod();
      }
    },
    create() {
      this.formData.taskBegDate = this.dateFormat(
        'YYYY-mm-dd HH:MM:SS',
        new Date(this.formData.taskBegDate),
      );
      this.formData.taskEndDate = this.dateFormat(
        'YYYY-mm-dd HH:MM:SS',
        new Date(this.formData.taskEndDate),
      );
      // this.formData.taskEndDate = '';
      if (this.formData.typeId == '') {
        delete this.formData.typeId;
      }
      this.server.createTask(this.formData).then((res) => {
        if (res.code == 200) {
          console.log('');
        }
      });
    },
    errorHandler() {
      return true;
    },
    processChange() {

    },
    show() {
      this.visible = true;
    },
    closed() {
      this.$emit('update:showAddTask', false);
    },
    close() {
      this.visible = false;
    },
    userChange(userId) {
      if (userId) {
        this.userList.forEach((user) => {
          if (user.userId == userId) {
            this.formData.userName = user.userName;
          }
        });
      } else {
        this.formData.userName = '';
      }
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>