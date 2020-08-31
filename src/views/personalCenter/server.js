import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 修改密码
  updateResetPassword(param) {
    return this._ajaxPost('gateway/system-service/sys/user/updateResetPassword', param);
  }
}
