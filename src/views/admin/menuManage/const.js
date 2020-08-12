/*
 * @Author: 许志鹏
 * @Date: 2020-08-10 11:32:33
 * @Description: file content
 */
const STATUS = {
  O: '开通',
  S: '停用',
  E: '过期',
};

const STATUS_LIST = [
  {
    statusName: '开通',
    statusCode: 'O',
  },
  {
    statusName: '停用',
    statusCode: 'S',
  },
  {
    statusName: '过期',
    statusCode: 'E',
  },
];

export default {
  STATUS,
  STATUS_LIST,
};