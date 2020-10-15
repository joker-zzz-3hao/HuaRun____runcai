<!--
  功能：
  作者：王志任
  时间：2020年08月04日 15:38:15
  备注：
-->
<template>
  <el-drawer
    :wrapperClosable="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    :visible.sync="visible"
    @closed="closed"
    :before-close="close"
    custom-class="custom-drawer create-task"
    class="tl-drawer"
  >
    <div slot="title" class="flex-sb">
      <div class="drawer-title">编辑任务过程</div>
    </div>
    <div class="modelCreate">
      <el-form ref="dataForm" :model="formData">
        <el-form-item label="任务过程名称：">
          <el-input
            placeholder="请输入任务标题"
            v-model="formData.processName"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="显示排序"
          prop="indexNumber"
          :rules="[{ trigger: 'blur', required: true, message: '请输入排序' }]"
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
        <el-form-item>
          <h1>任务过程使用范围设置</h1>
          <div style="display: flex; flex-direction: column">
            <el-checkbox disabled :checked="processObj.processType == '1'">
              团队申请
              <span>(创建后的任务过程其组织下成员均可使用)</span>
            </el-checkbox>
            <p>温馨提示：团队使用的任务过程只允许部门负责人进行创建</p>
            <el-checkbox disabled :checked="processObj.processType == '2'">
              小范围使用
              <span>(所加入的成员均可使用)</span>
            </el-checkbox>
            <div v-if="processObj.processType == '2'">
              <!-- <span style="marginLeft:10px" v-for="user in selectUserList" :key="user">
                <el-avatar :size="30" :src="user.headerUrl" @error="errorHandler">
                  <div v-if="user.userName" class="user-name">
                    <em>{{user.userName.substring(user.userName.length-2)}}</em>
                  </div>
                </el-avatar>
                <span>{{user.userName}}</span>
              </span>-->
              <span>添加成员</span>
              <i
                style="cursor: pointer"
                @click="addMember"
                class="el-icon-plus"
              ></i>
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
                  <!-- <span style="float: right">
                  <el-checkbox @change="selectChange(item)" v-model="item.userId"></el-checkbox>
                  </span>-->
                </el-option>
              </el-select>
            </div>
            <el-checkbox disabled :checked="processObj.processType == '3'"
              >个人使用</el-checkbox
            >
          </div>
        </el-form-item>
        <el-form-item>
          <h1>任务过程设置</h1>
          <p v-for="(step, index) in formData.stepList" :key="step.stepId">
            <span>步骤{{ index + 1 }}</span>
            <span>{{ step.stepName }}</span>
          </p>
        </el-form-item>
      </el-form>
    </div>
    <div class="operating-box">
      <el-button
        type="primary"
        class="tl-btn amt-bg-slip"
        :loading="loading"
        @click="updateProcess"
        >确定</el-button
      >
      <el-button class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
  </el-drawer>
</template>

<script>
import validateMixin from '../validateMixin';

export default {
  name: 'createdic',
  mixins: [validateMixin],
  components: {
  },
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
    optionType: {
      type: String,
      default() {
        return 'add';
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
      visible: false,
      formData: {
        available: 1,
        enable: 1,
        processType: '',
        indexNumber: '',
        orgId: '',
        processName: '',
        userIdList: [],
        stepList: [],
      },
      userList: [],
      selectUserList: [],
      loading: false,
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.visible = true;
  },
  computed: {},
  methods: {
    init() {
      this.formData.userIdList = [];
      // this.formData = this.processObj;
      this.server.queryProcessInfo(this.processObj.processId).then((res) => {
        if (res.code == 200) {
          this.formData.available = res.data.available;
          this.formData.indexNumber = res.data.indexNumber;

          this.formData.processType = res.data.processType;
          this.formData.orgId = res.data.orgId;
          this.formData.processName = res.data.processName;
          this.formData.processId = res.data.processId;
          this.formData.stepList = res.data.stepList;
          res.data.userList.forEach((user) => {
            if (user.userId) {
              this.formData.userIdList.push(user.userId);
            }
          });
        }
      });
      this.remoteMethod();
    },
    errorHandler() {
      return true;
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
    addMember() {},
    close() {
      this.visible = false;
    },
    closed() {
      this.$emit('update:exist', false);
    },
    visibleChange(name) {
      if (!name) {
        this.remoteMethod();
      }
    },
    updateProcess() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const params = {
            indexNumber: this.formData.indexNumber,
            processId: this.formData.processId,
            userIdList: this.formData.userIdList,
            processName: this.formData.processName,
          };
          this.server.updateProcess(params).then((res) => {
            if (res.code == 200) {
              this.$message.success('编辑成功');
              this.close();
              this.$emit('closeDialog', { refreshPage: true });
            }
          });
        }
      });
    },

  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
<style >
.tl-drawer-dic .el-drawer {
  width: 700px !important;
}
</style>