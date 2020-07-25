export default [
  {
    path: '/loginIndex',
    name: 'loginIndex',
    redirect: {
      name: 'login',
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '@/views/overview/index'),
    // 以上是组件懒加载的优化方法，后续可根据需要用之；
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