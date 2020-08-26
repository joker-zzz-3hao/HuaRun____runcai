import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  riskStatistics(param) {
    return this._ajaxPost('gateway/talent-query/home/okr/riskStatistics', param);
  }
}