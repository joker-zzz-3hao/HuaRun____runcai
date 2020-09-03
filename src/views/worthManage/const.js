const SCORE_LIST = [
  { label: '全部', value: '' },
  { label: '非常匹配', value: '10' },
  { label: '一般匹配', value: '20' },
  { label: '勉强匹配', value: '30' },
  { label: '不匹配', value: '40' },
  { label: '其他', value: '50' },
];
const SCORE_VALUE = [
  { label: '非常匹配', value: '10' },
  { label: '一般匹配', value: '20' },
  { label: '勉强匹配', value: '30' },
  { label: '不匹配', value: '40' },
  { label: '其他', value: '50' },
];

const SCORE_MAP = {
  10: '非常匹配',
  20: '一般匹配',
  30: '勉强匹配',
  40: '不匹配',
  50: '其他',
};

export default {
  SCORE_LIST,
  SCORE_MAP,
  SCORE_VALUE,
};