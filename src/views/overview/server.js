import ServerBase from '@/ajax/serverBase';
import qs from 'qs';

export default class Server extends ServerBase {
  riskStatistics(param) {
    return this._ajaxPost('gateway/talent-query/home/okr/riskStatistics', param);
  }

  identity(param) {
    return this._ajaxPost(`gateway/talent-query/home/person/identity?${qs.stringify(param)}`);
  }

  okrQuery(param) {
    return this._ajaxPost('gateway/system-service/sys/okr/queryPage', param);
  }

  okrStatistics(param) {
    return this._ajaxPost(`gateway/talent-query/home/person/okrStatistics?${qs.stringify(param)}`);
  }

  okrRisk(param) {
    return this._ajaxPost(`gateway/talent-query/home/team/okrRisk?${qs.stringify(param)}`);
  }

  okrData(param) {
    return this._ajaxPost(`gateway/talent-query/home/team/okrData?${qs.stringify(param)}`);
  }

  mainData(param) {
    return this._ajaxPost(`gateway/talent-query/home/org/mainData?${qs.stringify(param)}`);
  }

  // 查询下级部门
  queryMyOkr(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/myOkr', param);
  }

  calendarQurey(param) {
    return this._ajaxPost('gateway/weekly-service/calendar/qurey', param);
  }

  orgWeekly(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/statistic/orgWeekly', param);
  }

  orgEmotion(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/statistic/orgEmotion', param);
  }

  userWeekly(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/statistic/userWeekly', param);
  }

  teamEmotion(param) {
    return this._ajaxPost('gateway/weekly-service/weekly/statistic/teamEmotion', param);
  }

  teamWeekly(param) {
    return this._ajaxPost('gateway/weekly-service//weekly/statistic/teamWeekly', param);
  }

  // 查okr列表
  getmyOkr(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/myOkr', param);
  }

  getOkrCycleList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }
}
