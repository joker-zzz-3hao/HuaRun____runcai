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
            :class="[item.classTag,{'is-active':item.toName === $route.meta.parentRoute}]"
            :to="{name:item.toName}"
          >
            <i @click="fnHandle(item.functions.events,0)"></i>
            <div class="text-tip">
              <p>我是提示文案</p>
              <i></i>
            </div>
          </router-link>
        </ul>
        <div class="sub-menu">
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
      // menuList: [],
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