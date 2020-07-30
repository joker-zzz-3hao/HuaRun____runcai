export default [
  {
    path: '/adminIndex',
    name: 'adminIndex',
    redirect: {
      name: 'role',
    },
    component: () => import('@/views/adminIndex'),
    children: [
      {
        // 租户管理
        path: '/tenantManagement',
        name: 'tenantManagement',
        meta: {
        },
        component: () => import('@/views/admin/tenantManagement/index'),
      },
      {
        // 发布公告
        path: '/issueNotice',
        name: 'issueNotice',
        meta: {
        },
        component: () => import('@/views/admin/issueNotice/index'),
      },
      {
        // 数据字典
        path: '/dataDictionary',
        name: 'dataDictionary',
        meta: {
        },
        component: () => import('@/views/admin/dataDictionary/index'),
      },
      {
        // 系统维护
        path: '/systemMaintenance',
        name: 'systemMaintenance',
        meta: {
        },
        component: () => import('@/views/admin/systemMaintenance/index'),
      },
      {
        // 系统权限
        path: '/systemPermissions',
        name: 'systemPermissions',
        meta: {
        },
        component: () => import('@/views/admin/systemPermissions/index'),
      },
    ],
  },
];