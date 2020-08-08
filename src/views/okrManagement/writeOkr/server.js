import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getokrdata(param) {
    return this._ajaxPost('gateway/crcloud-okrManage/getokrdata', param);
  }

  getTimeCycle(param) {
    return this._ajaxPost('gateway/crcloud-okrManage/getTimeCycle', param);
  }

  getphilosophy(param) {
    return this._ajaxPost('gateway/crcloud-okrManage/getphilosophy', param);
  }

  getokrDetail(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/okrDetail?okrId=111111222', param);
  }

  addokr(param) {
    return this._ajaxPost('okr/main/add', param);
  }
}