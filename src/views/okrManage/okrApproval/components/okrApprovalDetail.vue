<template>
  <div class="okr-approval-detail">
    <dl class="dl-card-panel">
      <dt class="card-title">
        <em>基本信息</em>
        <i class="el-icon-arrow-left"></i>
        <a @click="backList">返回</a>
      </dt>
      <dd>
        <em>{{ data.periodName }}</em>
      </dd>
      <dd>
        <dl class="dl-item">
          <dt>
            <i class="el-icon-user"></i>
            <span>提交人</span>
          </dt>
          <dd>
            <em>{{ data.userName }}</em>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt>
            <i class="el-icon-s-operation"></i>
            <span>审批类型</span>
          </dt>
          <dd>
            <em>{{ CONST.APPROVAL_TYPE_MAP[data.approvalType] }}</em>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt>
            <i class="el-icon-user"></i>
            <span>当前审批者</span>
          </dt>
          <dd>
            <em>{{ data.approveUserName }}</em>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt>
            <i class="el-icon-odometer"></i>
            <span>进度</span>
          </dt>
          <dd>
            <el-progress
              v-if="data.approvalType == '1'"
              type="circle"
              :percentage="data.okrProgress"
              :width="60"
              :stroke-width="5"
              color="#4ccd79"
              class="tl-progress-circle"
            ></el-progress>
            <span v-else>暂无</span>
          </dd>
        </dl>
      </dd>
    </dl>
    <dl class="dl-card-panel" v-if="okrApprovalStep == '2'">
      <dt>
        <em>OKR信息</em>
      </dt>
      <dd>
        <tl-okrItem
          v-if="data.approvalType == '1'"
          :tableList="tableList"
        ></tl-okrItem>
        <tl-create-okrComponent
          v-if="data.approvalType == '0'"
          :tableList="tableList"
        ></tl-create-okrComponent>
      </dd>
    </dl>

    <!-- 变更原因 -->
    <dl class="dl-card-panel" v-if="data.approvalType == '1'">
      <dt>
        <em>变更原因</em>
      </dt>
      <dd>{{ JSON.parse(data.paramJson).modifyReason }}</dd>
    </dl>
    <!-- 附件 -->
    <dl class="dl-card-panel upload-list" v-if="data.approvalType == '1'">
      <dt>
        <em>附件</em>
      </dt>
      <dd v-for="file in okrData.attachmentList" :key="file.resourceId">
        <em>{{ file.resourceName }}</em>
        <span>
          <span
            v-if="CONST.IMAGES_MAP[cutType(file.resourceName)]"
            @click="openFile(file)"
            >预览</span
          >
          <span @click="downFile(file)">下载</span>
        </span>
      </dd>
    </dl>
    <dl
      class="dl-card-panel"
      v-if="hasApproval || canApproval"
    >
      <dt>
        <em>审批</em>
      </dt>
      <dd>
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          label-width="100px"
          class="el-form"
        >
          <el-form-item label="审批结果" prop="approvalStatus">
            <el-radio-group
              v-model.trim="ruleForm.approvalStatus"
              class="tl-radio-group"
            >
              <el-radio label="1" class="tl-radio">通过</el-radio>
              <el-radio label="2" class="tl-radio">退回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.approvalStatus == '2'"
            label="审批意见"
            prop="refuseInfo"
            :rules="[
              {
                required: ruleForm.approvalStatus == '2',
                message: '请输入审批意见',
              },
            ]"
          >
            <el-input
              type="textarea"
              placeholder="请输入审批意见，不超过100个字符"
              v-model.trim="ruleForm.refuseInfo"
              :maxlength="100"
              class="tl-textarea"
              :rows="3"
              resize="none"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              @click="submitForm('ruleForm')"
              class="tl-btn amt-bg-slip"
              >确认</el-button
            >
            <el-button
              plain
              @click="resetForm('ruleForm')"
              class="tl-btn amt-border-fadeout"
              >取消</el-button
            >
          </el-form-item>
        </el-form>
      </dd>
    </dl>
    <dl class="dl-card-panel" v-if="hasPower('okr-approval-history-query')">
      <dt>
        <em>审批记录</em>
      </dt>
      <dd>
        <div class="tl-custom-timeline">
          <dl class="timeline-list">
            <dt>
              <div class="list-info">
                <div class="list-title">{{ cycleFirst.createTime }}</div>
                <div class="list-cont">
                  <div class="operate-type">
                    <em>{{ cycleFirst.userName }}</em>
                    <span v-if="cycleFirst.remark">{{
                      `「${
                        CONST.APPROVAL_HISTROY_MAP[cycleFirst.approvalStatus]
                      }」`
                    }}</span>
                    <template v-if="cycleFirst.reason">
                      <!--  -->
                      <span
                        v-if="[0, 4, 5, 6].includes(cycleFirst.approvalStatus)"
                        >变更原因</span
                      >
                      <span v-else-if="cycleFirst.approvalStatus === 3"
                        >撤回原因</span
                      >
                      <span v-else>审批意见</span>
                    </template>
                    <em v-if="cycleFirst.reason">{{
                      `「${cycleFirst.reason}」`
                    }}</em>
                  </div>
                </div>
              </div>
            </dt>
            <dd v-for="item in cycleList" :key="item.id">
              <div class="list-info">
                <div class="list-title">{{ item.createTime }}</div>
                <div class="list-cont">
                  <div class="operate-type">
                    <em>{{ item.userName }}</em>
                    <span v-if="item.remark">{{
                      `「${CONST.APPROVAL_HISTROY_MAP[item.approvalStatus]}」`
                    }}</span>
                    <template v-if="item.reason">
                      <span v-if="item.approvalStatus === 0">变更原因</span>
                      <span v-else-if="item.approvalStatus === 3"
                        >撤回原因
                      </span>
                      <span v-else>审批意见</span>
                    </template>
                    <em v-if="item.reason">{{ `「${item.reason}」` }}</em>
                  </div>
                </div>
              </div>
            </dd>
          </dl>
        </div>
      </dd>
    </dl>
    <img-dialog ref="imgDialog" width="75%" top="5vh"></img-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import imgDialog from '@/components/imgDialog';
// import okrCollapse from '@/components/okrCollapse';
import CONST from '@/lib/const';
import okrItem from './okrItem';
import createOkrComponent from './createOkrComponent';
import Server from '../server';

const server = new Server();

export default {
  name: 'okrApprovalDetail',
  data() {
    return {
      server,
      CONST,
      okrId: '',
      data: {},
      tableList: [],
      okrData: { attachmentList: [] },
      loading: false,
      ruleForm: {
        approvalStatus: '1',
        refuseInfo: '',
      },
      cycleList: [],
      cycleFirst: {},
    };
  },
  components: {
    'tl-okrItem': okrItem,
    'tl-create-okrComponent': createOkrComponent,
    'img-dialog': imgDialog,
  },
  props: {
    canApproval: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState('common', {
      okrApprovalDetail: (state) => state.okrApprovalDetail,
      okrApprovalStep: (state) => state.okrApprovalStep,
      roleCode: (state) => state.roleCode,
    }),
    hasApproval() {
      if (this.roleCode.includes('TENANT_ADMIN') && this.data.approvalStatus === 5) {
        return true;
      }
      if (this.roleCode.includes('ORG_ADMIN')) {
        if (this.data.approvalStatus === 4 && this.data.ownerFlag) {
          return true;
        }
        if (this.data.approvalStatus === 6 && !this.data.ownerFlag && !this.roleCode.includes('TENANT_ADMIN')) {
          return true;
        }
        if (this.data.okrBelongType === 2 && this.data.approvalStatus === 4) {
          return true;
        }
        return false;
      }
      return false;
    },
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['setOkrApprovalStep']),
    // 审批
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.server.approval({
            approvalId: this.data.approvalId,
            approvalStatus: this.ruleForm.approvalStatus,
            refuseInfo: this.ruleForm.refuseInfo,
            approvalType: this.data.approvalType,
          }).then((res) => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.ruleForm.approvalStatus = '1';
              this.ruleForm.refuseInfo = '';
              this.setOkrApprovalStep('1');
            } else if (res.code == 30000) {
              this.$xwarning({
                title: 'OKR已被提交人撤回！',
                content: `撤回原因：${res.msg}`,
              }).then(() => {
                this.ruleForm.approvalStatus = '1';
                this.ruleForm.refuseInfo = '';
                this.setOkrApprovalStep('1');
              });
            }
            this.loading = false;
          });
        }
      });
    },
    okrOperationHistory() {
      if (this.hasPower('okr-approval-history-query')) {
        this.server.okrOperationHistory({
          okrMainId: this.data.okrMainId,
        // approvalId: this.data.approvalId,
        }).then((res) => {
          if (res.code == 200) {
            this.cycleList = res.data;
            this.cycleList.forEach((item) => {
              if (item.remark) {
                const contents = JSON.parse(item.remark);
                item.approvalStatus = contents.approvalStatus;
              } else { item.approvalStatus = 0; }
            });
            this.cycleFirst = this.cycleList.splice(0, 1)[0] || {};
            console.log(this.cycleFirst);
            console.log(this.cycleList);
          }
        });
      }
    },
    backList() {
      this.setOkrApprovalStep('1');
    },
    // 取消
    resetForm() {
      this.ruleForm.approvalStatus = '1';
      this.ruleForm.refuseInfo = '';
      this.setOkrApprovalStep('1');
    },
    // -------------文件-------------
    // 截取文件类型
    cutType(name) {
      console.log(name);
      if (name && name.indexOf('.') > -1) {
        return name.split('.')[1];
      } return '';
    },
    // 预览
    openFile(fileObj) {
      this.$refs.imgDialog.show(fileObj.resourceUrl);
    },
    // 下载
    downFile(fileObj) {
      console.log(this.data);
      const origin = window.location.origin
        ? window.location.origin
        : window.location.href.split('/#')[0];
      const url = `${origin}/gateway/system-service/sys/attachment/outside/download?resourceId=${fileObj.resourceId}&sourceType=OKRMODIFY&sourceKey=`;
      window.open(url);
    },
  },
  watch: {
    okrApprovalDetail: {
      handler(newVal) {
        if (newVal) {
          this.ruleForm.approvalStatus = '1';
          this.ruleForm.refuseInfo = '';
          this.data = JSON.parse(newVal);
          if (this.data.approvalType == '0' && this.data.paramJson) {
            this.okrData = JSON.parse(this.data.paramJson);
            this.tableList = this.okrData.okrInfoList;
          } else if (this.data.approvalType == '1' && this.data.updateJson) {
            this.okrData = JSON.parse(this.data.paramJson);
            this.tableList = JSON.parse(this.data.updateJson);
          } else {
            this.okrData = {};
            this.tableList = [];
          }
          console.log(this.tableList);
          this.okrOperationHistory();
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>