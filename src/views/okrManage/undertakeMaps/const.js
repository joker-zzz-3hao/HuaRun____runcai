const OKR_TYPE_MAP = {
  0: 'O',
  1: 'KR',
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
export default {
  OKR_TYPE_MAP,
  CONFIDENCE,
  CONFIDENCE_MAP,
};