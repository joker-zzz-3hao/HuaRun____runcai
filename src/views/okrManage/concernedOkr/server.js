import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  focusList(param) {
    return this._ajaxPost('gateway/talent-okr/okr/focus/list', param);
  }

  addFocus(param) {
    return this._ajaxPost('gateway/talent-okr/okr/focus/add', param);
  }

  queryOrgAndUser(param) {
    return this._ajaxPost('gateway/system-service/sys/organization/queryOrgAndUser', param);
  }

  queryFocusUserOkr(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/queryFocusUserOkr', param);
  }
}