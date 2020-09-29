const PRIORITY_LIST = [{
  label: '高', value: 20,
}, {
  label: '中', value: 10,
}, {
  label: '低', value: 1,
}];
const PRIORITY_MAP = {
  1: '低',
  10: '中',
  20: '高',
};
const TASK_PROCESS_LIST = [{
  label: '标准任务过程', value: 1,
}, {
  label: '产品任务过程', value: 2,
}, {
  label: '研发任务过程', value: 3,
}, {
  label: '测试任务过程', value: 4,
}, {
  label: '上线发布任务过程', value: 5,
}];
const TASK_STATUS_MAP = {
  0: '草稿',
  10: '待确认',
  20: '已确认',
};
const FIEID_MAP = {
  taskTitle: '任务标题',
  taskProgress: '任务进度',
  taskLevel: '任务优先级',
  processId: '归属任务过程',
  projectId: '归属项目',
  taskUserId: '执行人',
};
export default {
  PRIORITY_LIST,
  TASK_PROCESS_LIST,
  TASK_STATUS_MAP,
  FIEID_MAP,
  PRIORITY_MAP,
};