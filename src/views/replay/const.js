const REVIEW_STATUS = {
  0: '复盘结束',
  1: '待复盘',
  2: '待沟通',
  3: '复盘结束',
};

const OKR_BELONGTYPE = {
  1: '部门',
  2: '个人',
};

const REVIEW_STATUS_LIST = [
  { name: '全部', status: '' },
  { name: '待复盘', status: 1 },
  { name: '待沟通', status: 2 },
  { name: '复盘结束', status: 3 },
];
const REPLAY_STATUS_LIST = [
  { name: '全部', status: '' },
  { name: '待复核', status: 3 },
  { name: '已复核', status: 0 },
];
const REPLAY_ASSESS_STATUS_LIST = [
  { name: '全部', status: '' },
  { name: '未提交', status: 1 },
  { name: '复核中', status: 2 },
  { name: '同意', status: 3 },
  { name: '驳回', status: 4 },
];
const REVIEW_STATUS_MAP = {
  0: { name: '复盘结束', classname: 'finish-review' },
  1: { name: '待复盘', classname: 'no-review' },
  2: { name: '待沟通', classname: 'no-talk' },
  3: { name: '复盘结束', classname: 'finish-review' },
};
const APPROVAL_SCORE_STATUS_MAP = {
  1: { name: '未提交', classname: 'no-sumbit' },
  2: { name: '复核中', classname: 'approval-ing' },
  3: { name: '同意', classname: 'pass-sumbit' },
  4: { name: '驳回', classname: 'refuse-sumbit' },
};
const COMMUN_MAP = {
  1: '未沟通',
  2: '已沟通',
};
export default {
  REVIEW_STATUS,
  REVIEW_STATUS_LIST,
  OKR_BELONGTYPE,
  REPLAY_STATUS_LIST,
  REVIEW_STATUS_MAP,
  REPLAY_ASSESS_STATUS_LIST,
  APPROVAL_SCORE_STATUS_MAP,
  COMMUN_MAP,
};
