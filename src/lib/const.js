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
  { label: '待审批', value: '0' },
  { label: '审批通过', value: '1' },
  { label: '被退回', value: '2' },
  { label: '撤回', value: '3' },
  { label: '待审批', value: '4' },
  { label: '待审批', value: '5' },
  { label: '待审批', value: '6' },
  { label: '全部', value: '' },
];
const APPROVAL_STATUS_MAP = {
  0: '待审批',
  1: '审批通过',
  2: '被退回',
  3: '撤回',
  4: '待审批',
  5: '待审批',
  6: '待审批',
};
const APPROVAL_TYPE_LIST = [
  { label: '创建', value: '0' },
  { label: '变更', value: '1' },
  { label: '全部', value: '' },
];
const APPROVAL_TYPE_MAP = {
  0: '创建',
  1: '变更',
  2: '全部',
};
const APPROVAL_HISTROY_MAP = {
  0: '提交',
  1: '通过',
  2: '退回',
  3: '撤回',
  4: '提交',
  5: '提交',
  6: '提交',
};
const IMAGES_MAP = {
  jpg: true,
  jpeg: true,
  png: true,
  bmp: true,
  gif: true,
};
const OKR_TYPE_MAP = {
  1: '部门',
  2: '个人',
  3: '公司',
};
export default {
  bbb,
  CYCLE_LIST,
  APPROVAL_STATUS_LIST,
  APPROVAL_TYPE_LIST,
  CYCLE_MAP,
  APPROVAL_STATUS_MAP,
  APPROVAL_TYPE_MAP,
  APPROVAL_HISTROY_MAP,
  IMAGES_MAP,
  OKR_TYPE_MAP,
};