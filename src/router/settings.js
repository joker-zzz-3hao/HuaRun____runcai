/* eslint-disable indent */
export default [{
  path: '/settingsIndex',
  name: 'settingsIndex',
  redirect: {
    name: 'orgManage',
  },
  component: () => import('@/views/settingsIndex'),
  children: [{
    // 组织部门管理
    path: '/orgManage',
    name: 'orgManage',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'orgManage',
      title: 'orgManage',
      power: '',
    },
    component: () => import('@/views/settings/orgManage/index'),
  },
  {
    // 角色管理
    path: '/roleManage',
    name: 'roleManage',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'orgManage',
      title: 'roleManage',
      power: 'role-menu',
    },
    component: () => import('@/views/settings/roleManage/roleType/index'),
  },
  {
    // 角色管理
    path: '/members',
    name: 'members',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'orgManage',
      title: 'members',
      power: '',
    },
    component: () => import('@/views/settings/roleManage/members/index'),
  },
  {
    // 设置OKR查看权限
    path: '/okrPermissions',
    name: 'okrPermissions',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'orgManage',
      title: 'okrPermissions',
      power: 'okr-setting-menu',
    },
    component: () => import('@/views/settings/okrPermissions/index'),
  },
  {
    // 设置OKR周期与自评
    path: '/okrCycle',
    name: 'okrCycle',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'orgManage',
      title: 'okrCycle',
      power: 'okr-cycle-menu',
    },
    component: () => import('@/views/settings/okrCycle/index'),
  },
  {
    // 设置价值观
    path: '/setWorth',
    name: 'setWorth',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'orgManage',
      title: 'setWorth',
      power: 'worthStatistics',
    },
    component: () => import('@/views/settings/setWorth/index'),
  },
  // 价值观事件簿
  {
    path: '/worthManage',
    name: 'worthManage',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'orgManage',
      title: 'worthManage',
      power: 'worthStatistics',
    },
    component: () => import('@/views/worthManage/index'),
  },
    // 价值观统计
    // {
    //   path: '/worthStatistics',
    //   name: 'worthStatistics',
    //   meta: {
    //     hasMainMenu: true,
    //     isSubMenu: true,
    //     parentRoute: 'orgManage',
    //     title: 'worthStatistics',
    //     power: '',
    //   },
    //   component: () => import('@/views/worthManage/worthStatistics/index'),
    // },
  ],
}];
