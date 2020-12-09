const STATUS_LIST = [
  {
    name: '全部', id: 'all', className: 'all',
  }, {
    name: '进行中', id: '1', className: 'running',
  }, {
    name: '起草中', id: '6', className: 'draft',
  }, {
    name: '审批中', id: '7', className: 'approve',
  }, {
    name: '被退回', id: '8', className: 'recall',
  }, {
    name: '已完成', id: '3', className: 'finish',
  }, {
    name: '复盘中', id: '2', className: 'replay',
  }, {
    name: '已结束', id: '4', className: 'ending',
  }, {
    name: '未开始', id: '5', className: 'not-started',
  }];
const STATUS_LIST_MAP = {
  1: { name: '进行中', className: 'running' },
  2: { name: '复盘中', className: 'replay' },
  3: { name: '已完成', className: 'finish' },
  4: { name: '已结束', className: 'ending' },
  5: { name: '未开始', className: 'not-started' },
  6: { name: '起草中', className: 'draft' },
  7: { name: '审批中', className: 'approve' },
  8: { name: '被退回', className: 'recall' },
};
const CONFIDENCE = [{
  label: '高', value: '1',
}, {
  label: '中', value: '2',
}, {
  label: '低', value: '3',
}];
const CONFIDENCE_MAP = {
  1: '高',
  2: '中',
  3: '低',
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
const READ_RESULT_MAP = {
  0: '未阅',
  1: '无异议',
  2: '建议调整',
};
const TABLE_STATUS_MAP = {
  1: '进行中',
  2: '复盘中',
  3: '已完成',
  4: '已结束',
  5: '未开始',
};
export default {
  STATUS_LIST,
  CONFIDENCE,
  CONFIDENCE_MAP,
  OKR_TYPE_MAP,
  STATUS_LIST_MAP,
  OKR_TYPE_LIST,
  OKR_KIND_MAP,
  READ_RESULT_MAP,
  TABLE_STATUS_MAP,
};