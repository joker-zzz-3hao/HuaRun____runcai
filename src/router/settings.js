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
        // 角色设置
        path: '/organize',
        name: 'organize',
        meta: {
        },
        component: () => import('@/views/settings/organizeUserManagement/index'),
      },
    ],
  },
];