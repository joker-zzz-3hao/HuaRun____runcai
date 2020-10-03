const OKR_TYPE_LIST = [{
  name: '个人', id: 2,
}, {
  name: '部门', id: 1,
}];
const OKR_TYPE_MAP = {
  1: '部门',
  2: '个人',
  3: '公司',
};
const CONFIDENCE = [{
  label: '信心指数高', value: '1',
}, {
  label: '信心指数中', value: '2',
}, {
  label: '信心指数低', value: '3',
}];
const CONFIDENCE_MAP = {
  1: '信心指数高',
  2: '信心指数中',
  3: '信心指数低',
};
export default {
  OKR_TYPE_LIST,
  CONFIDENCE,
  CONFIDENCE_MAP,
  OKR_TYPE_MAP,
};