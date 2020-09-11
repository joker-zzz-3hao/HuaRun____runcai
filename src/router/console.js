/* eslint-disable indent */
export default [{
  path: '/',
  name: 'consoleIndex',
  redirect: {
    name: 'overview',
  },
  component: () => import('@/views/consoleIndex'),
  children: [{
    // 综合首页
    path: '/overview',
    name: 'overview',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'overview',
      title: 'overview',
      power: '',
    },
    redirect: {
      name: 'departleader',
    },
    component: () => import('@/views/overview/index'),
    children: [{
      path: '/teamleader',
      name: 'teamleader',
      meta: {
        hasMainMenu: true,
        noSubMenu: true,
        parentRoute: 'overview',
        title: 'teamleader',
        power: '',
      },
      component: () => import('@/views/overview/teamleader/index'),
    },
    {
      path: '/departleader',
      name: 'departleader',
      meta: {
        hasMainMenu: true,
        noSubMenu: true,
        parentRoute: 'overview',
        title: 'departleader',
        power: '',
      },
      component: () => import('@/views/overview/departleader/index'),
    },
    {
      path: '/grassStaff',
      name: 'grassStaff',
      meta: {
        hasMainMenu: true,
        noSubMenu: true,
        parentRoute: 'overview',
        title: 'grassStaff',
        power: '',
      },
      component: () => import('@/views/overview/grassStaff/index'),
    },
    ],
  },
  {
    // OKR管理
    // 我的OKR
    path: '/okr',
    name: 'okr',
    redirect: {
      name: 'myOkr',
    },
    meta: {
      title: 'okr',
      power: '',
    },
    component: () => import('@/views/okrManage/myOkr/index'),
    children: [{
      path: '/myOkr',
      name: 'myOkr',
      meta: {
        hasMainMenu: true,
        isSubMenu: true,
        parentRoute: 'myOkr',
        title: 'myOkr',
        power: '',
      },
      component: () => import('@/views/okrManage/myOkr/myOkr'),
    },
    {
      path: '/departmentOkr',
      name: 'departmentOkr',
      meta: {
        hasMainMenu: true,
        isSubMenu: true,
        parentRoute: 'myOkr',
        belongsTo: 'myOkr',
        title: 'departmentOkr',
        power: '',
      },
      component: () => import('@/views/okrManage/myOkr/departmentOkr'),
    },
    ],
  },
  {
    // OKR管理
    // OKR审批
    path: '/okrApproval',
    name: 'okrApproval',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myOkr',
      title: 'okrApproval',
      power: '',
    },
    component: () => import('@/views/okrManage/okrApproval/index'),
  },
  {
    // OKR管理
    // 我关注的OKR
    path: '/concernedOkr',
    name: 'concernedOkr',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myOkr',
      title: 'concernedOkr',
      power: '',
    },
    component: () => import('@/views/okrManage/concernedOkr/index'),
  },
  {
    // OKR管理
    // 承接树
    path: '/undertakeMaps',
    name: 'undertakeMaps',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myOkr',
      title: 'undertakeMaps',
      power: '',
    },
    component: () => import('@/views/okrManage/undertakeMaps/index'),
  },
  {
    // OKR管理
    // OKR地图
    path: '/okrMaps',
    name: 'okrMaps',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myOkr',
      title: 'okrMaps',
      power: '',
    },
    component: () => import('@/views/okrManage/okrMaps/index'),
  },
  {
    // 考核管理
    // 我的考核
    path: '/myAssess',
    name: 'myAssess',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myAssess',
      title: 'myAssess',
      power: '',
    },
    component: () => import('@/views/assessManage/myAssess/index'),
  },
  {
    // 考核管理
    // 考核PK
    path: '/assessPk',
    name: 'assessPk',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myAssess',
      title: 'assessPk',
      power: '',
    },
    component: () => import('@/views/assessManage/assessPk/index'),
  },
  {
    // 项目管理
    path: '/projectManage',
    name: 'projectManage',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'projectManage',
      title: 'projectManage',
      power: '',
    },
    component: () => import('@/views/projectManage/index'),
  },
  {
    // 周报管理
    // 我的周报
    path: '/myWeekly',
    name: 'myWeekly',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myWeekly',
      title: 'myWeekly',
      power: '',
    },
    component: () => import('@/views/weeklyManage/myWeekly/index'),
  },
  {
    // 周报管理
    // 团队周报
    path: '/teamWeekly',
    name: 'teamWeekly',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myWeekly',
      title: 'teamWeekly',
      power: '',
    },
    component: () => import('@/views/weeklyManage/teamWeekly/index'),
  },
  {

    // 团队周报详情
    path: '/teamWeeklyInfo',
    name: 'teamWeeklyInfo',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myWeekly',
      belongsTo: 'teamWeekly',
      title: 'teamWeeklyInfo',
      power: '',
    },
    component: () => import('@/views/weeklyManage/teamWeekly/components/teamWeeklyInfo'),
  },
  {
    // 团队管理
    path: '/teamsManage',
    name: 'teamsManage',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'teamsManage',
      title: 'teamsManage',
      power: '',
    },
    component: () => import('@/views/teamsManage/index'),
  },
  {
    // 价值观管理
    path: '/valuesManage',
    name: 'valuesManage',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'projectManage',
    },
    component: () => import('@/views/projectManage/index'),
  },
  // {
  //   // 项目管理
  //   path: '/projectManage',
  //   name: 'projectManage',
  //   meta: {
  //     hasMainMenu: true,
  //     noSubMenu: true,
  //     parentRoute: 'projectManage',
  //   },
  //   component: () => import('@/views/projectManage/index'),
  // },
  {
    // 个人中心
    path: '/personalCenter',
    name: 'personalCenter',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'personalCenter',
      title: 'personalCenter',
      power: '',
    },
    component: () => import('@/views/personalCenter/index'),
  },
  {
    // 任务管理
    // 我的任务
    path: '/myTask',
    name: 'myTask',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myTask',
      title: 'myTask',
      power: '',
    },
    component: () => import('@/views/taskManage/myTask/index'),
  },
  {
    // 任务管理
    // 我的任务
    path: '/createTask',
    name: 'createTask',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myTask',
      title: 'createTask',
      power: '',
    },
    component: () => import('@/views/taskManage/myTask/components/createTask'),
  },
  // 价值观事件簿
  {
    path: '/worthManage',
    name: 'worthManage',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'worthManage',
      title: 'worthManage',
      power: '',
    },
    component: () => import('@/views/worthManage/worthManage/index'),
  },
  // 价值观统计
  {
    path: '/worthStatistics',
    name: 'worthStatistics',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'worthManage',
      title: 'worthStatistics',
      power: '',
    },
    component: () => import('@/views/worthManage/worthStatistics/index'),
  },
  // 消息通知
  {
    path: '/notice',
    name: 'notice',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'notice',
      title: 'notice',
      power: '',
    },
    component: () => import('@/views/notice/index'),
  },
  // 个人设置
  {
    path: '/personConfig',
    name: 'personConfig',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'personConfig',
      title: 'personConfig',
      power: '',
    },
    component: () => import('@/views/personConfig/index'),
  },
  ],
}];
