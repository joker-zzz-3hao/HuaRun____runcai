import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 查询用户列表
  getUserLIst(param) {
    return this._ajaxPost('gateway/system-service/sys/user/getAdminUser', param);
  }

  // 修改密码
  editPwd(param) {
    return this._ajaxPost('gateway/system-service/sys/user/updateResetPassword', param);
  }
}
