import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 查询组织
  getOrg(param) {
    return this._ajaxPost('gateway/system-service/sys/organization/getOrg', param);
  }

  // 查询组织包含的用户列表
  getUserListByOrgId(param) {
    return this._ajaxPost('gateway/system-service/sys/user/listUserPage', param);
  }

  // 发送消息
  sendMessage(param) {
    return this._ajaxPost('gateway/system-service/sys/notice/sendNotice ', param);
  }
}
