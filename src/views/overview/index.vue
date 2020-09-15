<template>
  <div class="home">
    <!-- <tl-teamleader v-if="false"></tl-teamleader>
    <tl-grass-staff v-if="false"></tl-grass-staff>
    <tl-depart-leader v-if="true"></tl-depart-leader>-->
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import teamleader from './teamleader/index';
// import grassStaff from './grassStaff/index';
// import departleader from './departleader/index';
import Server from './server';

const server = new Server();
export default {
  name: 'overview',
  components: {
    // 'tl-teamleader': teamleader,
    // 'tl-grass-staff': grassStaff,
    // 'tl-depart-leader': departleader,
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      server,
      isRouterAlive: true,
    };
  },
  mounted() {
    // eslint-disable-next-line no-unused-expressions
    // this.$route.query.id ? '' : this.getidentity();
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
    }),
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>