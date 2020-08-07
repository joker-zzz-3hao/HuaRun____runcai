<template>
  <div>
    <!-- 公共信息 -->
    <div>
      <ul>
        <li>
          <span>目标类型</span>
          <span>{{okrmain.okrBelongType}}</span>
        </li>
        <li>
          <span>负责人</span>
          <span>{{okrmain.userName}}</span>
        </li>
        <li>
          <span>更新时间</span>
          <span>{{okrmain.updateTime}}</span>
        </li>
        <li>
          <span>进度</span>
          <span>
            <el-progress :stroke-width="10" :percentage="parseInt(okrmain.okrProgress, 10)"></el-progress>
          </span>
        </li>
      </ul>
    </div>
    <!-- okr折叠面板 -->
    <elcollapse class="collapse">
      <elcollapseitem v-for="(item, index) in tableList" :key="item.detailId+index">
        <template slot="title">
          <div>{{item.okrDetailObjectKr}}</div>
          <!-- <el-popover placement="right" width="400" trigger="click">
            <i slot="reference" class="el-icon-edit"></i>
          </el-popover>-->
          <!-- <el-input v-model="item.okrDetailObjectKr"></el-input> -->
          <span>
            <i class="el-icon-edit"></i>
          </span>
          <ul class="detail">
            <li>
              <span>权重</span>
              <span>{{item.okrWeight}}%</span>
            </li>
            <li>
              <span>当前进度</span>
              <span class="progresswidth">
                <el-progress :stroke-width="10" :percentage="parseInt(item.okrDetailProgress, 10)"></el-progress>
              </span>
            </li>
            <li>
              <span>目标承接自</span>
              <span>{{item.parentObjectKr}}</span>
            </li>
          </ul>
        </template>
        <div v-for="(kritem, index) in item.krList" :key="kritem.detailId+index">
          <div>
            <span>{{index+1}}</span>
            {{kritem.okrDetailObjectKr}}
          </div>
          <ul class="detail">
            <li>
              <span>分权重</span>
              <span>{{kritem.okrWeight}}%</span>
            </li>
            <li>
              <span>当前进度</span>
              <span class="progresswidth">
                <el-progress
                  :stroke-width="10"
                  :percentage="parseInt(kritem.okrDetailProgress, 10)"
                ></el-progress>
              </span>
            </li>
            <li>
              <span>信心状态</span>
              <span>{{kritem.confidence}}</span>
            </li>
          </ul>
        </div>
      </elcollapseitem>
    </elcollapse>
    <!-- 操作历史 -->
    <div></div>
    <!-- 点赞 -->
    <div>
      <ul style="display:flex">
        <li v-for="(item,index) in voteUser" :key="item.userId+index">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import elcollapse from '@/components/collapse/collapse';
import elcollapseitem from '@/components/collapse/collapse-item';
import CONST from '../const';

export default {
  name: 'okrDetail',
  data() {
    return {
      CONST,
      tableList: [], // okr列表
      voteUser: [], // 点赞人列表
      okrmain: {}, // 公共信息
      canWrite: true, // true写okr false okr详情
    };
  },
  components: {
    elcollapse, elcollapseitem,
  },
  props: {

    server: {
      type: Object,
      required: true,
    },
    okrId: {
      type: String,
    },
  },
  created() {
    this.getokrDetail();
  },
  methods: {
    getokrDetail() {
      this.server.getokrDetail({ okrId: this.okrId }).then((res) => {
        console.log('detail', res);
        this.tableList = res.data.okrDetails;
        this.okrmain = res.data.okrMain;
        this.voteUser = res.data.voteUser;
      });
    },

  },
  watch: {
    okrid: {
      handler() {
        this.getokrDetail();
      },
    },
  },
};
</script>

<style>
.collapse span,
.collapsetitle span {
  margin-left: 10px;
}

.collapsetitle {
  margin-left: 250px;
}
.progresswidth {
  width: 150px;
  display: inline-block;
}
.detail {
  display: flex;
}
</style>