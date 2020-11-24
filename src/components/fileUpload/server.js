/*
 * @Author: 王益
 * @Date: 2019-01-21 19:29:55
 * @LastEditors: 王益
 * @LastEditTime: 2019-04-15 16:18:05
 * @Description: file content
 */

import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  deleteFile(param = {}) {
    return this._ajaxPost(`gateway/system-service/sys/attachment/remove?resourceId=${param.resourceId}&sourceType=${param.sourceType}`);
  }
}
