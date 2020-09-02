<template>
  <div class="home">
    <leader-assess v-if="true"></leader-assess>
    <person-assess v-if="false"></person-assess>
  </div>
</template>

<script>
import leaderAssess from './components/leaderAssess';
import personAssess from './components/personAssess';

export default {
  name: 'assessManagementIndex',
  components: {
    leaderAssess,
    personAssess,
  },
};
</script>