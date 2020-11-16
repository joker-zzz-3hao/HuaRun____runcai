export default {

  setWeekList: (state, weekList = {}) => {
    state.weekList = weekList;
  },
  setWeeklyType: (state, setWeeklyType = {}) => {
    state.setWeeklyType = setWeeklyType;
  },
  setWeeklyData: (state, weeklyDataList = {}) => {
    state.weeklyDataList = weeklyDataList;
  },
  setWeeklyTypeList: (state, weeklyTypeList = {}) => {
    state.weeklyTypeList = weeklyTypeList;
  },

};