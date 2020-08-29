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
        redirect: {
          name: 'departleader',
        },
        meta: {
          hasMainMenu: true,
          noSubMenu: true,
          parentRoute: 'overview',
          title: 'overview',
          power: '',
        },
        component: () => import('@/views/overview/index'),
        children: [
          {
            path: '/teamleader',
            name: 'teamleader',
            meta: {
              hasMainMenu: true,
              isSubMenu: false,
              parentRoute: 'teamleader',
              title: 'teamleader',
              power: '',
            },
            component: () => import('@/views/overview/teamleader/index'),
          },
          {
            path: '/teamleader',
            name: 'teamleader',
            meta: {
              hasMainMenu: true,
              isSubMenu: false,
              parentRoute: 'teamleader',
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
              isSubMenu: false,
              parentRoute: 'departleader',
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
              isSubMenu: false,
              parentRoute: 'grassStaff',
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
        children: [
          {
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
    ],
  },
];