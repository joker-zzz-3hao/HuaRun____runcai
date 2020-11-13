<template>
  <div class="okr-approval-detail">
    <dl class="dl-card-panel">
      <dt class="card-title">
        <em>基本信息</em>
        <i class="el-icon-arrow-left"></i>
        <a @click="backList">返回</a>
      </dt>
      <dd>
        <em>{{
          isApprovaling ? okrData.periodName : okrData.okrMain.periodName
        }}</em>
      </dd>
      <dd>
        <dl class="dl-item">
          <dt>
            <i class="el-icon-user"></i>
            <span>提交人</span>
          </dt>
          <dd>
            <em>{{
              isApprovaling ? okrData.userName : okrData.okrMain.userName
            }}</em>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt>
            <i class="el-icon-user"></i>
            <span>OKR状态</span>
          </dt>
          <dd>
            <em>{{
              CONST.TABLE_STATUS_MAP[
                isApprovaling ? okrData.status : okrData.okrMain.status
              ]
            }}</em>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt>
            <i class="el-icon-odometer"></i>
            <span>OKR进度</span>
          </dt>
          <dd>
            <el-progress
              type="circle"
              :percentage="
                isApprovaling
                  ? okrData.okrProgress
                  : okrData.okrMain.okrProgress
              "
              :width="60"
              :stroke-width="5"
              color="#4ccd79"
              class="tl-progress-circle"
            ></el-progress>
          </dd>
        </dl>
      </dd>
    </dl>
    <dl class="dl-card-panel">
      <dt>
        <em>OKR信息</em>
      </dt>
      <dd>
        <tl-create-okrComponent :tableList="tableList"></tl-create-okrComponent>
      </dd>
    </dl>
    <dl
      class="dl-card-panel"
      v-if="
        !isApprovaling &&
        ![1, 2].includes(okrData.okrMain.readStatus) &&
        optionType == 'check'
      "
    >
      <dt>
        <em>审阅意见</em>
      </dt>
      <el-form ref="read" :model="formData"
        ><el-form-item
          prop="readRemark"
          :rules="
            formData.readStatus == 2
              ? [
                  {
                    required: true,
                    message: '请输入调整建议',
                    trigger: 'blur',
                  },
                ]
              : ''
          "
        >
          <el-input
            style="width: 70%"
            type="textarea"
            placeholder="请输入调整建议"
            v-model="formData.readRemark"
            :autosize="{ minRows: 5, maxRows: 8 }"
            maxlength="1000"
          ></el-input>
          <span class="tip-btn"
            ><dl>
              <dd>
                <el-button @click="setText('通过')" size="small"
                  >通过</el-button
                >
              </dd>
              <dd>
                <el-button @click="setText('加油')" size="small"
                  >加油</el-button
                >
              </dd>
              <dd>
                <el-button @click="setText('认真落实')" size="small"
                  >认真落实</el-button
                >
              </dd>
            </dl></span
          >
        </el-form-item></el-form
      >
      <div style="margin-top: 25px">
        <el-button
          plain
          :loading="loadingNoOpinion"
          :disabled="loadingHasOpinion"
          class="tl-btn amt-border-fadeout"
          @click="okrSummaryRead(1)"
          >已阅-无异议</el-button
        >

        <el-button
          slot="reference"
          :loading="loadingHasOpinion"
          :disabled="loadingNoOpinion"
          plain
          style="margin-left: 5px"
          class="tl-btn amt-border-fadeout"
          @click="okrSummaryRead(2)"
          >已阅-建议调整
        </el-button>
      </div>
    </dl>
    <dl
      class="dl-card-panel"
      v-if="
        !isApprovaling &&
        [1, 2].includes(okrData.okrMain.readStatus) &&
        optionType == 'info'
      "
    >
      <dt>
        <em>审阅结果</em>
      </dt>
      <dd>
        <em style="font-size: 20px">{{
          okrData.okrMain.readStatus == 1 ? "已阅-无异议" : "已阅-建议调整"
        }}</em>
      </dd>
      <dd style="margin-top: 10px">
        <em>{{ okrData.okrMain.readRemark }}</em>
      </dd>
    </dl>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// import okrCollapse from '@/components/okrCollapse';
// import CONST from '@/lib/const';
import Server from '../server';
import createOkrComponent from './createOkrComponent';
import CONST from '../const';

const server = new Server();

export default {
  name: 'okrSummarizeDetail',
  data() {
    return {
      server,
      CONST,
      loadingNoOpinion: false,
      loadingHasOpinion: false,
      okrId: '',
      feedback: '',
      okrData: {},
      tableList: [],
      loading: false,
      cycleList: [],
      cycleFirst: {},
      formData: {
        readStatus: '',
        readRemark: '',
      },
      isApprovaling: false,
      showDialog: false,
    };
  },
  components: {
    'tl-create-okrComponent': createOkrComponent,
    // 'tl-okrItem': okrItem,
  },
  props: {},
  computed: {
    ...mapState('common', {
      okrSummarizeDetail: (state) => state.okrSummarizeDetail,
      optionType: (state) => state.optionType,
    }),
  },
  mounted() {
    this.$busOn('clearInput', () => {
      this.$refs.read.resetField();
    });
  },
  methods: {
    ...mapMutations('common', ['setOkrSummarizeStep']),
    backList() {
      this.$busEmit('refreshPage');
      this.setOkrSummarizeStep('1');
    },
    okrSummaryRead(readStatus) {
      this.formData.readStatus = readStatus;

      this.$nextTick(() => {
        this.$refs.read.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal: false,
            }).then(() => {
              this.loadingNoOpinion = false;
              this.loadingHasOpinion = true;
              if (readStatus == 1) {
                this.loadingNoOpinion = true;
                this.loadingHasOpinion = false;
              }
              this.server.okrSummaryRead({
                okrId: this.okrData.okrMain.okrId,
                readStatus,
                readRemark: this.formData.readRemark,
                userId: this.okrData.okrMain.userId,
              }).then((res) => {
                if (res.code == 200) {
                  this.$message.success('审阅完成');
                  this.backList();
                  this.formData.readRemark = '';
                }
                this.loadingNoOpinion = false;
                this.loadingHasOpinion = false;
              });
            }).catch(() => {
            });
          }
        });
      });
    },
    setText(text) {
      this.formData.readRemark = text;
    },
    showDia() {
      this.showDialog = true;
      this.feedback = '';
      this.formData.readRemark = '';
    },
    close() {
      this.showDialog = false;
    },
  },
  watch: {
    okrSummarizeDetail: {
      handler(newVal) {
        if (newVal) {
          this.isApprovaling = false;
          this.okrData = JSON.parse(newVal);
          if (this.okrData.status === 0) { // 审批中
            this.isApprovaling = true;
            this.tableList = JSON.parse(this.okrData.paramJson).okrInfoList;
          } else {
            this.tableList = this.okrData.okrDetails;
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style lang="css">
.tip-btn {
  margin-left: 10px;
}
.tip-btn button {
  background-color: rgb(255, 255, 255);
  margin-top: 7px;
}
</style>