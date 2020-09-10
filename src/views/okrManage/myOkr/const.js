const STATUS_LIST = [
  {
    name: '全部', id: 'all',
  }, {
    name: '进行中', id: '1',
  }, {
    name: '起草中', id: '6',
  }, {
    name: '审批中', id: '7',
  }, {
    name: '被退回', id: '8',
  }, {
    name: '已完成', id: '3',
  }, {
    name: '考核中', id: '2',
  }, {
    name: '已结束', id: '4',
  }, {
    name: '未开始', id: '5',
  }];
const STATUS_LIST_MAP = {
  all: '全部',
  1: '进行中',
  2: '考核中',
  3: '已完成',
  4: '已结束',
  5: '未开始',
  6: '起草中',
  7: '审批中',
  8: '被退回',
};
const CONFIDENCE = [{
  label: '无风险', value: '1',
}, {
  label: '风险可控', value: '2',
}, {
  label: '失控', value: '3',
}];
const CONFIDENCE_MAP = {
  1: '无风险',
  2: '风险可控',
  3: '失控',
};
const OKR_TYPE_MAP = {
  1: '部门',
  2: '个人',
  3: '公司',
};
const OKR_TYPE_LIST = [{
  name: '个人', id: 2,
}, {
  name: '部门', id: 1,
},
{
  name: '公司', id: 3,
}];

const OKR_KIND_MAP = {
  0: '目标',
  1: '关键结果',
};
export default {
  STATUS_LIST,
  CONFIDENCE,
  CONFIDENCE_MAP,
  OKR_TYPE_MAP,
  STATUS_LIST_MAP,
  OKR_TYPE_LIST,
  OKR_KIND_MAP,
};