import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getOkrCycleList(param) {
    // return this._ajaxPost('gateway/okr/okrCycleList', param);
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }

  getDepartmentList(param) {
    return this._ajaxPost('gateway/okr/departmentList', param);
  }

  searchKeyword(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }

  test(param) {
    return this._ajaxPost('talent-gateway-service/account-service/test', param);
  }
}