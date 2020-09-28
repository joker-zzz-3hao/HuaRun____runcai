<!--
  功能：
  作者：王志任
  时间：2020年09月24日 13:57:15
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
      title="自定义任务过程"
    >
      <el-form ref="form" :model="formData">
        <el-form-item label="任务过程名称">
          <el-input placeholder="请输入任务标题" v-model="formData.processName"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="display:flex;flex-direction: column;">
            <el-checkbox v-model="teamUser" @change="selectTeamUser">
              团队申请
              <span>(组织下的成员可以使用)</span>
            </el-checkbox>
            <el-checkbox v-model="localUser" @change="selectLocalUser">
              小范围使用
              <span>(组织下的成员不可使用，需要加入到该团队)</span>
            </el-checkbox>
            <div v-if="localUser">
              <span>添加成员</span>
              <i style="cursor:pointer" @click="addMember" class="el-icon-plus"></i>
              <el-select
                v-model.trim="formData.userIdList"
                filterable
                placeholder="请输入成员姓名"
                remote
                :remote-method="remoteMethod"
                @visible-change="visibleChange"
                clearable
                multiple
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
                  <!-- <span style="float: right">
                  <el-checkbox @change="selectChange(item)" v-model="item.userId"></el-checkbox>
                  </span>-->
                </el-option>
              </el-select>
            </div>
            <el-checkbox v-model="personalUser" @change="selectPersonalUser">个人使用</el-checkbox>
          </div>
        </el-form-item>
      </el-form>
      <div class="operating-box">
        <el-button
          type="primary"
          class="tl-btn amt-bg-slip"
          :loading="loading"
          @click="addProcess"
        >确定</el-button>
        <el-button class="tl-btn amt-bg-slip" :loading="loading" @click="close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Server from '../server';

const server = new Server();
export default {
  name: '',
  components: {},
  props: {
    optionType: {
      type: String,
      default() {
        return 'create';
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
      visible: false,
      loading: false,
      formData: {
        available: 1,
        processType: '1',
        orgId: '',
        processName: '',
        userIdList: [],
      },
      userList: [],
      processList: [
        {
          code: '1',
          name: '待处理',
        },
        {
          code: '2',
          name: '处理中',
        },
        {
          code: '3',
          name: '已完成',
        },
      ],
    };
  },
  created() {
    this.formData.orgId = this.userInfo.orgId;
    this.remoteMethod();
    if (this.optionType == 'edit') {
      this.server.queryProcessInfo({ processId: this.processObj.processId }).then((res) => {
        if (res.code == 200) {
          res.data.forEach((user) => {
            if (user.userId) {
              this.formData.userIdList.push(user.userId);
            }
          });
        }
      });
      this.formData.processType = this.processObj.processType;
      this.formData.processName = this.processObj.processName;
    }
  },
  mounted() {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
    teamUser() {
      return this.formData.processType == '1';
    },
    localUser() {
      return this.formData.processType == '2';
    },
    personalUser() {
      return this.formData.processType == '3';
    },
  },
  methods: {
    close() {
      this.visible = false;
      this.$emit('closeAddProcess', { refreshPage: false });
    },
    show() {
      this.visible = true;
    },
    closed() {
      this.$emit('update:showMove', false);
    },
    move() {

    },
    addMember() {
      debugger;
    },
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
    errorHandler() {
      return true;
    },

    selectTeamUser(team) {
      if (team) {
        this.formData.processType = '1';
      } else {
        this.formData.processType = '';
      }
    },
    selectLocalUser(local) {
      if (local) {
        this.formData.processType = '2';
      } else {
        this.formData.processType = '';

        this.formData.userIdList = [];
      }
    },
    selectPersonalUser(personal) {
      if (personal) {
        this.formData.processType = '3';
      } else {
        this.formData.processType = '';
      }
    },
    addProcess() {
      if (this.formData.processType == '1') { // 团队需要orgId
        this.formData.userIdList = [];
      }
      if (this.formData.processType == '2') { // 小范围、个人不需要orgId，需要userIdList
        this.formData.orgId = '';
      }
      if (this.formData.processType == '3') { // 小范围、个人不需要orgId，需要userIdList
        this.formData.orgId = '';
        this.formData.userIdList = [this.userInfo.userId];
      }
      if (this.optionType == 'edit') {
        this.formData.processId = this.processObj.processId;
        // 校验必填项
        this.server.editProcess(this.formData).then((res) => {
          if (res.code == 200) {
            this.$message.success('修改成功');
            this.$emit('closeAddProcess');
          }
        });
      } else {
        // 校验必填项
        this.server.addProcess(this.formData).then((res) => {
          if (res.code == 200) {
            this.$message.success('新增成功');
            this.$emit('closeAddProcess');
          }
        });
      }
    },

  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>