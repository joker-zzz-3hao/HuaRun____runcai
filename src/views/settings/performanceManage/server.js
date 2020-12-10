import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getRuleList(param) {
    return this._ajaxPost('gateway/talent-query/assessment/rule/query', param);
  }

  orgQuery(param) {
    return this._ajaxPost('gateway/talent-query/assessment/periodRule/orgQuery', param);
  }

  getAmountData(param) {
    return this._ajaxPost('gateway/talent-query/assessment/periodRule/query', param);
  }

  addOrUpdateAmount(param) {
    return this._ajaxPost('gateway/talent-okr/assessment/periodRule/update', param);
  }

  // 查周期
  getOkrCycleList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }

  // 查询组织
  getOrg(param) {
    return this._ajaxPost('gateway/system-service/sys/organization/getOrg', param);
  }

  // 删除规则
  deleteRule(param) {
    return this._ajaxPost('gateway/talent-okr/assessment/periodRule/remove', param);
  }

  // 查询可分配数据
  getRemainAmountList(param) {
    return this._ajaxPost('gateway/talent-okr/assessment/periodRule/remove', param);
  }
}