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

  addokr(param) {
    return this._ajaxPost('gateway/talent-okr/okr/main/add', param);
  }

  getUndertakeOkr(param) {
    return this._ajaxPost('gateway/talent-okr/okr/main/getUndertakeOkr', param);
  }

  queryCultureList(param) {
    return this._ajaxPost('gateway/talent-okr/okr/cultureValue/queryCultureList', param);
  }

  getOkrCycleList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }

  modifyOkrInfo(param) {
    return this._ajaxPost('gateway/talent-okr/okr/main/modifyOkrInfo', param);
  }

  saveOkrDraft(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrDraft/saveOkrDraft', param);
  }

  deleteOkrDraft(param) {
    return this._ajaxPost(`gateway/talent-okr/okr/okrDraft/deleteOkrDraft?okrDraftId=${param.okrDraftId}`, param);
  }

  getOkrModifyUndertakeOkrList(param) {
    return this._ajaxPost('gateway/talent-okr/okr/main/getOkrModifyUndertakeOkrList', param);
  }
}