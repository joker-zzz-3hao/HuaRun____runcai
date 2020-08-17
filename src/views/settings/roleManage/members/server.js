import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  delUserRole(param) {
    return this._ajaxPost('system-service/sys/userRole/delUserRole', param);
  }

  listRoleUser(param) {
    return this._ajaxPost('system-service/sys/userRole/listRoleUser', param);
  }

  getOrg(param) {
    return this._ajaxPost('system-service/sys/organization/getOrg', param);
  }

  listOrgUser(param) {
    return this._ajaxPost('system-service/sys/user/listOrgUser', param);
  }

  addUserRole(param) {
    return this._ajaxPost('system-service/sys/userRole/addUserRole', param);
  }

  fuzzyQueryUser(param) {
    return this._ajaxPost('system-service/sys/user/fuzzyQueryUser', param);
  }
}