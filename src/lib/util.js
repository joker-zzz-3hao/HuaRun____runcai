export const loginOut = () => {
  // 登出时清除缓存中的token和vuex中的用户信息
  localStorage.setItem('token', '');
  window.$store.commit('common/setUserInfo', { userInfo: {} });
  window.open(process.env.VUE_APP_LOGINOUT, '_self');
};
export const getOrigin = () => {
  const origin = window.location.origin
    ? window.location.origin
    : window.location.href.split('/#')[0];
  return origin;
};