<!--
 * @Author: your name
 * @Date: 2020-12-28 14:31:04
 * @LastEditTime: 2021-01-02 15:05:47
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \cr-talent-web\src\views\login\transfer.vue
-->
<template>
  <section class="login-layout">
    <div class="loading-box">
      <i class="el-icon-loading"></i>
      <em>登录跳转中</em>
      <el-dialog
        :append-to-body="true"
        :visible="visible"
        @close="close"
        :title="diaTitle"
        :close-on-click-modal="false"
        width="30%"
      >
        <div>
          <el-form ref="dataForm" :model="formData" label-width="120px">
            <el-form-item
              label="租户群组名称"
              prop="groupName"
              :rules="[
                { required: true, message: '请填写群组名称', trigger: blur },
              ]"
            >
              <el-input v-model="formData.groupName" maxlength="50"></el-input
            ></el-form-item>
          </el-form>
          <div class="operating-box">
            <el-button
              :loading="loading"
              type="primary"
              class="tl-btn amt-bg-slip"
              @click="save"
              >确认</el-button
            >
            <el-button
              :disabled="loading"
              plain
              class="tl-btn amt-border-fadeout"
              @click="cancel"
              >取消</el-button
            >
          </div>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'transfer',
  components: {
  },
  data() {
    return {
      adminFlag: false,
      visible: false,
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  mounted() {
    // 判断是否有system权限，如果是system就直接跳转系统管理，如果不是就跳转润才首页
    const self = this;
    self.userInfo.privilegeList.forEach((item) => {
      if (item.functionCode == 'sys_system') {
        self.adminFlag = true;
      }
    });
    if (self.adminFlag) {
      self.$router.push({
        name: 'tenantManage',
      });
    } else {
      self.$router.push({
        name: this.userInfo.defaultJump || 'overview',
      });
    }
  },
  methods: {},
};
</script>