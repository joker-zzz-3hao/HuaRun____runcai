import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getokrApproval(param) {
    return this._ajaxPost('gateway/crcloud-okrManage/getokrApproval', param);
  }
}