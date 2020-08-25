import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 查询日历
  getCalendar(param) {
    return this._ajaxPost('gateway/weekly-service/calendar/qurey', param);
  }

  // 查询周报
  queryWeekly(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/get', param);
  }
}
