import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  searchTable(param) {
    return this._ajaxPost('gateway/task-service/searchTable', param);
  }
}