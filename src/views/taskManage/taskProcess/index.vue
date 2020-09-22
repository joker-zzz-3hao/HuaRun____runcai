<template>
  <div class="home">
    <div v-if="!showReal" class="show-pic">
      <div v-if="changeKanban" class="pic-taskprocess" @click="changeKanban = false">
        <!-- <img src="~@/assets/images/demoPic/taskprocess.png" /> -->
      </div>
      <div v-else @click="changeKanban = true">
        <div class="pic-kanban01"></div>
        <div class="pic-kanban02"></div>
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
      showReal: false, // 展示示例图片 false
      changeKanban: true,
    };
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
  background-size: cover;
  height: 995px;
}
.pic-kanban01 {
  background: url("~@/assets/images/demoPic/kanban01.png") no-repeat;
  background-size: cover;
  height: 467px;
}
.pic-kanban02 {
  background: url("~@/assets/images/demoPic/kanban02.png") no-repeat;
  background-size: cover;
  height: 528px;
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