<template>
  <div class="assistant">
    <!-- <el-popover placement="top" trigger="click" :append-to-body="false" width="370">
      <div class="pic-help" @click="showDia"></div>
      <img slot="reference" src="~@/assets/images/demoPic/helpicon.png" />
    </el-popover>-->
    <img @click="showDia" src="~@/assets/images/demoPic/helpicon.png" />
    <div v-if="showDialog">
      <el-dialog append-to-body @close="close" :visible="showDialog">
        <div>Hello {{ userInfo.userName }}</div>
        <div>您可以在这给你的同事发送提醒或待办任务哦~</div>
        <div>
          <span>发送类型</span>
          <el-select v-model.trim="formData.noticeType">
            <el-option
              v-for="type in typeList"
              :key="type.noticeType"
              :label="type.name"
              :value="type.noticeType"
            ></el-option>
          </el-select>
        </div>
        <div>
          <div v-if="formData.noticeType == 1">
            <span>发送对象</span>
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
                <span style="float: left">
                  <el-avatar
                    :size="30"
                    :src="item.headUrl"
                    @error="errorHandler"
                  >
                    <div v-if="item.userName" class="user-name">
                      <em>{{
                        item.userName.substring(item.userName.length - 2)
                      }}</em>
                    </div>
                  </el-avatar>
                </span>
                <span style="float: left; marginleft: 5px">{{
                  item.userName
                }}</span>
              </el-option>
            </el-select>
          </div>
          <div v-if="formData.noticeType == 2">待办</div>
          <div v-if="formData.noticeType == 3">
            <div>
              <el-radio v-model="formData.callbackType" label="1"
                >遇到问题</el-radio
              >
              <el-radio v-model="formData.callbackType" label="2"
                >使用建议</el-radio
              >
            </div>
            <div>
              <span>选择模块</span>
              <el-button @click="selectModule('1')">OKR</el-button>
              <el-button @click="selectModule('2')">周报</el-button>
              <el-button @click="selectModule('3')">系统管理</el-button>
            </div>
          </div>
        </div>
        <div v-if="formData.noticeType == '1' || formData.noticeType == '3'">
          <el-input
            v-model="formData.noticeContent"
            type="textarea"
            :placeholder="
              formData.noticeType == '1'
                ? '这里请输入你想说的内容~'
                : '请详细描述您的问题'
            "
          ></el-input>
        </div>
        <div>
          <el-button @click="sendMessage">
            <i class="el-icon-position"></i> 发送内容
          </el-button>
        </div>
      </el-dialog>
    </div>
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
      showDialog: false,
      userList: [],
      treeData: [],
      formData: {
        userId: '',
        noticeType: '1',
        // callbackType: '1',
        // callbackModule: '1',
        noticeContent: '',
      },
      typeList: [
        {
          noticeType: '1',
          name: '发送提醒',
        },
        {
          noticeType: '2',
          name: '发送待办',
        },
        {
          noticeType: '3',
          name: '发送问题反馈',
        },
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
  },
  mounted() {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    showDia() {
      this.showDialog = true;
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
      this.server.sendMessage(this.formData).then((res) => {
        if (res.code == 200) {
          this.$message.success('发送成功');
          this.showDialog = false;
          this.formData = {
            userId: '',
            noticeType: '1',
            noticeContent: '',
          };
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
  },
  watch: {},
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