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
    return this._ajaxPost('gateway/talent-query/assessment/periodRule/update', param);
  }
}