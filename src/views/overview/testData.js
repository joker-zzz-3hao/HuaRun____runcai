const mainData = {
  mainDataY: [10, 20, 30, 60, 50, 70],
  mainDataX: ['门户', '行云', '磐云', '容云', '捷云', '耕云'],
  mainCount: [10, 49, 50, 70, 50, 70],
  moodData: [['门户', 10, 20, 30], ['行云', 10, 30, 20], ['磐云', 10, 24, 20], ['容云', 10, 20, 15], ['捷云', 10, 20, 10], ['耕云', 10, 30, 10]],
  orkData: {
    code: 200,
    msg: 'response.success',
    data: [{
      orgId: '1233236980796686336', orgName: '门户', orgFullId: null, orgType: 0, orgAvailable: 0, createTime: null, updateTime: null, personCount: 5, okrProgress: 35, okrProgressUpdateCount: 35, okrContinueCount: 12, okrChangeCount: 3, operateType: null, okrMainId: null,
    }, {
      orgId: '1233240313691308032', orgName: '行云', orgFullId: null, orgType: 0, orgAvailable: 0, createTime: null, updateTime: null, personCount: 1, okrProgress: 30, okrProgressUpdateCount: 7, okrContinueCount: 0, okrChangeCount: 0, operateType: null, okrMainId: null,
    }, {
      orgId: '1233241688080842752', orgName: '磐云', orgFullId: null, orgType: 0, orgAvailable: 0, createTime: null, updateTime: null, personCount: 1, okrProgress: 20, okrProgressUpdateCount: 2, okrContinueCount: 0, okrChangeCount: 0, operateType: null, okrMainId: null,
    }, {
      orgId: '1245170805128404992', orgName: '容云', orgFullId: null, orgType: 0, orgAvailable: 0, createTime: null, updateTime: null, personCount: 2, okrProgress: 0, okrProgressUpdateCount: 0, okrContinueCount: 0, okrChangeCount: 0, operateType: null, okrMainId: null,
    }, {
      orgId: '1284529713665425408', orgName: '捷云', orgFullId: null, orgType: 0, orgAvailable: 0, createTime: null, updateTime: null, personCount: 1, okrProgress: 0, okrProgressUpdateCount: 3, okrContinueCount: 0, okrChangeCount: 0, operateType: null, okrMainId: null,
    }, {
      orgId: '1284530366500454400', orgName: '耕云', orgFullId: null, orgType: 0, orgAvailable: 0, createTime: null, updateTime: null, personCount: 1, okrProgress: 0, okrProgressUpdateCount: 0, okrContinueCount: 0, okrChangeCount: 0, operateType: null, okrMainId: null,
    }],
  },
  tableData: {
    code: 200,
    msg: 'response.success',
    data: [{
      orgName: '门户', orgAdminUserName: '张三', orgNumber: 10, weeklyNumber: 3, weeklyType0Number: 2, weeklyType1Number: 1, visitSum: 42, visitUserNumber: 10, supportSum: 0,
    }, {
      orgName: '磐云', orgAdminUserName: '李四', orgNumber: 22, weeklyNumber: 77, weeklyType0Number: 33, weeklyType1Number: 44, visitSum: 23, visitUserNumber: 20, supportSum: 0,
    }, {
      orgName: '容云', orgAdminUserName: '王五', orgNumber: 30, weeklyNumber: 17, weeklyType0Number: 10, weeklyType1Number: 13, visitSum: 43, visitUserNumber: 30, supportSum: 0,
    }, {
      orgName: '捷云', orgAdminUserName: '吴六', orgNumber: 40, weeklyNumber: 12, weeklyType0Number: 33, weeklyType1Number: 12, visitSum: 21, visitUserNumber: 40, supportSum: 0,
    }],
  },
  timeData: ['2020-08-01', '2020-08-07', '2020-08-14', '2020-08-21', '2020-08-28', '2020-09-05'],
  lineData: [{
    type: 'line',
    symbol: 'circle',
    symbolSize: 7,
    showAllSymbol: true,
    itemStyle: {
      normal: {
        color(params) {
          if (params.value[1] == 1) {
            return '#4CCD79';
          }
          if (params.value[1] == 4) {
            return '#FFBC20';
          }
          if (params.value[1] == 7) {
            return '#FB4C59 ';
          }
        },

      },
    },
    data: [['2020-08-01', 1], ['2020-08-07', 4], ['2020-08-14', 4], ['2020-08-21', 1], ['2020-08-28', 7], ['2020-09-05', 7]],
  },
  {
    type: 'line',
    symbol: 'circle',
    symbolSize: 7,
    showAllSymbol: true,
    itemStyle: {
      normal: {
        color(params) {
          if (params.value[1] == 1) {
            return '#4CCD79';
          }
          if (params.value[1] == 4) {
            return '#FFBC20';
          }
          if (params.value[1] == 7) {
            return '#FB4C59 ';
          }
        },

      },
    },
    data: [['2020-08-01', 1], ['2020-08-07', 4], ['2020-08-14', 7], ['2020-08-21', 7], ['2020-08-28', 7], ['2020-09-05', 7]],
  },
  {
    type: 'line',
    symbol: 'circle',
    symbolSize: 7,
    showAllSymbol: true,
    itemStyle: {
      normal: {
        color(params) {
          if (params.value[1] == 1) {
            return '#4CCD79';
          }
          if (params.value[1] == 4) {
            return '#FFBC20';
          }
          if (params.value[1] == 7) {
            return '#FB4C59 ';
          }
        },

      },
    },
    data: [['2020-08-01', 4], ['2020-08-07', 1], ['2020-08-14', 4], ['2020-08-21', 4], ['2020-08-28', 4], ['2020-09-05', 4]],
  }],

};

const teamData = {
  mainDataY: [10, 30, 40, 30, 30, 70],
  mainDataX: ['负责人A', '负责人B', '负责人C', '负责人D', '负责人E', '负责人F'],
  mainDatapreY: [10, 30, 40, 30, 30, 70],
  okrData: {
    code: 200,
    msg: 'response.success',
    data: [{
      orgId: null, orgFullId: null, orgName: '云门户', orgAdminUserName: '张聪', orgNumber: 10, weeklyNumber: 2, weeklyType0Number: 1, weeklyType1Number: 1, visitSum: 10, visitUserNumber: 10, supportSum: 10,
    }],
  },
  mainDatapreX: ['负责人A', '负责人B', '负责人C', '负责人D', '负责人E', '负责人F'],
  weekY: [['2020-08-31至2020-09-06', 3, 5, 1], ['2020-09-07至2020-09-13', 3, 5, 6], ['2020-08-14至2020-09-20', 3, 5, 5], ['2020-08-21至2020-09-27', 3, 5, 5], ['2020-08-28至2020-10-04', 3, 5, 5]],
  weekX: [['2020-08-31至2020-09-06', 3, 5], ['2020-09-07至2020-09-13', 3, 5], ['2020-08-14至2020-09-20', 3, 5], ['2020-08-21至2020-09-27', 3, 5], ['2020-08-28至2020-10-04', 3, 5]],
  roundData: {
    code: 200,
    msg: 'response.success',
    data: [{
      riskName: '无风险', riskCode: 1, count: 6, ratio: '60',
    }, {
      riskName: '风险可控', riskCode: 2, count: 3, ratio: '30',
    }, {
      riskName: '失控', riskCode: 3, count: 1, ratio: '10',
    }],
  },
};

const userData = {
  mainDataX: ['2020-8', '2020-09', '2020-10', '2020-11', '2020-12', '2021-01'],
  mainDataY: [10, 15, 20, 30, 40, 60],
  mainpreDataX: ['2020-8', '2020-09', '2020-10', '2020-11', '2020-12', '2021-01'],
  mainpreDataY: [10, 15, 20, 30, 40, 60],
  riskDataY: [['2020-08-01', 1], ['2020-08-07', 4], ['2020-08-14', 1], ['2020-08-21', 4], ['2020-08-28', 1], ['2020-09-05', 7]],
  riskDataX: ['2020-08-01', '2020-08-07', '2020-08-14', '2020-08-21', '2020-08-28', '2020-09-05'],
  userTable: {
    code: 200,
    msg: 'response.success',
    data: [{
      calendarId: '106', calendarYear: 2020, week: 36, weekBegin: '2020-08-31', weekEnd: '2020-09-06', weeklyId: '462160506641715200', weeklyEmotion: 50, updateTime: '2020-09-12 10:45:50',
    }, {
      calendarId: '109', calendarYear: 2020, week: 37, weekBegin: '2020-09-07', weekEnd: '2020-09-13', weeklyId: '462785278605266944', weeklyEmotion: 100, updateTime: '2020-09-12 10:44:13',
    }, {
      calendarId: '112', calendarYear: 2020, week: 38, weekBegin: '2020-09-14', weekEnd: '2020-09-20', weeklyId: '461337251514552320', weeklyEmotion: 0, updateTime: '2020-09-17 11:12:23',
    }],
  },
};

const okrData = {
  code: 200,
  msg: 'response.success',
  data: {
    okrMain: {
      okrId: '1243273803975811073', tenantId: 'CR0011000054', orgId: '1233235675126628352', userId: '1233255981732003840', periodId: '1240066906512007168', okrBelongType: 1, okrVersion: 1, okrProgress: 14, createBy: '1233255981732003840', updateBy: null, createTime: '2020-09-01 19:07:10', updateTime: null, status: 1, userName: '佳俊一级负责人', periodName: '2002年第4季度OKR', orgName: '佳俊一级部门',
    },
    okrDetails: [{
      detailId: '1259957209311141889',
      okrDetailId: '1243273803975811075',
      okrParentId: '1242293726796242947',
      okrMainId: '1243273803975811073',
      okrDetailVersion: 0,
      okrDetailObjectKr: '营业额超过100万',
      okrDetailProgress: 50,
      okrWeight: 10,
      okrDetailConfidence: 0,
      okrDetailType: 0,
      okrFullId: '1243273803975811075:1242293726796242947',
      createTime: '2020-09-01 19:07:10',
      status: 1,
      approveStatus: 0,
      okrDetailParentVersion: 1,
      isTrue: 1,
      parentObjectKr: '基础平台的转化能力',
      orgName: '佳俊分公司',
      parentUpdate: false,
      continueCount: 5,
      versionCount: 3,
      krList: [{
        detailId: '1243466184150933506', okrDetailId: '1243273803975811076', okrMainId: '1243273803975811073', okrDetailVersion: 0, okrDetailObjectKr: '完成100万目标', okrDetailProgress: 0, okrWeight: 100, okrDetailConfidence: 1, okrDetailType: 1, okrFullId: '1243273803975811076', allFullId: null, createTime: '2020-09-01 19:07:10', updateTime: null, status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, cultureId: null, remark: null, checkQuota: null, judgeMethod: null, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 2, versionCount: 2, userName: null, userId: null, okrBelongType: null, krList: null, krContinueList: null, odetailId: '1243273803975811075',
      }],
    }, {
      detailId: '1259957209311141890',
      okrDetailId: '1259957209311141891',
      okrMainId: '1243273803975811073',
      okrDetailVersion: 0,
      okrDetailObjectKr: '提升基础平台的转化能力提升基础平台的转化能力提升基础平台的最长展示区域…',
      okrDetailProgress: 10,
      okrWeight: 90,
      okrDetailConfidence: 0,
      okrDetailType: 0,
      okrFullId: '1259957209311141891',
      createTime: '2020-09-07 09:59:41',
      status: 1,
      approveStatus: 0,
      okrDetailParentVersion: 0,
      isTrue: 1,
      parentUpdate: false,
      continueCount: 5,
      versionCount: 1,
      krList: [{
        detailId: '1259957209311141892', okrDetailId: '1259957209311141893', okrParentId: null, parentKrOId: null, okrMainId: '1243273803975811073', okrDetailVersion: 0, okrDetailObjectKr: '完成100万目标', okrDetailProgress: 0, okrWeight: 100, okrDetailConfidence: 1, okrDetailType: 1, okrFullId: '1259957209311141893', allFullId: null, createTime: '2020-09-07 09:59:41', updateTime: null, status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, cultureId: null, remark: null, checkQuota: null, judgeMethod: null, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 1, versionCount: 1, userName: null, userId: null, okrBelongType: null, krList: null, krContinueList: null, odetailId: '1259957209311141891',
      }],
    }],
    orgTable: [{
      orgId: '1233236980796686336', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: '门户', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1233236980796686336:', orgType: 0, orgAvailable: 0, createTime: '2020-08-29 09:58:41', updateTime: '2020-08-29 09:58:41', userId: '1233259623864270848', userName: '佳俊二级负责人',
    }, {
      orgId: '1233240313691308032', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: '行云', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1233240313691308032:', orgType: 0, orgAvailable: 0, createTime: '2020-08-29 10:00:17', updateTime: '2020-08-29 10:00:17', userId: '1233264571666595840', userName: '佳俊部部负责人',
    }, {
      orgId: '1233241688080842752', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: '磐云', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1233241688080842752:', orgType: 0, orgAvailable: 0, createTime: '2020-08-29 10:00:57', updateTime: '2020-08-29 10:00:57', userId: '1233265980415868928', userName: '佳俊门门负责人',
    }, {
      orgId: '1284529713665425408', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: '容云', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1284529713665425408:', orgType: 0, orgAvailable: 0, createTime: '2020-09-15 16:38:55', updateTime: '2020-09-15 16:38:55', userId: '1284536448174145536', userName: '炜哥一负责人',
    }, {
      orgId: '1284530366500454400', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: '耕云', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1284530366500454400:', orgType: 0, orgAvailable: 0, createTime: '2020-09-15 16:39:14', updateTime: '2020-09-15 16:39:14', userId: '1284539059514261504', userName: '炜哥二负责人',
    }],
    orgUser: null,
  },
};
module.exports = {
  mainData,
  teamData,
  userData,
  okrData,
};