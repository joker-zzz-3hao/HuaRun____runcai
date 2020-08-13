import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  MenuList(param) {
    return this._ajaxPost('system-service/sys/function/query', param);
  }

  addOrUpdate(param) {
    return this._ajaxPost('system-service/sys/function/addOrUpdate', param);
  }

  queryMenu(param) {
    return this._ajaxPost('system-service/sys/function/query', param);
  }

  // 删除菜单
  deleteById(param) {
    return this._ajaxPost('system-service/sys/function/deleteById', param);
  }
}