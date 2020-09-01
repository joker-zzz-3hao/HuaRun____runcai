import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  weeklyEvents(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/events', param);
  }
}