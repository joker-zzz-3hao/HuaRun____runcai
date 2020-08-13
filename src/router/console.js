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
          title: '概览首页',
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
          parentRoute: 'okr',
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
          parentRoute: 'okr',
        },
        component: () => import('@/views/okrManage/okrApproval/index'),
      },
      {
        // OKR管理
        // 写OKR
        path: '/writeOkr',
        name: 'writeOkr',
        meta: {
          hasMainMenu: true,
          isSubMenu: true,
          parentRoute: 'okr',
          belongsTo: 'myOkr',
        },
        component: () => import('@/views/okrManage/writeOkr/index'),
      },
      {
        // OKR管理
        // 我关注的OKR
        path: '/concernedOkr',
        name: 'concernedOkr',
        meta: {
          hasMainMenu: true,
          isSubMenu: true,
          parentRoute: 'okr',
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
          parentRoute: 'okr',
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
          parentRoute: 'okr',
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
          parentRoute: 'assess',
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
          parentRoute: 'assess',
        },
        component: () => import('@/views/assessManage/assessPk/index'),
      },
    ],
  },
];