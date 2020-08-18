import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  login(param) {
    return this._ajaxPost('/gateway/talent-gateway-service/account-service/outside/login', param);
  }
}