export default {
  // 获取用户信息
  getUserInfo({ dispatch, commit }) {
    console.log(dispatch);
    const infoUrl = 'gateway/crcloud-account/queryUserInfo';
    return window.$ajax.post(infoUrl).then((response) => {
      if (response.data.code == 200) {
        commit('setUserInfo', response.data.data);
        return response.data;
      }
    });
  },
};