<template>
  <div class="home">
    <tl-teamleader></tl-teamleader>
  </div>
</template>

<script>
import teamleader from './teamleader/index';

export default {
  name: 'overview',
  components: {
    'tl-teamleader': teamleader,
  },
  data() {
    return {

    };
  },
  methods: {

  },
};
</script>