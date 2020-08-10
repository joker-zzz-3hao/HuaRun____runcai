<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogDetailVisible"
    width="50%"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
  >
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
    <okrCollapse :tableList="tableList" :activeList="activeList" :disabled="true"></okrCollapse>
    <!-- 操作历史 -->
    <div></div>
    <!-- 点赞 -->
    <div>
      <ul style="display:flex">
        <li v-for="(item,index) in voteUser" :key="item.userId+index">{{item.name}}</li>
      </ul>
    </div>
  </el-dialog>
</template>

<script>
import okrCollapse from '@/components/okrCollapse';
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
      dialogTitle: 'OKR详情', // 弹框标题
      dialogDetailVisible: false,
    };
  },
  components: {
    okrCollapse,
  },
  props: {
    dialogExist: {
      type: Boolean,
      default: true,
    },
    server: {
      type: Object,
      required: true,
    },
    okrId: {
      type: String,
    },
  },
  computed: {
    activeList() {
      if (this.tableList && this.tableList.length > 0) {
        return Array.from(new Array(this.tableList.length).keys());
      }
      return [];
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
    // 控制弹窗
    showOkrDialog() {
      this.dialogDetailVisible = true;
      this.getokrDetail();
    },
    close() {
      this.dialogDetailVisible = false;
    },
    closed() {
      this.$emit('update:dialogExist', false);
    },
  },
  watch: {
    // okrid: {
    //   handler() {
    //     this.getokrDetail();
    //   },
    //   deep: true,
    //   immediate: true,
    // },
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