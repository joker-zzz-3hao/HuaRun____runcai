<template>
  <div class="menu-cont" :class="{'no-sub-menu': noSubMenu,'is-sub-menu': isSubMenu}">
    <div class="menu-cont-inside">
      <div class="main-menu">
        <ul>
          <!-- <li class="" @click="extendedMenus">
            <i></i>
          </li>-->
          <router-link tag="li" :to="{name:'overview'}" class="workbench">
            <i></i>
          </router-link>
          <router-link tag="li" :to="{name:'myOkr'}" class="workbench">
            <i></i>
          </router-link>
          <router-link tag="li" :to="{name:'overview'}" class="workbench">
            <i></i>
          </router-link>
          <router-link tag="li" :to="{name:'overview'}" class="workbench">
            <i></i>
          </router-link>
        </ul>
        <div class="sub-menu">
          <ul>
            <li>二级菜单级菜单级菜单</li>
            <li>二级菜单</li>
            <li>二级菜单</li>
            <li>二级菜单</li>
          </ul>
          <div class="menu-control-button">
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
    extendedMenus() {
      this.isSubMenu = true;
    },
  },
};
</script>
