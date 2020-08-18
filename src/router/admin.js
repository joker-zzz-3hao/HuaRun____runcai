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
      noSubMenu: true,
      parentRoute: 'tenantManage',
    },
    component: () => import('@/views/admin/tenantManage/index'),
  },
  {
    // 用户管理
    path: '/userManage',
    name: 'userManage',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'userManage',
    },
    component: () => import('@/views/admin/userManage/index'),
  },
  {
    // 部门管理
    path: '/departmentManage',
    name: 'departmentManage',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'departmentManage',
    },
    component: () => import('@/views/admin/departmentManage/index'),
  },
  {
    // 字典管理
    path: '/dictionaryManage',
    name: 'dictionaryManage',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'dictionaryManage',
    },
    component: () => import('@/views/admin/dictionaryManage/index'),
  },
  {
    // 菜单管理
    path: '/menuManage',
    name: 'menuManage',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'menuManage',
      title: 'menuManage',
      power: '',
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
      parentRoute: 'sysUserManage',
    },
    component: () => import('@/views/admin/systemPrivilege/sysUserManage/index'),
  },
  ],
},
];