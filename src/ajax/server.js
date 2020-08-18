import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  queryByTenantIdAndUserId(param) {
    return this._ajaxGet('/gateway/privilege-service/privilege/function/queryByTenantIdAndUserId', param);
  }
}