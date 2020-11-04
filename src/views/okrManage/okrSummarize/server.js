import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getOkrCycleList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }

  getOrgTable(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/orgTable', param);
  }

  queryAllOkrList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/queryAllOkrList', param);
  }

  summaryOkrInfo(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/summaryOkrInfo', param);
  }

  // 查okr详情
  getokrDetail(param) {
    return this._ajaxPost(`gateway/talent-query/okr/query/okrDetail?okrId=${param.okrId}`);
  }

  // 审阅
  okrSummaryRead(param) {
    return this._ajaxPost('gateway/talent-okr/okr/main/okrSummaryRead', param);
  }

  // 查点赞列表
  getSupportList(param) {
    return this._ajaxPost(`gateway/talent-okr/okr/okrSupport/getSupportList?okrId=${param.okrId}`);
  }

  // 查操作历史
  okrOperationHistory(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrOperateHistory/getOkrHistory', param);
  }

  // 历史版本
  selectOkrHistoryVersion(param) {
    return this._ajaxPost(`gateway/talent-okr/okr/main/selectOkrHistoryVersion?okrDetailId=${param.okrDetailId}`, param);
  }
}
