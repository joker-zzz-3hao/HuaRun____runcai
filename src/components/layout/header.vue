<template>
  <section class="header-wrap">
    <div class="area-left">
      <div class="logo-bg">
        <div class="logo">logo</div>
      </div>
    </div>
    <div class="area-right">
      <ul class="top-menu">
        <li>
          <i></i>
          <em>通知</em>
          <div class="badge">9</div>
          <div class="remind-state"></div>
        </li>
        <li class="user-info">
          <img v-if="userInfo.headUrl" :src="userInfo.headUrl" alt />
          <div v-else class="user-name">{{userInfo.userName}}</div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'tlHeader',
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
};
</script>
