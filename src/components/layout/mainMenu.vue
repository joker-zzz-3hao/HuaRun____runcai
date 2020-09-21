<template>
  <div
    class="menu-cont"
    :class="{'no-sub-menu': noSubMenu,'is-sub-menu': isSubMenu,'is-shrink': isShrinkMenus}"
  >
    <div class="menu-cont-inside" :class="{'is-zindex': zIndex}">
      <div class="main-menu" :class="{'is-main-menu': isMainMenu}">
        <ul>
          <li
            v-for="(item,idx) in menuList"
            :key="item.id"
            :class="[item.classTag,{'is-active':item.toName === $route.meta.parentRoute},{'is-hover': menuIndex === idx}]"
            @click="fnHandle(item.events,0,item.toName)"
          >
            <i></i>
            <em>{{item.mainMenuTitle}}</em>
          </li>
        </ul>
        <div class="sub-menu" :class="{'change-index': changeZindex}">
          <template v-for="item in menuList">
            <dl
              :key="item.id"
              v-if="item.subMenuList"
              :class="{'is-focus': item.toName === $route.meta.parentRoute}"
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
                @mouseover.native="changeIndex"
                @mouseleave.native="rmChangeIndex"
              >
                <!-- <i></i> -->
                <span>
                  <em>{{options.subMenuTitle}}</em>
                </span>
              </router-link>
            </dl>
          </template>
          <div class="menu-control-button" @click="shrinkMenus" @mouseover.stop="rmChangeIndex">
            <span></span>
          </div>
        </div>
      </div>
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
      zIndex: false,
      selectMenu: '',
      menuIndex: '',
      changeZindex: false,
      isMainMenu: false,
    };
  },
  props: {
    menuList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    noSubMenu() {
      return this.$route.meta.noSubMenu;
    },
    isSubMenu() {
      return this.$route.meta.isSubMenu;
    },
  },
  mounted() {},
  methods: {
    fnHandle(str, index, parameter) {
      if (str.length > 0 && index < str.length) {
        if (typeof (parameter) === 'string') {
          // eslint-disable-next-line no-eval
          eval(`this.${str[index]}('${parameter}')`);
        } else if (typeof (parameter) === 'number') {
          // eslint-disable-next-line no-eval
          eval(`this.${str[index]}(${parameter})`);
        } else {
          // eslint-disable-next-line no-eval
          eval(`this.${str[index]}(${parameter})`);
        }
      }
    },
    shrinkMenus() {
      this.isShrinkMenus = !this.isShrinkMenus;
      // this.changeZindex = !this.changeZindex;
      this.isMainMenu = true;
    },
    rmSubMenu(routeName) {
      this.go(routeName);
      this.isShrinkMenus = false;
    },
    isExtend(routeName) {
      this.go(routeName);
      if (this.isShrinkMenus) {
        this.isShrinkMenus = false;
      }
    },
    moveMenu(itemIndex) {
      this.menuIndex = itemIndex;
      this.zIndex = true;
    },
    leaveMenu() {
      this.menuIndex = '';
      this.zIndex = false;
    },
    changeIndex() {
      if (!this.changeZindex) {
        this.changeZindex = true;
        if (this.isMainMenu) {
          this.isMainMenu = false;
        }
      }
    },
    rmChangeIndex() {
      if (this.changeZindex) {
        this.changeZindex = false;
        console.log(2222);
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