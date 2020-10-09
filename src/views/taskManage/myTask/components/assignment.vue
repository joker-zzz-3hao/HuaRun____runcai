<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :before-close="close"
    @closed="closed"
    title="确认指派"
    class="tl-dialog"
    width="490px"
  >
    <div>是否需要进一步完善确认指派信息，如不需要请直接点击确认即可</div>
    <el-form :model="formData">
      <el-form-item label="归属项目" prop="projectVal">
        <el-input
          v-model.trim="formData.projectName"
          placeholder="请选择归属项目"
          maxlength="0"
          @focus="projectInputFocus()"
        ></el-input>
      </el-form-item>
      <el-form-item label="归属任务过程" prop="processId">
        <el-select v-model="formData.processId" placeholder="请选择任务过程">
          <el-option
            v-for="item in processList"
            :key="item.processId"
            :label="item.processName"
            :value="item.processId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="归属OKR" prop="okrDetailId">
        <el-select v-model="formData.okrDetailId" placeholder="请选择归属OKR">
          <el-option
            v-for="item in okrList"
            :key="item.okrDetailId"
            :label="item.okrDetailObjectKr"
            :value="item.okrDetailId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设置执行人" prop="executor">
        <el-select
          v-model="formData.taskUserId"
          placeholder="添加执行人"
          filterable
          remote
          :remote-method="getUserList"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          >
            <el-avatar :size="30" :src="item.headUrl" @error="errorHandler">
              <div v-if="item.userName" class="user-name">
                <em>{{ item.userName.substring(item.userName.length - 2) }}</em>
              </div>
            </el-avatar>
            <span>{{ item.userName }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="tl-btn amt-bg-slip" @click="summit"
        >确认</el-button
      >
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
    <tl-selectproject
      ref="selectProject"
      :showProjectDialog.sync="showProjectDialog"
      v-if="showProjectDialog"
      :server="server"
      @closeProjectDia="closeProjectDia"
    ></tl-selectproject>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import selectProject from './selectProject';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'assignment',
  components: {
    'tl-selectproject': selectProject,
  },
  props: {

  },
  data() {
    return {
      CONST,
      server,
      formData: {
        projectVal: {},
        okrDetailId: null,
        processId: null,
        executor: null,
      },
      executorList: [],
      okrList: [], // 归属okr列表
      projectList: [], // 项目列表
      userList: [], // 执行人列表
      processList: [], // 过程列表
      visible: false,
      showProjectDialog: false,
    };
  },
  created() {

  },
  mounted() {
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    show(id) {
      this.queryOkr();
      this.getUserList();
      this.getProcess();
      this.visible = true;
      if (id) {
        this.server.queryTaskDetail({ taskId: id }).then((res) => {
          if (res.code == 200 && res.data) {
            console.log(res.data);
            this.formData = res.data;
          }
        });
      }
    },
    close() {
      this.visible = false;
    },
    closed() {
      this.$emit('update:existAssignment', false);
    },
    queryOkr() {
      const params = {
        myOrOrg: 'org',
        status: '1',
        orgId: this.userInfo.orgId,
      };
      this.server.queryOkr(params).then((res) => {
        if (res.code == 200) {
          this.okrList = res.data.okrDetails;
          console.log(res.data);
        }
      });
    },
    getUserList(name = '') {
      const params = {
        currentPage: 1,
        pageSize: 20,
        orgFullId: this.userInfo.orgList[0].orgFullId,
        userName: name.trim(),
      };
      this.server.getUserListByOrgId(params).then((res) => {
        if (res.code == 200) {
          this.userList = res.data.content;
        }
      });
    },
    getProcess() {
      this.server.queryProcess({
        currentPage: 1,
        pageSize: 1000,
      }).then((res) => {
        if (res.code == 200) {
          this.processList = res.data.content || [];
        }
      });
    },
    projectInputFocus() {
      this.showProjectDialog = true;
      this.$nextTick(() => {
        this.$refs.selectProject.show();
      });
    },
    closeProjectDia(data) {
      this.formData.projectVal = data.project;
      this.formData.projectName = this.formData.projectVal.projectNameCn;
    },
    errorHandler() {
      return true;
    },
    summit() {
      const okrVal = this.okrList.filter((item) => item.okrDetailId == this.formData.okrDetailId)[0] || {};
      const userVal = this.userList.filter((item) => item.userId == this.formData.taskUserId)[0] || {};
      this.formData.okrDetailName = okrVal.okrDetailObjectKr;
      this.formData.userName = userVal.userName;
      if (this.formData.projectVal) {
        this.formData.projectId = this.formData.projectVal.projectId;
        this.formData.projectName = this.formData.projectVal.projectNameCn;
      }
      const params = {
        okrDetailId: this.formData.okrDetailId,
        okrDetailName: this.formData.okrDetailName,
        processId: this.formData.processId,
        projectId: this.formData.projectId,
        projectName: this.formData.projectName,
        taskId: this.formData.taskId,
        taskUserId: this.formData.taskUserId,
        userName: this.formData.userName,
      };

      this.server.appoint(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('提交成功');
          this.close();
          this.$emit('success');
        }
      });
    },
  },
  watch: {
  },
  updated() {},
  beforeDestroy() {},
};
</script>