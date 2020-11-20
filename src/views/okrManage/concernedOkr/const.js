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

const OKR_TYPE_MAP = {
  1: '部门',
  2: '个人',
  3: '公司',
};

export default {
  STATUS_LIST_MAP,
  OKR_TYPE_MAP,
};