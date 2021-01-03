<!--
 * @Author: your name
 * @Date: 2020-12-28 14:31:04
 * @LastEditTime: 2021-01-03 10:30:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cr-talent-web\src\views\login\transfer.vue
-->
<template>
  <section class="login-layout">
    <div class="loading-box">
      <i class="el-icon-loading"></i>
      <em>登录跳转中</em>
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
  methods: {

  },
};
</script>