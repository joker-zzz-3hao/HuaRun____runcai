export default [
  {
    path: '/demo',
    name: 'demo',
    redirect: {
      name: 'table',
    },
    component: () => import('@/views/demoIndex'),
    children: [
      {
        path: '/table',
        name: 'table',
        component: () => import('@/views/demo/table/index'),
      },
      {
        path: '/tree',
        name: 'tree',
        component: () => import('@/views/demo/tree/tree'),
      },
      {
        path: '/groupdrag',
        name: 'groupdrag',
        component: () => import('@/views/demo/draggable/list'),
      },
      {
        path: '/simplelist',
        name: 'simplelist',
        component: () => import('@/views/demo/draggable/simplelist'),
      },
    ],
  },
];