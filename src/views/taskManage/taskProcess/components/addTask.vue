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
          <el-form-item prop="userId">
            <el-select
              v-model.trim="formData.userId"
              filterable
              placeholder="请输入成员姓名"
              remote
              :remote-method="remoteMethod"
              @visible-change="visibleChange"
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
          <el-form-item prop="timeBeg">
            <!-- TODO:时间精确到分 -->
            <el-date-picker
              placeholder="开始时间"
              :picker-options="dateBegRange"
              v-model="formData.timeBeg"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="timeEnd">
            <el-date-picker
              placeholder="截止时间"
              :picker-options="dateEndRange"
              v-model="formData.timeEnd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="priority">
            <el-select v-model="formData.priority" placeholder="优先级">
              <el-option
                :label="item.name"
                :value="item.priority"
                v-for="item in priorityList"
                :key="item.priority"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="process">
            <el-slider
              v-model="formData.process"
              @change="processChange"
              :step="1"
              show-input
              style="width:60%"
            ></el-slider>
          </el-form-item>
          <el-form-item label="当前进度更新原因说明" prop="reason">
            <el-input
              maxlength="220"
              placeholder="请输入当前进度更新原因"
              type="textarea"
              v-model="formData.reason"
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
  props: {},
  data() {
    return {
      server,
      visible: false,
      loading: false,
      formData: {
        taskTitle: '',
        userId: '',
        timeBeg: '',
        timeEnd: '',
        priority: '',
        process: 0,
        reason: '',
      },
      userList: [],
      priorityList: [
        {
          priority: '1',
          name: '高',
        },
        {
          priority: '2',
          name: '中',
        },
        {
          priority: '3',
          name: '低',
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
        //   return time.getTime() < new Date(this.formData.timeBeg).getTime();
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
        // orgFullId: this.treeData[0].orgId,
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
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>