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
  label: '高', value: '1',
}, {
  label: '中', value: '2',
}, {
  label: '低', value: '3',
}];
const CONFIDENCE_MAP = {
  1: '高',
  2: '中',
  3: '低',
};
export default {
  OKR_TYPE_LIST,
  CONFIDENCE,
  CONFIDENCE_MAP,
  OKR_TYPE_MAP,
};