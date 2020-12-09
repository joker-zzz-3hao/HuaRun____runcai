import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  okrReviewList(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrReview/okrReviewList', param);
  }

  getOkrReviewDetail(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrReview/getOkrReviewDetail', param);
  }

  // okr复盘沟通保存
  okrReviewCommunicationSave(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrReview/okrReviewCommunicationSave', param);
  }

  // okr复盘沟通提交
  okrReviewCommunicationSubmit(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrReview/okrReviewCommunicationSubmit', param);
  }

  // okr复盘保存
  okrReviewSave(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrReview/okrReviewSave', param);
  }

  // okr复盘提交
  okrReviewSubmit(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrReview/okrReviewSubmit', param);
  }

  getOkrCycleList(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/period', param);
  }

  getOkrReviewHistoryList(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrReview/getOkrReviewHistoryList', param);
  }

  // 查询复盘列表
  getOkrReviewPage(param) {
    return this._ajaxPost('gateway/talent-query/okr/review/query/getOkrReviewPage', param);
  }

  // 更新文件状态
  updateResource(param) {
    return this._ajaxPost(`gateway/system-service/sys/attachment/updateResource?resourceId=${param.resourceId}&sourceType=${param.sourceType}`, param);
  }

  // 查询排名列表接口
  assessment(param) {
    return this._ajaxPost('gateway/talent-okr/assessment/result/init', param);
  }

  // 绩效排名暂存
  assessmentSave(param) {
    return this._ajaxPost('gateway/talent-okr/assessment/result/save', param);
  }

  // 绩效排名
  summary(param) {
    return this._ajaxPost('gateway/talent-okr/assessment/result/summary', param);
  }

  // 绩效排名提交
  assessmentSubmit(param) {
    return this._ajaxPost('gateway/talent-okr/assessment/result/submit', param);
  }

  // 查询组织
  getOrgTable(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/orgTable', param);
  }

  // 查询复核列表
  getOkrCheckPage(param) {
    return this._ajaxPost('gateway/talent-query/okr/review/query/getOkrCheckPage', param);
  }

  getOkrCheckDetail(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrReview/getOkrCheckDetail', param);
  }

  // 提交复核
  okrCheckSubmit(param) {
    return this._ajaxPost('gateway/talent-okr/okr/okrReview/okrCheckSubmit', param);
  }
}
