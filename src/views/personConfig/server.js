import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  queryConfig(param) {
    return this._ajaxPost('gateway/system-service/sys/config/person/query', param);
  }

  addOrUpdate(param) {
    return this._ajaxPost('gateway/system-service/sys/config/person/addOrUpdate', param);
  }
}