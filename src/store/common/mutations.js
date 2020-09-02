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
  // 设置润才菜单
  setCrMenu: (state, crMenuList = []) => {
    state.crMenuList = crMenuList;
  },
  // 租户管理菜单
  setTalentMenu: (state, talentMenuList = []) => {
    state.talentMenuList = talentMenuList;
  },
  // 系统管理菜单
  setSystemMenu: (state, systemMenuList = []) => {
    state.systemMenuList = systemMenuList;
  },
  // 系统管理菜单
  setUserInfo: (state, userInfo = {}) => {
    state.userInfo = userInfo;
  },
  // 我的okr抽屉
  setMyokrDrawer: (state, myokrDrawer = {}) => {
    state.myokrDrawer = myokrDrawer;
  },
  // 新建okr抽屉
  setCreateokrDrawer: (state, createokrDrawer = {}) => {
    state.createokrDrawer = createokrDrawer;
  },
  // 设置承接地图周期id
  setPeriodId: (state, undertakePeriodId = {}) => {
    state.undertakePeriodId = undertakePeriodId;
  },
  // 设置用户角色
  setRoleCode: (state, roleCode = {}) => {
    state.roleCode = roleCode;
  },
  // 设置用户角色
  setShowAuto: (state, showAuto = {}) => {
    state.showAuto = showAuto;
  },
};