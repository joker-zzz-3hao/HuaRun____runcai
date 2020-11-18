export default {

  setWeekList: (state, weekList = []) => {
    state.weekList = weekList;
  },
  setWeeklyType: (state, setWeeklyType = {}) => {
    state.setWeeklyType = setWeeklyType;
  },
  setWeeklyData: (state, weeklyDataList = []) => {
    state.weeklyDataList = weeklyDataList;
  },
  setWeeklyTypeList: (state, weeklyTypeList = []) => {
    state.weeklyTypeList = weeklyTypeList;
  },
  setSelectWeek: (state, week = {}) => {
    state.week = week;
  },
  setProjectList: (state, projectList = []) => {
    state.projectList = projectList;
  },
  setOriginalMyOkrList: (state, originalMyOkrList = []) => {
    state.originalMyOkrList = originalMyOkrList;
  },
  setMyOkrPeriodList: (state, myOkrPeriodList = []) => {
    state.myOkrPeriodList = myOkrPeriodList;
  },
  setMyOkrList: (state, myOkrList = []) => {
    state.myOkrList = myOkrList;
  },
  setOriginalOrgOkrList: (state, originalOrgOkrList = []) => {
    state.originalOrgOkrList = originalOrgOkrList;
  },
  setOrgOkrPeriodList: (state, orgOkrPeriodList = []) => {
    state.orgOkrPeriodList = orgOkrPeriodList;
  },
  setOrgOkrList: (state, orgOkrList = []) => {
    state.orgOkrList = orgOkrList;
  },
  setCultureList: (state, cultureList = []) => {
    state.cultureList = cultureList;
  },
  setConfigItemCodeOKR: (state, configItemCodeOKR = '') => {
    state.configItemCodeOKR = configItemCodeOKR;
  },
};