<template>
  <div class="home">
    <tl-teamleader v-if="false"></tl-teamleader>
    <tl-grass-staff></tl-grass-staff>
  </div>
</template>

<script>
import teamleader from './teamleader/index';
import grassStaff from './grassStaff/index';

export default {
  name: 'overview',
  components: {
    'tl-teamleader': teamleader,
    'tl-grass-staff': grassStaff,
  },
  data() {
    return {

    };
  },
  methods: {

  },
};
</script>