export default [
  {
    path: '/loginIndex',
    name: 'loginIndex',
    redirect: {
      name: 'login',
    },
    component: () => import('@/views/loginIndex'),
    children: [
      {
        // LADP登录
        path: '/login',
        name: 'login',
        meta: {
          title: '登录',
          power: '',
        },
        component: () => import('@/views/login/index'),
      },
      {
        // 超级系统管理员登录
        path: '/superSystemAdmins',
        name: 'superSystemAdminis',
        meta: {
        },
        component: () => import('@/views/login/superSystemAdmins'),
      },
      {
        // 登录中转
        path: '/transfer',
        name: 'transfer',
        meta: {
          title: 'transfer',
          power: '',
        },
        component: () => import('@/views/login/transfer'),
      },
      {
        // 403
        path: '/exception403',
        name: 'exception403',
        meta: {
          title: 'exception403',
          power: '',
        },
        component: () => import('@/views/login/exception403'),
      },
      {
        // 404
        path: '/exception404',
        name: 'exception404',
        meta: {
          title: 'exception404',
          power: '',
        },
        component: () => import('@/views/login/exception404'),
      },
    ],
  },
];