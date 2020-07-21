export default [
  {
    path: '/',
    name: 'consoleIndex',
    redirect: {
      name: 'overview',
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '@/views/overview/index'),
    // 以上是组件懒加载的优化方法，后续可根据需要用之；
    component: () => import('@/views/consoleIndex'),
    children: [
      {
        // 综合首页
        path: 'overview',
        name: 'overview',
        component: () => import('@/views/overview/index'),
      },
    ],
  },
];