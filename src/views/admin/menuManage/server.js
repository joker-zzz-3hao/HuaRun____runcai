import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  addOrUpdate(param) {
    return this._ajaxPost('gateway/system-service/sys/function/addOrUpdate', param);
  }

  queryMenu(param) {
    return this._ajaxPost('gateway/system-service/sys/function/query', param);
  }

  // 删除菜单
  deleteById(param) {
    return this._ajaxPost('gateway/system-service/sys/function/deleteById', param);
  }
}