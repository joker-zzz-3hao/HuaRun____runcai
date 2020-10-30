import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  queryOfPage(param) {
    return this._ajaxPost('gateway/system-service/sys/dictionary/queryOfPage', param);
  }

  onlineUserInfo(param) {
    return this._ajaxPost('gateway/account-service/collect/onlineUserInfo', param);
  }

  getLoginLogPage(param) {
    return this._ajaxPost('gateway/account-service/getLoginLogPage', param);
  }
}
