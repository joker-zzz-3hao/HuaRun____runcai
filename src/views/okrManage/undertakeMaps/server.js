import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getokrdata(param) {
    return this._ajaxPost('gateway/crcloud-okrManage/getokrdata', param);
  }

  getTimeCycle(param) {
    return this._ajaxPost('gateway/crcloud-okrManage/getTimeCycle', param);
  }

  // getmaps(param) {
  //   return this._ajaxPost('gateway/crcloud-okrManage/getmaps', param);
  // }
  getmaps(param) {
    return this._ajaxPost('gateway/talent-query/okr/outside/query/okrContinueMap', param);
  }

  getokrDetail(param) {
    return this._ajaxPost('gateway/talent-query/okr/outside/query/okrDetail?okrId=111111222', param);
  }

  getOkrCycleList(param) {
    return this._ajaxPost('gateway/talent-query/okr/outside/query/period', param);
  }

  getOrgTable(param) {
    return this._ajaxPost('gateway/talent-query/okr/outside/query/orgTable', param);
  }

  getOkrTree(param) {
    return this._ajaxPost(`gateway/talent-query/okr/outside/query/okrTree?periodId=${param.periodId}`, param);
  }

  getDepartmentList(param) {
    return this._ajaxPost('gateway/okr/departmentList', param);
  }

  searchKeyword(param) {
    return this._ajaxPost('gateway/talent-query/okr/outside/query/period', param);
  }

  okrCheck(param) {
    return this._ajaxPost('gateway/talent-query/okr/outside/query/okrCheck', param);
  }

  summitUpdate(param) {
    return this._ajaxPost('gateway/talent-okr/okr/main/updateOkrProcess', param);
  }
}