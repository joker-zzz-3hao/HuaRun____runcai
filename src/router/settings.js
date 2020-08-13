export default [
  {
    path: '/settingsIndex',
    name: 'settingsIndex',
    redirect: {
      name: 'organizeManage',
    },
    component: () => import('@/views/settingsIndex'),
    children: [
      {
        // 组织部门管理
        path: '/organizeManage',
        name: 'organizeManage',
        meta: {
          hasMainMenu: true,
        },
        component: () => import('@/views/settings/organizeUserManage/index'),
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
        // 角色管理
        path: '/roleManage',
        name: 'roleManage',
        meta: {
          hasMainMenu: true,
        },
        component: () => import('@/views/settings/roleManage/department/index'),
      },
      {
        // 角色管理
        path: '/members',
        name: 'members',
        meta: {
          hasMainMenu: true,
        },
        component: () => import('@/views/settings/roleManage/members/index'),
      },
    ],
  },
];