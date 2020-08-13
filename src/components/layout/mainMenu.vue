<template>
  <div
    class="menu-cont"
    :class="{'no-sub-menu': noSubMenu,'is-sub-menu': isSubMenu,'is-shrink': isShrinkMenus}"
  >
    <div class="menu-cont-inside">
      <div class="main-menu">
        <ul>
          <router-link
            tag="li"
            v-for="item in menuList"
            :key="item.id"
            :class="[item.classTag,{'is-active':item.parentRoute === $route.meta.parentRoute}]"
            :to="{name:item.toName}"
          >
            <i @click="fnHandle(item.functions.events,0)"></i>
          </router-link>
        </ul>
        <div class="sub-menu">
          <template v-for="item in menuList">
            <dl
              :key="item.id"
              v-if="item.subMenuList"
              :class="{'is-focus': item.parentRoute === $route.meta.parentRoute}"
            >
              <dt>{{item.mainMenuTitle}}</dt>
              <router-link
                tag="dd"
                :key="options.id"
                v-for="options in item.subMenuList"
                :class="[
                options.subClassTag,
                {'is-active': selectMenu === options.subToName || options.subToName === $route.meta.belongsTo}
                ]"
                :to="{name:options.subToName}"
              >
                <i></i>
                <span>
                  <em>{{options.subMenuTitle}}</em>
                </span>
              </router-link>
            </dl>
          </template>
          <div class="menu-control-button" @click="shrinkMenus">
            <span></span>
          </div>
        </div>
      </div>
      <ul class="management-platform">
        <li>
          <i></i>
        </li>
        <li>
          <i></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'mainMenu',
  data() {
    return {
      server,
      isShrinkMenus: false,
      selectMenu: '',
      menuList: [
        {
          mainMenuTitle: '工作台',
          classTag: ['workbench'],
          toName: 'overview',
          parentRoute: 'overview',
          functions: {
            events: ['rmSubMenu'],
          },
        },
        {
          mainMenuTitle: 'OKR管理',
          classTag: ['okr-menu'],
          toName: 'myOkr',
          parentRoute: 'okr',
          functions: {
            events: ['isExtend'],
          },
          subMenuList: [
            {
              subMenuTitle: '我的OKR',
              subClassTag: ['my-okr-menu'],
              subToName: 'myOkr',
            },
            {
              subMenuTitle: 'OKR审批',
              subClassTag: ['approval-menu'],
              subToName: 'okrApproval',
            },
            {
              subMenuTitle: 'ORK承接与对齐',
              subClassTag: ['undertake-menu'],
              subToName: 'undertakeMaps',
            },
            {
              subMenuTitle: '我关注的OKR',
              subClassTag: ['concerned-menu'],
              subToName: 'concernedOkr',
            },
            {
              subMenuTitle: 'OKR地图',
              subClassTag: ['maps-menu'],
              subToName: 'okrMaps',
            },
          ],
        },
        {
          mainMenuTitle: '考核管理',
          classTag: ['assess-menu'],
          toName: 'myAssess',
          parentRoute: 'assess',
          functions: {
            events: ['isExtend'],
          },
          subMenuList: [
            {
              subMenuTitle: '我的考核',
              subClassTag: ['my-assess-menu'],
              subToName: 'myAssess',
            },
            {
              subMenuTitle: '考核PK',
              subClassTag: ['assess-pk-menu'],
              subToName: 'assessPk',
            },
          ],
        },
      ],
    };
  },
  computed: {
    noSubMenu() {
      return this.$route.meta.noSubMenu;
    },
    isSubMenu() {
      return this.$route.meta.isSubMenu;
    },
  },
  mounted() {
    this.server.queryByTenantIdAndUserId().then((res) => {
      console.log(res);
    });
  },
  methods: {
    fnHandle(str, index) {
      if (str.length > 0 && index < str.length) {
        // eslint-disable-next-line no-eval
        eval(`this.${str[index]}()`);
      }
    },
    shrinkMenus() {
      this.isShrinkMenus = !this.isShrinkMenus;
    },
    rmSubMenu() {
      this.isShrinkMenus = false;
    },
    isExtend() {
      if (this.isShrinkMenus) {
        this.isShrinkMenus = false;
      }
    },
  },
  watch: {
    '$route.name': {
      handler(newVal) {
        this.selectMenu = newVal;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>