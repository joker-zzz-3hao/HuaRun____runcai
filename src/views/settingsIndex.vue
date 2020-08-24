<template>
  <el-scrollbar class="settings-layout">
    <tl-header></tl-header>
    <tl-main-area :menuList="talentMenuList"></tl-main-area>
  </el-scrollbar>
</template>

<script>
import menuList from '@/mixin/menuList';
import tlHeader from '@/components/layout/header';
import tlMainArea from '@/components/layout/mainArea';

export default {
  name: 'settingsIndex',
  components: {
    tlHeader,
    tlMainArea,
  },
  mixins: [menuList],
  data() {
    return {
      // menuList: [
      //   {
      //     mainMenuTitle: '部门管理',
      //     classTag: ['organize-menu'],
      //     toName: 'organizeManage',
      //     events: ['rmSubMenu', 'moveMenu', 'leaveMenu'],
      //   },
      //   {
      //     mainMenuTitle: '角色管理',
      //     classTag: ['role-menu'],
      //     toName: 'roleManage',
      //     events: ['rmSubMenu', 'moveMenu', 'leaveMenu'],
      //   },
      //   {
      //     mainMenuTitle: '设置管理',
      //     classTag: ['settings-menu'],
      //     toName: 'okrPermissions',
      //     events: ['isExtend', 'moveMenu', 'leaveMenu'],
      //     subMenuList: [
      //       {
      //         subMenuTitle: '设置OKR',
      //         subClassTag: ['okr-setting-menu'],
      //         subToName: 'okrPermissions',
      //       },
      //       {
      //         subMenuTitle: 'OKR周期与自评',
      //         subClassTag: ['okr-cycle-menu'],
      //         subToName: 'okrCycle',
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