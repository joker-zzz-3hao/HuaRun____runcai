<template>
  <div>
    <el-drawer
      :before-close="close"
      @closed="closed"
      :wrapperClosable="false"
      :modal-append-to-body="true"
      :append-to-body="true"
      :visible.sync="visible"
      custom-class="custom-drawer create-task"
      class="tl-drawer"
    >
      <div slot="title" class="flex-sb">
        <div class="drawer-title">新建任务过程</div>
      </div>
      <el-scrollbar>
        <div class="cont-box">
          <el-form ref="dataForm" :model="formData" class="tl-form">
            <el-form-item
              label="任务过程名称"
              prop="processName"
              :rules="[
                {
                  trigger: 'blur',
                  required: true,
                  message: '请输入任务过程名称',
                },
              ]"
            >
              <el-input
                placeholder="请输入任务标题"
                v-model="formData.processName"
                maxlength="24"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="显示排序"
              prop="indexNumber"
              :rules="[
                { trigger: 'blur', required: true, message: '请输入排序' },
              ]"
            >
              <el-input-number
                v-model="formData.indexNumber"
                controls-position="right"
                :min="0"
                :max="100"
                :step="1"
                :precision="0"
              ></el-input-number>
            </el-form-item>
            <dl>
              <dt>任务过程使用范围设置</dt>
              <dd>
                <el-checkbox
                  class="tl-checkbox"
                  v-model="teamUser"
                  @change="selectTeamUser"
                  :disabled="
                    !this.roleCode.includes('ORG_ADMIN') &&
                    !this.roleCode.includes('TEAM_ADMIN')
                  "
                >
                  <span> 团队使用</span>
                  <span>(创建后的任务过程其组织下成员均可使用)</span>
                </el-checkbox>
                <p>温馨提示：团队使用的任务过程只允许部门负责人进行创建</p>
              </dd>
              <dd>
                <el-checkbox
                  class="tl-checkbox"
                  v-model="localUser"
                  @change="selectLocalUser"
                >
                  小范围使用
                  <span>(所加入的成员均可使用)</span>
                </el-checkbox>
                <dl v-if="localUser" style="display: flex">
                  <dt>添加成员</dt>
                  <dd v-for="p in cutPic" :key="p.userId" class="user-info">
                    <img v-if="p.headUrl" :src="p.headUrl" alt="" />
                    <div v-else class="user-name">
                      <em>{{ p.userName.substring(p.userName.length - 2) }}</em>
                    </div>
                  </dd>
                  <dd>
                    <tl-personmultiple
                      :userList="userList"
                      v-model="formData.userIdList"
                      :showSelect="false"
                    ></tl-personmultiple>
                  </dd>
                </dl>
              </dd>
              <dd>
                <el-checkbox
                  class="tl-checkbox"
                  v-model="personalUser"
                  @change="selectPersonalUser"
                  >个人使用
                </el-checkbox>
              </dd>
            </dl>
            <dl>
              <dt>任务过程设置</dt>
              <dd
                v-for="(step, index) in formData.stepList"
                :key="step.randomId"
              >
                <el-form-item
                  :prop="'stepList.' + index + '.name'"
                  :rules="[
                    {
                      trigger: 'blur',
                      required: true,
                      message: '请填写步骤名称',
                    },
                  ]"
                >
                  <span>步骤{{ index + 1 }}</span>

                  <el-input v-model.trim="step.name" maxlength="24"></el-input>
                  <el-button
                    @click="deleteName(step)"
                    v-if="formData.stepList.length > 1"
                    >删除</el-button
                  >
                  <el-button
                    @click="addName"
                    v-if="index == formData.stepList.length - 1"
                    >添加</el-button
                  >
                </el-form-item>
              </dd>
            </dl>
          </el-form>
        </div>
      </el-scrollbar>
      <div class="operating-box">
        <el-button
          type="primary"
          class="tl-btn amt-bg-slip"
          :loading="loading"
          @click="addProcess"
          >确定</el-button
        >
        <el-button
          plain
          class="tl-btn amt-border-fadeout"
          :loading="loading"
          @click="close"
          >取消</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import personMultiple from '@/components/personMultiple';
import Server from '../server';

const server = new Server();
export default {
  name: 'addProcess',
  components: {
    'tl-personmultiple': personMultiple,
  },
  props: {
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
        enable: 1,
        taskProcessQueryType: '1',
        orgId: '',
        processName: '',
        userIdList: [],
        stepNameList: [],
        stepList: [{
          randomId: Math.random().toString(36).substr(3),
          name: '',
        }],
        indexNumber: '',
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
    // 只有部门负责人才能选团队使用
    if (this.roleCode.includes('ORG_ADMIN') || this.roleCode.includes('TEAM_ADMIN')) {
      this.formData.taskProcessQueryType = '1';
    } else {
      this.formData.taskProcessQueryType = '2';
    }
    this.formData.orgId = this.userInfo.orgId;
    this.remoteMethod();
  },
  mounted() {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      roleCode: (state) => state.roleCode,
      orgFullId: (state) => state.orgFullId,
    }),
    teamUser() {
      return this.formData.taskProcessQueryType == '1';
    },
    localUser() {
      return this.formData.taskProcessQueryType == '2';
    },
    personalUser() {
      return this.formData.taskProcessQueryType == '3';
    },
    cutPic() {
      const list = [];
      this.formData.userIdList.forEach((id) => {
        this.userList.forEach((uitem) => {
          if (uitem.userId == id) {
            list.push(uitem);
          }
        });
      });
      return list;
    },
  },
  methods: {
    close() {
      this.visible = false;
    },
    show() {
      this.visible = true;
    },
    closed() {
      this.$emit('update:exist', false);
    },
    move() {

    },
    addMember() {},
    remoteMethod() {
      this.server.listOrgUserPage({
        orgFullId: this.orgFullId,
      }).then((res) => {
        if (res.code == 200) {
          this.userList = res.data || [];
        }
      });
    },
    visibleChange(name) {
      if (!name) {
        // this.remoteMethod();
      }
    },
    errorHandler() {
      return true;
    },

    selectTeamUser(team) {
      if (team) {
        this.formData.taskProcessQueryType = '1';
      } else {
        this.formData.taskProcessQueryType = '';
      }
    },
    selectLocalUser(local) {
      if (local) {
        this.formData.taskProcessQueryType = '2';
      } else {
        this.formData.taskProcessQueryType = '';

        this.formData.userIdList = [];
      }
    },
    selectPersonalUser(personal) {
      if (personal) {
        this.formData.taskProcessQueryType = '3';
      } else {
        this.formData.taskProcessQueryType = '';
      }
    },
    addProcess() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (this.formData.taskProcessQueryType == '') {
            this.$message.error('请选择使用范围');
            return;
          }
          if (this.formData.taskProcessQueryType == '1') { // 团队需要orgId
            this.formData.userIdList = [];
          }
          if (this.formData.taskProcessQueryType == '2') { // 小范围、个人不需要orgId，需要userIdList
            this.formData.orgId = '';
          }
          if (this.formData.taskProcessQueryType == '3') { // 小范围、个人不需要orgId，需要userIdList
            this.formData.orgId = '';
            this.formData.userIdList = [this.userInfo.userId];
          }
          // this.formData.stepNameList = [...this.stepNameList];
          this.formData.stepList.forEach((step) => {
            this.formData.stepNameList.push(step.name);
          });
          this.loading = true;
          this.server.addProcess(this.formData).then((res) => {
            this.loading = false;
            if (res.code == 200) {
              this.$message.success('新增成功');
              this.close();
              this.$emit('closeAddProcess');
            }
          });
        }
      });
    },
    addName() {
      this.formData.stepList.push({
        randomId: Math.random().toString(36).substr(3),
        name: '',
      });
    },
    deleteName(step) {
      this.formData.stepList = this.formData.stepList.filter((element) => element.randomId != step.randomId);
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>