<template>
  <div>
    <div>
      <span @click="backList">返回</span>
    </div>
    <div>
      <p>基本信息</p>
      <div style="display: flex;">
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
        <div>
          <span>OKR进度：</span>
          <span>{{data.okrProgress}}%</span>
        </div>
      </div>
    </div>
    <div>
      <p>OKR信息信息</p>
      <tl-okrCollapse :tableList="tableList" :showOKRInfoLabel="true" :showParentOkr="false"></tl-okrCollapse>
    </div>
    <div v-if="data.approvalStatus =='0'">
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
    <div>
      <p>审核记录</p>
      <tl-timeLine :cycleList="cycleList"></tl-timeLine>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import okrCollapse from '@/components/okrCollapse';
import timeLine from '@/components/timeLine';
import CONST from '@/lib/const';
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
      cycleList: [{
        date: '2020-08-01',
        time: '16:14',
        name: '张三',
        statusName: '通过',
        content: '内内容内容内容内容内容内容内容内容容',
      }, {
        date: '2020-08-01',
        time: '16:14',
        name: '张三',
        statusName: '通过',
        content: '内内容内容内容内容内容内容内容内容容',
      }, {
        date: '2020-08-01',
        time: '16:14',
        name: '张三',
        statusName: '通过',
        content: '内内容内容内容内容内容内容内容内容容',
      }],
    };
  },
  components: {
    'tl-okrCollapse': okrCollapse,
    'tl-timeLine': timeLine,
  },
  props: {},
  computed: {
    ...mapState('common', {
      okrApprovalDetail: (state) => state.okrApprovalDetail,
    }),
    activeList() {
      return Array.from(new Array(this.tableList.length).keys());
    },
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
          console.log(this.data);
          console.log(this.okrData);
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>