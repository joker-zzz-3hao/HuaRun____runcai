<!--
  功能：
  作者：王志任
  时间：2020年08月04日 15:38:15
  备注：
-->
<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      @close="close"
      title="创建用户"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form ref="userForm" :model="formData" label-width="80px">
        <el-form-item
          label="姓名"
          prop="userName"
          :rules="[{ required: true, message: '请填写姓名', trigger: 'blur' }]"
        >
          <el-input
            v-model.trim="formData.userName"
            maxlength="50"
            clearable
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
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="用户密码"
          prop="loginPwd"
          :rules="[{ required: true, validator: validatePwd, trigger: 'blur' }]"
        >
          <el-input
            v-model.trim="formData.loginPwd"
            show-password
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPwd"
          :rules="[
            { required: true, validator: validateConfirmPwd, trigger: 'blur' },
          ]"
        >
          <el-input
            v-model.trim="formData.confirmPwd"
            show-password
            clearable
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
          <el-input v-model.trim="formData.userMobile" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="电子邮箱"
          prop="userMail"
          :rules="[
            { required: true, validator: validateEmail, trigger: 'blur' },
          ]"
        >
          <el-input v-model.trim="formData.userMail" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属租户">
          <el-input v-model.trim="formData.tenantName" disabled></el-input>
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
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-input v-model.trim="formData.userTypeLdap"></el-input>
        </el-form-item>
      </el-form>
      <div class="operating-box">
        <el-button
          :loading="loading"
          type="primary"
          class="tl-btn amt-bg-slip"
          @click="saveUser"
          >确定</el-button
        >
        <el-button
          :disabled="loading"
          plain
          class="tl-btn amt-border-fadeout"
          @click="cancel"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cryptojs from '@/lib/cryptojs';
import validateMixin from '../validateMixin';

export default {
  name: 'createUser',
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
      visible: false,
      loading: false,
      initUserAccount: '',
      formData: {
        userName: '', // 姓名
        loginPwd: '', // 密码
        confirmPwd: '',
        userMobile: '', // 手机
        userMail: '', // 邮箱
        userStatus: '0', // 状态 0有效50：禁用
        orgId: '', // 用户所在部门ID
        userAccount: '',
        tenantName: this.tenantName,
        userType: 2,
        newPwd: '',
        orgIdList: [],
        userTypeLdap: '',
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
      this.setOrgIdList(this.globalOrgId);
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
      this.formData.orgIdList = [];
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
    show() {
      this.visible = true;
    },
    close(status) {
      this.visible = false;
      this.$emit('closeUserDialog', { refreshPage: status == 'refreshPage' });
    },
    handleData(date) {
      this.formData.orgId = date.orgId;
    },
    saveUser() {
      // delete this.formData.confirmPwd;
      const params = {
        orgId: this.formData.orgIdList[this.formData.orgIdList.length - 1],
        loginPwd: this.Cryptojs.encrypt(this.formData.loginPwd),
        orgFullId: this.formData.orgIdList.join(':'),
        tenantName: this.formData.tenantName,
        userAccount: this.formData.userAccount,
        userMail: this.formData.userMail,
        userMobile: this.formData.userMobile,
        userName: this.formData.userName,
        userStatus: this.formData.userStatus,
        userType: this.formData.userType,
      };
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.server.createUser(params).then((res) => {
            if (res.code == 200) {
              this.$message.success('用户创建成功');
              this.close('refreshPage');
            }
            this.loading = false;
          });
        }
      });
    },
    cancel() {
      this.close();
    },
    selectIdChange(data) {
      this.$refs.cascader.dropDownVisible = false;
      this.formData.orgIdList = data;
    },

  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>