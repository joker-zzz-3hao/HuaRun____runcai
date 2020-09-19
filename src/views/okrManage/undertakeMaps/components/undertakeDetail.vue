<template>
  <div class="home">
    <!-- 返回 -->
    <div>
      <el-button @click="goback">返回</el-button>
    </div>
    <!-- 更新 -->
    <el-collapse>
      <el-collapse-item ref="okrcoll">
        <!-- OKR -->
        <template slot="title">
          <dl>
            <dt>
              <span v-if="undertakeDetail.okrDetailType == 0">目标</span>
              <span v-else>KR</span>
              <em>{{undertakeDetail.okrDetailObjectKr}}</em>
              <tl-process :data="undertakeDetail.okrDetailProgress"></tl-process>
            </dt>
          </dl>
        </template>
        <!-- 操作按钮 -->
        <div>
          <span>以下人员承接了你的OKR，他们的工作进展用于你的OKR更新</span>
          <el-button @click="openUpdate">更新进展</el-button>
          <span v-if="checkStatus === 0" @click="okrCheck(1)">历史okr对齐</span>
          <span v-else @click="okrCheck(0)">返回</span>
        </div>
        <!-- 对齐的内容 -->
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
      </el-collapse-item>
    </el-collapse>
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
    ...mapMutations('common', ['setUndertakeMapsStep', 'setundertakeDetail']),
    okrCheck(checkStatus) {
      this.checkStatus = checkStatus;
      this.okrDetailId = this.undertakeDetail.okrDetailId || '';
      this.server.okrCheck({
        checkStatus,
        okrDetailId: this.okrDetailId,
        okrType: this.undertakeDetail.okrDetailType === 1 ? 'KR' : 'O',
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
      this.setUndertakeMapsStep('1');
      this.setundertakeDetail({});
    },
  },
};
</script>

<style>
</style>