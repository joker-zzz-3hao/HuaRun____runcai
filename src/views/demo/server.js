import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getMockTable(param) {
    return this._ajaxPost('gateway/crcloud-demo/getTable', param);
  }

  productClassifyAllInfo(param) {
    return this._ajaxPost('gateway/crcloud-product/outside/productClassifyAllInfo', param);
  }
}