<template>
  <div class="undertake-maps-detail">
    <div class="cont-area">
      <elcollapse accordion @change="okrCheck">
        <elcollapseitem
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
              <dd>
                <span>{{okrItem.undertakeCount}}</span>
                <span>个支撑项可对齐</span>
              </dd>
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
                    <dd v-if="okritem.operateType == '5'">
                      <span v-if="okritem.okrDetailType == 0">目标O</span>
                      <span v-else>关键结果KR</span>
                      <em>{{okritem.okrContent}}</em>
                    </dd>
                    <dd v-if="okritem.operateType == '5'">
                      <span>更新说明</span>
                      <em>{{okritem.remark}}</em>
                    </dd>
                    <dd v-if="okritem.operateType == '6'">
                      <span>周报周期</span>
                      <em></em>
                    </dd>
                    <dd v-if="okritem.operateType == '6'">
                      <span>支撑项</span>
                      <em>{{okritem.okrContent}}</em>
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
        </elcollapseitem>
      </elcollapse>
      <tl-update-progress
        ref="tlokrupdate"
        :server="server"
        :okrForm="choseOkrInfo"
        :dialogExist.sync="dialogExist"
      ></tl-update-progress>
    </div>
    <div class="operating-area">
      <div class="operating-area-inside">
        <div class="operating-box">
          <el-button plain @click="goback" class="tl-btn amt-border-slip">
            返回
            <span class="lines"></span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState, mapMutations } from 'vuex';
import elcollapse from '@/components/collapse/collapse';
import elcollapseitem from '@/components/collapse/collapse-item';
import process from '@/components/process';
import updateProgress from './updateProgress';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'undertakeDetail',
  components: {
    elcollapse,
    elcollapseitem,
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
      undertakeCount: 0,
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
          this.okrInfoList.forEach((item) => {
            if (item.historyList) {
              item.undertakeCount = 0;
              item.historyList.forEach((hitem) => {
                item.undertakeCount += hitem.length;
              });
            }
          });
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
              this.undertakeCount += pitem.length;
              pitem.forEach((citem) => {
                const contentObject = JSON.parse(citem.content) || {};
                // eslint-disable-next-line max-len
                if (citem.operateType == '5') {
                  citem.okrDetailProgress = (contentObject.afterProgress - contentObject.beforeProgress) || 0;
                } else if (
                  citem.operateType == '6'
                ) {
                  citem.okrDetailProgress = (contentObject.progressAfter - contentObject.progressBefor) || 0;
                }
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