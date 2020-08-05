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
        path: '/organizeManagement',
        name: 'organizeManagement',
        meta: {
          hasMainMenu: true,
        },
        component: () => import('@/views/settings/organizeUserManagement/index'),
      },
      {
        // 角色设置
        path: '/role',
        name: 'role',
        meta: {
          hasMainMenu: true,
        },
        component: () => import('@/views/settings/role/index'),
      },
      {
        // 设置OKR查看权限
        path: '/okrPermissions',
        name: 'okrPermissions',
        meta: {
          hasMainMenu: true,
        },
        component: () => import('@/views/settings/okrPermissions/index'),
      },
      {
        // 设置OKR周期与自评
        path: '/okrCycle',
        name: 'okrCycle',
        meta: {
          hasMainMenu: true,
        },
        component: () => import('@/views/settings/okrCycle/index'),
      },
      {
        // 发布消息
        path: '/issueMessage',
        name: 'issueMessage',
        meta: {
          hasMainMenu: true,
        },
        component: () => import('@/views/settings/issueMessage/index'),
      },
    ],
  },
];