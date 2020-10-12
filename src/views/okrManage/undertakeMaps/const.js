const OKR_TYPE_MAP = {
  0: '目标',
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
  label: '信心指数高', value: 1,
}, {
  label: '信心指数中', value: 2,
}, {
  label: '信心指数低', value: 3,
}];
const CONFIDENCE_MAP = {
  1: '信心指数高',
  2: '信心指数中',
  3: '信心指数低',
};
const OPERATE_TYPE_MAP = {
  5: 'OKR更新',
  6: '周报更新',
};
export default {
  OKR_TYPE_MAP,
  CONFIDENCE,
  CONFIDENCE_MAP,
  OPERATE_TYPE_MAP,
  OKR_TYPE_NAME_MAP,
  OKR_KIND_MAP,
};