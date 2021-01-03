/*
 * @Author: your name
 * @Date: 2020-12-28 14:31:04
 * @LastEditTime: 2021-01-03 15:14:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cr-talent-web\src\views\login\server.js
 */
import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  login(param) {
    return this._ajaxPost('/gateway/account-service/outside/login', param);
  }

  // 获取租户列表
  getTenantList(param) {
    return this._ajaxPost(`/gateway/account-service/outside/tenants?tag=${param}`, param);
  }

  // 切换组织架构
  selectTenant(param) {
    return this._ajaxPost('/gateway/account-service/outside/switchTenant', param);
  }
}