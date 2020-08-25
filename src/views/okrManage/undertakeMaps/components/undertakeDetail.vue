<template>
  <div class="home">
    <!-- 返回 -->
    <div>
      <el-button @click="goback">返回</el-button>
    </div>
    <!-- 更新 -->
    <div>
      <dl>
        <dd>{{undertakeDetail.okrDetailObjectKr}}</dd>
        <dd>
          <el-progress
            :stroke-width="10"
            :percentage="parseInt(undertakeDetail.okrDetailProgress, 10)"
          ></el-progress>
        </dd>
        <dd>
          <span>负责人</span>
          <span>{{undertakeDetail.userName}}</span>
        </dd>
        <dd>
          <el-button @click="openUpdate">更新OKR</el-button>
        </dd>
      </dl>
    </div>

    <div>
      <dl v-for="(pitem,index) in personList" :key="index">
        <dt v-if="index==0">{{pitem.userName}}</dt>
        <dd v-for="(okritem,okrindex) in pitem" :key="okrindex">
          <ul>
            <li>{{okritem.createTime}}</li>
            <li>
              <span>目标O</span>
              <span>{{okritem.okrDetailtitle}}</span>
            </li>
            <li>
              <span>更新说明</span>
              <span>{{okritem.content}}</span>
            </li>
            <li>
              <span>来自</span>
              <span>{{okritem.operateType}}</span>
            </li>
            <li>
              <span>本次更新进度+</span>
              <span>{{okritem.okrDetailProgress}}%</span>
            </li>
            <li>
              <el-button @click="duiqi">已对启</el-button>
            </li>
          </ul>
        </dd>
      </dl>
    </div>
    <tl-update-progress
      ref="tlokrupdate"
      :server="server"
      :okrForm="undertakeDetail"
      :dialogExist.sync="dialogExist"
    ></tl-update-progress>
  </div>
</template>

<script>

import { mapState, mapMutations } from 'vuex';

import updateProgress from './updateProgress';
import Server from '../server';

const server = new Server();

export default {
  name: 'undertakeDetail',
  components: {
    'tl-update-progress': updateProgress,
  },
  data() {
    return {
      server,
      personList: [],
      formData: {
        maindata: {
          okrDetailtitle: '实现公司收入1亿元',
          okrDetailProgress: 50,
          userName: '肖海山',

        },
      },
      okrForm: {
        okrDetailObjectKr: '定个小目标',
        okrDetailProgress: 70,
        confidence: '1',
      },
      dialogExist: false,
    };
  },
  created() {
    this.okrCheck();
  },
  computed: {
    ...mapState('common', {
      undertakeDetail: (state) => state.undertakeDetail,
    }),
  },
  methods: {
    ...mapMutations('common', ['undertakeMapsStep', 'setundertakeDetail']),
    okrCheck() {
      console.log(this.undertakeDetail);
      this.server.okrCheck({
        checkStatus: 0,
        okrDetailId: '111122',
      }).then((res) => {
        if (res.code == 200) {
          this.personList = res.data;
        }
      });
    },
    openUpdate() {
      // 打开更新okr
      this.$nextTick(() => {
        this.$refs.tlokrupdate.showOkrDialog();
        this.dialogExist = true;
      });
    },
    duiqi() {
      console.log('刷新列表');
    },
    goback() {
      this.undertakeMapsStep('1');
      this.setundertakeDetail({});
    },
  },
};
</script>

<style>
</style>