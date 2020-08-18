export default {
  // 获取用户信息
  getUserInfo({ dispatch, commit }) {
    console.log(dispatch);
    const infoUrl = '/gateway/privilege-service/privilege/function/queryByTenantIdAndUserId';
    return window.$ajax.get(infoUrl).then((response) => {
      if (response.data.code == 200) {
        commit('setUserInfo', response.data.data);
        return response.data;
      }
    });
  },
  // 登出
  ldapLogout({ dispatch, commit }) {
    console.log(dispatch);
    const infoUrl = '/gateway/talent-gateway-service/account-service/ldapLogout';
    return window.$ajax.post(infoUrl).then((response) => {
      if (response.data.code == 200) {
        commit('setUserInfo', {});
        return response.data;
      }
    });
  },
};