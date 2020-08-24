<template>
  <el-scrollbar class="admin-layout">
    <tl-header></tl-header>
    <tl-main-area :menuList="systemMenuList"></tl-main-area>
  </el-scrollbar>
</template>

<script>
import menuList from '@/mixin/menuList';
import tlHeader from '@/components/layout/header';
import tlMainArea from '@/components/layout/mainArea';

export default {
  name: 'adminIndex',
  components: {
    tlHeader,
    tlMainArea,
  },
  mixins: [menuList],
  data() {
    return {
      // menuList: [
      //   {
      //     mainMenuTitle: '租户管理',
      //     classTag: ['tenant-menu'],
      //     toName: 'tenantManage',
      //     events: ['rmSubMenu', 'moveMenu', 'leaveMenu'],
      //   },
      //   {
      //     mainMenuTitle: '用户管理',
      //     classTag: ['user-menu'],
      //     toName: 'userManage',
      //     events: ['rmSubMenu', 'moveMenu', 'leaveMenu'],
      //   },
      //   {
      //     mainMenuTitle: '部门管理',
      //     classTag: ['department-menu'],
      //     toName: 'departmentManage',
      //     events: ['rmSubMenu', 'moveMenu', 'leaveMenu'],
      //   },
      //   {
      //     mainMenuTitle: '字典管理',
      //     classTag: ['dictionary-menu'],
      //     toName: 'dictionaryManage',
      //     events: ['rmSubMenu', 'moveMenu', 'leaveMenu'],
      //   },
      //   {
      //     mainMenuTitle: '菜单管理',
      //     classTag: ['menus-menu'],
      //     toName: 'menuManage',
      //     events: ['rmSubMenu', 'moveMenu', 'leaveMenu'],
      //   },
      //   {
      //     mainMenuTitle: '系统权限',
      //     classTag: ['menus-menu'],
      //     toName: 'sysUserManage',
      //     events: ['rmSubMenu', 'moveMenu', 'leaveMenu'],
      //     subMenuList: [
      //       {
      //         subMenuTitle: '系统用户管理',
      //         subClassTag: ['sys-user-menu'],
      //         subToName: 'sysUserManage',
      //       },
      //     ],
      //   },
      //   {
      //     mainMenuTitle: '返回前台',
      //     classTag: ['go-back-menu'],
      //     toName: 'overview',
      //     events: ['rmSubMenu', 'moveMenu', 'leaveMenu'],
      //   },
      // ],
    };
  },
};
</script>

<style>
@import "~@/assets/styles/layouts.css";
@import "~@/assets/styles/modules.css";
@import "~@/assets/styles/pages.css";
@import "~@/assets/styles/icons.css";
@import "~@/assets/styles/animations.css";
@import "~@/assets/styles/browser.css";
@import "~@/assets/styles/themes.css";
</style>