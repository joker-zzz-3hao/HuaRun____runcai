/*
 * @Author: 许志鹏
 * @Date: 2020-08-10 10:18:59
 * @Description: file content
 */
import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  tenantList(param) {
    return this._ajaxPost('system-service/sys/tenant/pageTenantList', param);
  }

  queryMenu(param) {
    return this._ajaxPost('system-service/sys/function/query', param);
  }

  getTenant(param) {
    return this._ajaxPost('system-service/sys/tenant/getTenant', param);
  }

  insertTenant(param) {
    return this._ajaxPost('system-service/sys/tenant/insertTenant', param);
  }

  updateTenant(param) {
    return this._ajaxPost('system-service/sys/tenant/updateTenant', param);
  }
}