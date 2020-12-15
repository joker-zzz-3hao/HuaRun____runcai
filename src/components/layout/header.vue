<template>
  <section
    v-if="!$route.meta.isBrowser"
    class="header-wrap"
    :class="{ 'is-full-screen': !$route.meta.hasMainMenu }"
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
            popper-class="tl-select-dropdown toggle-teams"
            class="tl-select w220"
          >
            <el-option
              v-for="item in userInfo.orgList"
              :key="item.orgId"
              :label="item.orgName"
              :value="item.orgId"
            >
              <span>{{ item.orgName }}</span>
              <span v-if="item.orgFlag == 1">(虚线汇报)</span>
              <span v-if="item.orgFlag == 2">(代理)</span>
              <span v-if="item.orgFlag == 3">(综合岗)</span>
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
        <li class="top-menu-manual">
          <i></i>
          <em @click="openDoc">使用手册</em>
        </li>
        <li v-if="showTeam" class="top-menu-teams">
          <i></i>
          <em @click="go('teamsManage')">团队管理</em>
        </li>
        <li @click="go('notice')" class="top-menu-remind">
          <i></i>
          <em>通知</em>
          <div v-if="!(totalMeaasge == '0')" class="badge">
            {{ totalMeaasge }}
          </div>
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
              <el-dropdown-item @click.native="loginOut">
                <em>退出登录</em>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
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
    // showServiceManual() {
    //   return window.location.origin ? window.location.origin : window.location.href.split(
    //     '/#',
    //   )[0] != 'https://talent.crcloud.com';
    // },
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
    ...mapActions('common', ['getUserInfo']),
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
          if (this.$route.name == 'overview' || this.$route.name == 'departleader' || this.$route.name == 'grassStaff' || this.$route.name == 'teamleader') {
            this.getUserInfo().then(() => {
              this.checkUserType();
            });
            return false;
          }

          window.location.reload();
        }
      });
    },
    checkUserType() {
      this.server.identity({
        user: this.userInfo.userId,
        orgId: this.orgId,
      }).then((response) => {
        if (response.data.identityType == 'org') {
          this.$router.push({ path: '/departleader' });
          // eslint-disable-next-line no-unused-expressions
          this.$route.name == 'departleader' ? window.location.reload() : '';
        }
        if (response.data.identityType == 'team') {
          this.$router.push({ path: '/teamleader' });
          // eslint-disable-next-line no-unused-expressions
          this.$route.name == 'teamleader' ? window.location.reload() : '';
        }
        if (response.data.identityType == 'person') {
          this.$router.push({ path: '/grassStaff' });
          // eslint-disable-next-line no-unused-expressions
          this.$route.name == 'grassStaff' ? window.location.reload() : '';
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
    openDoc() {
      window.open('https://z3zs5t1od8.crc.feishu.cn/docs/dockalvLv50B4VpwQ578K6lYFn0?new_source=message');
    },
  },
};
</script>