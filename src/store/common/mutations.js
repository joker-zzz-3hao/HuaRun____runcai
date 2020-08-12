export default {
  // 设置OKR审批列表和详情切换
  setOkrApprovalStep: (state, okrApprovalStep = {}) => {
    state.okrApprovalStep = okrApprovalStep;
  },
  // 设置承接地图和对齐详情切换
  undertakeMapsStep: (state, undertakeMapsStep = {}) => {
    state.undertakeMapsStep = undertakeMapsStep;
  },
  // 设置从承接地图传入的数据
  setundertakeDetail: (state, undertakeDetail = {}) => {
    state.undertakeDetail = undertakeDetail;
  },
  // 设置OKR审批列表和详情切换
  setDetailData: (state, okrApprovalDetail = {}) => {
    state.okrApprovalDetail = okrApprovalDetail;
  },
};