/*
 * @Author: 许志鹏
 * @Date: 2020-08-12 18:48:11
 * @Description: file content
 */
import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  delUserRole(param) {
    return this._ajaxPost('gateway/system-service/sys/userRole/delUserRole', param);
  }

  listRoleUser(param) {
    return this._ajaxPost('gateway/system-service/sys/userRole/listRoleUser', param);
  }

  getOrg(param) {
    return this._ajaxPost('gateway/system-service/sys/organization/getOrg', param);
  }

  listOrgUser(param) {
    return this._ajaxPost('gateway/system-service/sys/user/listOrgUser', param);
  }

  addUserRole(param) {
    return this._ajaxPost('gateway/system-service/sys/userRole/addUserRole', param);
  }

  fuzzyQueryUser(param) {
    return this._ajaxPost('gateway/system-service/sys/user/fuzzyQueryUser', param);
  }
}