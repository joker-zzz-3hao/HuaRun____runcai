import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getokrdata(param) {
    return this._ajaxPost('gateway/crcloud-okrManage/getokrdata', param);
  }

  getTimeCycle(param) {
    return this._ajaxPost('gateway/crcloud-okrManage/getTimeCycle', param);
  }

  getphilosophy(param) {
    return this._ajaxPost('gateway/crcloud-okrManage/getphilosophy', param);
  }

  getokrDetail(param) {
    return this._ajaxPost(`gateway/talent-query/okr/query/okrDetail?okrId=${param.okrId}`);
  }

  addokr(param) {
    return this._ajaxPost('gateway/talent-okr/okr/main/add', param);
  }

  getUndertakeOkr(param) {
    return this._ajaxPost(`gateway/talent-okr/okr/main/getUndertakeOkr?periodId=${param.periodId}`);
  }

  queryCultureList(param) {
    return this._ajaxPost('gateway/talent-okr/okr/cultureValue/queryCultureList', param);
  }

  getOkrCycleList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }
}