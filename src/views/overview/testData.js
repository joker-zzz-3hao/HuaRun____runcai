const mainData = {
  mainDataY: [20, 30, 30, 50, 40, 50, 40, 50, 60],
  mainDataX: ['A部门', 'B部门', 'C部门', 'D部门', 'E部门', 'F部门', 'G部门', 'H部门', 'I部门'],
  mainCount: [80, 40, 20, 40, 80, 40, 20, 70, 30],
  moodData: [['A部门', 10, 40, 30], ['B部门', 10, 30, 20], ['C部门', 10, 24, 20], ['D部门', 10, 20, 15], ['E部门', 10, 20, 10], ['F部门', 10, 30, 10]],
  orkData: {
    code: 200,
    msg: 'response.success',
    data: [{
      orgId: '1233236980796686336', orgName: 'A部门', orgFullId: null, orgType: 0, orgAvailable: 0, createTime: null, updateTime: null, personCount: 5, okrProgress: 35, okrProgressUpdateCount: 35, okrContinueCount: 12, okrChangeCount: 3, operateType: null, okrMainId: null,
    }, {
      orgId: '1233240313691308032', orgName: 'B部门', orgFullId: null, orgType: 0, orgAvailable: 0, createTime: null, updateTime: null, personCount: 1, okrProgress: 30, okrProgressUpdateCount: 7, okrContinueCount: 0, okrChangeCount: 0, operateType: null, okrMainId: null,
    }, {
      orgId: '1233241688080842752', orgName: 'C部门', orgFullId: null, orgType: 0, orgAvailable: 0, createTime: null, updateTime: null, personCount: 1, okrProgress: 20, okrProgressUpdateCount: 2, okrContinueCount: 0, okrChangeCount: 0, operateType: null, okrMainId: null,
    }, {
      orgId: '1245170805128404992', orgName: 'D部门', orgFullId: null, orgType: 0, orgAvailable: 0, createTime: null, updateTime: null, personCount: 2, okrProgress: 0, okrProgressUpdateCount: 0, okrContinueCount: 0, okrChangeCount: 0, operateType: null, okrMainId: null,
    }, {
      orgId: '1284529713665425408', orgName: 'E部门', orgFullId: null, orgType: 0, orgAvailable: 0, createTime: null, updateTime: null, personCount: 1, okrProgress: 0, okrProgressUpdateCount: 3, okrContinueCount: 0, okrChangeCount: 0, operateType: null, okrMainId: null,
    }, {
      orgId: '1284530366500454400', orgName: 'F部门', orgFullId: null, orgType: 0, orgAvailable: 0, createTime: null, updateTime: null, personCount: 1, okrProgress: 0, okrProgressUpdateCount: 0, okrContinueCount: 0, okrChangeCount: 0, operateType: null, okrMainId: null,
    }],
  },
  tableData: {
    code: 200,
    msg: 'response.success',
    data: [{
      orgName: 'A部门', orgAdminUserName: '周帅', orgNumber: 10, weeklyNumber: 3, weeklyType0Number: 2, weeklyType1Number: 1, visitSum: 42, visitUserNumber: 10, supportSum: 0,
    }, {
      orgName: 'B部门', orgAdminUserName: '张丽丽', orgNumber: 22, weeklyNumber: 77, weeklyType0Number: 33, weeklyType1Number: 44, visitSum: 23, visitUserNumber: 20, supportSum: 0,
    }, {
      orgName: 'C部门', orgAdminUserName: '王坤逸', orgNumber: 30, weeklyNumber: 17, weeklyType0Number: 10, weeklyType1Number: 13, visitSum: 43, visitUserNumber: 30, supportSum: 0,
    }, {
      orgName: 'D部门', orgAdminUserName: '刘伊汶', orgNumber: 40, weeklyNumber: 12, weeklyType0Number: 33, weeklyType1Number: 12, visitSum: 21, visitUserNumber: 40, supportSum: 0,
    }, {
      orgName: 'E部门', orgAdminUserName: '唐娅', orgNumber: 40, weeklyNumber: 12, weeklyType0Number: 33, weeklyType1Number: 12, visitSum: 21, visitUserNumber: 40, supportSum: 0,
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
  okrListData: {
    code: 200,
    msg: 'response.success',
    data: [{
      userName: '刘林', okrDetailObjectKr: '完成目标', okrDetailId: '1243273803975811076', okrDetailType: '1', odetailId: '1243273803975811075',
    }, {
      userName: '张小萍', okrDetailObjectKr: '完成目标', okrDetailId: '1259957209311141893', okrDetailType: '1', odetailId: '1259957209311141891',
    }, {
      userName: '周明明', okrDetailObjectKr: '完成目标', okrDetailId: '1302737282636865543', okrDetailType: '1', odetailId: '1302737282636865541',
    }, {
      userName: '刘伊汶', okrDetailObjectKr: '完成目标', okrDetailId: '1302758826192822281', okrDetailType: '1', odetailId: '1302758826192822279',
    }, {
      userName: '王逸坤', okrDetailObjectKr: '完成目标', okrDetailId: '1302758826192822291', okrDetailType: '1', odetailId: '1302758826192822289',
    }, {
      userName: '曾伟明', okrDetailObjectKr: '完成目标', okrDetailId: '1302758826192822296', okrDetailType: '1', odetailId: '1302758826192822294',
    }, {
      userName: '许雨', okrDetailObjectKr: '完成目标', okrDetailId: '1302758826192822301', okrDetailType: '1', odetailId: '1302758826192822299',
    }, {
      userName: '张丽丽', okrDetailObjectKr: '完成目标', okrDetailId: '1302758826192822306', okrDetailType: '1', odetailId: '1302758826192822304',
    }, {
      userName: '徐明', okrDetailObjectKr: '完成目标', okrDetailId: '1302758826192822311', okrDetailType: '1', odetailId: '1302758826192822309',
    }],
  },
  // eslint-disable-next-line max-len
  mainDataY: [80, 40, 20, 20, 80, 40, 30, 80, 40, 20, 80, 40, 80, 40],
  mainDataX: ['刘林', '周明明', '张小萍', '林衣衣', '唐娅', '刘伊汶', '唐帅', '许雨', '王逸坤', '曾伟明', '张丽丽', '徐明', '车晓慧', '李林林'],
  // eslint-disable-next-line max-len
  mainDatapreY: [80, 40, 20, 20, 80, 40, 30, 80, 40, 20, 80, 40, 80, 40],
  okrData: {
    code: 200,
    msg: 'response.success',
    data: [{
      orgId: null, orgFullId: null, orgName: '云门户', orgAdminUserName: '张聪', orgNumber: 10, weeklyNumber: 2, weeklyType0Number: 1, weeklyType1Number: 1, visitSum: 10, visitUserNumber: 10, supportSum: 10,
    }],
  },
  mainDatapreX: ['刘林', '周明明', '张小萍', '林衣衣', '唐娅', '刘伊汶', '唐帅', '许雨', '王逸坤', '曾伟明', '张丽丽', '徐明', '车晓慧', '李林林'],
  weekY: [['08-31 ~ 09-06', 5, 40, 20], ['09-07 ~ 09-13', 5, 20, 30], ['08-14 ~ 09-20', 5, 30, 40], ['08-21 ~ 09-27', 2, 5, 10], ['08-28 ~ 10-04', 5, 20, 30]],
  weekX: [['08-31 ~ 09-06', 10, 40], ['09-07 ~ 09-13', 30, 25], ['08-14 ~ 09-20', 5, 10], ['08-21 ~ 09-27', 10, 30], ['08-28 ~ 10-04', 25, 15]],
  roundData: {
    code: 200,
    msg: 'response.success',
    data: [{
      riskName: '信心指数高', riskCode: 1, count: 30, ratio: '40',
    }, {
      riskName: '信心指数中', riskCode: 2, count: 40, ratio: '30',
    }, {
      riskName: '信心指数低', riskCode: 3, count: 30, ratio: '30',
    }],
  },
};

const userData = {
  mainDataX: ['2020-08', '2020-09', '2020-10', '2020-11', '2020-12', '2021-01'],
  mainDataY: [10, 10, 20, 40, 50, 60],
  mainpreDataX: ['2020-8', '2020-09', '2020-10', '2020-11', '2020-12', '2021-01'],
  mainpreDataY: [10, 15, 20, 30, 40, 60],
  riskDataY: {
    type: 'line',
    symbol: 'circle',
    symbolSize: 10,
    showAllSymbol: true,

    data: [['2020-08-01', 1], ['2020-08-07', 4], ['2020-08-14', 4], ['2020-08-21', 1], ['2020-08-28', 1], ['2020-09-05', 4], ['2020-09-12', 4]],
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
        lineStyle: {
          color: '#3F7DFF',
        },
      },
    },
  },
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
      okrId: '1243273803975811073', tenantId: 'CR0011000054', orgId: '1233235675126628352', userId: '1233255981732003840', periodId: '1240066906512007168', okrBelongType: 1, okrVersion: 1, okrProgress: 30, createBy: '1233255981732003840', updateBy: null, createTime: '2020-09-01 19:07:10', updateTime: null, status: 1, userName: '王五', periodName: '2002年第4季度OKR', orgName: '华润一级部门',
    },
    okrDetails: [{
      detailId: '1259957209311141889',
      okrDetailId: '1243273803975811075',
      okrParentId: '1242293726796242947',
      okrMainId: '1243273803975811073',
      okrDetailVersion: 0,
      okrDetailObjectKr: '【示例数据】实现创纪录的收入，同时提高盈利能力',
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
      orgName: '华润分公司',
      parentUpdate: false,
      continueCount: 5,
      versionCount: 3,
      krList: [{
        detailId: '1243466184150933506', okrDetailId: '1243273803975811076', okrMainId: '1243273803975811073', okrDetailVersion: 40, okrDetailObjectKr: '【示例数据】将公司平均交易规模增加30%', okrDetailProgress: 40, okrWeight: 100, okrDetailConfidence: 1, okrDetailType: 1, okrFullId: '1243273803975811076', allFullId: null, createTime: '2020-09-01 19:07:10', updateTime: null, status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, cultureId: null, remark: null, checkQuota: null, judgeMethod: null, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 2, versionCount: 2, userName: null, userId: null, okrBelongType: null, krList: null, krContinueList: null, odetailId: '1243273803975811075',
      }, {
        detailId: '1243466184150933506', okrDetailId: '1243273803975811076', okrMainId: '1243273803975811073', okrDetailVersion: 20, okrDetailObjectKr: '【示例数据】正式启动方案A，将业务扩展到2个新国家', okrDetailProgress: 20, okrWeight: 100, okrDetailConfidence: 1, okrDetailType: 1, okrFullId: '1243273803975811076', allFullId: null, createTime: '2020-09-01 19:07:10', updateTime: null, status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, cultureId: null, remark: null, checkQuota: null, judgeMethod: null, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 2, versionCount: 2, userName: null, userId: null, okrBelongType: null, krList: null, krContinueList: null, odetailId: '1243273803975811075',
      }, {
        detailId: '1243466184150933506', okrDetailId: '1243273803975811076', okrMainId: '1243273803975811073', okrDetailVersion: 20, okrDetailObjectKr: '【示例数据】在A地区实现100%的年销售额增长%', okrDetailProgress: 20, okrWeight: 100, okrDetailConfidence: 1, okrDetailType: 1, okrFullId: '1243273803975811076', allFullId: null, createTime: '2020-09-01 19:07:10', updateTime: null, status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, cultureId: null, remark: null, checkQuota: null, judgeMethod: null, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 2, versionCount: 2, userName: null, userId: null, okrBelongType: null, krList: null, krContinueList: null, odetailId: '1243273803975811075',
      },
      ],
    }, {
      detailId: '1259957209311141890',
      okrDetailId: '12599572093211141891',
      okrMainId: '12432738039752811073',
      okrDetailVersion: 0,
      okrDetailObjectKr: '【示例数据】第四季度保持至少90%订单续费率',
      okrDetailProgress: 10,
      okrWeight: 90,
      okrDetailConfidence: 0,
      okrDetailType: 0,
      okrFullId: '12599572093111411891',
      createTime: '2020-09-07 09:59:41',
      status: 1,
      approveStatus: 0,
      okrDetailParentVersion: 0,
      isTrue: 1,
      parentUpdate: false,
      continueCount: 5,
      versionCount: 1,
      krList: [{
        detailId: '125995720931111421892', okrDetailId: '125995720922311141893', okrParentId: null, parentKrOId: null, okrMainId: '124327383039751811073', okrDetailVersion: 0, okrDetailObjectKr: '提高售后服务', okrDetailProgress: 0, okrWeight: 100, okrDetailConfidence: 1, okrDetailType: 1, okrFullId: '125992157209311141893', allFullId: null, createTime: '2020-09-07 09:59:41', updateTime: null, status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, cultureId: null, remark: null, checkQuota: null, judgeMethod: null, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 1, versionCount: 1, userName: null, userId: null, okrBelongType: null, krList: null, krContinueList: null, odetailId: '12599517209311141891',
      }],
    }, {
      detailId: '125995720293121141890',
      okrDetailId: '125995722209311141891',
      okrMainId: '124327380391758111073',
      okrDetailVersion: 0,
      okrDetailObjectKr: '【示例数据】提高客户满意度',
      okrDetailProgress: 10,
      okrWeight: 90,
      okrDetailConfidence: 0,
      okrDetailType: 0,
      okrFullId: '125995720931111141891',
      createTime: '2020-09-07 09:59:41',
      status: 1,
      approveStatus: 0,
      okrDetailParentVersion: 0,
      isTrue: 1,
      parentUpdate: false,
      continueCount: 5,
      versionCount: 1,
      krList: [{
        detailId: '12599572093111141892', okrDetailId: '12599572029311141893', okrParentId: null, parentKrOId: null, okrMainId: '1243273803975811073', okrDetailVersion: 0, okrDetailObjectKr: '提高售后服务', okrDetailProgress: 0, okrWeight: 100, okrDetailConfidence: 1, okrDetailType: 1, okrFullId: '1259957209311141893', allFullId: null, createTime: '2020-09-07 09:59:41', updateTime: null, status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, cultureId: null, remark: null, checkQuota: null, judgeMethod: null, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 1, versionCount: 1, userName: null, userId: null, okrBelongType: null, krList: null, krContinueList: null, odetailId: '12599571209311141891',
      }],
    }],
    orgTable: [{
      orgId: '12332369807196686336', orgParentId: '12332235675126628352', tenantId: 'CR10011000054', orgName: 'A部门', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1233236980796686336:', orgType: 0, orgAvailable: 0, createTime: '2020-08-29 09:58:41', updateTime: '2020-08-29 09:58:41', userId: '1233259623864270848', userName: '佳俊二级负责人',
    }, {
      orgId: '12332403136291308032', orgParentId: '1233235675126628352', tenantId: 'CR00111000054', orgName: 'B部门', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1233240313691308032:', orgType: 0, orgAvailable: 0, createTime: '2020-08-29 10:00:17', updateTime: '2020-08-29 10:00:17', userId: '1233264571666595840', userName: '佳俊部部负责人',
    }, {
      orgId: '1233241688080842752', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: 'C部门', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1233241688080842752:', orgType: 0, orgAvailable: 0, createTime: '2020-08-29 10:00:57', updateTime: '2020-08-29 10:00:57', userId: '1233265980415868928', userName: '佳俊门门负责人',
    }, {
      orgId: '1284529713665425408', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: 'D部门', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1284529713665425408:', orgType: 0, orgAvailable: 0, createTime: '2020-09-15 16:38:55', updateTime: '2020-09-15 16:38:55', userId: '1284536448174145536', userName: '炜哥一负责人',
    }, {
      orgId: '1284530366500454400', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: 'E部门', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1284530366500454400:', orgType: 0, orgAvailable: 0, createTime: '2020-09-15 16:39:14', updateTime: '2020-09-15 16:39:14', userId: '1284539059514261504', userName: '炜哥二负责人',
    },
    {
      orgId: '1284530366500454400', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: 'F部门', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1284530366500454400:', orgType: 0, orgAvailable: 0, createTime: '2020-09-15 16:39:14', updateTime: '2020-09-15 16:39:14', userId: '1284539059514261504', userName: '炜哥二负责人',
    },
    {
      orgId: '1284530366500454400', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: 'G部门', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1284530366500454400:', orgType: 0, orgAvailable: 0, createTime: '2020-09-15 16:39:14', updateTime: '2020-09-15 16:39:14', userId: '1284539059514261504', userName: '炜哥二负责人',
    },
    {
      orgId: '1284530366500454400', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: 'H部门', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1284530366500454400:', orgType: 0, orgAvailable: 0, createTime: '2020-09-15 16:39:14', updateTime: '2020-09-15 16:39:14', userId: '1284539059514261504', userName: '炜哥二负责人',
    }, {
      orgId: '1284530366500454400', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: 'I部门', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1284530366500454400:', orgType: 0, orgAvailable: 0, createTime: '2020-09-15 16:39:14', updateTime: '2020-09-15 16:39:14', userId: '1284539059514261504', userName: '炜哥二负责人',
    }],
    orgUser: null,
  },
};

const okrDataTeam = {
  code: 200,
  msg: 'response.success',
  data: {
    okrMain: {
      okrId: '1243273803975811073', tenantId: 'CR0011000054', orgId: '1233235675126628352', userId: '1233255981732003840', periodId: '1240066906512007168', okrBelongType: 1, okrVersion: 1, okrProgress: 30, createBy: '1233255981732003840', updateBy: null, createTime: '2020-09-01 19:07:10', updateTime: null, status: 1, userName: '张三', periodName: '2002年第4季度OKR', orgName: '华润一级部门',
    },
    okrDetails: [{
      detailId: '1259957209311141889',
      okrDetailId: '1243273803975811075',
      okrParentId: '1242293726796242947',
      okrMainId: '1243273803975811073',
      okrDetailVersion: 0,
      okrDetailObjectKr: '【示例数据】成功推出新产品',
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
      orgName: '华润分公司',
      parentUpdate: false,
      continueCount: 5,
      versionCount: 3,
      krList: [{
        detailId: '1243466184150933506', okrDetailId: '1243273803975811076', okrMainId: '1243273803975811073', okrDetailVersion: 0, okrDetailObjectKr: '【示例数据】完成所有新产品网站的更新', okrDetailProgress: 40, okrWeight: 100, okrDetailConfidence: 1, okrDetailType: 1, okrFullId: '1243273803975811076', allFullId: null, createTime: '2020-09-01 19:07:10', updateTime: null, status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, cultureId: null, remark: null, checkQuota: null, judgeMethod: null, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 2, versionCount: 2, userName: null, userId: null, okrBelongType: null, krList: null, krContinueList: null, odetailId: '1243273803975811075',
      }, {
        detailId: '1243466184150933506', okrDetailId: '1243273803975811076', okrMainId: '1243273803975811073', okrDetailVersion: 0, okrDetailObjectKr: '【示例数据】为客户和合作伙伴提供独家的启动前更新', okrDetailProgress: 20, okrWeight: 100, okrDetailConfidence: 1, okrDetailType: 1, okrFullId: '1243273803975811076', allFullId: null, createTime: '2020-09-01 19:07:10', updateTime: null, status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, cultureId: null, remark: null, checkQuota: null, judgeMethod: null, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 2, versionCount: 2, userName: null, userId: null, okrBelongType: null, krList: null, krContinueList: null, odetailId: '1243273803975811075',
      }, {
        detailId: '1243466184150933506', okrDetailId: '1243273803975811076', okrMainId: '1243273803975811073', okrDetailVersion: 0, okrDetailObjectKr: '【示例数据】应用中心评分超过 4 星，重点客户调研满意度达到 85%', okrDetailProgress: 20, okrWeight: 100, okrDetailConfidence: 1, okrDetailType: 1, okrFullId: '1243273803975811076', allFullId: null, createTime: '2020-09-01 19:07:10', updateTime: null, status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, cultureId: null, remark: null, checkQuota: null, judgeMethod: null, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 2, versionCount: 2, userName: null, userId: null, okrBelongType: null, krList: null, krContinueList: null, odetailId: '1243273803975811075',
      }],
    }, {
      detailId: '1259957209311141890',
      okrDetailId: '1259957209311141891',
      okrMainId: '1243273803975811073',
      okrDetailVersion: 0,
      okrDetailObjectKr: '【示例数据】第四季度保持至少90%订单续费率',
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
        detailId: '12599572093111141892', okrDetailId: '12599527209311141893', okrParentId: null, parentKrOId: null, okrMainId: '1243273803975811073', okrDetailVersion: 0, okrDetailObjectKr: '提高售后服务', okrDetailProgress: 20, okrWeight: 100, okrDetailConfidence: 1, okrDetailType: 1, okrFullId: '1259957209311141893', allFullId: null, createTime: '2020-09-07 09:59:41', updateTime: null, status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, cultureId: null, remark: null, checkQuota: null, judgeMethod: null, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 1, versionCount: 1, userName: null, userId: null, okrBelongType: null, krList: null, krContinueList: null, odetailId: '1259957209311141891',
      }],
    }, {
      detailId: '12599572093111141890',
      okrDetailId: '12599572093211141891',
      okrMainId: '12432738039752811073',
      okrDetailVersion: 0,
      okrDetailObjectKr: '【示例数据】提高我们销售方式的质量',
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
        detailId: '125995720931141892', okrDetailId: '125995720931141893', okrParentId: null, parentKrOId: null, okrMainId: '124323803975811073', okrDetailVersion: 0, okrDetailObjectKr: '提高用户体验', okrDetailProgress: 0, okrWeight: 100, okrDetailConfidence: 1, okrDetailType: 1, okrFullId: '125995709311141893', allFullId: null, createTime: '2020-09-07 09:59:41', updateTime: null, status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, cultureId: null, remark: null, checkQuota: null, judgeMethod: null, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 1, versionCount: 1, userName: null, userId: null, okrBelongType: null, krList: null, krContinueList: null, odetailId: '1259957209311141891',
      }],
    }],
    orgTable: [{
      orgId: '1233236980796686336', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: '刘林', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1233236980796686336:', orgType: 0, orgAvailable: 0, createTime: '2020-08-29 09:58:41', updateTime: '2020-08-29 09:58:41', userId: '1233259623864270848', userName: '佳俊二级负责人',
    }, {
      orgId: '1233240313691308032', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: '张小萍', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1233240313691308032:', orgType: 0, orgAvailable: 0, createTime: '2020-08-29 10:00:17', updateTime: '2020-08-29 10:00:17', userId: '1233264571666595840', userName: '佳俊部部负责人',
    }, {
      orgId: '1233241688080842752', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: '周明明', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1233241688080842752:', orgType: 0, orgAvailable: 0, createTime: '2020-08-29 10:00:57', updateTime: '2020-08-29 10:00:57', userId: '1233265980415868928', userName: '佳俊门门负责人',
    }, {
      orgId: '1284529713665425408', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: '刘伊汶', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1284529713665425408:', orgType: 0, orgAvailable: 0, createTime: '2020-09-15 16:38:55', updateTime: '2020-09-15 16:38:55', userId: '1284536448174145536', userName: '炜哥一负责人',
    }, {
      orgId: '1284530366500454400', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: '王逸坤', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1284530366500454400:', orgType: 0, orgAvailable: 0, createTime: '2020-09-15 16:39:14', updateTime: '2020-09-15 16:39:14', userId: '1284539059514261504', userName: '炜哥二负责人',
    },
    {
      orgId: '1284530366500454400', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: '曾伟明', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1284530366500454400:', orgType: 0, orgAvailable: 0, createTime: '2020-09-15 16:39:14', updateTime: '2020-09-15 16:39:14', userId: '1284539059514261504', userName: '炜哥二负责人',
    }, {
      orgId: '1284530366500454400', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: '许雨', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1284530366500454400:', orgType: 0, orgAvailable: 0, createTime: '2020-09-15 16:39:14', updateTime: '2020-09-15 16:39:14', userId: '1284539059514261504', userName: '炜哥二负责人',
    }, {
      orgId: '1284530366500454400', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: '张丽丽', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1284530366500454400:', orgType: 0, orgAvailable: 0, createTime: '2020-09-15 16:39:14', updateTime: '2020-09-15 16:39:14', userId: '1284539059514261504', userName: '炜哥二负责人',
    }, {
      orgId: '1284530366500454400', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: '徐明', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1284530366500454400:', orgType: 0, orgAvailable: 0, createTime: '2020-09-15 16:39:14', updateTime: '2020-09-15 16:39:14', userId: '1284539059514261504', userName: '炜哥二负责人',
    }, {
      orgId: '1284530366500454400', orgParentId: '1233235675126628352', tenantId: 'CR0011000054', orgName: '李林林', orgFullId: 'CR0011000054:1233234953572122624:1233235675126628352:1284530366500454400:', orgType: 0, orgAvailable: 0, createTime: '2020-09-15 16:39:14', updateTime: '2020-09-15 16:39:14', userId: '1284539059514261504', userName: '炜哥二负责人',
    }],
    orgUser: null,
  },

};

const okrUser = {
  code: 200,
  msg: 'response.success',
  data: {
    okrMain: {
      okrId: '1243273803975811073', tenantId: 'CR0011000054', orgId: '1233235675126628352', userId: '1233255981732003840', periodId: '1240066906512007168', okrBelongType: 2, okrVersion: 1, okrProgress: 30, createBy: '1233255981732003840', updateBy: null, createTime: '2020-09-01 19:07:10', updateTime: null, status: 1, userName: '王丽丽', periodName: '2002年第4季度OKR', orgName: '华润一级部门',
    },
    okrDetails: [{
      detailId: '1259957209311141889',
      okrDetailId: '1243273803975811075',
      okrParentId: '1242293726796242947',
      okrMainId: '1243273803975811073',
      okrDetailVersion: 0,
      okrDetailObjectKr: '【示例数据】A 产品成功上线，获得广泛的用户认可',
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
      orgName: '华润分公司',
      parentUpdate: false,
      continueCount: 5,
      versionCount: 3,
      krList: [{
        detailId: '1243466184150933506', okrDetailId: '1243273803975811076', okrMainId: '1243273803975811073', okrDetailVersion: 40, okrDetailObjectKr: '【示例数据】10月初上架应用中心，实现无障碍下载和注册', okrDetailProgress: 40, okrWeight: 100, okrDetailConfidence: 1, okrDetailType: 1, okrFullId: '1243273803975811076', allFullId: null, createTime: '2020-09-01 19:07:10', updateTime: null, status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, cultureId: null, remark: null, checkQuota: null, judgeMethod: null, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 2, versionCount: 2, userName: null, userId: null, okrBelongType: null, krList: null, krContinueList: null, odetailId: '1243273803975811075',
      }, {
        detailId: '1243466184150933506', okrDetailId: '1243273803975811076', okrMainId: '1243273803975811073', okrDetailVersion: 20, okrDetailObjectKr: '【示例数据】注册用户数达到 50,000，付费率达到 20%', okrDetailProgress: 20, okrWeight: 100, okrDetailConfidence: 1, okrDetailType: 1, okrFullId: '1243273803975811076', allFullId: null, createTime: '2020-09-01 19:07:10', updateTime: null, status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, cultureId: null, remark: null, checkQuota: null, judgeMethod: null, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 2, versionCount: 2, userName: null, userId: null, okrBelongType: null, krList: null, krContinueList: null, odetailId: '1243273803975811075',
      }, {
        detailId: '1243466184150933506', okrDetailId: '1243273803975811076', okrMainId: '1243273803975811073', okrDetailVersion: 20, okrDetailObjectKr: '【示例数据】应用中心评分超过 4 星，重点客户调研满意度达到 85%', okrDetailProgress: 20, okrWeight: 100, okrDetailConfidence: 1, okrDetailType: 1, okrFullId: '1243273803975811076', allFullId: null, createTime: '2020-09-01 19:07:10', updateTime: null, status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, cultureId: null, remark: null, checkQuota: null, judgeMethod: null, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 2, versionCount: 2, userName: null, userId: null, okrBelongType: null, krList: null, krContinueList: null, odetailId: '1243273803975811075',
      },
      ],
    }, {
      detailId: '1259957209311141890',
      okrDetailId: '1259957209311141891',
      okrMainId: '1243273803975811073',
      okrDetailVersion: 0,
      okrDetailObjectKr: '【示例数据】优化 A 产品重点功能和体验，充分满足商业化要求',
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
        detailId: '12599572209311141892', okrDetailId: '12599572209311141893', okrParentId: null, parentKrOId: null, okrMainId: '12432738103975811073', okrDetailVersion: 0, okrDetailObjectKr: '提高运营流量', okrDetailProgress: 0, okrWeight: 100, okrDetailConfidence: 1, okrDetailType: 1, okrFullId: '1259957209311141893', allFullId: null, createTime: '2020-09-07 09:59:41', updateTime: null, status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, cultureId: null, remark: null, checkQuota: null, judgeMethod: null, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 1, versionCount: 1, userName: null, userId: null, okrBelongType: null, krList: null, krContinueList: null, odetailId: '1259957209311141891',
      }],
    }, {
      detailId: '12599572093111411890',
      okrDetailId: '12599572092311141891',
      okrMainId: '1243273803975811073',
      okrDetailVersion: 0,
      okrDetailObjectKr: '【示例数据】建设专业运营团队，高质量支持 A 产品的客户运营和服务需求',
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
    orgTable: null,
    orgUser: null,
  },
};

module.exports = {
  mainData,
  teamData,
  userData,
  okrData,
  okrDataTeam,
  okrUser,
};