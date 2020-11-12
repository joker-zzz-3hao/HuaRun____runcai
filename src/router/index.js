import Vue from 'vue';
import {
  getParams,
  localSave,
  getOrigin,
} from '@/lib/util';
import VueRouter from 'vue-router';
import loginJs from './login';
import consoleJs from './console';
import settingsJs from './settings';
import adminJs from './admin';
import demoJs from './demo';

Vue.use(VueRouter);
const routes = [...loginJs, ...consoleJs, ...settingsJs, ...adminJs, ...demoJs];

const router = new VueRouter({
  routes,
  base: process.env.BASE_URL,
  linkActiveClass: '',
  linkExactActiveClass: '',
});

// 判断权限
function hasPower(power) {
  const userPowers = (window.$store.state.common.userInfo.allMenuList || []).map((item) => item
    .functionCode);
  if (typeof power == 'string') {
    return !!userPowers.includes(power) || (power == '');
  }
  if (Array.isArray(power)) {
    let result = true;
    if (!userPowers.includes('admin')) {
      power.forEach((item) => {
        if (!userPowers.includes(item)) {
          result = false;
        }
      });
    }
    return result;
  }
}
// 判断浏览器是否是chrome、edge、firefox、sarif
function judeBrowser() {
  let inBrowser = typeof window !== 'undefined'
  let UA = inBrowser && window.navigator.userAgent.toLowerCase();
  let isEdge = UA && UA.indexOf('edge/') > 0
}

router.beforeEach((to, from, next) => {
  // 判断浏览器是否是chrome、edge、firefox、sarif
  judeBrowser();
  const urlParams = getParams(window.location.href);
  const urlCrctoken = urlParams.token;
  const origin = getOrigin();
  // 判断获取的token,如果token存在就更新存到缓存
  if (urlCrctoken) {
    localSave('token', urlCrctoken);
  }
  // 首先判断localStorage是否有token,没有token就跳转到ladp登录页
  if (!localStorage.token || localStorage.token === null) {
    // 当token不存在时，如果是环境上就需要跳转到ladp登录页面，如果是本地启动就直接跳转login页面
    if (origin == 'https://talent.crcloud.com' && !urlParams.isAdmin) {
      window.$store.commit('common/setUserInfo', { userInfo: {} });
      localStorage.setItem('token', '');
      window.open('https://portal.crc.com.cn/oamsso/logout.html?end_url=http%3a%2f%2fldap.talent.crcloud.com%3a8888%2faccount-service%2foutside%2fldapLogin', '_self');
    } else if (to.name == 'login') {
      next();
    } else {
      next('login');
    }
  } else if (localStorage.token && !(window.$store.getters['common/userInfo'].userName)) {
    // 没有用户信息时调查询用户信息接口
    window.$store.dispatch('common/getUserInfo').then((response) => {
      // 获取用户信息成功走200
      if (response && response.code == 200) {
        if (to.name == 'login') {
          next('transfer');
        } else if (to.meta.title) { // 判断路由是否存在
          // 无权限跳转至403页面
          if (!hasPower(to.meta.power)) {
            next('/exception403');
          } else {
            next();
          }
        } else {
          next('/exception404');
        }
      }
      // else if (to.name == 'login') {
      //   localStorage.token = '';
      //   next();
      // } else {
      //   localStorage.token = '';
      //   next('login');
      // }

      // TODO:
      // else if (origin == process.env.VUE_APP_PORTAL) {
      //   window.open(process.env.VUE_APP_LOGIN, '_self');
      // }
    });
  } else if (localStorage.token && (window.$store.getters['common/userInfo'].userName)) {
    if (to.name == 'login') {
      next('transfer');
    } else if (to.meta.title) {
      // 无权限跳转至403页面
      if (!hasPower(to.meta.power)) {
        next('/exception403');
      } else if (to.name == 'overview') {
        if (window.$store.getters['common/getIdentity'].data) {
          console.log(window.$store.getters['common/getIdentity']);
          const {
            identityType,
          } = window.$store.getters['common/getIdentity'].data;

          if (identityType == 'org') {
            next('/departleader');
          }
          if (identityType == 'team') {
            next('/teamleader');
          }
          if (identityType == 'person') {
            next('/grassStaff');
          }
        } else {
          console.log(window.$store.getters['common/userInfo'].orgId);
          window.$store.dispatch('common/getUserType', {
            user: window.$store.getters['common/userInfo'].userId,
            orgId: window.$store.getters['common/userInfo'].orgId,
          }).then((res) => {
            const {
              identityType,
            } = res.data;

            if (identityType == 'org') {
              next('/departleader');
            }
            if (identityType == 'team') {
              next('/teamleader');
            }
            if (identityType == 'person') {
              next('/grassStaff');
            }
          });
        }
      } else {
        next();
      }
    } else {
      next('/exception404');
    }
  }
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};
export default router;
