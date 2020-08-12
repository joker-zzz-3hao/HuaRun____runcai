/*
 * @Author: 许志鹏
 * @Date: 2020-08-12 13:49:27
 * @Description: file content
 */
import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  listRolePage(param) {
    return this._ajaxPost('system-service/sys/role/listRolePage', param);
  }

  queryMenu(param) {
    return this._ajaxPost('system-service/sys/function/query', param);
  }

  addRole(param) {
    return this._ajaxPost('system-service/sys/role/addRole', param);
  }
}