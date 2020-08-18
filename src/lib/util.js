export const loginOut = () => {
  // 登出时清除缓存中的token和vuex中的用户信息
  localStorage.setItem('token', '');
  window.$store.commit('common/setUserInfo', { userInfo: {} });
  window.$store.dispatch('common/ldapLogout').then((response) => {
    console.log(response);
    window.open(process.env.VUE_APP_PORTAL, '_self');
  });
};
export const getOrigin = () => {
  const origin = window.location.origin
    ? window.location.origin
    : window.location.href.split('/#')[0];
  return origin;
};
export const getParams = (url) => {
  const keyValueArr = url.split('?')[1] ? url.split('?')[1].split('&') : [];
  const paramObj = {};
  keyValueArr.forEach((item) => {
    const keyValue = item.split('=');
    // eslint-disable-next-line prefer-destructuring
    paramObj[keyValue[0]] = keyValue[1];
  });
  return paramObj;
};
export const localSave = (key, value) => {
  localStorage.setItem(key, value);
};