export default [
  {
    path: '/',
    name: 'consoleIndex',
    redirect: {
      name: 'overview',
    },
    component: () => import('@/views/consoleIndex'),
    children: [
      {
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
        component: () => import('@/views/overview/index'),
      },
      {
        // OKR管理
        // 我的OKR
        path: '/myOkr',
        name: 'myOkr',
        meta: {
          hasMainMenu: true,
          isSubMenu: true,
          parentRoute: 'myOkr',
          title: 'myOkr',
          power: '',
        },
        component: () => import('@/views/okrManage/myOkr/index'),
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
    ],
  },
];