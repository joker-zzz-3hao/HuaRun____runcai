<template>
  <div>
    <el-button plain @click="$router.back()" class="tl-btn amt-border-slip">
      返回
      <span class="lines"></span>
    </el-button>
    <div>
      复盘对象：{{ okrMain.okrMainVo.periodName }}({{
        dateFormat("YYYY/mm/dd", new Date(okrMain.okrMainVo.startTime)) +
        "~" +
        dateFormat("YYYY/mm/dd", new Date(okrMain.okrMainVo.endTime))
      }})
    </div>
    <div class="replay-user">
      <div class="list">
        <img
          v-if="okrMain.okrMainVo.headUrl"
          style="width: 50px; height: 50px; border-radius: 50%"
          :src="okrMain.okrMainVo.headUrl"
        />
        <!-- <div class="user-name" v-else>
          <em>{{ cutName(okrMain.okrMainVo.userName) }}</em>
        </div> -->
        {{ okrMain.okrMainVo.userName }}
      </div>
      <div class="list">
        <dl class="okr-progress">
          <dt>
            <em>OKR进度</em>
          </dt>
          <dd>
            <el-progress
              type="circle"
              :percentage="parseInt(okrMain.okrMainVo.okrProgress, 10) || 0"
              :width="70"
              :stroke-width="5"
              color="#4ccd79"
              class="tl-progress-circle"
            ></el-progress>
          </dd>
        </dl>
      </div>
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
    </div>
    <div>
      <div>复盘记录</div>
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(item, index) in activities"
          :key="index"
          :timestamp="item.createTime"
          >{{ item.userName }} {{ item.content }}</el-timeline-item
        >
      </el-timeline>
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