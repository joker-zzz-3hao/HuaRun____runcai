/*
 * @Author: 许志鹏
 * @Date: 2020-08-04 15:38:01
 * @Description: file content
 */
import Vue from 'vue';
// import {
//   getParams,
//   loginOut,
//   localSave,
// } from '@/lib/util';
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
// function hasPower(power) {
//   const userPowers = (window.$store.state.common.userInfo.privilegeList || []).map((item) => item
//     .privilegeCode);
//   if (typeof power == 'string') {
//     return !!userPowers.includes(power) || userPowers.includes('admin') || (power == '');
//   } if (Array.isArray(power)) {
//     let result = true;
//     if (!userPowers.includes('admin')) {
//       power.forEach((item) => {
//         if (!userPowers.includes(item)) {
//           result = false;
//         }
//       });
//     }
//     return result;
//   }
// }

// router.beforeEach((to, from, next) => {
//   const urlParams = getParams(window.location.href);
//   const urlCrctoken = urlParams.crctoken;
//   // 判断获取的token,如果token存在就更新存到缓存
//   if (urlCrctoken) {
//     localSave('token', urlCrctoken);
//   }
//   // 首先判断localStorage是否有token,没有token就跳转到ladp登录页
//   if (!localStorage.token || localStorage.token === null) {
//     window.open(process.env.VUE_APP_LOGIN, '_self');
//   } else if (localStorage.token && !(window.$store.getters['common/userInfo'])) {
//     // 没有用户信息时调查询用户信息接口
//     window.$store.dispatch('common/getUserInfo').then((response) => {
//       if (response.code == 200) {
//         // 判断路由是否存在
//         if (to.meta.title) {
//           // 无权限跳转至403页面
//           if (!hasPower(to.meta.power)) {
//             next('/exception403');
//           } else {
//             next();
//           }
//         } else {
//           next('/exception404');
//         }
//       } else {
//         loginOut();
//       }
//     }).catch(() => {
//       loginOut();
//     });
//   } else if (localStorage.token && (window.$store.getters['common/userInfo'])) {
//     // 用户信息存在
//     // 判断路由是否存在
//     if (to.meta.title) {
//       // 无权限跳转至403页面
//       if (!hasPower(to.meta.power)) {
//         next('/exception403');
//       } else {
//         next();
//       }
//     } else {
//       next('/exception404');
//     }
//   }
// });

export default router;