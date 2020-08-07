const STATUS_LIST = [{
  name: '起草中', id: '1',
}, {
  name: '被退回', id: '2',
}, {
  name: '审核中', id: '3',
}, {
  name: '进行中', id: '4',
}, {
  name: '已结束', id: '5',
}, {
  name: '考核中', id: '6',
}, {
  name: '已完成', id: '7',
}];
const CONFIDENCE = [{
  label: '可控', value: '1',
}, {
  label: '有风险', value: '2',
}, {
  label: '失控', value: '3',
}];
export default {
  STATUS_LIST,
  CONFIDENCE,
};