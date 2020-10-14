<template>
  <div>
    <div>复盘对象：{{ okrMain.okrMainVo.periodName }}</div>
    <div class="replay-user">
      <div class="list">姓名：{{ okrMain.okrMainVo.userName }}</div>
      <div class="list">OKR进度： {{ okrMain.okrMainVo.okrProgress }}%</div>
      <div class="list">
        复盘时间：
        {{
          okrMain.okrMainVo.reviewCommitTime
            ? okrMain.okrMainVo.reviewCommitTime
            : "--"
        }}
      </div>
    </div>
    <div>
      <el-radio-group v-model="okrMain.okrMainVo.reviewType">
        <el-radio :label="1" v-if="okrMain.okrMainVo.reviewType == 1"
          >以关键结果KR复盘</el-radio
        >
        <el-radio :label="0" v-if="okrMain.okrMainVo.reviewType == 0"
          >以目标O复盘</el-radio
        >
      </el-radio-group>
    </div>
    <div>
      <tl-kr-detail v-if="okrMain.okrMainVo.reviewType == 1" />
      <tl-o-detail v-if="okrMain.okrMainVo.reviewType == 0" />
    </div>
  </div>
</template>

<script>
import Server from '../server';
import krDetail from './component/krDetail';
import odetail from './component/odetail';

const server = new Server();
export default {
  name: 'home',
  components: {
    'tl-o-detail': odetail,
    'tl-kr-detail': krDetail,
  },
  data() {
    return {
      form: {},
      activeNames: ['1'],
      server,
      okrMain: {
        okrMainVo: {
          reviewType: 0,
        },
      },
      active: {},
      communication: {},
      communicationLabel: {},
      list: [],
      listBtn: [
        '超级优秀',
        '优秀',
        '继续努力',
        '要加油哦',
      ],
    };
  },
  created() {
    this.getOkrReviewDetail();
  },

  methods: {
    checkDatakrs(clear) {
      const krsData = this.okrMain.okrReviewPojoList.map((item) => item.krs);
      const krs = [];
      let krsList;
      krsData.forEach((item) => {
        krsList = krs.concat(item);
      });
      if (clear) {
        this.list = krsList.map((item) => ({
          detailId: item.detailId,
          okrDetailId: item.okrDetailId,
          communication: '',
          communicationLabel: '',
        }));
      } else {
        this.list = krsList.map((item) => ({
          detailId: item.detailId,
          okrDetailId: item.okrDetailId,
          communication: item.communication,
          communicationLabel: item.communicationLabel,
        }));
      }
    },
    inputCommunication(value, index, i) {
      this.okrMain.okrReviewPojoList[index].krs[i].communication = value;
    },
    selectCommunicationLabel(value, index, i) {
      const mainData = this.okrMain.okrReviewPojoList[index].krs[i];
      mainData.communicationLabel = value;
    },
    save() {
      this.checkDatakrs(false);
      const params = {
        okrMainVo: {
          okrId: this.okrMain.okrMainVo.okrId,
          reviewType: 1,
        },
        list: this.list,
      };
      this.server.okrReviewCommunicationSave(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('保存成功');
        }
      });
    },
    handleDeleteOne() {
      this.$xconfirm({ title: '该数据删除将无法恢复，确认要删除吗？', content: '' })
        .then(() => {
          this.clearClose();
        })
        .catch(() => {});
    },
    clearClose() {
      this.checkDatakrs(true);
      const params = {
        okrMainVo: {
          okrId: this.okrMain.okrMainVo.okrId,
          reviewType: 1,
        },
        list: this.list,
      };
      this.server.okrReviewCommunicationSave(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('保存成功');
        }
      });
    },
    submit() {
      this.checkDatakrs(false);
      const params = {
        okrMainVo: {
          okrId: this.okrMain.okrMainVo.okrId,
          reviewType: 1,
        },
        list: this.list,
      };
      this.server.okrReviewCommunicationSubmit(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('提交成功');
        }
      });
    },
    handleChange(val) {
      console.log(val);
    },
    getOkrReviewDetail() {
      this.server.getOkrReviewDetail({
        okrMainId: this.$route.query.okrId,
      }).then((res) => {
        this.okrMain = res.data;
        this.checkDatakrs();
      });
    },
  },
};
</script>
<style  scoped>
.replay-user {
  display: flex;
  flex-direction: row;
}
.replay-user .list {
  margin-right: 40px;
}
.right {
  float: right;
}
</style>