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
      <dd>
        <el-radio-group v-model="feedback" @change="setText">
          <el-radio :label="1">加油，看好你！</el-radio>
          <el-radio :label="2">努力，加油干！</el-radio>
          <el-radio :label="3">辛苦了</el-radio>
        </el-radio-group>
      </dd>

      <div style="margin-top: 25px">
        <el-button
          plain
          class="tl-btn amt-border-fadeout"
          @click="okrSummaryRead"
          >已阅-无异议</el-button
        >

        <el-button
          slot="reference"
          plain
          style="margin-left: 5px"
          class="tl-btn amt-border-fadeout"
          @click="showDia"
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
    <el-dialog
      :append-to-body="true"
      :visible="showDialog"
      @close="close"
      title=""
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form ref="read" :model="formData"
        ><el-form-item
          prop="readRemark"
          :rules="[
            {
              required: true,
              message: '请输入调整建议',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            style="width: 100%"
            type="textarea"
            placeholder="请输入调整建议"
            v-model="formData.readRemark"
            :autosize="{ minRows: 4, maxRows: 8 }"
            maxlength="1000"
          ></el-input> </el-form-item
      ></el-form>
      <div class="operating-box">
        <el-button
          :loading="loading"
          type="primary"
          class="tl-btn amt-bg-slip"
          @click="submitFeedback"
          >确定</el-button
        >
        <el-button
          :disabled="loading"
          plain
          class="tl-btn amt-border-fadeout"
          @click="close"
          >取消</el-button
        >
      </div>
    </el-dialog>
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
    // this.$busOn('clearInput', () => {
    //   this.$refs.read.resetField();
    // });
  },
  methods: {
    ...mapMutations('common', ['setOkrSummarizeStep']),
    backList() {
      this.$busEmit('refreshPage');
      this.setOkrSummarizeStep('1');
    },
    okrSummaryRead() {
      this.$nextTick(() => {
        this.$confirm('确认提交？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
        }).then(() => {
          this.server.okrSummaryRead({
            okrId: this.okrData.okrMain.okrId,
            readStatus: 1,
            readRemark: this.formData.readRemark,
            userId: this.okrData.okrMain.userId,
          }).then((res) => {
            if (res.code == 200) {
              this.$message.success('审阅完成');
              this.backList();
            }
          });
        }).catch(() => {
        });
      });
    },
    submitFeedback() {
      this.$refs.read.validate((valid) => {
        if (valid) {
          this.server.okrSummaryRead({
            okrId: this.okrData.okrMain.okrId,
            readStatus: 2,
            readRemark: this.formData.readRemark,
            userId: this.okrData.okrMain.userId,
          }).then((res) => {
            if (res.code == 200) {
              this.$message.success('审阅完成');
              this.close();
              this.backList();
            }
          });
        }
      });
    },
    okrSuggestChange() {

    },
    setText(feedback) {
      this.showDialog = false;
      switch (feedback) {
        case 1:
          this.formData.readRemark = '加油，看好你！';
          break;
        case 2:
          this.formData.readRemark = '努力，加油干！';
          break;
        case 3:
          this.formData.readRemark = '辛苦了！';
          break;
        default:
          break;
      }
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