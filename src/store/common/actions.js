import qs from 'qs';

export default {
  // 获取用户信息
  getUserInfo({ dispatch, commit }) {
    console.log(dispatch);
    const infoUrl = '/gateway/privilege-service/privilege/function/queryByTenantIdAndUserId';
    return window.$ajax.get(infoUrl).then((response) => {
      if (response.data.code == 200) {
        if (response.data.data.roleList && response.data.data.roleList.length) {
          console.log('getuser');
          commit('setRoleCode', response.data.data.roleList.map((item) => item.roleCode));
        }
        commit('setUserInfo', response.data.data);
        return response.data;
      }
    });
  },
  // 登出
  ldapLogout({ dispatch, commit }) {
    console.log(dispatch);
    const infoUrl = '/gateway/account-service/ldapLogout';
    return window.$ajax.post(infoUrl).then((response) => {
      if (response.data.code == 200) {
        commit('setUserInfo', {});
        commit('setIdentity', {});
        return response.data;
      }
    });
  },

  getUserType({ commit }, params) {
    const url = `gateway/talent-query/home/person/identity?${qs.stringify({
      user: params.user,
      orgId: params.orgId,
    })}`;
    return window.$ajax.post(url).then((response) => {
      commit('setIdentity', response.data);
      return response.data;
    });
  },
};