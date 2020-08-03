import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getMockTable(param) {
    return this._ajaxPost('gateway/crcloud-demo/getTable', param);
  }

  getHistory(param) {
    return this._ajaxPost('gateway/crcloud-demo/getHistory', param);
  }

  productClassifyAllInfo(param) {
    return this._ajaxPost('gateway/crcloud-product/outside/productClassifyAllInfo', param);
  }

  getokrdata(param) {
    return this._ajaxPost('gateway/crcloud-demo/getokrdata', param);
  }

  getTimeCycle(param) {
    return this._ajaxPost('gateway/crcloud-demo/getTimeCycle', param);
  }
}