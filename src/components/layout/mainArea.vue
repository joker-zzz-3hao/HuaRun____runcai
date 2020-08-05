<template>
  <section class="main-area">
    <div class="menu-wrap">
      <main-menu></main-menu>
      <router-view class="view-wrap" />
    </div>
  </section>
</template>

<script>
import mainMenu from '@/components/layout/mainMenu';

export default {
  name: 'mainArea',
  components: {
    mainMenu,
  },

};
</script>
