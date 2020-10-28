<template>
  <div></div>
</template>

<script>
import Server from './server';

const server = new Server();
export default {
  name: 'listenerData',
  data() {
    return {
      server,
    };
  },
  components: {},
  props: {},
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.server.queryOfPage().then((res) => {
        if (res.code == '200') {
          console.log(res);
        }
      });
    },
  },
  watch: {},
};
</script>