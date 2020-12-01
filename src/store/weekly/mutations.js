export default {

  setWeekList: (state, weekList = []) => {
    state.weekList = weekList;
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
  // setWeeklyType: (state, weeklyType = '') => {
  //   state.weeklyType = weeklyType;
  // },

  setCurrentWeek: (state, currentWeek = {}) => {
    state.currentWeek = currentWeek;
  },
  setSelectedMonth: (state, selectedMonth = '') => {
    state.selectedMonth = selectedMonth;
  },
};