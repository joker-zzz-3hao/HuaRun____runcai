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
    :modal="false"
    :visible.sync="visible"
    :wrapperClosable="false"
    class="tl-drawer tl-drawer-user-info"
  >
    <div>
      <el-form ref="userForm" :model="formData" label-width="80px">
        <el-form-item label="姓名">
          <span>{{ formData.userName }}</span>
        </el-form-item>
        <el-form-item label="用户账号">
          <span>{{ formData.userAccount }}</span>
        </el-form-item>
        <el-form-item label="手机号">
          <span>{{ formData.userMobile }}</span>
        </el-form-item>
        <el-form-item label="电子邮箱">
          <span>{{ formData.userMail }}</span>
        </el-form-item>
        <el-form-item label="所属租户">
          <span>{{ formData.tenantName }}</span>
        </el-form-item>
        <el-form-item label="所在部门">
          <span>
            <span>{{ orgName }}</span>
          </span>
        </el-form-item>
        <el-form-item label="用户类型">
          <span>{{
            formData.ldapType == "Contractor" ? "外部员工" : "内部员工"
          }}</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="operating-box">
      <el-button
        type="primary"
        class="tl-btn amt-bg-slip"
        :loading="loading"
        @click="cancel"
        >确定</el-button
      >
    </div>
  </el-drawer>
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
    userId: {
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
      orgName: '',
      formData: {
        userName: '', // 用户名称
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
        ldapType: '',
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
          this.orgName = res.data.orgName;
          this.ldapType = res.data.ldapType;
        }
        this.visible = true;
      });
    },
    closed() {
      this.$emit('update:showUserInfo', false);
    },
    cancel() {
      this.visible = false;
      this.$emit('closeUserDialog', { refreshPage: false });
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
<style >
.tl-drawer-user-info .el-drawer {
  width: 400px !important;
}
</style>