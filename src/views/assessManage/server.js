import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 查okr详情
  orgQuarterList(param) {
    return this._ajaxPost('gateway/talent-okr/okr/examine/orgQuarterList', param);
  }

  getUserQuarter(param) {
    return this._ajaxPost('gateway/talent-okr/okr/examine/getUserQuarter', param);
  }

  // 查周期
  getOkrCycleList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }

  querySubordinateBasic(param) {
    return this._ajaxPost('gateway/talent-query/okr/examine/querySubordinateBasic', param);
  }
}