<template>
  <div class="home">
    <tl-teamleader v-if="false"></tl-teamleader>
    <tl-grass-staff v-if="false"></tl-grass-staff>
    <tl-depart-leader></tl-depart-leader>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import teamleader from './teamleader/index';
import grassStaff from './grassStaff/index';
import departleader from './departleader/index';
import Server from './server';

const server = new Server();
export default {
  name: 'overview',
  components: {
    'tl-teamleader': teamleader,
    'tl-grass-staff': grassStaff,
    'tl-depart-leader': departleader,
  },
  data() {
    return {
      server,
    };
  },
  created() {
    // this.getidentity();
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    getidentity() {
      this.server.identity({
        user: this.userInfo.userId,
        orgId: this.userInfo.orgId,
      }).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>