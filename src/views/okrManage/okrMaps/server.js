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

  // 查okr详情
  getokrDetail(param) {
    return this._ajaxPost(`gateway/talent-query/okr/query/okrDetail?okrId=${param.okrId}`);
  }

  // 查点赞列表
  getSupportList(param) {
    return this._ajaxPost(`gateway/talent-okr/okr/okrSupport/getSupportList?okrId=${param.okrId}`);
  }

  // 查操作历史
  okrOperationHistory(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/okrOperationHistory', param);
  }

  // 搜索框查询
  search(param) {
    return this._ajaxPost('gateway/talent-query/okr/outside/search', param);
  }

  // 点赞
  okrSupport(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrSupport/support', param);
  }
}