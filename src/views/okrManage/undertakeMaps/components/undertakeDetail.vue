<template>
  <div class="home">
    <!-- 返回 -->
    <div>
      <el-button @click="goback">返回</el-button>
    </div>
    <!-- 更新 -->
    <el-collapse class="tl-collapse" accordion @change="okrCheck">
      <el-collapse-item
        ref="okrcoll"
        v-for="okrItem in okrInfoList"
        :key="okrItem.okrDetailId"
        :name="okrItem.okrDetailId"
      >
        <!-- OKR -->
        <template slot="title">
          <dl>
            <dt>
              <span v-if="okrItem.okrDetailType == 0">目标</span>
              <span v-else>KR</span>
              <em>{{okrItem.okrDetailObjectKr}}</em>
              <tl-process :data="okrItem.okrDetailProgress"></tl-process>
            </dt>
          </dl>
        </template>
        <!-- 操作按钮 -->
        <div>
          <span>以下人员承接了你的OKR，他们的工作进展用于你的OKR更新</span>
          <el-button @click="openUpdate(okrItem)">更新进展</el-button>
          <span v-if="checkStatus === 0" @click="okrCheck(okrItem.okrDetailId,1)">历史okr对齐</span>
          <span v-else @click="okrCheck(okrItem.okrDetailId,0)">返回</span>
        </div>
        <!-- 对齐的内容 -->
        <div>
          <dl v-for="(pitem) in personList" :key="pitem.id">
            <dt>
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
                    <span v-if="okritem.okrDetailType == 0">目标O</span>
                    <span v-else>关键结果KR</span>
                    <em>{{okritem.okrContent}}</em>
                  </dd>
                  <dd>
                    <span>更新说明</span>
                    <em>{{okritem.remark}}</em>
                  </dd>
                  <dd>
                    <span>来自-</span>
                    <em>{{CONST.OPERATE_TYPE_MAP[okritem.operateType]}}</em>
                  </dd>
                  <dd>
                    <span>本次更新进度</span>
                    <em v-if="okritem.okrDetailProgress>0">+{{okritem.okrDetailProgress}}%</em>
                    <em v-else>{{okritem.okrDetailProgress}}%</em>
                  </dd>
                </div>
              </el-timeline-item>
            </el-timeline>
          </dl>
        </div>
      </el-collapse-item>
    </el-collapse>
    <tl-update-progress
      ref="tlokrupdate"
      :server="server"
      :okrForm="choseOkrInfo"
      :dialogExist.sync="dialogExist"
    ></tl-update-progress>
  </div>
</template>

<script>

import { mapState, mapMutations } from 'vuex';
import process from '@/components/process';
import updateProgress from './updateProgress';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'undertakeDetail',
  components: {
    'tl-update-progress': updateProgress,
    'tl-process': process,
  },
  data() {
    return {
      CONST,
      server,
      personList: [],
      dialogExist: false,
      checkStatus: 0,
      okrInfoList: [],
      choseOkrInfo: {},
    };
  },
  created() {
    this.queryOAndKrList();
  },
  computed: {
    ...mapState('common', {
      undertakeDetail: (state) => state.undertakeDetail,
      undertakePeriodId: (state) => state.undertakePeriodId,
    }),
  },
  methods: {
    ...mapMutations('common', ['setUndertakeMapsStep', 'setundertakeDetail']),
    queryOAndKrList() {
      this.server.queryOAndKrList({
        okrDetailId: this.undertakeDetail.okrDetailId,
        periodId: this.undertakePeriodId,
      }).then((res) => {
        if (res.code == 200) {
          this.okrInfoList = res.data || [];
        }
      });
    },
    okrCheck(okrDetailId, checkStatus = 0) {
      console.log(okrDetailId, checkStatus);
      this.checkStatus = checkStatus;
      this.okrDetailId = okrDetailId || '';
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
                citem.remark = citem.reason || '暂无';
              });
            }
          });
        }
      });
    },
    openUpdate(info) {
      this.choseOkrInfo = info;
      // 打开更新okr
      this.dialogExist = true;

      this.$nextTick(() => {
        this.$refs.tlokrupdate.showOkrDialog();
      });
    },
    duiqi() {
      console.log('刷新列表');
    },
    goback() {
      this.setUndertakeMapsStep('1');
      this.setundertakeDetail({});
    },
  },
};
</script>

<style>
</style>