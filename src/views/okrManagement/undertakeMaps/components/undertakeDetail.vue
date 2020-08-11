<template>
  <div class="home">
    <!-- 更新 -->
    <div>
      <dl>
        <dd>{{formData.maindata.okrDetailtitle}}</dd>
        <dd>
          <el-progress
            :stroke-width="10"
            :percentage="parseInt(formData.maindata.okrDetailProgress, 10)"
          ></el-progress>
        </dd>
        <dd>
          <span>负责人</span>
          <span>{{formData.maindata.userName}}</span>
        </dd>
        <dd>
          <el-button @click="gengxin">更新OKR</el-button>
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
  </div>
</template>

<script>

import Server from '../server';

const server = new Server();

export default {
  name: 'undertakeDetail',
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
    };
  },
  created() {
    this.okrCheck();
  },
  methods: {
    okrCheck() {
      this.server.okrCheck({
        checkStatus: 0,
        okrDetailId: '111122',
      }).then((res) => {
        if (res.code == 200) {
          this.personList = res.data;
        }
      });
    },
    gengxin() {
      // 打开一个
    },
    duiqi() {
      console.log('刷新列表');
    },
  },
};
</script>

<style>
</style>