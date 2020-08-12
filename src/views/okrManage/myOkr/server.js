import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getokrdata(param) {
    return this._ajaxPost('gateway/crcloud-okrManage/getokrdata', param);
  }

  getTimeCycle(param) {
    return this._ajaxPost('gateway/crcloud-okrManage/getTimeCycle', param);
  }

  getokrDetail(param) {
    return this._ajaxPost(`gateway/talent-query/okr/query/okrDetail?okrId=${param.okrId}`);
  }

  getmyOkr(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/myOkr', param);
  }

  getOkrCycleList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }

  okrSupport(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrSupport/support', param);
  }

  getSupportList(param) {
    return this._ajaxPost(`gateway/talent-okr/okr/okrSupport/getSupportList?okrId=${param.okrId}`);
  }

  okrOperationHistory(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/okrOperationHistory', param);
  }
}