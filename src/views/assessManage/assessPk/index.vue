<template>
  <div class="home">
    <leaderPK v-if="true"></leaderPK>
    <personPK v-if="false"></personPK>
  </div>
</template>

<script>
import leaderPK from './components/leaderPK';
import personPK from './components/personPK';

export default {
  name: 'assessManagementIndex',
  components: {
    leaderPK,
    personPK,
  },
};
</script>