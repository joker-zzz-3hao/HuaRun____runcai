<!--
  功能：
  作者：王志任
  时间：2020年08月04日 15:38:15
  备注：
-->
<template>
  <div>
    <el-drawer
      :modal="false"
      :append-to-body="true"
      :wrapperClosable="false"
      title="编辑用户"
      :before-close="closeDrawer"
      :visible.sync="showEditUser"
      class="tl-drawer tl-drawer-user-edit"
    >
      <el-form
        ref="userForm"
        :model="formData"
        label-width="80px"
        class="tl-form"
      >
        <el-form-item
          prop="userName"
          label="姓名"
          :rules="[{ required: true, message: '请填写姓名', trigger: 'blur' }]"
        >
          <el-input
            v-model.trim="formData.userName"
            maxlength="50"
            clearable
            style="width: 90%"
            class="tl-input"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="用户账号"
          prop="userAccount"
          :rules="[
            { required: true, validator: validateAccount, trigger: 'blur' },
          ]"
        >
          <el-input
            v-model.trim="formData.userAccount"
            maxlength="50"
            style="width: 90%"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="pwdLabel"
          prop="newPwd"
          :rules="[{ required: true, validator: validatePwd, trigger: 'blur' }]"
        >
          <el-input
            :disabled="!isEditPwd"
            v-model.trim="formData.newPwd"
            style="width: 90%"
            show-password
            clearable
          ></el-input>
          <el-button v-if="!isEditPwd" @click="editPwd">修改密码</el-button>
          <el-button v-if="isEditPwd" @click="cancelEditPwd">取消</el-button>
        </el-form-item>
        <!-- <el-form-item
          v-if="isEditPwd"
          label="新密码"
          prop="newPwd"
          :rules="[{required:true,validator:validatePwd,trigger:'blur'}]"
        >
          <el-input v-model.trim="formData.newPwd" show-password clearable></el-input>
        </el-form-item>-->
        <el-form-item
          v-if="isEditPwd"
          label="确认密码"
          prop="confirmPwd"
          :rules="[
            {
              required: true,
              validator: validateNewConfirmPwd,
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model.trim="formData.confirmPwd"
            show-password
            clearable
            style="width: 90%"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="userMobile"
          :rules="[
            {
              required: true,
              validator: validateInsideMobile,
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model.trim="formData.userMobile"
            clearable
            style="width: 90%"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="电子邮箱"
          prop="userMail"
          :rules="[
            { required: true, validator: validateEmail, trigger: 'blur' },
          ]"
        >
          <el-input
            v-model.trim="formData.userMail"
            clearable
            style="width: 90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属租户">
          <el-input
            v-model.trim="formData.tenantName"
            disabled
            style="width: 90%"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="所在部门"
          prop="orgIdList"
          :rules="[{ required: true, message: '请选择部门', trigger: 'blur' }]"
        >
          <el-cascader
            ref="cascader"
            v-model="formData.orgIdList"
            :options="treeData"
            :show-all-levels="false"
            :props="{
              checkStrictly: true,
              value: 'orgId',
              label: 'orgName',
              children: 'sonTree',
            }"
            @change="selectIdChange"
            style="width: 90%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div class="operating-box">
        <el-button
          type="primary"
          :loading="loading"
          @click="saveUser"
          class="tl-btn amt-bg-slip"
          >确定</el-button
        >
        <el-button
          plain
          :disabled="loading"
          @click="cancel"
          class="tl-btn amt-border-fadeout"
          >取消</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Cryptojs from '@/lib/cryptojs';
import validateMixin from '../validateMixin';

export default {
  name: 'createOrEditUser',
  mixins: [validateMixin],
  components: {
  },
  props: {
    treeData: {
      type: Array,
      default() {
        return [];
      },
    },
    server: {
      type: Object,
      default() {
        return {};
      },
    },
    userId: {
      type: String,
      default() {
        return '';
      },
    },
    tenantName: {
      type: String,
      default() {
        return '';
      },
    },
    globalOrgId: {
      type: String,
      default() {
        return '';
      },
    },
  },
  data() {
    return {
      Cryptojs,
      loading: false,
      isEditPwd: false,
      showEditUser: false,
      initUserAccount: '',
      pwdLabel: '用户密码',
      formData: {
        userName: '', // 姓名
        userMobile: '', // 手机
        userMail: '', // 邮箱
        userStatus: '0', // 状态 0有效50：禁用
        orgId: '', // 用户所在部门ID
        userAccount: '',
        tenantName: this.tenantName,
        userType: 2, // 创建用户
        newPwd: '',
        confirmPwd: '',
        orgIdList: [],
      },
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  computed: {},
  methods: {
    init() {
      this.server.getUserInfo({ userId: this.userId }).then((res) => {
        if (res.code == 200) {
          this.formData.userName = res.data.userName;
          this.formData.userAccount = res.data.userAccount;
          this.initUserAccount = res.data.userAccount;
          this.formData.userMobile = res.data.userMobile;
          this.formData.userMail = res.data.userMail;
          this.formData.userStatus = res.data.userStatus;
          this.formData.tenantName = res.data.tenantName;
          this.formData.newPwd = 'Wang@123456';
          this.setOrgIdList(res.data.orgId);
        }
        this.showEditUser = true;
      });
    },
    setOrgIdList(orgId) {
      // 遍历嵌套数组，转换为一维数组
      const queue = [...this.treeData];
      const result = [];
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const next = queue.shift();
        if (!next) {
          break;
        }
        result.push({
          orgId: next.orgId,
          orgName: next.orgName,
          orgParentId: next.orgParentId,
        });
        if (Array.isArray(next.sonTree)) {
          queue.push(...next.sonTree);
        }
      }
      this.orgIdList = [];
      this.getOrgIdList(result, orgId);
      this.formData.orgIdList.reverse();
    },
    getOrgIdList(result, orgId) {
      let orgParentId = '';
      for (const org of result) {
        if (org.orgId == orgId) {
          orgParentId = org.orgParentId;
          this.formData.orgIdList.push(org.orgId);
          this.getOrgIdList(result, orgParentId);
        }
      }
    },
    saveUser() {
      const params = {
        userId: this.userId,
        orgId: this.formData.orgIdList[this.formData.orgIdList.length - 1],
        orgFullId: this.formData.orgIdList.join(':'),
        tenantName: this.formData.tenantName,
        userAccount: this.formData.userAccount,
        userMail: this.formData.userMail,
        userMobile: this.formData.userMobile,
        userName: this.formData.userName,
        userStatus: this.formData.userStatus,
        userType: this.formData.userType,
      };
      if (this.isEditPwd) {
        params.newPwd = this.Cryptojs.encrypt(this.formData.newPwd);
      } else if (!this.isEditPwd && params.newPwd) {
        delete params.newPwd;
      }
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.server.updateOrgUser(params).then((res) => {
            if (res.code == 200) {
              this.$message.success('用户编辑成功');
              this.$emit('closeUserDialog', { refreshPage: true });
            }
            this.loading = false;
          });
        }
      });
    },
    cancel() {
      this.$emit('closeUserDialog', { refreshPage: false });
    },
    editPwd() {
      this.pwdLabel = '新密码';
      this.formData.newPwd = '';
      this.isEditPwd = true;
    },
    cancelEditPwd() {
      this.pwdLabel = '用户密码';
      this.formData.newPwd = 'Wang@123456';
      this.isEditPwd = false;
    },
    selectIdChange(data) {
      this.$refs.cascader.dropDownVisible = false;
      this.formData.orgIdList = data;
    },
    closeDrawer() {
      this.showEditUser = false;
      this.$emit('closeUserDialog', { refreshPage: false });
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
<style >
.tl-drawer-user-edit .el-drawer {
  width: 500px !important;
}
</style>