import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getOrgTable(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/orgTable', param);
  }
}