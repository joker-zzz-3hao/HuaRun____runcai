import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  tenantList(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/query', param);
  }
}
