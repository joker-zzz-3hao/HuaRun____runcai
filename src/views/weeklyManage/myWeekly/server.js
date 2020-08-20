import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  getCalendar(param) {
    return this._ajaxPost('gateway/weekly-service/calendar/qurey', param);
  }
}