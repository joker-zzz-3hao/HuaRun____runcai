import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getDepartmentList(param) {
    return this._ajaxPost('gateway/okr/departmentList', param);
  }

  queryByTenantIdAndUserId(param) {
    return this._ajaxGet('gateway/privilege-service/privilege/function/queryByTenantIdAndUserId', param);
  }
}