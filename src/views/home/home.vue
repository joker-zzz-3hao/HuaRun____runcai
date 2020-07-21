<template>
  <div class="home">
    <temp msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>

import temp from '@/components/temp';

export default {
  name: 'home',
  components: {
    temp,
  },
};
</script>
