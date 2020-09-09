import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getDepartmentList(param) {
    return this._ajaxPost('gateway/okr/departmentList', param);
  }

  switchorg(param) {
    return this._ajaxPost('gateway/account-service/switch/org', param);
  }
}