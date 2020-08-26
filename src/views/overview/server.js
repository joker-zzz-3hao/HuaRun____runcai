import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  identity(param) {
    return this._ajaxPost('gateway/talent-query/home/person/identity', param);
  }
}