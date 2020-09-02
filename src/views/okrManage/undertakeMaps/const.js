const OKR_TYPE_MAP = {
  0: 'O',
  1: 'KR',
};
const OKR_KIND_MAP = {
  1: '部门',
  2: '个人',
};
const OKR_TYPE_NAME_MAP = {
  0: '目标O',
  1: '关键结果KR',
};
const CONFIDENCE = [{
  label: '无风险', value: 1,
}, {
  label: '风险可控', value: 2,
}, {
  label: '失控', value: 3,
}];
const CONFIDENCE_MAP = {
  1: '无风险',
  2: '风险可控',
  3: '失控',
};
const OPERATE_TYPE_MAP = {
  5: 'OKR更新',
  7: '周报更新',
};
export default {
  OKR_TYPE_MAP,
  CONFIDENCE,
  CONFIDENCE_MAP,
  OPERATE_TYPE_MAP,
  OKR_TYPE_NAME_MAP,
  OKR_KIND_MAP,
};