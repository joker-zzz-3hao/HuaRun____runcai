<template>
  <section class="header-wrap">
    <div class="area-left">
      <div class="logo-bg">
        <div class="logo">logo</div>
      </div>
      <div class>
        <span v-if="userInfo.orgList &&  userInfo.orgList.length <= 1">{{userInfo.orgName}}</span>
        <el-select v-model="orgId" @change="switchOrg">
          <el-option
            v-for="item in userInfo.orgList"
            :key="item.orgId"
            :label="item.orgName"
            :value="item.orgId"
          >
            <span>{{item.orgName}}</span>
            <span v-if="item.orgId == userInfo.orgId">当前选择</span>
          </el-option>
        </el-select>
      </div>
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
import Server from '../server';

const server = new Server();

export default {
  name: 'tlHeader',
  data() {
    return {
      server,
      orgId: '',
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  mounted() {
    this.orgId = this.userInfo.orgId;
  },
  mixins: [global],
  methods: {
    loginOut() {
      loginOut();
    },
    switchOrg() {
      this.server.switchorg({ orgId: this.orgId }).then((res) => {
        if (res.code == 200) {
          console.log(res.data);
          window.location.reload();
        }
      });
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