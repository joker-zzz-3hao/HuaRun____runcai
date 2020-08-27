import ServerBase from '@/ajax/serverBase';
import qs from 'qs';

export default class Server extends ServerBase {
  identity(param) {
    return this._ajaxPost('gateway/talent-query/home/person/identity', param);
  }

  okrQuery(param) {
    return this._ajaxPost('gateway/system-service/sys/okr/queryPage', param);
  }

  okrStatistics(param) {
    return this._ajaxPost('gateway/talent-query/home/person/okrStatistics', param);
  }

  okrRisk(param) {
    return this._ajaxPost(`gateway/talent-query/home/team/okrRisk?${qs.stringify(param)}`);
  }

  okrData(param) {
    return this._ajaxPost(`gateway/talent-query/home/team/okrData?${qs.stringify(param)}`);
  }

  mainData(param) {
    return this._ajaxPost(`gateway/talent-query/home/org/mainData?${qs.stringify(param)}`);
  }
}
