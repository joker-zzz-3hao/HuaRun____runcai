import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  addEvaluate(param) {
    return this._ajaxPost('gateway/talent-okr/assessment/rule/create', param);
  }
}