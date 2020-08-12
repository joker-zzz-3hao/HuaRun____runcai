export default {
  // 设置OKR审批列表和详情切换
  okrApprovalStep: (state, okrApprovalStep = {}) => {
    state.okrApprovalStep = okrApprovalStep;
  },
  // 设置承接地图和对齐详情切换
  undertakeMapsStep: (state, undertakeMapsStep = {}) => {
    state.undertakeMapsStep = undertakeMapsStep;
  },
  // 设置承接地图和对齐详情切换
  setundertakeDetail: (state, undertakeDetail = {}) => {
    state.undertakeDetail = undertakeDetail;
  },
};