<template>
  <section
    class="header-wrap"
    :class="{ 'no-mainnav': !$route.meta.hasMainMenu }"
  >
    <div class="area-left">
      <div class="logo-bg">
        <div class="logo"></div>
      </div>
      <dl class="toggle-department">
        <dt v-if="userInfo.orgList && userInfo.orgList.length > 1">切换团队</dt>
        <dd v-if="userInfo.orgList && userInfo.orgList.length <= 1">
          {{ userInfo.orgName }}
        </dd>
        <dd v-else>
          <el-select
            v-model="orgId"
            @change="switchOrg"
            :popper-append-to-body="true"
            popper-class="tl-select-dropdown"
            class="tl-select"
          >
            <el-option
              v-for="item in userInfo.orgList"
              :key="item.orgId"
              :label="item.orgName"
              :value="item.orgId"
            >
              <span>{{ item.orgName }}</span>
              <span v-if="item.orgFlag == 1">（虚线汇报）</span>
              <span v-if="item.orgFlag == 2">（代理）</span>
              <span v-if="item.orgId == userInfo.orgId">
                <i class="el-icon-check"></i>
              </span>
            </el-option>
          </el-select>
        </dd>
      </dl>
    </div>
    <div class="area-right">
      <ul class="top-menu">
        <li>
          <div @click="go('serviceManual')">使用手册</div>
        </li>
        <li v-if="showTeam">
          <div @click="go('teamsManage')">团队管理</div>
        </li>
        <li @click="go('notice')">
          <i class="el-icon-bell"></i>
          <em>通知</em>
          <div v-if="!(totalMeaasge == '0')" class="badge">
            {{ totalMeaasge }}
          </div>
          <div class="remind-state"></div>
        </li>
        <li>
          <el-dropdown class="tl-dropdown">
            <div class="el-dropdown-link user-info">
              <img v-if="userInfo.headUrl" :src="userInfo.headUrl" alt />
              <div v-else-if="userInfo.userName" class="user-name">
                <em>{{
                  userInfo.userName.substring(userInfo.userName.length - 2)
                }}</em>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="go('personalCenter')">
                <em>个人中心</em>
              </el-dropdown-item>
              <el-dropdown-item @click.native="downloadHelpFile">
                <em>帮助文档</em>
              </el-dropdown-item>
              <!-- <el-dropdown-item @click.native="go('personConfig')">
                <em>个人设置</em>
              </el-dropdown-item> -->
              <el-dropdown-item @click.native="loginOut">
                <em>退出登录</em>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
      <!-- <ul class="person-select">
        <li @click="go('personalCenter')">个人中心</li>
        <li @click="go('personConfig')">个人设置</li>
        <li @click="loginOut">退出登录</li>
      </ul>-->
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
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
      showTeam: false,
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      totalMeaasge: (state) => state.totalMeaasge,
    }),
  },
  mounted() {
    this.orgId = this.userInfo.orgId;
    if (this.userInfo.userId != 'admin') { this.init(); }
    this.userInfo.roleList.forEach((item) => {
      if (item.roleCode == 'TENANT_ADMIN' || item.roleCode == 'TEAM_ADMIN' || item.roleCode == 'ORG_ADMIN') {
        this.showTeam = true;
      }
    });
  },
  mixins: [global],
  methods: {
    ...mapMutations('common', ['setTotalMeaasge', 'changeTestModel']),
    init() {
      this.server.unread().then((res) => {
        if (res.code == '200') {
          this.setTotalMeaasge(res.data);
        }
      });
    },
    loginOut() {
      this.changeTestModel(false);
      loginOut();
    },
    switchOrg() {
      this.server.switchorg({ orgId: this.orgId }).then((res) => {
        if (res.code == 200) {
          window.location.reload();
        }
      });
    },
    downloadHelpFile() {
      this.$xconfirm({
        title: '',
        content: '确认下载润才帮助文档?',

      }).then(() => {
        // 下载
        window.open('');
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