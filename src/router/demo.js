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
    ],
  },
];