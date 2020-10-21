<template>
  <div class="department-view" id="department-view">
    <el-tag
      v-show="testModel"
      type="success"
      style="margin-bottom: 10px; width: 100%"
      size="medium"
      :hit="true"
      >以下为示例数据内容，润才提供综合数据视图，多种维度可视化报告，帮助管理者与个人关注目标的合理性与团队能力</el-tag
    >
    <div class="cont-area">
      <tl-org-page :periodId="periodId"></tl-org-page>
      <tl-okr-schedule :mainData="mainData"></tl-okr-schedule>
      <div class="tl-card-panel">
        <div class="card-panel-head">
          <div class="panner-title">
            <em>OKR承接与变更统计</em>
            <span v-show="testModel">示例数据</span>
          </div>
          <div>
            <i
              class="el-icon-caret-left"
              v-show="prevBtn"
              @click="prevSwiper"
            ></i>
            <i
              class="el-icon-caret-right"
              v-show="nextBtn"
              @click="nextSwiper"
            ></i>
          </div>
        </div>
        <div
          class="card-panel-body"
          v-swiper:mySwiper="swiperOption"
          ref="mySwiper"
        >
          <div class="tl-card-panel-group swiper-wrapper">
            <dl
              v-for="(item, index) in riskList"
              :key="index"
              class="swiper-slide"
            >
              <dt>{{ item.orgName }}</dt>
              <dd>
                <span>总人数</span>
                <em>{{ item.personCount }}</em>
              </dd>
              <dd>
                <span>承接数</span>
                <em>{{ item.okrContinueCount }}</em>
              </dd>
              <dd>
                <span>变更数</span>
                <em>{{ item.okrChangeCount }}</em>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <tl-weeking :periodId="periodId"></tl-weeking>
      <tl-weekTable :periodId="periodId"></tl-weekTable>
    </div>
    <tl-period @getPeriod="getPeriod" :showBack="false"></tl-period>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import okrSchedule from './components/okrSchedule';
import okrUpdate from './components/okrUpdate';
import orgPage from '../component/orgPage';
import weeking from './components/weeking';
// eslint-disable-next-line import/no-unresolved
import weekTable from './components/weekTable';
import period from '../component/period';
import Server from '../server';
import { mainData } from '../testData';

const server = new Server();

export default {
  name: 'departleader',
  components: {
    'tl-okr-schedule': okrSchedule,
    // eslint-disable-next-line vue/no-unused-components
    'tl-okr-update': okrUpdate,
    'tl-weeking': weeking,
    'tl-org-page': orgPage,
    'tl-period': period,
    'tl-weekTable': weekTable,
  },
  data() {
    return {
      showOver: false,
      fullscreenLoading: true,
      server,
      orgTable: [],
      periodId: '',
      mainData: [],
      orgUser: [],
      riskList: [],
      nextBtn: true,
      prevBtn: false,
      swiperOption: {
        spaceBetween: 10,
        observer: true,
        observeParents: true,
        width: 291,

      },
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
      testModel: (state) => state.testModel,
    }),
  },
  methods: {
    prevSwiper() {
      if (this.$refs.mySwiper.swiper.activeIndex == 1) {
        this.nextBtn = true;
        this.prevBtn = false;
      }

      this.$refs.mySwiper.swiper.slidePrev();
    },
    nextSwiper() {
      if (this.$refs.mySwiper.swiper.activeIndex + 1 > 0) {
        this.prevBtn = true;
      }
      if (this.$refs.mySwiper.swiper.activeIndex == this.riskList.length - 2) {
        this.nextBtn = false;
      }

      this.$refs.mySwiper.swiper.slideNext();
    },
    // 切换周期
    getPeriod(periodId) {
      this.periodId = periodId;
      this.getmainData();
    },
    // 截取名字第一个字
    checkName(name) {
      return name.substring(0, 1);
    },
    // 获取主页okr进度与更新次数统计 this.$route.query.id如果为部门负责人或团队负责人则为orgId,普通员工为userId
    getmainData() {
      this.server.mainData({
        orgId: this.$route.query.id ? this.$route.query.id : this.setOrgId,
        periodId: this.periodId,
      }).then((res) => {
        this.mainData = res.data;
        this.riskList = this.testModel ? mainData.orkData.data : res.data;
      });
    },

  },
};
</script>