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
    return this._ajaxPost('gateway/talent-okr/okr/okrOperateHistory/getOkrApproveHistory', param);
  }

  // 查询综合管理员是否可审批
  getTypeConfig(param) {
    return this._ajaxPost('gateway/system-service/sys/config/query', param);
  }

  // 查询组织
  getOrgTable(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/orgTable', param);
  }
}