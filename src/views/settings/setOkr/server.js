/*
 * @Author: 许志鹏
 * @Date: 2020-08-11 19:40:03
 * @Description: file content
 */
import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  configQuery(param) {
    return this._ajaxPost('system-service/sys/config/query', param);
  }

  addOrUpdate(param) {
    return this._ajaxPost('system-service/sys/config/addOrUpdate', param);
  }
}