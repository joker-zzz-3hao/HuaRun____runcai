<template>
  <div class="home">
    <div class="pic-fupan03" @click="$router.back()">
      <!-- <img src="~@/assets/images/demoPic/fupan01.png" /> -->
    </div>
  </div>
</template>

<script>
export default {
  methods: {},
};
</script>

<style>
.show-pic {
  display: inline-block;
  height: auto;
  max-width: 100%;
}
.pic-fupan03 {
  background: url("~@/assets/images/demoPic/fupan03.png") no-repeat;
  background-size: 100%;
  /* background-size: cover; */
  height: calc(250vh);
  display: flex;
}
</style>