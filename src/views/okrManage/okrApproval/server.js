import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getokrApproval(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/okrApprovalList', param);
  }

  getOkrCycleList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }

  approval(param) {
    return this._ajaxPost('gateway/talent-okr/okr/approval', param);
  }

  okrOperationHistory(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/okrOperationHistory', param);
  }
}