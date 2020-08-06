import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getokrdata(param) {
    return this._ajaxPost('gateway/crcloud-okrManage/getokrdata', param);
  }

  getTimeCycle(param) {
    return this._ajaxPost('gateway/crcloud-okrManage/getTimeCycle', param);
  }

  getmaps(param) {
    return this._ajaxPost('gateway/crcloud-okrManage/getmaps', param);
  }

  getokrDetail(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/okrDetail?okrId=111111222', param);
  }
}