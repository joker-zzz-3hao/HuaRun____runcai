const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  // author：林心荃
  // 用于：查我的okr
  'POST /gateway/crcloud-okrManage/getokrdata': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|5': [{
        okrDetailObjectKr: '@csentence(10, 20)',
        'objectId|+1': 1,
        'percent|+5': 10,
        'progress|+5': 50,
        map: 4,
        'krList|5': [{
          'krId|+1': 1,
          okrDetailObjectKr: '@csentence(10, 20)',
          'percent|+5': 10,
          progress: 50,
          'okrDetailConfidence|+1': 1,
        }],
      }],
    })));
  },
  // author：林心荃
  // 用于：查周期
  'POST /gateway/crcloud-okrManage/getTimeCycle': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|4': [{
        'timeid|+1': 1,
        timecycle: '@datetime("yyyy-MM-dd")',
      }],
    })));
  },
  // author：林心荃
  // 用于：查公司价值观
  'POST /gateway/crcloud-okrManage/getphilosophy': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|4': [{
        'philosophyid|+1': 1,
        'philosophy|1': ['成就客户', '创新成长', '成人达已', '追求极致'],
      }],
    })));
  },
  // author：林心荃
  // 用于：承接地图
  'POST /gateway/talent-query/okr/outside/query/okrContinueMap': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      ARRAY: [{
        detailId: '11',
        okrDetailId: '1111',
        okrParentId: null,
        parentKrOId: null,
        okrMainId: '888811113333',
        okrDetailVersion: 1,
        okrDetailObjectKr: '先赚100个亿--o',
        okrDetailProgress: 30,
        okrWeight: 80,
        okrDetailConfidence: 3,
        okrDetailType: 0,
        okrFullId: '1111',
        allFullId: '1111',
        createTime: '2020-08-05 13:40:06',
        updateTime: '2020-08-05 13:40:25',
        status: 1,
        approveStatus: 0,
        okrDetailParentVersion: 0,
        isTrue: 1,
        parentObjectKr: null,
        orgName: null,
        parentUpdate: false,
        continueCount: 0,
        versionCount: 0,
        userName: 'wangzhirenAB',
        krList: [{
          detailId: '1122', okrDetailId: '111111', okrParentId: null, parentKrOId: null, okrMainId: '888811113333', okrDetailVersion: 2, okrDetailObjectKr: '营业额100个亿--kr', okrDetailProgress: 30, okrWeight: 50, okrDetailConfidence: 3, okrDetailType: 1, okrFullId: '111111', allFullId: '111111', createTime: '2020-08-05 13:40:06', updateTime: '2020-08-05 13:40:25', status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 0, versionCount: 0, userName: 'wangzhirenAB', krList: null, krContinueList: [], odetailId: '1111',
        }, {
          detailId: '112233',
          okrDetailId: '111122',
          okrParentId: null,
          parentKrOId: null,
          okrMainId: '888811113333',
          okrDetailVersion: 1,
          okrDetailObjectKr: '市场份额100个亿--kr',
          okrDetailProgress: 30,
          okrWeight: 50,
          okrDetailConfidence: 3,
          okrDetailType: 1,
          okrFullId: '111122',
          allFullId: '111122',
          createTime: '2020-08-05 13:40:06',
          updateTime: '2020-08-05 13:40:25',
          status: 1,
          approveStatus: 0,
          okrDetailParentVersion: 0,
          isTrue: 1,
          parentObjectKr: null,
          orgName: null,
          parentUpdate: false,
          continueCount: 0,
          versionCount: 0,
          userName: 'wangzhirenAB',
          krList: null,
          krContinueList: [{
            detailId: '1233', okrDetailId: '11111122211', okrParentId: '111122', parentKrOId: '1111', okrMainId: '88881111333312', okrDetailVersion: 1, okrDetailObjectKr: '先赚100个亿--0', okrDetailProgress: 60, okrWeight: 100, okrDetailConfidence: 3, okrDetailType: 0, okrFullId: '11111122211:111122', allFullId: '1122211:111122', createTime: '2020-08-05 13:40:06', updateTime: '2020-08-05 13:40:25', status: 1, approveStatus: 0, okrDetailParentVersion: 1, isTrue: 1, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 0, versionCount: 0, userName: '用户006', krList: null, krContinueList: null, odetailId: null,
          }],
          odetailId: '1111',
        }],
        krContinueList: [],
        odetailId: null,
      }, {
        detailId: '1111', okrDetailId: '2222', okrParentId: null, parentKrOId: null, okrMainId: '888811113333', okrDetailVersion: 1, okrDetailObjectKr: '先骗100块钱--o', okrDetailProgress: 30, okrWeight: 20, okrDetailConfidence: 3, okrDetailType: 0, okrFullId: '2222', allFullId: '2222', createTime: '2020-08-05 13:40:06', updateTime: '2020-08-05 13:40:25', status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 0, versionCount: 0, userName: 'wangzhirenAB', krList: null, krContinueList: [], odetailId: '',
      }],

    })));
  },
  // author：林心荃
  // 用于：okr详情
  'POST /gateway/talent-query/okr/query/okrDetail': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      okrMain: {
        'okrId|1': ['111111222', '111111223'],
        'okrBelongType|1': ['0', '1'],
        orgName: '云门户',
        userName: 'lxq',
        userId: '0123',
        updateTime: '2020-08-06',
        okrProgress: '40',
      },
      'okrDetails|2': [
        {
          'detailId|1': ['1233', '1234'],
          'userName|1': ['心荃', '滕炜'],
          'okrDetailObjectKr|1': ['定个小目标', '定大目标', '走上人生巅峰'],
          okrWeight: 50,
          okrDetailProgress: 70,
          parentObjectKr: '华润云',
          'parentUpdate|1': [true, false],
          'krList|2': [
            {
              'detailId|1': ['1233', '1234'],
              'okrDetailObjectKr|1': ['先赚1个亿', '先赚20亿'],
              'userName|1': ['心荃', '滕炜'],
              okrWeight: 50,
              okrDetailProgress: 30,
              parentObjectKr: '华润云',
              okrDetailConfidence: '1',
            },
          ],
        },
      ],
      'voteUser|3': [{
        'userId|+1': ['0011', '0022', '0033'],
        'userName|1': ['cx', 'tw'],
      }],
    })));
  },
  // author：林心荃
  // 用于：我的okr
  'POST /gateway/talent-query/okr/query/myOkr': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      okrMain: {
        'okrId|1': ['111111222', '111111223'],
        'okrBelongType|1': ['0', '1'],
        orgName: '云门户',
        userName: 'lxq',
        userId: '0123',
        updateTime: '2020-08-06',
        okrProgress: '40',
      },
      'okrDetails|3': [
        {
          'detailId|1': ['1233', '1234'],
          'okrDetailObjectKr|1': ['定个小目标', '定大目标', '走上人生巅峰'],
          'userName|1': ['心荃', '滕炜'],
          okrWeight: 40,
          okrDetailProgress: 30,
          parentObjectKr: '华润云',
          'krList|5': [
            {
              'detailId|': ['1233', '1234'],
              'okrDetailObjectKr|1': ['先赚1个亿', '先赚20亿'],
              'userName|1': ['心荃', '滕炜'],
              okrWeight: 40,
              okrDetailProgress: 30,
              parentObjectKr: '华润云',
              okrDetailConfidence: '1',
            },
          ],
        },
      ],
      'orgUser|10': [{
        'userId|+1': ['0011', '0022', '0033'],
        'userName|1': ['心荃', '滕炜', '陈翔', '主任', '陆涛'],
      }],
    })));
  },
  // author：林心荃
  // 用于：查点赞列表
  'POST /gateway/talent-okr/okr/okrSupport/getSupportList': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'supportUserList|3': [{
        'userId|+1': ['0011', '0022', '0033'],
        'userName|1': ['心荃', '滕炜', '陈翔', '主任', '陆涛'],
      }],
    })));
  },
  // author：林心荃
  // 用于：查操作历史
  // 'POST /gateway/talent-query/okr/query/okrOperationHistory': (req, res) => {
  //   res.send(mockUtil.getSuccessData(Mock.mock({
  //     'records|3': [{
  //       'date|+1': ['8月12日', '8月11日', '8月10日'],
  //       'createTime|1': ['16:45', '06:15', '20:05'],
  //       'createBy|1': ['心荃', '滕炜', '陈翔', '主任', '陆涛'],
  //       operateType: 0,
  //       content: '@csentence(10, 20)',
  //     }],
  //   })));
  // },
  // author：林心荃
  // 用于：查价值观
  'POST /gateway/talent-okr/okr/cultureValue/queryCultureList': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|5': [{
        'cultureDesc|+1': ['成人达已', '诚实守信', '追求极致', '勇于担当', '成人达己'],
        'cultureId|+1': 1,
      }],
    })));
  },
  // author：林心荃
  // 用于：查可承接的okr
  'POST /gateway/talent-okr/okr/main/getUndertakeOkr': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      parentUndertakeOkrInfoResult: {
        okrPeriodEntity: {
          periodDesc: '2020上半年',
        },
        'okrList|2': [{
          o: {
            'okrDetailId|1': ['1233', '1234'],
            'okrDetailObjectKr|1': ['定个小目标', '定大目标', '走上人生巅峰'],
            'userName|1': ['心荃', '滕炜'],
            okrWeight: 40,
            okrDetailProgress: 30,
            parentObjectKr: '华润云',
            okrDetailVersion: '1.0',
          },
          'krList|2': [
            {
              'okrDetailId|1': ['1233', '1234'],
              'okrDetailObjectKr|1': ['先赚1个亿', '先赚20亿'],
              'userName|1': ['心荃', '滕炜'],
              okrWeight: 40,
              okrDetailProgress: 30,
              parentObjectKr: '华润云',
              okrDetailConfidence: '1',
              okrDetailVersion: '1.0',
            },
          ],
        }],
      },
    })));
  },
  // author：林心荃
  // 用于：新建okr
  'POST /gateway/talent-okr/okr/main/add': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      data: 'success',
    })));
  },
  // author：林心荃
  // 用于：更新进度
  'POST /gateway/talent-okr/okr/main/updateOkrProcess': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      data: 'success',
    })));
  },
  // author：林心荃
  // 用于：点赞
  'POST /gateway/talent-okr/okr/okrSupport/support': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      data: 'success',
    })));
  },
  // author：林心荃
  // 用于：
  'POST /gateway/talent-query/okr/query/okrOperationHistory': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      content: {
        '2020-08-20': [{
          id: '1206431540120363008', periodId: '1206360106224295937', attachId: null, okrMainId: '1206360106224295937', okrDetailId: null, content: '测试-HM-1 更新：目标(O)进度 为 50，原因：还可以 ', operateType: 5, checkStatus: 0, status: 1, createBy: '1234567890001', createTime: '2020-08-20 09:16:19', createDate: '2020-08-20',
        }, {
          id: '1206431540120363009', periodId: '1206360106224295937', attachId: null, okrMainId: '1206360106224295937', okrDetailId: '1206360106224295941', content: '测试-HM-1 更新：关键结果(KR)进度 为 50，原因：还可以 ', operateType: 5, checkStatus: 0, status: 1, createBy: '1234567890001', createTime: '2020-08-20 09:16:19', createDate: '2020-08-20',
        }, {
          id: '1206431540120363010', periodId: '1206360106224295937', attachId: null, okrMainId: '1206360106224295937', okrDetailId: '1206360106224295941', content: '测试-HM-1 更新：关键结果(KR)风险指数 为 50，原因：还可以 ', operateType: 5, checkStatus: 0, status: 1, createBy: '1234567890001', createTime: '2020-08-20 09:16:19', createDate: '2020-08-20',
        }],
      },
    })));
  },
};
module.exports = mockData;