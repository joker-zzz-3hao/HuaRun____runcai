<!--
  功能：
  作者：王志任
  时间：2020年08月04日 15:38:15
  备注：
-->
<template>
  <el-drawer
    :modal-append-to-body="false"
    @closed="closed"
    :close-on-click-modal="false"
    title
    direction="rtl"
    :modal="false"
    :visible.sync="visible"
    :wrapperClosable="false"
    class="tl-drawer tl-drawer-dic"
  >
    <div class="modelCreate">
      <el-form ref="form" :model="formData">
        <el-form-item label="任务过程名称：">
          <el-input disabled placeholder="请输入任务标题" v-model="formData.processName"></el-input>
        </el-form-item>
        <el-form-item label="显示排序：">
          <el-input type="number" v-model="formData.indexNumber"></el-input>
        </el-form-item>
        <el-form-item>
          <h1>任务过程使用范围设置</h1>
          <div style="display:flex;flex-direction: column;">
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
            <el-checkbox disabled :checked="processObj.processType == '3'">个人使用</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item>
          <h1>任务过程使用范围设置</h1>
          <p v-for="step in processObj.stepNameList" :key="step">{{step}}</p>
        </el-form-item>
      </el-form>
    </div>
    <div class="operating-box">
      <el-button
        type="primary"
        class="tl-btn amt-bg-slip"
        :loading="loading"
        @click="updateProcess"
      >确定</el-button>
      <el-button class="tl-btn amt-border-fadeout" @click="closed">取消</el-button>
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
        processType: '',
        indexNumber: '',
        orgId: '',
        processName: '',
        userIdList: [],
        stepNameList: [],
      },
      userList: [],
      selectUserList: [],

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
      this.formData.available = this.processObj.available;
      this.formData.indexNumber = this.processObj.indexNumber;

      this.formData.processType = this.processObj.processType;
      this.formData.orgId = this.processObj.orgId;
      this.formData.processName = this.processObj.processName;
      this.formData.stepNameList = this.processObj.stepNameList;
      this.formData.processId = this.processObj.processId;
      this.server.queryProcessInfo({ processId: this.processObj.processId }).then((res) => {
        if (res.code == 200) {
          res.data.forEach((user) => {
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
    closed() {
      this.visible = false;
      this.$emit('closeDialog', { refreshPage: false });
    },
    visibleChange(name) {
      if (!name) {
        this.remoteMethod();
      }
    },
    updateProcess() {
      //    formData: {
      //   available: 1,
      //   processType: '1',
      //   orgId: '',
      //   processName: '',
      //   userIdList: [],
      //   stepNameList: [],
      // },

      // this.stepNameList.forEach((step) => {
      //   this.formData.stepNameList.push(step.name);
      // });
      this.server.updateProcess(this.formData).then((res) => {
        if (res.code == 200) {
          this.$message.success('编辑成功');
          this.$emit('closeAddProcess');
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