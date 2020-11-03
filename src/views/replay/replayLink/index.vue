<template>
  <div class="replay-link">
    <tl-replayUser :okrMain="okrMain"></tl-replayUser>
    <tl-kr-detail
      v-if="okrMain.okrMainVo.reviewType == 1"
      @getView="getOkrReviewDetail"
      :okrMain="okrMain"
    />
    <tl-o-detail
      v-if="okrMain.okrMainVo.reviewType == 0"
      @getView="getOkrReviewDetail"
      :okrMain="okrMain"
    />
    <tl-replayHistory :activities="activities"></tl-replayHistory>
  </div>
</template>

<script>
import Server from '../server';
import krDetail from './component/krDetail';
import odetail from './component/odetail';
import replayUser from '../component/repayUser';
import replayHistory from '../component/replayHistory';

const server = new Server();
export default {
  name: 'home',
  components: {
    'tl-o-detail': odetail,
    'tl-kr-detail': krDetail,
    'tl-replayUser': replayUser,
    'tl-replayHistory': replayHistory,
  },
  data() {
    return {
      form: {},
      activeNames: ['1'],
      server,
      okrMain: {
        okrReviewPojoList: [],
        okrMainVo: {
          reviewType: 0,
        },
      },
      activities: [],
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
  mounted() {
    this.getOkrReviewDetail();
    this.getOkrReviewHistoryList();
  },

  methods: {
    getOkrReviewHistoryList() {
      this.server.getOkrReviewHistoryList({
        okrMainId: this.$route.query.okrId,

      }).then((res) => {
        this.activities = res.data;
      });
    },
    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
    },
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