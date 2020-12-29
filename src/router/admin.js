export default [{
  path: '/adminIndex',
  name: 'adminIndex',
  redirect: {
    name: 'tenantManage',
  },
  component: () => import('@/views/adminIndex'),
  children: [{
    // 租户管理
    path: '/tenantManage',
    name: 'tenantManage',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'tenantManage',
      title: 'tenantManage',
      power: 'sys_tenant',
    },
    component: () => import('@/views/admin/tenantManage/index'),
  },
  {
    // 用户管理
    path: '/userManage',
    name: 'userManage',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'tenantManage',
      title: 'userManage',
      power: 'sys_user',
    },
    component: () => import('@/views/admin/userManage/index'),
  },
  {
    // 部门管理
    path: '/departmentManage',
    name: 'departmentManage',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'tenantManage',
      title: 'departmentManage',
      power: 'sys_department',
    },
    component: () => import('@/views/admin/departmentManage/index'),
  },
  {
    // 字典管理
    path: '/dictionaryManage',
    name: 'dictionaryManage',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'tenantManage',
      title: 'dictionaryManage',
      power: 'sys_dictionary',
    },
    component: () => import('@/views/admin/dictionaryManage/index'),
  },
  {
    // 菜单管理
    path: '/menuManage',
    name: 'menuManage',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'tenantManage',
      title: 'menuManage',
      power: 'sys_menu',
    },
    component: () => import('@/views/admin/menuManage/index'),
  },
  {
    // 系统用户管理
    path: '/sysUserManage',
    name: 'sysUserManage',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'tenantManage',
      title: 'sysUserManage',
      power: 'sys_auth',
    },
    component: () => import('@/views/admin/systemPrivilege/sysUserManage/index'),
  },
  {
    // 监听数据统计
    path: '/listenerData',
    name: 'listenerData',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'tenantManage',
      title: 'listenerData',
      power: 'listenerData',
    },
    component: () => import('@/views/admin/listenerData/index'),
  },
  ],
},
];