const THROW_TYPE_MAP = {
  0: '经营性支出',
  1: '研发支出',
};
const CURRENCY_MAP = {
  0: '人民币',
  1: '港币',
};
const PROJECT_TYPE_MAP = {
  0: '可行性研究项目',
  1: '研发项目',
  2: '运营项目',
  3: '建设项目',
  4: '内部管理项目',
  5: '售前项目',
};

const PROJECT_TYPE_LIST = [
  { value: '0', label: '可行性研究项目' },
  { value: '1', label: '研发项目' },
  { value: '2', label: '运营项目' },
  { value: '3', label: '建设项目' },
  { value: '4', label: '内部管理项目' },
  { value: '5', label: '售前项目' },
];
const LEVEL_LIST = [
  { value: '0', label: 'L3' },
  { value: '1', label: 'L4' },
  { value: '2', label: 'L5' },
  { value: '3', label: 'L6' },
  { value: '4', label: 'L7' },
];
const FUNC_LIST = [
  { value: '0', label: '前端开发' },
  { value: '1', label: '产品经理' },
  { value: '2', label: '测试经理' },
  { value: '3', label: '售前' },
  { value: '4', label: '售后' },
];
const THROW_TYPE_LIST = [
  { value: '0', label: '经营性支出' },
  { value: '1', label: '研发支出' },
];
const CURRENCY_LIST = [
  { value: '0', label: '人民币' },
  { value: '1', label: '港币' },
];

export default {
  THROW_TYPE_MAP,
  THROW_TYPE_LIST,
  CURRENCY_MAP,
  CURRENCY_LIST,
  PROJECT_TYPE_MAP,
  PROJECT_TYPE_LIST,
  LEVEL_LIST,
  FUNC_LIST,
};
