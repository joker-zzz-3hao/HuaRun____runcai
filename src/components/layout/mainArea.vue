<template>
  <section class="main-wrap">
    <main-menu :menuList="menuList" v-if="hasMainMenu"></main-menu>
    <router-view class="view-cont" />
  </section>
</template>

<script>
import mainMenu from '@/components/layout/mainMenu';

export default {
  name: 'mainArea',
  components: {
    mainMenu,
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
    hasMainMenu() {
      return this.$route.meta.hasMainMenu;
    },
  },
};
</script>
