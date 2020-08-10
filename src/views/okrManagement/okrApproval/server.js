import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getokrApproval(param) {
    return this._ajaxPost('gateway/crcloud-okrManage/getokrApproval', param);
  }

  getokrDetail(param) {
    return this._ajaxPost(`gateway/talent-query/okr/query/okrDetail?okrId=${param.okrId}`, param);
  }
}