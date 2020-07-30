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
    ],
  },
];