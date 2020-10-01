import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  login(param) {
    return this._ajaxPost('/gateway/account-service/outside/login', param);
  }
}