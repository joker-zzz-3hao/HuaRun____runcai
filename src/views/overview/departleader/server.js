import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  riskStatistics(param) {
    return this._ajaxPost('gateway/talent-query/home/okr/riskStatistics', param);
  }

  okrQuery(param) {
    return this._ajaxPost('gateway/system-service/sys/okr/queryPage', param);
  }
}