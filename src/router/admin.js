export default [
  {
    path: '/adminIndex',
    name: 'adminIndex',
    redirect: {
      name: 'role',
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '@/views/overview/index'),
    // 以上是组件懒加载的优化方法，后续可根据需要用之；
    component: () => import('@/views/adminIndex'),
    children: [
      {
        // 角色设置
        path: '/role',
        name: 'role',
        meta: {
        },
        component: () => import('@/views/admin/role/index'),
      },
    ],
  },
];