import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  okrQuery(param) {
    return this._ajaxPost('gateway/system-service/sys/okr/queryPage', param);
  }

  addOrUpdate(param) {
    return this._ajaxPost('gateway/system-service/sys/okr/addOrUpdate', param);
  }
}