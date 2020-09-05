import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  weeklyEvents(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/events', param);
  }

  orgCulture(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/statistic/orgCulture', param);
  }

  queryCultureList(param) {
    return this._ajaxPost('gateway/talent-okr/okr/cultureValue/queryCultureList', param);
  }

  getOrgTable(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/orgTable', param);
  }

  score(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/score', param);
  }

  getOkrCycleList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }

  tenantCultureScore(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/statistic/tenantCultureScore', param);
  }
}