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
    return this._ajaxPost('gateway/talent-query/okr/outside/query/okrOperationHistory', param);
  }

  // 更新进度
  summitUpdate(param) {
    return this._ajaxPost('gateway/talent-okr/okr/main/updateOkrProcess', param);
  }

  // 历史版本
  selectOkrHistoryVersion(param) {
    return this._ajaxPost(`gateway/talent-okr/okr/main/selectOkrHistoryVersion?okrDetailId=${param.okrDetailId}`, param);
  }
}