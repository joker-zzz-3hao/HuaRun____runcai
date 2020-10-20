import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  queryOfPage(param) {
    return this._ajaxPost('gateway/system-service/sys/dictionary/queryOfPage', param);
  }
}
