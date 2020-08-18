import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  okrQuery(param) {
    return this._ajaxPost('gateway/system-service/sys/okr/query', param);
  }

  addOrUpdate(param) {
    return this._ajaxPost('gateway/system-service/sys/okr/addOrUpdate', param);
  }
}