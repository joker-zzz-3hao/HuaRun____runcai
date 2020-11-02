<template>
  <div class="okr-approval-detail">
    <!-- <h1>{{ okrData.okrMain.periodName }}</h1> -->
    <dl class="dl-card-panel">
      <dt class="card-title">
        <em>基本信息</em>
        <i class="el-icon-arrow-left"></i>
        <a @click="backList">返回</a>
      </dt>
      <dd>
        <em>{{ okrData.okrMain.periodName }}</em>
      </dd>
      <dd>
        <dl class="dl-item">
          <dt>
            <i class="el-icon-user"></i>
            <span>提交人</span>
          </dt>
          <dd>
            <em>{{ okrData.okrMain.userName }}</em>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt>
            <i class="el-icon-user"></i>
            <span>OKR状态</span>
          </dt>
          <dd>
            <em>{{ okrData.okrMain.status }}</em>
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
              :percentage="okrData.okrMain.okrProgress"
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
      v-if="![1, 2].includes(okrData.okrMain.readStatus)"
    >
      <dt>
        <em>审阅意见</em>
      </dt>
      <dd>
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
              style="width: 100%"
              type="textarea"
              v-model="formData.readRemark"
              :autosize="{ minRows: 4, maxRows: 8 }"
              maxlength="1000"
            ></el-input> </el-form-item
        ></el-form>
      </dd>
      <div class="operating-box" style="margin-top: 20px">
        <el-button
          :loading="loading"
          plain
          class="tl-btn amt-border-fadeout"
          @click="okrSummaryRead(1)"
          >已阅-无异议</el-button
        >
        <el-button
          :loading="loading"
          type="primary"
          class="tl-btn amt-bg-slip"
          @click="okrSummaryRead(2)"
          >已阅-建议调整</el-button
        >
      </div>
    </dl>
    <dl class="dl-card-panel" v-else>
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
import CONST from '@/lib/const';
import Server from '../server';
import createOkrComponent from './createOkrComponent';

const server = new Server();

export default {
  name: 'okrSummarizeDetail',
  data() {
    return {
      server,
      CONST,
      okrId: '',
      okrData: {},
      tableList: [],
      loading: false,
      cycleList: [],
      cycleFirst: {},
      formData: {
        readStatus: '',
        readRemark: '',
      },
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
    }),
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['setOkrSummarizeStep']),
    backList() {
      this.setOkrSummarizeStep('1');
    },
    okrSummaryRead(readStatus) {
      this.formData.readStatus = readStatus;
      this.$nextTick(() => {
        this.$refs.read.validate((valid) => {
          if (valid) {
            this.server.okrSummaryRead({
              okrId: this.okrData.okrMain.okrId,
              readStatus: this.formData.readStatus,
              readRemark: this.formData.readRemark,
            }).then((res) => {
              if (res.code == 200) {
                this.$message.success('审阅完成');
                this.backList();
              }
            });
          }
        });
      });
    },
  },
  watch: {
    okrSummarizeDetail: {
      handler(newVal) {
        if (newVal) {
          this.okrData = JSON.parse(newVal);
          this.tableList = this.okrData.okrDetails;
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>