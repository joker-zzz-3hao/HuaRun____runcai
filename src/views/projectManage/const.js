const THROW_TYPE_MAP = {
  0: '经营性支出',
  1: '研发支出',
};
const CURRENCY_MAP = {
  0: '港币',
  1: '人民币',
};
const PROJECT_TYPE_MAP = {
  0: '可行性研究项目',
  1: '研发项目',
  2: '运营项目',
  3: '建设项目',
  4: '内部管理项目',
  5: '售前项目',
};

const DATE_MODE = {
  mondayMor: '周一上午',
  mondayAft: '周一下午',
  tuesdayMor: '周二上午',
  tuesdayAft: '周二下午',
  wednesdayMor: '周三上午',
  wednesdayAft: '周三下午',
  thursdayMor: '周四上午',
  thursdayAft: '周四下午',
  fridayMor: '周五上午',
  fridayAft: '周五下午',
  saturdayMor: '周六上午',
  saturdayAft: '周六下午',
  sundayMor: '周日上午',
  sundayAft: '周日下午',
};

const DATE_MODE_NUM = [
  { weekDate: 0, weekTimeType: 1, value: '周一上午' },
  { weekDate: 0, weekTimeType: 2, value: '周一下午' },
  { weekDate: 1, weekTimeType: 1, value: '周二上午' },
  { weekDate: 1, weekTimeType: 2, value: '周二下午' },
  { weekDate: 2, weekTimeType: 1, value: '周三上午' },
  { weekDate: 2, weekTimeType: 2, value: '周三下午' },
  { weekDate: 3, weekTimeType: 1, value: '周四上午' },
  { weekDate: 3, weekTimeType: 2, value: '周四下午' },
  { weekDate: 4, weekTimeType: 1, value: '周五上午' },
  { weekDate: 4, weekTimeType: 2, value: '周五下午' },
  { weekDate: 4, weekTimeType: 1, value: '周六上午' },
  { weekDate: 4, weekTimeType: 2, value: '周六下午' },
  { weekDate: 4, weekTimeType: 1, value: '周日上午' },
  { weekDate: 4, weekTimeType: 2, value: '周日下午' },
];

const DATE_MODE_NUMOBJ = [
  { weekDate: 0, weekTimeType: 1, value: '周一上午' },
  { weekDate: 0, weekTimeType: 2, value: '周一下午' },
  { weekDate: 1, weekTimeType: 1, value: '周二上午' },
  { weekDate: 1, weekTimeType: 2, value: '周二下午' },
  { weekDate: 2, weekTimeType: 1, value: '周三上午' },
  { weekDate: 2, weekTimeType: 2, value: '周三下午' },
  { weekDate: 3, weekTimeType: 1, value: '周四上午' },
  { weekDate: 3, weekTimeType: 2, value: '周四下午' },
  { weekDate: 4, weekTimeType: 1, value: '周五上午' },
  { weekDate: 4, weekTimeType: 2, value: '周五下午' },
  { weekDate: 5, weekTimeType: 1, value: '周六上午' },
  { weekDate: 5, weekTimeType: 2, value: '周六下午' },
  { weekDate: 6, weekTimeType: 1, value: '周日上午' },
  { weekDate: 6, weekTimeType: 2, value: '周日下午' },
];

const DATE_NUM = {
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
  7: 'sunday',
};

const PROJECT_TYPE_LIST = [
  { value: '', label: '全部' },
  { value: '0', label: '可行性研究项目' },
  { value: '1', label: '研发项目' },
  { value: '2', label: '运营项目' },
  { value: '3', label: '建设项目' },
  { value: '4', label: '内部管理项目' },
  { value: '5', label: '售前项目' },
];
const PROJECT_TYPE_CREATE_LIST = [
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
  { value: '', label: '全部' },
  { value: '0', label: '经营性支出' },
  { value: '1', label: '研发支出' },
];
const THROW_TYPE_CREATE_LIST = [
  { value: '0', label: '经营性支出' },
  { value: '1', label: '研发支出' },
];
const CURRENCY_LIST = [
  // { value: '0', label: '港币' },
  { value: '1', label: '人民币' },
];

const PROJECT_STATUS_LIST = [
  { value: '', label: '全部' },
  { value: '0', label: '进行中' },
  { value: '1', label: '已关闭' },
];

const PROJECT_STATUS_MAP = {
  0: '进行中',
  1: '已关闭',
};

const APPROVAL_STATUS_MAP = {
  1: '待审批',
  2: '已审批',
};

const PROJECT_ORG_TYPE = {
  0: '否',
  1: '是',
};

const ALLOCATESTATUS_TYPE = {
  1: '周报',
  2: '调入',
  3: '调出',
};

const PROJECT_ORG_TYPE_ARR = [
  { value: '', label: '全部' },
  { value: 0, label: '否' },
  { value: 1, label: '是' },
];

const APPROVAL_LEVEL = {
  Contractor: '外部账户',
  OTHER: '特殊账户',
  Full_Time: '员工账户',
};

const APPROVAL_SELECT = [
  { value: 1, label: '按周筛选' },
  { value: 2, label: '按日筛选' },
];

const APPROVAL_STATUS_LIST = [
  { value: '', label: '全部' },
  { value: '1', label: '待审批' },
  { value: '2', label: '已审批' },
];
const PROJECT_SOURCE_MAP = [
  { value: 'TENANT', label: '虚拟项目' },
];

const BELONGINGTYPE = [
  { value: 1, label: '内部' },
  { value: 2, label: '外部' },
];

const BELONGINGTYPE_TYPE = {
  1: '内部',
  2: '外部',
};

export default {
  THROW_TYPE_MAP,
  THROW_TYPE_LIST,
  CURRENCY_MAP,
  CURRENCY_LIST,
  PROJECT_TYPE_MAP,
  PROJECT_TYPE_LIST,
  LEVEL_LIST,
  FUNC_LIST,
  PROJECT_STATUS_MAP,
  APPROVAL_STATUS_MAP,
  APPROVAL_STATUS_LIST,
  PROJECT_SOURCE_MAP,
  PROJECT_STATUS_LIST,
  PROJECT_TYPE_CREATE_LIST,
  THROW_TYPE_CREATE_LIST,
  DATE_MODE,
  DATE_NUM,
  DATE_MODE_NUM,
  DATE_MODE_NUMOBJ,
  APPROVAL_SELECT,
  APPROVAL_LEVEL,
  PROJECT_ORG_TYPE,
  PROJECT_ORG_TYPE_ARR,
  BELONGINGTYPE,
  BELONGINGTYPE_TYPE,
  ALLOCATESTATUS_TYPE,
};
