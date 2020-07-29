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
      {
        path: '/nested',
        name: 'nested',
        component: () => import('@/views/demo/draggable/index'),
      },
      {
        path: '/tabletree',
        name: 'tabletree',
        component: () => import('@/views/demo/tree/tabletree'),
      },
      {
        path: '/elementTree',
        name: 'elementTree',
        component: () => import('@/views/demo/tree/elementTree'),
      },
      {
        path: '/svgtree',
        name: 'svgtree',
        component: () => import('@/views/demo/svgtree/index'),
      },
      {
        path: '/element',
        name: 'svgtree',
        component: () => import('@/views/demo/element/index'),
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import('@/views/demo/menu/index'),
      },
    ],
  },
];