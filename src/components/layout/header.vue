<template>
  <section class="header-wrap">
    <div class="area-left">
      <div class="logo-bg">
        <div class="logo">logo</div>
      </div>
      <div class="toggle-department">切换部门</div>
    </div>
    <div class="area-right">
      <ul class="top-menu">
        <li @click="go('notice')">
          <i></i>
          <em>通知</em>
          <div class="badge">9</div>
          <div class="remind-state"></div>
        </li>
        <li class="user-info">
          <img v-if="userInfo.headUrl" :src="userInfo.headUrl" alt />
          <div v-else-if="userInfo.userName" class="user-name">
            <em>{{userInfo.userName.substring(userInfo.userName.length-2)}}</em>
          </div>
        </li>
      </ul>
      <ul class="person-select">
        <li @click="go('personalCenter')">个人中心</li>
        <li @click="go('personConfig')">个人设置</li>
        <li @click="loginOut">退出登录</li>
      </ul>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { loginOut } from '@/lib/util';
import global from '@/mixin/global';

export default {
  name: 'tlHeader',
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  mixins: [global],
  methods: {
    loginOut() {
      loginOut();
    },
  },
};
</script>
<style>
.area-right:hover .person-select {
  display: block;
}
.person-select {
  display: none;
  position: absolute;
  right: 50px;
}
.person-select li {
  padding: 5px 20px;
  border: 1px solid blue;
}
</style>