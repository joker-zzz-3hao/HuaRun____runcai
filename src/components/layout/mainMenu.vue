<template>
  <div
    class="menu-cont"
    :class="{'no-sub-menu': noSubMenu,'is-sub-menu': isSubMenu,'is-shrink': isShrinkMenus,'is-extend': isExtend}"
  >
    <div class="menu-cont-inside">
      <div class="main-menu">
        <ul>
          <router-link
            tag="li"
            v-for="(item,idx) in menuList"
            :key="item.id"
            :class="item.classTag"
            :to="{name:item.toName}"
          >
            <i @click="fnHandle(item.functions.events,0,idx)"></i>
          </router-link>
          <!-- <router-link
            tag="li"
            :to="{name:'myOkr'}"
            @click.native="changeSubMenu"
            class="workbench"
          >
            <i></i>
          </router-link>
          <router-link
            tag="li"
            :to="{name:'okrMaps'}"
            @click.native="changeSubMenu"
            class="workbench"
          >
            <i></i>
          </router-link>
          <router-link
            tag="li"
            :to="{name:'myAssess'}"
            @click.native="changeSubMenu"
            class="workbench"
          >
            <i></i>
          </router-link>-->
        </ul>
        <div class="sub-menu">
          <template v-for="(item,idx) in menuList">
            <ul :key="item.id" v-if="item.subMenuList" :class="{'is-focus': menuIndex === idx}">
              <router-link
                tag="li"
                :key="options.id"
                v-for="options in item.subMenuList"
                :class="options.subClassTag"
                :to="{name:options.subToName}"
              >
                <span>
                  <i></i>
                  <em>{{options.subMenuTitle}}</em>
                </span>
              </router-link>
            </ul>
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
export default {
  name: 'mainMenu',
  data() {
    return {
      isShrinkMenus: false,
      isExtend: false,
      menuIndex: '',
      menuList: [
        {
          mainMenuTitle: '工作台',
          classTag: ['workbench'],
          toName: 'overview',
          functions: {
            events: ['rmSubMenu'],
          },
        },
        {
          mainMenuTitle: 'OKR管理',
          classTag: ['okr-menu'],
          toName: 'myOkr',
          functions: {
            events: ['getMenuIndex'],
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
          functions: {
            events: ['getMenuIndex'],
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
  mounted() {
  },
  computed: {
    noSubMenu() {
      return this.$route.meta.noSubMenu;
    },
    isSubMenu() {
      return this.$route.meta.isSubMenu;
    },
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
      console.log('hahah');
    },
    rmSubMenu() {
      console.log(2222);
      this.isShrinkMenus = false;
      this.isExtend = false;
    },
    changeSubMenu() {
      this.isExtend = true;
      console.log('哈哈，我日');
    },
    getMenuIndex(index) {
      this.menuIndex = index;
      console.log('我是UL');
    },
  },
};
</script>
