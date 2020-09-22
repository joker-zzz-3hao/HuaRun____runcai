<template>
  <div class="home">
    <div v-if="!showReal">
      <div class="pic-noteIndex" v-if="changeNote == 'index'">
        <div @click="changeNote = 'detail'" class="click-detail"></div>
        <div class="click-write" @click="changeNote = 'write'"></div>
      </div>
      <div class="show-pic" v-if="changeNote == 'detail'" @click="changeNote = 'index'">
        <div class="pic-detail01">
          <img src="~@/assets/images/demoPic/detail01.png" />
        </div>
        <div class="pic-detail02">
          <img src="~@/assets/images/demoPic/detail02.png" />
        </div>
      </div>
      <div v-if="changeNote == 'write'" class="pic-writenote" @click="changeNote = 'index'"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'note',
  components: {},
  props: {},
  data() {
    return {
      changeNote: 'index',
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
<style lang="css" stylus>
.pic-noteIndex {
  background: url("~@/assets/images/demoPic/noteIndex.png") no-repeat;
  background-size: 100%;
  /* background-size: cover; */
  height: calc(100vh);
  display: flex;
}
.click-detail {
  margin: 0 13px;
  height: 400px;
  width: 400px;
}
.click-write {
  margin: 0 13px;
  height: 400px;
  width: 400px;
}
.pic-detail01 {
  background: url("~@/assets/images/demoPic/detail01.png") no-repeat;
  /* background-size: cover; */
  background-size: 100%;
  /* height: 499px; */
  flex: 1;
}
.pic-detail02 {
  background: url("~@/assets/images/demoPic/detail02.png") no-repeat;
  background-size: 100%;
  /* background-size: cover; */
  /* height: 500px; */
  flex: 1;
}
.pic-writenote {
  background: url("~@/assets/images/demoPic/writenote.png") no-repeat;
  background-size: 100%;
  /* background-size: cover; */
  height: calc(100vh);
}
.show-pic {
  display: flex;
  flex-direction: column;
}
.pic-detail01 img,
.pic-detail02 img {
  display: inline-block;
  height: auto;
  max-width: 100%;
}
</style>