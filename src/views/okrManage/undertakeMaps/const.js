const OKR_TYPE_MAP = {
  1: '部门',
  2: '个人',
  3: '公司',
};
const OKR_KIND_MAP = {
  0: '目标',
  1: 'KR',
};
const OKR_TYPE_NAME_MAP = {
  0: '目标O',
  1: '关键结果KR',
};
const CONFIDENCE = [{
  label: '高', value: 1,
}, {
  label: '中', value: 2,
}, {
  label: '低', value: 3,
}];
const CONFIDENCE_MAP = {
  1: '高',
  2: '中',
  3: '低',
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