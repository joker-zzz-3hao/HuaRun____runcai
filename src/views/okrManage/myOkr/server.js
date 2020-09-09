import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 查okr详情
  getokrDetail(param) {
    return this._ajaxPost(`gateway/talent-query/okr/query/okrDetail?okrId=${param.okrId}`);
  }

  // 查okr列表
  getmyOkr(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/myOkr', param);
  }

  // 查周期
  getOkrCycleList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }

  // 点赞
  okrSupport(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrSupport/support', param);
  }

  // 查点赞列表
  getSupportList(param) {
    return this._ajaxPost(`gateway/talent-okr/okr/okrSupport/getSupportList?okrId=${param.okrId}`);
  }

  // 查操作历史
  okrOperationHistory(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrOperateHistory/getOkrHistory', param);
  }

  // 更新进度
  summitUpdate(param) {
    return this._ajaxPost('gateway/talent-okr/okr/main/updateOkrProcess', param);
  }

  // 历史版本
  selectOkrHistoryVersion(param) {
    return this._ajaxPost(`gateway/talent-okr/okr/main/selectOkrHistoryVersion?okrDetailId=${param.okrDetailId}`, param);
  }

  // 新建okr
  addokr(param) {
    return this._ajaxPost('gateway/talent-okr/okr/main/add', param);
  }

  // 承接项
  getUndertakeOkr(param) {
    return this._ajaxPost(`gateway/talent-okr/okr/main/getUndertakeOkr?periodId=${param.periodId}`);
  }

  // 价值观
  queryCultureList(param) {
    return this._ajaxPost('gateway/talent-okr/okr/cultureValue/queryCultureList', param);
  }

  // 变更
  modifyOkrInfo(param) {
    return this._ajaxPost('gateway/talent-okr/okr/main/modifyOkrInfo', param);
  }

  // 报错草稿
  saveOkrDraft(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrDraft/saveOkrDraft', param);
  }

  // 删除草稿
  deleteOkrDraft(param) {
    return this._ajaxPost(`gateway/talent-okr/okr/okrDraft/deleteOkrDraft?okrDraftId=${param.okrDraftId}`, param);
  }

  // 获取可更新承接项
  getOkrModifyUndertakeOkrList(param) {
    return this._ajaxPost('gateway/talent-okr/okr/main/getOkrModifyUndertakeOkrList', param);
  }

  ignoreUndertake(param) {
    return this._ajaxPost('gateway/talent-okr//okr/main/ignoreSpecifiedVersionOfOkrUndertake', param);
  }
}