<template>
  <div class="home">
    <!-- 返回 -->
    <div>
      <el-button @click="goback">返回</el-button>
    </div>
    <!-- 更新 -->
    <div>
      <dl>
        <dd>
          <span>{{CONST.OKR_TYPE_MAP[undertakeDetail.okrDetailType]}}：</span>
          <span>{{undertakeDetail.okrDetailObjectKr}}</span>
        </dd>
        <dd>
          <el-progress
            :stroke-width="10"
            :percentage="parseInt(undertakeDetail.okrDetailProgress, 10)"
          ></el-progress>
        </dd>
        <dd>
          <span>负责人:</span>
          <span>{{undertakeDetail.userName}}</span>
        </dd>
        <dd>
          <el-button @click="openUpdate">更新OKR</el-button>
        </dd>
      </dl>
    </div>
    <div>
      <el-button v-if="checkStatus === 0" @click="okrCheck(1)">icon历史OKR对齐</el-button>
      <el-button v-else @click="okrCheck(0)">icon返回</el-button>
    </div>
    <div>
      <dl v-for="(pitem,index) in personList" :key="index">
        <dt v-if="index==0">
          <span>{{pitem[0].userName}}</span>
          <span>({{pitem.length}})</span>
        </dt>
        <el-timeline>
          <el-timeline-item
            v-for="(okritem, okrindex) in pitem"
            :key="okrindex"
            :timestamp="okritem.createTime"
            placement="top"
          >
            <div>
              <dd>
                <span>目标O{{okritem.okrDetailType}}</span>
                <span>{{okritem.okrContent}}</span>
              </dd>
              <dd>
                <span>更新说明</span>
                <span>{{okritem.remark}}</span>
              </dd>
              <dd>
                <span>来自-</span>
                <span>{{CONST.OPERATE_TYPE_MAP[okritem.operateType]}}</span>
              </dd>
              <dd>
                <span>
                  本次更新进度
                  <span v-if="okritem.okrDetailProgress>0">+</span>
                </span>
                <span>{{okritem.okrDetailProgress}}%</span>
              </dd>
            </div>
          </el-timeline-item>
        </el-timeline>
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
import CONST from '../const';

const server = new Server();

export default {
  name: 'undertakeDetail',
  components: {
    'tl-update-progress': updateProgress,
  },
  data() {
    return {
      CONST,
      server,
      personList: [],
      dialogExist: false,
      checkStatus: 0,
    };
  },
  created() {
    this.okrCheck(this.checkStatus);
  },
  computed: {
    ...mapState('common', {
      undertakeDetail: (state) => state.undertakeDetail,
    }),
  },
  methods: {
    ...mapMutations('common', ['undertakeMapsStep', 'setundertakeDetail']),
    okrCheck(checkStatus) {
      this.checkStatus = checkStatus;
      this.okrDetailId = this.undertakeDetail.okrDetailId || '';
      this.server.okrCheck({
        checkStatus,
        okrDetailId: this.okrDetailId,
      }).then((res) => {
        if (res.code == 200) {
          this.personList = res.data || [];
          this.personList.forEach((pitem) => {
            if (pitem.length > 0) {
              pitem.forEach((citem) => {
                const contentObject = JSON.parse(citem.content) || {};
                // eslint-disable-next-line max-len
                citem.okrDetailProgress = (contentObject.afterProgress - contentObject.beforeProgress) || 0;
                citem.remark = contentObject.remark || '暂无';
              });
            }
          });
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