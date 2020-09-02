<template>
  <div class="okr-permissions">
    <div class="operating-area">
      <div class="page-title">个人设置</div>
      <div class="operating-panel"></div>
    </div>
    <div class="cont-area">
      <div class="cont-panel">
        <dl class="dl-list">
          <dt>
            <span>接受待办消息</span>
            <span style="font-size: 12px;color: #999;margin-left: 20px;">别人@我、@部门、@公告和回复我的消息</span>
          </dt>
          <dd>
            <el-radio v-model="receiveEmail" label="O" class="tl-radio">开启邮件通知</el-radio>
            <el-radio v-model="receiveEmail" label="S" class="tl-radio">关闭邮件通知</el-radio>
          </dd>
        </dl>
        <dl class="dl-list">
          <dt>
            <span>接收公告消息</span>
            <span style="font-size: 12px;color: #999;margin-left: 20px;">系统内发布的公告消息</span>
          </dt>
          <dd>
            <el-radio v-model="receiveSystem" label="O" class="tl-radio">开启邮件通知</el-radio>
            <el-radio v-model="receiveSystem" label="S" class="tl-radio">关闭邮件通知</el-radio>
          </dd>
        </dl>
      </div>
      <div class="operating-panel">
        <el-button
          type="primary"
          :disabled="BtnDisabled"
          @click="getSave"
          class="tl-btn amt-bg-slip"
        >保存更改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Server from './server';

const server = new Server();
export default {
  name: 'personConfig',
  data() {
    return {
      ruleForm: {},
      server,
      receiveEmail: 'O',
      emailCode: '',
      receiveSystem: 'O',
      systemCode: '',
      BtnDisabled: false,
      paramsList: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.server.queryConfig({
        configType: 'PERSON',
        level: 'U',
      }).then((res) => {
        if (res.code == '200') {
          res.data.forEach((item) => {
            if (item.configTypeDetail == 'P-1') {
              this.receiveEmail = item.configItemCode;
              this.emailCode = item.configId;
            } else if (item.configTypeDetail == 'P-2') {
              this.receiveSystem = item.configItemCode;
              this.systemCode = item.configId;
            }
          });
        }
      });
    },
    getSave() {
      this.paramsList = [];
      this.paramsList.push({
        configId: this.emailCode,
        configItemCode: this.receiveEmail,
      });
      this.paramsList.push({
        configId: this.systemCode,
        configItemCode: this.receiveSystem,
      });
      this.server.addOrUpdate(this.paramsList).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
  watch: {},
};
</script>