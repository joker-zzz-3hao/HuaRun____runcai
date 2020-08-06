import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getOkrCycleList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }

  getOrgTable(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/orgTable', param);
  }

  getOkrTree(param) {
    return this._ajaxPost(`gateway/talent-query/okr/query/okrTree?periodId=${param.periodId}&orgId=${param.orgId}`, param);
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