import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  innermsg(param) {
    return this._ajaxPost('gateway/sms-service/innermsg/list', param);
  }
}