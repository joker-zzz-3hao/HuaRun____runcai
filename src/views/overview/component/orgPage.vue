<template>
  <div class="home">
    <div class="org">
      <em>2020年下半年OKR</em>
      <el-progress :percentage="50" class="progress"></el-progress>
      <em>状态 · 进行中</em>
      <em>负责人 肖海山</em>
    </div>
    <div class="swiperModel">
      <div class="upDown">
        <i class="el-icon-arrow-up"></i>
        <i class="el-icon-arrow-down"></i>
      </div>
      <div>
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide>
            <div class="swiperList">
              <div class="okrPress">
                <em>完成上半年营收入100万元</em>
                <em>x</em>
              </div>
              <div class="listOkr">
                <em>权重：30%</em>
                <el-progress :percentage="50" class="progress"></el-progress>
                <em>50%</em>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="swiperList">
              <div class="okrPress">
                <em>完成上半年营收入100万元</em>
                <em>x</em>
              </div>
              <div class="listOkr">
                <em>权重：30%</em>
                <el-progress :percentage="50" class="progress"></el-progress>
                <em>50%</em>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="swiperList">
              <div class="okrPress">
                <em>完成上半年营收入100万元</em>
                <em>x</em>
              </div>
              <div class="listOkr">
                <em>权重：30%</em>
                <el-progress :percentage="50" class="progress"></el-progress>
                <em>50%</em>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'orgPage',
  components: {

  },
  data() {
    return {
      swiperOption: {

      },
    };
  },
  created() {
    this.swiperOption = {
      autoplay: 3000,
      direction: 'vertical',
      slidesPerView: 2,
      height: 120,
      centeredSlides: true,
      observeParent: true,
      roundLengths: true,
      observer: true,
    };
  },
  methods: {

  },
};
</script>
<style  scoped>
.progress {
  width: 300px;
}
.upDown {
  display: flex;
  flex-direction: column;
}
.org {
  display: flex;
  flex-direction: row;
}
.swiperModel {
  overflow: hidden;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: row;
}
.listOkr {
  display: flex;
  flex-direction: row;
}
.okrPress {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.swiperList {
  width: 800px;
  border: 1px solid black;
  padding: 10px;
}
</style>