// import qs from 'qs';

export default {
  // 获取用户信息
  // getUserInfo({ dispatch, commit }) {
  //   console.log(dispatch);
  //   const infoUrl = '/gateway/privilege-service/privilege/function/queryByTenantIdAndUserId';
  //   return window.$ajax.get(infoUrl).then((response) => {
  //     if (response.data.code == 200) {
  //       if (response.data.data.roleList && response.data.data.roleList.length) {
  //         console.log('getuser');
  //         commit('setRoleCode', response.data.data.roleList.map((item) => item.roleCode));
  //       }
  //       if (response.data.data.orgList && response.data.data.orgList.length > 0) {
  //         try {
  //           const orgFullId = response.data.data.orgList.filter((item) => item.orgId == response.data.data.orgId);
  //           commit('setOrgFullId', orgFullId[0].orgFullId);
  //         } catch (err) {
  //           console.log(err);
  //         }
  //       }
  //       commit('setUserInfo', response.data.data);
  //       return response.data;
  //     }
  //   });
  // },

};