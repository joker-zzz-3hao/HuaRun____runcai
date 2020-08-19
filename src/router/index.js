import Vue from 'vue';
import {
  getParams,
  localSave,
} from '@/lib/util';
// getOrigin,
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
  const userPowers = (window.$store.state.common.userInfo.privilegeList || []).map((item) => item
    .privilegeCode);
  if (typeof power == 'string') {
    return !!userPowers.includes(power) || userPowers.includes('admin') || (power == '');
  } if (Array.isArray(power)) {
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

router.beforeEach((to, from, next) => {
  const urlParams = getParams(window.location.href);
  const urlCrctoken = urlParams.crctoken;
  // const origin = getOrigin();
  // 判断获取的token,如果token存在就更新存到缓存
  if (urlCrctoken) {
    localSave('token', urlCrctoken);
  }
  // 首先判断localStorage是否有token,没有token就跳转到ladp登录页
  if (!localStorage.token || localStorage.token === null) {
    // 当token不存在时，如果是环境上就需要跳转到ladp登录页面，如果是本地启动就直接跳转login页面
    // if (origin == process.env.VUE_APP_PORTAL) {
    //   window.open(process.env.VUE_APP_LOGIN, '_self');
    // } else
    if (to.name == 'login') {
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
      } else if (to.name == 'login') {
        localStorage.token = '';
        next();
      } else {
        localStorage.token = '';
        next('login');
      }
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

export default router;