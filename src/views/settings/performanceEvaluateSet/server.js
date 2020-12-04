import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  addEvaluate(param) {
    return this._ajaxPost('gateway/talent-okr/assessment/rule/create', param);
  }

  updateEvaluate(param) {
    return this._ajaxPost('gateway/talent-okr/assessment/rule/update', param);
  }

  getEvaluateList(param) {
    return this._ajaxPost('gateway/talent-query/assessment/rule/query', param);
  }
}