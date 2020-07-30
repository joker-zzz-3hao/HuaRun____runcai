export default [
  {
    path: '/adminIndex',
    name: 'adminIndex',
    redirect: {
      name: 'role',
    },
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