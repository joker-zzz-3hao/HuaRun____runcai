const STATUS_MAP = {
  1: '进行中',
  2: '复盘中',
  3: '已完成',
  4: '已结束',
};

const OKR_TYPE_MAP = {
  1: '部门',
  2: '个人',
  3: '公司',
};

const SEARCH_TYPE_LIST = [
  { label: '部门', value: '1' },
  { label: 'OKR', value: '2' },
  { label: '成员', value: '3' },
];

const TABLE_STATUS_MAP = {
  1: '进行中',
  2: '复盘中',
  3: '已完成',
  4: '已结束',
  5: '未开始',
};
const OKR_KIND_MAP = {
  0: '目标',
  1: '关键结果',
};
const CONFIDENCE_MAP = {
  1: '高',
  2: '中',
  3: '低',
};
export default {
  STATUS_MAP,
  OKR_TYPE_MAP,
  SEARCH_TYPE_LIST,
  TABLE_STATUS_MAP,
  OKR_KIND_MAP,
  CONFIDENCE_MAP,
};