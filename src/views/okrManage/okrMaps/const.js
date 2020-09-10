const STATUS_MAP = {
  1: '进行中',
  2: '考核中',
  3: '已完成',
  4: '已结束',
};

const OKR_TYPE_MAP = {
  O: '目标O',
  KR: '关键结果KR',
};

const SEARCH_TYPE_LIST = [
  { label: '部门', value: '1' },
  { label: 'OKR', value: '2' },
  { label: '成员', value: '3' },
];

const TABLE_STATUS_MAP = {
  1: '进行中',
  2: '考核中',
  3: '已完成',
  4: '已结束',
  5: '未开始',
};

export default {
  STATUS_MAP,
  OKR_TYPE_MAP,
  SEARCH_TYPE_LIST,
  TABLE_STATUS_MAP,
};