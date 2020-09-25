<template>
  <div class="home">
    <div v-if="!showReal" class="show-pic">
      <div v-if="changeKanban" class="pic-taskprocess">
        <div class="go-back" @click="goback"></div>
        <div class="go-kanban" @click="changeKanban = false"></div>

        <!-- <img src="~@/assets/images/demoPic/taskprocess.png" /> -->
      </div>
      <div v-else class="pic-kanban">
        <div class="go-back" @click="goback"></div>
        <div class="go-kanban" @click="changeKanban = true"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'taskProcess',
  components: {
  },
  data() {
    return {
      showReal: true, // 展示示例图片 false
      changeKanban: true,
    };
  },
  methods: {
    goback() {
      this.$router.go('-1');
    },
  },
};
</script>
<style lang="css" stylus>
.show-pic {
  /* display: flex;
  flex-direction: column; */
}
.pic-taskprocess {
  background: url("~@/assets/images/demoPic/taskprocess.png") no-repeat;
  background-size: 100%;
  /* background-size: cover; */
  height: calc(100vh);
}
.pic-kanban {
  background: url("~@/assets/images/demoPic/kanban.png") no-repeat;
  background-size: 100%;
  height: calc(100vh);
}
.go-back {
  width: 200px;
  height: 300px;
  cursor: pointer;
}

.go-kanban {
  position: absolute;
  right: 41px;
  top: 7px;
  width: 114px;
  height: 68px;
  cursor: pointer;
}
/* .pic-one,
.pic-two,
.pic-three {
  flex: 1;
} */
/* .pic-one img,
.pic-two img,
.pic-three img {
  display: inline-block;
  height: auto;
  max-width: 100%;
} */
</style>