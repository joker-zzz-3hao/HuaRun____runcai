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
  // 用于：承接地图
  'POST /gateway/talent-query/okr/query/okrContinueMap': (req, res) => {
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
        krContinueList: [{
          detailId: '1111', okrDetailId: '22232', okrParentId: '1111', parentKrOId: null, okrMainId: '888811113333', okrDetailVersion: 1, okrDetailObjectKr: '先骗100块钱--o', okrDetailProgress: 30, okrWeight: 20, okrDetailConfidence: 3, okrDetailType: 0, okrFullId: '2222', allFullId: '2222', createTime: '2020-08-05 13:40:06', updateTime: '2020-08-05 13:40:25', status: 1, approveStatus: 0, okrDetailParentVersion: 0, isTrue: 1, parentObjectKr: null, orgName: null, parentUpdate: false, continueCount: 0, versionCount: 0, userName: 'wangzhirenAB', krList: null, krContinueList: [], odetailId: '',
        }],
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
          parentObjectKr: '定个小目标',
          okrParentId: '1222018079536250882',
          'parentUpdate|1': [true, false],
          'krList|2': [
            {
              'detailId|1': ['1233', '1234'],
              'okrDetailObjectKr|1': ['先赚1个亿', '先赚20亿'],
              'userName|1': ['心荃', '滕炜'],
              okrWeight: 50,
              okrDetailProgress: 30,
              parentObjectKr: '定个小目标',
              okrParentId: '1222018079536250882',
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
        okrProgress: 40,
      },
      'okrDetails|3': [
        {
          'detailId|1': ['1233', '1234'],
          'okrDetailId|1-100': 100,
          'okrDetailObjectKr|1': ['定个小目标', '定大目标', '走上人生巅峰'],
          'userName|1': ['心荃', '滕炜'],
          okrWeight: 40,
          okrDetailProgress: 50,
          parentObjectKr: '华润云',
          continueCount: 2,
          'krList|5': [
            {
              'detailId|': ['1233', '1234'],
              'okrDetailObjectKr|1': ['先赚1个亿', '先赚20亿'],
              'userName|1': ['心荃', '滕炜'],
              okrWeight: 40,
              okrDetailProgress: 30,
              parentObjectKr: '华润云',
              'okrDetailConfidence|1': [1, 2, 3],
              continueCount: 2,
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
      'supportUserList|23': [{
        'userId|+1': ['0011', '0022', '0033'],
        'userName|1': ['心荃', '滕炜', '陈翔', '主任', '陆涛'],
      }],
    })));
  },
  // author：林心荃
  // 用于：查操作历史
  'POST /gateway/talent-okr/okr/okrOperateHistory/getOkrHistory': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      userId: '1221377442212904960',
      userName: '智慧普通',
      contentVoList: [
        {
          remark: null,
          createTime: '2020-09-03 17:41:04',
          operateType: 'update',
          operateTypeCn: '更新',
          okrDetailId: [
            {
              type: 0,
              updateJsonStr: '{"okrDetailObjectKr":"我是一个o","beforeProgress":"100","afterProgress":"20","remark":"更新为风险可控"}',
            },
            {
              type: 1,
              updateJsonStr: '{"okrDetailObjectKr":"我是一个kr","beforeProgress":"0","beforeConfidence":"1","afterProgress":"20","remark":"更新为风险可控","afterConfidence":"2"}',
            },
          ],
        },
        {
          remark: null,
          createTime: '2020-09-03 17:30:34',
          operateType: 'update',
          operateTypeCn: '更新',
          okrDetailId: [
            {
              type: 0,
              updateJsonStr: '{"okrDetailObjectKr":"我是一个o","beforeProgress":"0","afterProgress":"100"}',
            },
          ],
        },
      ],
    })));
  },
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
  // 用于：查操作历史
  'POST /gateway/talent-query/okr/query/okrOperationHistory': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'content|3': [{
        userName: '张三',
        createTime: '@datetime("yyyy-MM-dd")',
        reason: '变更说明',
        changeContent: [{
          historyType: '1', // 变更
          oldOkrDetailObjectKr: '原okr标题',
          okrDetailObjectKr: '变更后okr标题',
          oldOkrWeight: 20, // 原权重
          okrWeight: 30, // 变更后权重
        }, {
          historyType: '2', // 关联
          undertakeOkrContent: '关联的okr标题',
          undertakeOkrType: '1', // 关联的okr类型 o || kr
        }, {
          historyType: '3', // 创建目标
          okrDetailObjectKr: 'okr标题',
          okrDetailType: '1', // okr类型 o || kr
        }, {
          historyType: '4', // 更新进度
          okrDetailObjectKr: 'okr标题',
          okrDetailType: '1', // okr类型 o || kr
          okrDetailProgress: 30, // 进度
          okrDetailConfidence: '1', // 风险状态
        }],
      }],
    })));
  },
  // author：林心荃
  // 用于：查变更承接项
  'POST /gateway/talent-okr/okr/main/getOkrModifyUndertakeOkrList': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      modifyUndertakeList: [{
        detailId: '1213546204999188481', okrDetailId: '1213463501108789251', okrDetailType: 0, okrDetailVersion: 2, okrDetailObjectKr: '门户o（变更了门户的o）', currentOption: false, modifyReason: null,
      }, {
        detailId: '1213463501108789250', okrDetailId: '1213463501108789251', okrDetailType: 0, okrDetailVersion: 1, okrDetailObjectKr: '门户o', currentOption: true, modifyReason: null,
      }, {
        detailId: '1213485560060821508', okrDetailId: '1213485560060821509', okrDetailType: 1, okrDetailVersion: 1, okrDetailObjectKr: '个人kr', currentOption: false, modifyReason: null,
      }],
    })));
  },
  // author：林心荃
  // 用于：查历史版本
  'POST /gateway/talent-okr/okr/main/selectOkrHistoryVersion': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      ARRAY: [{
        detailId: '1213129799329218561', okrDetailId: '1213057025402765315', okrMainId: '1213057025402765313', okrDetailVersion: 4, okrDetailObjectKr: '版本6修改o', okrDetailProgress: 0, okrWeight: 80, okrDetailConfidence: 0, okrDetailType: 0, okrFullId: 'xxxxx', createTime: '2020-08-22 14:50:06', updateTime: null, status: 1, approveStatus: null, okrParentId: null, okrDetailParentVersion: null, isTrue: 1, cultureId: '1162020375644299262', okrDetailParentObjectKr: null, modifyReason: null, odetailId: '',
      }, {
        detailId: '1213098257089101825', okrDetailId: '1213057025402765315', okrMainId: '1213057025402765313', okrDetailVersion: 3, okrDetailObjectKr: '版本1o变为版本3', okrDetailProgress: 0, okrWeight: 80, okrDetailConfidence: 0, okrDetailType: 0, okrFullId: 'xxxxx', createTime: '2020-08-22 14:50:06', updateTime: null, status: 1, approveStatus: null, okrParentId: null, okrDetailParentVersion: null, isTrue: 0, cultureId: '1162020375644299262', okrDetailParentObjectKr: null, modifyReason: null, odetailId: '',
      }, {
        detailId: '1213083310602911745', okrDetailId: '1213057025402765315', okrMainId: '1213057025402765313', okrDetailVersion: 2, okrDetailObjectKr: '版本1o', okrDetailProgress: 0, okrWeight: 80, okrDetailConfidence: 0, okrDetailType: 0, okrFullId: 'xxxxx', createTime: '2020-08-22 14:50:06', updateTime: null, status: 1, approveStatus: null, okrParentId: null, okrDetailParentVersion: null, isTrue: 0, cultureId: '1162020375644299262', okrDetailParentObjectKr: null, modifyReason: null, odetailId: '',
      }, {
        detailId: '1213057025402765314', okrDetailId: '1213057025402765315', okrMainId: '1213057025402765313', okrDetailVersion: 1, okrDetailObjectKr: '版本1o', okrDetailProgress: 0, okrWeight: 100, okrDetailConfidence: 0, okrDetailType: 0, okrFullId: 'xxxxx', createTime: '2020-08-22 14:50:06', updateTime: null, status: 1, approveStatus: null, okrParentId: null, okrDetailParentVersion: null, isTrue: 0, cultureId: '1162020375644299262', okrDetailParentObjectKr: null, modifyReason: null, odetailId: '',
      }],
    })));
  },
};
module.exports = mockData;