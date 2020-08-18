import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  configQuery(param) {
    return this._ajaxPost('gateway/system-service/sys/config/query', param);
  }

  addOrUpdate(param) {
    return this._ajaxPost('gateway/system-service/sys/config/addOrUpdate', param);
  }
}