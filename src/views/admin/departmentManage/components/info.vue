<!--
  功能：
  作者：王志任
  时间：2020年08月04日 15:38:15
  备注：
-->
<template>
  <el-drawer
    :modal-append-to-body="false"
    :before-close="cancel"
    @closed="closed"
    :close-on-click-modal="false"
    title="用户详情"
    direction="rtl"
    size="35%"
    :modal="false"
    :visible.sync="visible"
    :wrapperClosable="false"
    class="tl-drawer tl-drawer-depart-info"
  >
    <div>
      <el-form ref="userForm" :model="formData" label-width="80px">
        <el-form-item label="用户名称">
          <span>{{formData.userName}}</span>
        </el-form-item>
        <el-form-item label="用户账号">
          <span>{{formData.userAccount}}</span>
        </el-form-item>
        <el-form-item label="手机号">
          <span>{{formData.userMobile}}</span>
        </el-form-item>
        <el-form-item label="电子邮箱">
          <span>{{formData.userMail}}</span>
        </el-form-item>
        <el-form-item label="所属租户">
          <span>{{formData.tenantName}}</span>
        </el-form-item>
        <el-form-item label="所在部门">
          <span>{{orgName}}</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="operating-box">
      <el-button type="primary" class="tl-btn amt-bg-slip" :loading="loading" @click="cancel">确定</el-button>
    </div>
  </el-drawer>
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
    tenantId: {
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
      visible: false,
      isEditPwd: false,
      initUserAccount: '',
      pwdLabel: '用户密码',
      orgName: '',
      formData: {
        userName: '', // 用户名称
        userMobile: '', // 手机
        userMail: '', // 邮箱
        userStatus: '0', // 状态 0有效50：禁用
        orgId: '', // 用户所在部门ID
        userAccount: '',
        tenantName: this.tenantName,
        userType: 2, // 创建用户
        loginPwd: '', // 密码
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
          this.formData.loginPwd = 'Wang@123456';
          this.orgName = res.data.orgName;
          this.setOrgIdList(res.data.orgId);
        }
        this.visible = true;
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
        tenantId: this.tenantId,
        userAccount: this.formData.userAccount,
        userMail: this.formData.userMail,
        userMobile: this.formData.userMobile,
        userName: this.formData.userName,
        userStatus: this.formData.userStatus,
        userType: this.formData.userType,
      };
      if (this.isEditPwd) {
        params.loginPwd = this.Cryptojs.encrypt(this.formData.loginPwd);
        params.newPwd = this.Cryptojs.encrypt(this.formData.newPwd);
      } else if (!this.isEditPwd && params.loginPwd && params.newPwd) {
        delete params.loginPwd;
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
    closed() {
      this.$emit('update:infoDrawer', false);
    },
    editPwd() {
      this.pwdLabel = '原始密码';
      this.formData.loginPwd = '';
      this.isEditPwd = true;
    },
    cancelEditPwd() {
      this.pwdLabel = '用户密码';
      this.formData.loginPwd = 'Wang@123456';
      this.isEditPwd = false;
    },
    selectIdChange(data) {
      this.formData.orgIdList = data;
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
<style >
.tl-drawer-depart-info .el-drawer {
  width: 400px !important;
}
</style>