<template>
  <div
    class="menu-cont"
    :class="{'no-sub-menu': noSubMenu,'is-sub-menu': isSubMenu,'is-shrink': isShrinkMenus,'is-extend': isExtend}"
  >
    <div class="menu-cont-inside">
      <div class="main-menu">
        <ul>
          <!-- <li class="">
            <i></i>
          </li>-->
          <router-link tag="li" :to="{name:'overview'}" @click.native="rmSubMenu" class="workbench">
            <i></i>
          </router-link>
          <router-link
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
          </router-link>
        </ul>
        <div class="sub-menu">
          <ul>
            <router-link tag="li" :to="{name:'overview'}">
              <span>
                <em>二级菜单</em>
              </span>
            </router-link>
            <router-link tag="li" :to="{name:'overview'}">
              <span>
                <em>二级菜单</em>
              </span>
            </router-link>
            <router-link tag="li" :to="{name:'overview'}">
              <span>
                <em>二级菜单</em>
              </span>
            </router-link>
            <router-link tag="li" :to="{name:'overview'}">
              <span>
                <em>二级菜单</em>
              </span>
            </router-link>
          </ul>
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
      menuList: [
        {
          mainMenuTitle: '工作台',
          classTage: 'workbench',
          toName: 'overview',
          subMenuList: [],
        },
        {
          mainMenuTitle: 'OKR管理',
          classTage: 'okr-management',
          toName: 'myOkr',
          subMenuList: [
            {
              subMenuTitle: '',
              subClassTage: 'workbench',
              subToName: 'overview23',
            },
          ],
        },
        {
          mainMenuTitle: '考核管理',
          classTage: 'appraisal-management',
          toName: 'myOkr',
          subMenuList: [
            {
              subMenuTitle: '',
              subClassTage: 'workbench',
              subToName: 'overview23',
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
  methods: {
    shrinkMenus() {
      this.isShrinkMenus = !this.isShrinkMenus;
      console.log('hahah');
    },
    rmSubMenu() {
      this.isShrinkMenus = false;
      this.isExtend = false;
    },
    changeSubMenu() {
      this.isExtend = true;
      console.log('哈哈，我日');
    },
  },
};
</script>
