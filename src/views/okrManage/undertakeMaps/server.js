import ServerBase from '@/ajax/serverBase';
import qs from 'qs';

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
    return this._ajaxPost('gateway/talent-query/okr/query/okrContinueMap', param);
  }

  getokrDetail(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/okrDetail?okrId=111111222', param);
  }

  getOkrCycleList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }

  getOrgTable(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/orgTable', param);
  }

  getOkrTree(param) {
    return this._ajaxPost(`gateway/talent-query/okr/query/okrTree?periodId=${param.periodId}`, param);
  }

  getDepartmentList(param) {
    return this._ajaxPost('gateway/okr/departmentList', param);
  }

  searchKeyword(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }

  okrCheck(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/okrCheck', param);
  }

  summitUpdate(param) {
    return this._ajaxPost('gateway/talent-okr/okr/main/singleUpdateProcess', param);
  }

  queryOAndKrList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/queryOAndKrList', param);
  }

  // 传入orgId与userId判断首页身份
  identity(param) {
    return this._ajaxPost(`gateway/talent-query/home/person/identity?${qs.stringify(param)}`);
  }
}