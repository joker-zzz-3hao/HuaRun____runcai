<!--
  功能：
  作者：王志任
  时间：2020年08月04日 15:38:15
  备注：
-->
<template>
  <div>
    <span @click="editPwd">修改密码</span>
    <el-form ref="userForm" :model="formData" label-width="80px">
      <el-form-item
        label="用户名称"
        prop="userName"
        :rules="[{required:true,message:'请填写用户名称',trigger:'blur'}]"
      >
        <el-input v-model.trim="formData.userName" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item
        label="用户账号"
        prop="userAccount"
        :rules="[{required:true,validator:validateAccount,trigger:'blur'}]"
      >
        <el-input v-model.trim="formData.userAccount" maxlength="50"></el-input>
      </el-form-item>

      <el-form-item
        label="手机号"
        prop="userMobile"
        :rules="[{required:true,validator:validateInsideMobile,trigger:'blur'}]"
      >
        <el-input v-model.trim="formData.userMobile"></el-input>
      </el-form-item>
      <el-form-item
        label="电子邮箱"
        prop="userMail"
        :rules="[{required:true,validator:validateEmail,trigger:'blur'}]"
      >
        <el-input v-model.trim="formData.userMail"></el-input>
      </el-form-item>
      <el-form-item label="所属租户">
        <el-input v-model.trim="formData.tenantName" disabled></el-input>
      </el-form-item>
      <el-form-item
        label="所在部门"
        prop="orgId"
        :rules="[{required:true,message:'请选择部门',trigger:'blur'}]"
        v-if="initDepartment.orgId || optionType == 'create'"
      >
        <!-- <tl-department
          v-model="formData.orgId"
          :data="treeData"
          :defaultProps="{ children: 'sonTree', label: 'orgName'}"
          :initDepartment="initDepartment"
          :type="'department'"
          @handleData="handleData"
        ></tl-department>-->
        <el-cascader
          v-model="value"
          :options="treeData"
          :props="{ expandTrigger: 'hover',label:'orgName',children:'sonTree' }"
          @change="handleChange"
        ></el-cascader>
        <el-button @click="addOrg">添加部门</el-button>
      </el-form-item>

      <el-form-item prop="sortIndex">
        <el-button :loading="loading" @click="saveUser">确定</el-button>
        <el-button :disabled="loading" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="修改密码"
      :append-to-body="false"
      :modal-append-to-body="false"
      :visible.sync="pwdVisible"
      v-if="pwdVisible"
      width="30%"
      :before-close="closeEditDialog"
      :modal="false"
      :close-on-click-modal="false"
    >
      <el-form ref="editPwd" label-width="80px" :model="formData">
        <el-form-item
          label="原始密码"
          prop="loginPwd"
          :rules="[
          {required:true,message:'请输入原始密码',trigger:'blur'}]"
        >
          <el-input v-model.trim="formData.loginPwd" show-password></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPwd"
          :rules="[{required:true,validator:validatePwd,trigger:'blur'}]"
        >
          <el-input v-model.trim="formData.newPwd" show-password></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPwd"
          :rules="[
          {required:true,validator:validateNewConfirmPwd,trigger:'blur'}]"
        >
          <el-input v-model.trim="formData.confirmPwd" show-password></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="cancelEditPwd">取 消</el-button>
          <el-button type="primary" @click="confirmEditPwd">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import department from '@/components/department';
import validateMixin from '../validateMixin';

export default {
  name: 'createOrEditUser',
  mixins: [validateMixin],
  components: {
    // 'tl-department': department,
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
    optionType: {
      type: String,
      default() {
        return 'create';
      },
    },
    userAccount: {
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
      loading: false,
      initDepartment: {},
      isEditPwd: false,
      pwdVisible: false,
      formData: {
        userName: '', // 用户名称
        userMobile: '', // 手机
        userMail: '', // 邮箱
        userStatus: '0', // 状态 0有效50：禁用
        orgId: this.treeData[0].orgId, // 用户所在部门ID
        userAccount: '',
        tenantName: this.tenantName,
        userType: 2,
        loginPwd: '', // 密码
        newPwd: '',
        confirmPwd: '',
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
      this.server.getUserInfo({ userAccount: this.userAccount }).then((res) => {
        if (res.code == 200) {
          this.formData.userName = res.data.userName;
          this.formData.userAccount = res.data.userAccount;
          this.formData.userMobile = res.data.userMobile;
          this.formData.userMail = res.data.userMail;
          this.formData.orgId = res.data.orgId;
          this.formData.userStatus = res.data.userStatus;
          this.formData.tenantName = res.data.tenantName;

          this.setInitDepartment(res.data.orgId);
        }
      });
    },
    setInitDepartment(orgId) {
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
        });
        if (Array.isArray(next.sonTree)) {
          queue.push(...next.sonTree);
        }
      }
      // 遍历一维数组，设置initDepartment值
      for (const org of result) {
        if (org.orgId == orgId) {
          this.initDepartment = {
            orgId, orgName: org.orgName,
          };
        }
      }
    },

    handleData(date) {
      this.formData.orgId = date.orgId;
    },
    saveUser() {
      delete this.formData.confirmPwd;
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.server.updateOrgUser(this.formData).then((res) => {
            if (res.code == 200) {
              this.$message.success('用户编辑成功');
            }
            this.loading = false;
          });
        }
      });
    },
    cancel() {
      this.isEditPwd = false;
      this.close();
    },
    editPwd() {
      this.formData.loginPwd = '';

      this.pwdVisible = true;
    },
    confirmEditPwd() {
      this.$refs.editPwd.validate((valid) => {
        if (valid) {
          this.isEditPwd = true;
          this.pwdVisible = false;
        }
      });
    },
    cancelEditPwd() {
      this.isEditPwd = false;
      this.closeDialog();
    },
    closeEditDialog() {
      this.isEditPwd = false;
      this.closeDialog();
    },
    closeDialog() {
      this.formData.loginPwd = '';
      this.formData.newPwd = '';
      this.formData.confirmPwd = '';
      this.pwdVisible = false;
    },
    addOrg() {
      this.$emit('createDepart');
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>