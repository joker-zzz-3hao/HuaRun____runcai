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
          <span>{{CONST.OKR_TYPE[okrmain.okrBelongType]}}</span>
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
    <div>
      <span>操作历史</span>
      <timeline :cycleList="cycleList"></timeline>
    </div>
    <!-- 点赞 -->
    <div>
      <ul style="display:flex">
        <li v-for="(item,index) in voteUser" :key="item.userId+index">{{item.userName}}</li>
        <el-button v-if="showLike" @click="like()">点赞</el-button>
      </ul>
    </div>
  </el-dialog>
</template>

<script>
import okrCollapse from '@/components/okrCollapse';
import timeline from '@/components/timeLine';
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
      cycleList: [], // 操作历史
      showLike: true, // okr地图查看详情可点赞
      supportType: 0, // 点赞1 取消赞0
    };
  },
  components: {
    okrCollapse,
    timeline,
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
    // 生成数字序列（用于打开okrCollapse
    activeList() {
      if (this.tableList && this.tableList.length > 0) {
        return Array.from(new Array(this.tableList.length).keys());
      }
      return [];
    },
  },
  created() {
    this.getokrDetail();
    this.getSupportList();
    this.getOperationHistory();
  },
  methods: {
    // 查okr详情
    getokrDetail() {
      this.server.getokrDetail({ okrId: this.okrId }).then((res) => {
        console.log('detail', res);
        this.tableList = res.data.okrDetails;
        this.okrmain = res.data.okrMain;
        // this.voteUser = res.data.voteUser;
      });
    },
    // 点赞
    like() {
      this.supportType = this.supportType === 1 ? 0 : 1;
      this.server.okrSupport({
        okrId: this.okrId,
        supportType: this.supportType,
      }).then((res) => {
        if (res.code == 200) {
          console.log(res.code);
          this.getSupportList();
        }
      });
    },
    // 查点赞列表
    getSupportList() {
      // TODO:{ okrId: this.okrId }
      this.server.getSupportList({ okrId: this.okrId }).then((res) => {
        console.log(res.code);
        if (res.code == 200) {
          this.voteUser = res.data.supportUserList;
        }
      });
    },
    // TODO:查全部pageSize要传大点
    getOperationHistory() {
      this.server.okrOperationHistory({
        currentPage: 1,
        okrMainId: this.okrId,
        pageSize: 100,
      }).then((res) => {
        console.log(res.code);
        if (res.code == 200) {
          this.cycleList = res.data.records;
        }
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