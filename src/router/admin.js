/*
 * @Author: 许志鹏
 * @Date: 2020-08-04 15:39:16
 * @Description: file content
 */
/* eslint-disable indent */
export default [{
  path: '/adminIndex',
  name: 'adminIndex',
  redirect: {
    name: 'role',
  },
  component: () => import('@/views/adminIndex'),
  children: [{
    // 租户管理
    path: '/tenantManagement',
    name: 'tenantManagement',
    meta: {
      hasMainMenu: true,
    },
    component: () => import('@/views/admin/tenantManagement/index'),
  },
  {
    // 发布公告
    path: '/issueNotice',
    name: 'issueNotice',
    meta: {
      hasMainMenu: true,
    },
    component: () => import('@/views/admin/issueNotice/index'),
  },
  {
    // 数据字典
    path: '/dataDictionary',
    name: 'dataDictionary',
    meta: {
      hasMainMenu: true,
    },
    component: () => import('@/views/admin/dataDictionary/index'),
  },
  {
    // 系统维护
    path: '/systemMaintenance',
    name: 'systemMaintenance',
    meta: {
      hasMainMenu: true,
    },
    component: () => import('@/views/admin/systemMaintenance/index'),
  },
  {
    // 用户管理
    path: '/userManage',
    name: 'userManage',
    meta: {
      hasMainMenu: true,
    },
    component: () => import('@/views/admin/userManage/index'),
  },
  {
    // 部门管理
    path: '/departmentManage',
    name: 'departmentManage',
    meta: {
      hasMainMenu: true,
    },
    component: () => import('@/views/admin/departmentManage/index'),
  },
  {
    // 系统用户管理
    path: '/sysUserManage',
    name: 'sysUserManage',
    meta: {
      hasMainMenu: true,
    },
    component: () => import('@/views/admin/systemPrivilege/sysUserManage/index'),
  },
  {
    // 菜单管理
    path: '/menuManagement',
    name: 'menuManagement',
    meta: {
      hasMainMenu: true,
    },
    component: () => import('@/views/admin/menuManagement/index'),
  },
  ],
},
];
