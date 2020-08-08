const bbb = 1;
const CYCLE_LIST = [
  { label: '2020年第一季度', value: 1 },
  { label: '2020年第二季度', value: 2 },
  { label: '2020年第三季度', value: 3 },
];
const CYCLE_MAP = {
  1: '2020年第一季度',
  2: '2020年第二季度',
  3: '2020年第三季度',
};
const APPROVAL_STATUS_LIST = [
  { label: '待审批', value: '01' },
  { label: '已审批', value: '02' },
  { label: '已退回', value: '03' },
  { label: '全部', value: '04' },
];
const APPROVAL_STATUS_MAP = {
  '01': '待审批',
  '02': '已审批',
  '03': '已退回',
  '04': '全部',
};
const APPROVAL_TYPE_LIST = [
  { label: '全部', value: '001' },
  { label: '变更', value: '002' },
  { label: '创建', value: '003' },
];
const APPROVAL_TYPE_MAP = {
  '001': '全部',
  '002': '变更',
  '003': '创建',
};

export default {
  bbb,
  CYCLE_LIST,
  APPROVAL_STATUS_LIST,
  APPROVAL_TYPE_LIST,
  CYCLE_MAP,
  APPROVAL_STATUS_MAP,
  APPROVAL_TYPE_MAP,
};