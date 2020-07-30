export default [
  {
    path: '/settingsIndex',
    name: 'settingsIndex',
    redirect: {
      name: 'organize',
    },
    component: () => import('@/views/settingsIndex'),
    children: [
      {
        // 组织用户管理
        path: '/organize',
        name: 'organize',
        meta: {
        },
        component: () => import('@/views/settings/organizeUserManagement/index'),
      },
      {
        // 角色设置
        path: '/role',
        name: 'role',
        meta: {
        },
        component: () => import('@/views/settings/role/index'),
      },
    ],
  },
];