import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  sdkList(param) {
    return this._ajaxPost('gateway/account-admin/outside/face/sdk/list', param);
  }
}