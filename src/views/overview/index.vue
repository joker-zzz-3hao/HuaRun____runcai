<template>
  <div class="home">
    <tl-teamleader v-if="false"></tl-teamleader>
    <tl-grass-staff v-if="false"></tl-grass-staff>
    <tl-depart-leader></tl-depart-leader>
  </div>
</template>

<script>
import teamleader from './teamleader/index';
import grassStaff from './grassStaff/index';
import departleader from './departleader/index';

export default {
  name: 'overview',
  components: {
    'tl-teamleader': teamleader,
    'tl-grass-staff': grassStaff,
    'tl-depart-leader': departleader,
  },
  data() {
    return {

    };
  },
  methods: {

  },
};
</script>