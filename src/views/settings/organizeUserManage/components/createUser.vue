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
      :title="userTitle"
      :close-on-click-modal="false"
    >
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
          label="用户密码"
          prop="loginPwd"
          :rules="[
          {required:true,validator:validatePwd,trigger:'blur'}]"
        >
          <el-input v-model.trim="formData.loginPwd" show-password></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPwd"
          :rules="[
          {required:true,validator: validateConfirmPwd,trigger:'blur'}]"
        >
          <el-input v-model.trim="formData.confirmPwd" show-password></el-input>
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
        ></el-form-item>
        <el-form-item prop="sortIndex">
          <el-button :loading="loading" @click="saveUser">确定</el-button>
          <el-button :disabled="loading" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
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
    optionType: {
      type: String,
      default() {
        return 'create';
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
      visible: false,
      loading: false,
      userTitle: '创建用户',
      pwdLabel: '用户密码',
      initDepartment: {},
      isEditPwd: false,
      formData: {
        userName: '', // 用户名称
        loginPwd: '', // 密码
        confirmPwd: '',
        userMobile: '', // 手机
        userMail: '', // 邮箱
        userStatus: '0', // 状态 0有效50：禁用
        orgId: this.treeData[0].orgId, // 用户所在部门ID
        userAccount: '',
        tenantName: this.tenantName,
        userType: 2,
        newPwd: '',
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
      this.setInitDepartment(this.globalOrgId);
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
      delete this.formData.confirmPwd;
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.server.createUser(this.formData).then((res) => {
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
    editPwd() {
      this.pwdLabel = '原始密码';
      this.formData.loginPwd = '';
      this.isEditPwd = true;
    },
    cancelEditPwd() {
      this.pwdLabel = '用户密码';
      this.formData.loginPwd = '******';
      this.isEditPwd = false;
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>