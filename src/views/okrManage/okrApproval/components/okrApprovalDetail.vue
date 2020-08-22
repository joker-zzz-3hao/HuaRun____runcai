<template>
  <div>
    <div>
      <span @click="backList">返回</span>
    </div>
    <div style="margin-top: 20px;">
      <p>基本信息</p>
      <div style="display: flex;margin-top: 20px;justify-content:space-between;">
        <div>
          <span>姓名：</span>
          <span>{{data.userName}}</span>
        </div>
        <div>
          <span>直接审批者：</span>
          <span>{{data.approveUser}}</span>
        </div>
        <div>
          <span>OKR周期：</span>
          <span>{{data.periodName}}</span>
        </div>
        <div>
          <span>OKR类型：</span>
          <span>{{CONST.APPROVAL_TYPE_MAP[data.approvalType]}}</span>
        </div>
        <div style="display:flex;">
          <div>OKR进度：</div>
          <div>
            <el-progress type="circle" :percentage="data.okrProgress"></el-progress>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top: 20px;">
      <p>OKR信息信息</p>
      <tl-okr-collapse :tableList="tableList"></tl-okr-collapse>
      <el-card class="box-card">
        <!-- <tl-okrItem :tableList="tableList"></tl-okrItem> -->
      </el-card>
    </div>
    <div v-if="data.approvalStatus =='0'" style="margin-top: 20px;">
      <p>审核</p>
      <div>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="审核结果" prop="approvalStatus">
            <el-radio-group v-model.trim="ruleForm.approvalStatus">
              <el-radio label="1">通过</el-radio>
              <el-radio label="2">退回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见" prop="refuseInfo">
            <el-input
              type="textarea"
              placeholder="请输入退回原因，不超过100个字符"
              v-model.trim="ruleForm.refuseInfo"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">确认</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div style="margin-top: 20px;">
      <p>审核记录</p>
      <el-timeline>
        <el-timeline-item
          :timestamp="item.createTime"
          placement="top"
          v-for="item in cycleList"
          :key="item.id"
        >
          <div style="display: flex;">
            <div>
              <div
                v-if="item.remark && JSON.parse(item.remark).approvalStatus == '0'"
              >{{JSON.parse(item.remark).createName}}</div>
              <div v-else>{{JSON.parse(item.remark).approveName}}</div>
            </div>
            <div
              v-if="item.remark"
            >{{`「${CONST.APPROVAL_HISTROY_MAP[JSON.parse(item.remark).approvalStatus]}」`}}</div>
            <div v-if="item.remark && JSON.parse(item.remark).approvalStatus == '2'">意见</div>
            <div
              v-if="item.remark && JSON.parse(item.remark).approvalStatus == '2'"
            >{{`「${item.content}」`}}</div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import okrCollapse from '@/components/okrCollapse';
import CONST from '@/lib/const';
// import okrItem from './okrItem';
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
      loading: false,
      ruleForm: {
        approvalStatus: '1',
        refuseInfo: '',
      },
      cycleList: [],
    };
  },
  components: {
    // 'tl-okrItem': okrItem,
    'tl-okr-collapse': okrCollapse,
  },
  props: {},
  computed: {
    ...mapState('common', {
      okrApprovalDetail: (state) => state.okrApprovalDetail,
    }),
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['setOkrApprovalStep']),
    // 审批
    submitForm() {
      this.loading = true;
      this.server.approval({
        approvalId: this.data.approvalId,
        approvalStatus: this.ruleForm.approvalStatus,
        refuseInfo: this.ruleForm.refuseInfo,
        approvalType: '0',
      }).then((res) => {
        if (res.code == '200') {
          this.$message.success(res.msg);
          this.setOkrApprovalStep('1');
        }
        this.loading = false;
      });
    },
    okrOperationHistory() {
      this.server.okrOperationHistory({
        // attachId: this.data.approvalId,
        attachId: '1204662838228131841',
      }).then((res) => {
        if (res.code == '200') {
          this.cycleList = res.data.content;
        }
      });
    },
    backList() {
      this.setOkrApprovalStep('1');
    },
  },
  watch: {
    okrApprovalDetail: {
      handler(newVal) {
        if (newVal) {
          this.data = JSON.parse(newVal);
          if (this.data.paramJson) {
            this.okrData = JSON.parse(this.data.paramJson);
            this.tableList = this.okrData.okrInfoList;
          } else {
            this.okrData = {};
            this.tableList = [];
          }
          console.log(111);
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