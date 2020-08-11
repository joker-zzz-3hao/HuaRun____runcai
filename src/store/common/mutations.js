export default {
  // 设置OKR审批列表和详情切换
  setOkrApprovalStep: (state, okrApprovalStep = {}) => {
    state.okrApprovalStep = okrApprovalStep;
  },
  // 设置OKR审批列表和详情切换
  setDetailData: (state, okrApprovalDetail = {}) => {
    state.okrApprovalDetail = okrApprovalDetail;
  },
};