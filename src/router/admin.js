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
      power: '',
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
      power: '',
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
      power: '',
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
      power: '',
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
      parentRoute: 'tenantManage',
      title: 'sysUserManage',
      power: '',
    },
    component: () => import('@/views/admin/systemPrivilege/sysUserManage/index'),
  },
  ],
},
];