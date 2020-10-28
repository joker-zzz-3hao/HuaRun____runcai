<template>
  <div class="assistant" :class="{ 'is-focus': showDialog }">
    <i @click="showDia"></i>
    <div
      class="assistant-popup"
      v-if="showDialog"
      :class="{ 'is-show': showDialog }"
    >
      <dl class="sender-info">
        <dt>
          <span>Hello</span><em>{{ userInfo.userName }}</em>
        </dt>
        <dd>您可以在这给你的同事发送提醒或代办任务哦～</dd>
      </dl>
      <div class="receiver-info">
        <el-form ref="asistant" :model="formData" label-width="80px">
          <el-form-item
            label="发送类型"
            prop="noticeType"
            :rules="[{ required: true }]"
          >
            <el-select
              v-model.trim="formData.noticeType"
              @change="typeChange"
              popper-class="select-border"
              class="tl-select"
            >
              <el-option
                v-for="type in typeList"
                :key="type.noticeType"
                :label="type.name"
                :value="type.noticeType"
              ></el-option> </el-select
          ></el-form-item>
          <el-form-item
            label="发送对象"
            prop="userId"
            :rules="[
              { required: true, message: '请选择发送对象', trigger: 'blur' },
            ]"
          >
            <el-select
              v-model.trim="formData.userId"
              filterable
              placeholder="请输入成员姓名"
              remote
              :remote-method="remoteMethod"
              @visible-change="visibleChange"
              clearable
              @change="userChange"
              popper-class="tl-select-dropdown"
              class="tl-select"
            >
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              >
                <dl>
                  <dd>
                    <em>{{ item.userName }}</em>
                    <em>{{ `(${item.userAccount})` }}</em>
                  </dd>
                </dl>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="任务标题"
            prop="taskTitle"
            :rules="[
              { required: true, message: '请填写任务标题', trigger: 'blur' },
            ]"
            v-if="formData.noticeType == 2"
          >
            <el-input
              maxlength="50"
              v-model.trim="formData.taskTitle"
              placeholder="请输入任务标题"
              class="tl-input"
            ></el-input
          ></el-form-item>
          <el-form-item v-if="formData.noticeType == 3">
            <el-radio v-model="formData.callbackType" label="1"
              >遇到问题</el-radio
            >
            <el-radio v-model="formData.callbackType" label="2"
              >使用建议</el-radio
            >
          </el-form-item>
          <el-form-item label="选择模块" v-if="formData.noticeType == 3">
            <el-button @click="selectModule('1')">OKR</el-button>
            <el-button @click="selectModule('2')">周报</el-button>
            <el-button @click="selectModule('3')">系统管理</el-button>
          </el-form-item>
          <el-form-item
            label="内容"
            prop="noticeContent"
            :rules="[
              { required: true, message: '请填写内容', trigger: 'blur' },
            ]"
            v-if="formData.noticeType == '1' || formData.noticeType == '3'"
            ><el-input
              v-model="formData.noticeContent"
              maxlength="1000"
              rows="2"
              resize="none"
              type="textarea"
              :placeholder="
                formData.noticeType == '1'
                  ? '这里请输入你想说的内容~'
                  : '请详细描述您的问题'
              "
              class="tl-textarea"
            ></el-input
          ></el-form-item>
        </el-form>
      </div>
      <el-button type="primary" @click="sendMessage" class="tl-btn amt-bg-slip">
        <i class="el-icon-position"></i><em>发送内容</em>
      </el-button>
    </div>
    <!-- <el-dialog
      :modal="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="close"
      @closed="closed"
      :visible="showDialog"
      custom-class="assistant-dialog"
      class="tl-dialog"
      :class="{ 'is-show': showDialog }"
    >
      <div>Hello {{ userInfo.userName }}</div>
      <div>您可以在这给你的同事发送提醒或任务哦~</div>
      <el-form ref="asistant" :model="formData" label-width="80px">
        <el-form-item
          label="发送类型"
          prop="noticeType"
          :rules="[{ required: true }]"
        >
          <el-select v-model.trim="formData.noticeType" @change="typeChange">
            <el-option
              v-for="type in typeList"
              :key="type.noticeType"
              :label="type.name"
              :value="type.noticeType"
            ></el-option> </el-select
        ></el-form-item>
        <el-form-item
          label="发送对象"
          prop="userId"
          :rules="[
            { required: true, message: '请选择发送对象', trigger: 'blur' },
          ]"
        >
          <el-select
            v-model.trim="formData.userId"
            filterable
            placeholder="请输入成员姓名"
            remote
            :remote-method="remoteMethod"
            @visible-change="visibleChange"
            clearable
            @change="userChange"
            popper-class="tl-select-dropdown set-manage"
            class="tl-select"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            >
              <dl>
                <dd>
                  <em>{{ item.userName }}</em>
                  <em>{{ `(${item.userAccount})` }}</em>
                </dd>
              </dl>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="任务标题"
          prop="taskTitle"
          :rules="[
            { required: true, message: '请填写任务标题', trigger: 'blur' },
          ]"
          v-if="formData.noticeType == 2"
        >
          <el-input maxlength="50" v-model.trim="formData.taskTitle"></el-input
        ></el-form-item>
        <el-form-item v-if="formData.noticeType == 3">
          <el-radio v-model="formData.callbackType" label="1"
            >遇到问题</el-radio
          >
          <el-radio v-model="formData.callbackType" label="2"
            >使用建议</el-radio
          >
        </el-form-item>
        <el-form-item label="选择模块" v-if="formData.noticeType == 3">
          <el-button @click="selectModule('1')">OKR</el-button>
          <el-button @click="selectModule('2')">周报</el-button>
          <el-button @click="selectModule('3')">系统管理</el-button>
        </el-form-item>
        <el-form-item
          label="内容"
          prop="noticeContent"
          :rules="[{ required: true, message: '请填写内容', trigger: 'blur' }]"
          v-if="formData.noticeType == '1' || formData.noticeType == '3'"
          ><el-input
            v-model="formData.noticeContent"
            maxlength="1000"
            type="textarea"
            :placeholder="
              formData.noticeType == '1'
                ? '这里请输入你想说的内容~'
                : '请详细描述您的问题'
            "
          ></el-input
        ></el-form-item>
      </el-form>

      <div>
        <el-button @click="sendMessage">
          <i class="el-icon-position"></i> 发送
        </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Server from './server';

const server = new Server();

export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      server,
      route: '',
      showDialog: false,
      userList: [],
      treeData: [],
      formData: {
        userId: '',
        noticeType: '1',
        noticeContent: '',
        taskTitle: '',
        userName: '',
      },
      typeList: [
        {
          noticeType: '1',
          name: '通知',
        },
        {
          noticeType: '2',
          name: '任务',
        },
        // {
        //   noticeType: '3',
        //   name: '问题反馈',
        // },
      ],
    };
  },
  created() {
    // 初始化下拉框用户列表
    this.server.getOrg({}).then((res) => {
      if (res.code == 200) {
        this.treeData = res.data;
        // 初始化下拉框用户列表
        this.remoteMethod();
      }
    });
    // 没有任务权限时，小助手无发送待办功能
    if (!this.hasPower('renwu')) {
      this.typeList = [{
        noticeType: '1',
        name: '通知',
      }];
    }
    this.route = this.$route.name;
  },
  mounted() {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    showDia() {
      this.showDialog = !this.showDialog;
      this.formData = {
        userId: '',
        noticeType: '1',
        noticeContent: '',
        taskTitle: '',
        userName: '',
      };
    },
    remoteMethod(name) {
      this.server.getUserListByOrgId({
        currentPage: 1,
        pageSize: 20,
        orgFullId: this.treeData[0].orgId,
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

    errorHandler() {
      return true;
    },
    selectModule(callbackModule) {
      this.formData.callbackModule = callbackModule;
    },
    sendMessage() {
      let params = {};
      this.$refs.asistant.validate((valid) => {
        if (valid) {
          if (this.formData.noticeType == 1) {
            params = {
              noticeContent: this.formData.noticeContent,
              noticeType: this.formData.noticeType,
              userId: this.formData.userId,
            };
            this.server.sendMessage(params).then((res) => {
              if (res.code == 200) {
                this.$message.success('发送成功');
                this.formData = {
                  userId: '',
                  noticeType: '1',
                  noticeContent: '',
                  taskTitle: '',
                  userName: '',
                };
              }
            });
          } else if (this.formData.noticeType == 2) {
            params = {
              taskUserId: this.formData.userId,
              taskTitle: this.formData.taskTitle,
              userName: this.formData.userName,
            };
            this.server.appointSave(params).then((res) => {
              if (res.code == 200) {
                this.$message.success('发送成功');
                this.formData = {
                  userId: '',
                  noticeType: '2',
                  noticeContent: '',
                  taskTitle: '',
                  userName: '',
                };
              }
            });
          }
        }
      });
    },
    close() {
      this.showDialog = false;
      this.formData = {
        userId: '',
        noticeType: '1',
        noticeContent: '',
      };
    },
    userChange(userId) {
      this.userList.forEach((user) => {
        if (user.userId == userId) {
          this.formData.userName = user.userName;
        }
      });
    },
    typeChange() {
      this.$refs.asistant.clearValidate();
    },
  },
  watch: {
    // 路由切换关闭小助手
    '$route.name': {
      handler(newVal) {
        if (this.route != newVal) {
          this.showDialog = false;
          this.route = '';
        }
      },
      deep: true,
      immediate: true,
    },
  },
  updated() {},
  beforeDestroy() {},
};
</script>
<style lang="css">
.pic-help {
  background: url("~@/assets/images/demoPic/help.png") no-repeat;
  background-size: 100%;
  height: 431px;
}
</style>