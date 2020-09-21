<template>
  <el-scrollbar class="console-layout">
    <tl-assistant></tl-assistant>
    <tl-header></tl-header>
    <tl-main-area :menuList="crMenuList"></tl-main-area>
  </el-scrollbar>
</template>

<script>
import menuList from '@/mixin/menuList';
import tlHeader from '@/components/layout/header';
import tlMainArea from '@/components/layout/mainArea';
import tlAssistant from '@/components/layout/assistant';

export default {
  name: 'consoleIndex',
  components: {
    tlHeader,
    tlMainArea,
    tlAssistant,
  },
  mixins: [menuList],
  data() {
    return {
      // menuList: [
      //   {
      //     mainMenuTitle: '工作台',
      //     classTag: ['workbench'],
      //     toName: 'overview',
      //     events: ['rmSubMenu', 'moveMenu', 'leaveMenu'],
      //   },
      //   {
      //     mainMenuTitle: 'OKR管理',
      //     classTag: ['okr-menu'],
      //     toName: 'myOkr',
      //     events: ['isExtend', 'moveMenu', 'leaveMenu'],
      //     subMenuList: [
      //       {
      //         subMenuTitle: '我的OKR',
      //         subClassTag: ['my-okr-menu'],
      //         subToName: 'myOkr',
      //       },
      //       {
      //         subMenuTitle: 'OKR审批',
      //         subClassTag: ['approval-menu'],
      //         subToName: 'okrApproval',
      //       },
      //       {
      //         subMenuTitle: 'ORK承接与对齐',
      //         subClassTag: ['undertake-menu'],
      //         subToName: 'undertakeMaps',
      //       },
      //       {
      //         subMenuTitle: '我关注的OKR',
      //         subClassTag: ['concerned-menu'],
      //         subToName: 'concernedOkr',
      //       },
      //       {
      //         subMenuTitle: 'OKR地图',
      //         subClassTag: ['maps-menu'],
      //         subToName: 'okrMaps',
      //       },
      //     ],
      //   },
      //   {
      //     mainMenuTitle: '考核管理',
      //     classTag: ['assess-menu'],
      //     toName: 'myAssess',
      //     events: ['isExtend', 'moveMenu', 'leaveMenu'],
      //     subMenuList: [
      //       {
      //         subMenuTitle: '我的考核',
      //         subClassTag: ['my-assess-menu'],
      //         subToName: 'myAssess',
      //       },
      //       {
      //         subMenuTitle: '考核PK',
      //         subClassTag: ['assess-pk-menu'],
      //         subToName: 'assessPk',
      //       },
      //     ],
      //   },
      //   {
      //     mainMenuTitle: '周报管理',
      //     classTag: ['weekly-menu'],
      //     toName: 'myWeekly',
      //     events: ['isExtend', 'moveMenu', 'leaveMenu'],
      //     subMenuList: [
      //       {
      //         subMenuTitle: '我的周报',
      //         subClassTag: ['my-weekly-menu'],
      //         subToName: 'myWeekly',
      //       },
      //       {
      //         subMenuTitle: '团队周报',
      //         subClassTag: ['team-weekly-menu'],
      //         subToName: 'teamWeekly',
      //       },
      //     ],
      //   },
      //   {
      //     mainMenuTitle: '团队管理',
      //     classTag: ['teams-menu'],
      //     toName: 'teamsManage',
      //     events: ['rmSubMenu', 'moveMenu', 'leaveMenu'],
      //   },
      //   {
      //     mainMenuTitle: '企业管理',
      //     classTag: ['company-menu'],
      //     toName: 'organizeManage',
      //     events: ['rmSubMenu', 'moveMenu', 'leaveMenu'],
      //   },
      //   {
      //     mainMenuTitle: '系统管理',
      //     classTag: ['system-menu'],
      //     toName: 'tenantManage',
      //     events: ['rmSubMenu', 'moveMenu', 'leaveMenu'],
      //   },
      // ],
    };
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {},
};
</script>

<style>
@import "~@/assets/styles/layouts.css";
@import "~@/assets/styles/modules.css";
@import "~@/assets/styles/icons.css";
@import "~@/assets/styles/animations.css";
@import "~@/assets/styles/pages.css";
@import "~@/assets/styles/browser.css";
@import "~@/assets/styles/themes.css";
</style>