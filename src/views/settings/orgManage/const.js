/* eslint-disable indent */
const USER_TYPE_LIST = [{
  key: '',
  label: '全部',
}, {
  key: '0',
  label: '注册用户',
}, {
  key: '1',
  label: 'LDAP用户',
}, {
  key: '2',
  label: '创建用户',
}];
const USER_STATUS_LIST = [{
  key: '',
  label: '全部',
}, {
  key: '0',
  label: '启用',
},
{
  key: '50',
  label: '禁用',
},
];
const USER_STATUS_MAP = {
  0: '启用',
  50: '禁用',
};
const USER_TYPE_MAP = {
  0: '注册用户',
  1: 'LDAP用户',
  2: '创建用户',
};
const IS_LEADER_LIST = [{
  key: '',
  label: '全部',
}, {
  key: '0',
  label: '是',
},
{
  key: '1',
  label: '否',
},
];
export default {
  USER_TYPE_LIST,
  USER_STATUS_LIST,
  IS_LEADER_LIST,
  USER_STATUS_MAP,
  USER_TYPE_MAP,
};
