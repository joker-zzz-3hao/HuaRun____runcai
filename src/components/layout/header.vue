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
          <div class="remind-state"></div>
        </li>
        <li class="user-info">
          <img v-if="false" src="@/assets/images/user/user.jpg" alt />
          <div v-else class="user-name">哲民</div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: 'tlHeader',

};
</script>
