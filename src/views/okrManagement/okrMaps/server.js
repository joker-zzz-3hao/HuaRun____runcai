import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getOkrCycleList(param) {
    return this._ajaxPost('gateway/okr/okrCycleList', param);
  }

  test(param) {
    return this._ajaxPost('talent-gateway-service/account-service/test', param);
  }
}