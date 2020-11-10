<template>
  <div class="okr-permissions">
    <div class="operating-area">
      <div class="page-title">设置OKR</div>
      <div class="operating-box"></div>
    </div>
    <div class="cont-area">
      <div class="cont-panel">
        <dl class="dl-list">
          <dt>
            <em>OKR</em>
            <span>是否可变更</span>
          </dt>
          <dd>
            <el-radio
              @change="submitOKRChangeData"
              v-model="radio['O-1']"
              label="O"
              class="tl-radio"
              >是 ( 开启后OKR可申请变更 )</el-radio
            >
            <el-radio
              @change="submitOKRChangeData"
              v-model="radio['O-1']"
              label="S"
              class="tl-radio"
              >否 ( 开启后OKR不可以申请变更)</el-radio
            >
          </dd>
        </dl>
        <dl class="dl-list">
          <dt>
            <span>周报中支撑个人OKR或团队OKR</span>
          </dt>
          <dd>
            <el-radio
              @change="submitWeeklyData"
              v-model="radio['O-2']"
              label="O"
              class="tl-radio"
              >个人</el-radio
            >
            <el-radio
              @change="submitWeeklyData"
              v-model="radio['O-2']"
              label="S"
              class="tl-radio"
              >团队</el-radio
            >
          </dd>
        </dl>
        <dl class="dl-list">
          <dt>
            <span>综合岗是否可以审批OKR</span>
          </dt>
          <dd>
            <el-radio
              @change="submitSecretaryData"
              v-model="radio['O-3']"
              label="O"
              class="tl-radio"
              >是（开启后综合岗可以审批OKR）</el-radio
            >
            <el-radio
              @change="submitSecretaryData"
              v-model="radio['O-3']"
              label="S"
              class="tl-radio"
              >否（开启后综合岗不可以审批OKR）</el-radio
            >
          </dd>
        </dl>
        <dl class="dl-list">
          <el-form ref="form" label-width="130px" class="tl-form">
            <dt style="margin-bottom: 20px">
              <span>okr审阅人设置</span
              ><span class="check-tip">提示：审阅人在OKR汇总中可以审阅OKR</span>
            </dt>
            <el-form-item label="审阅人：">
              <el-input
                v-model="checkUserNameStr"
                :disabled="true"
                placeholder="请设置okr审阅人"
                style="width: 350px"
                class="tl-input"
              ></el-input>
              <el-button
                v-if="hasPower('tenant-okr-rootorg-user-save')"
                type="primary"
                style="margin-left: 20px"
                class="tl-btn amt-bg-slip"
                @click="okrCheckExist = true"
                >设置</el-button
              >
            </el-form-item>
          </el-form>
        </dl>
        <dl class="dl-list">
          <el-form ref="form" label-width="130px" class="tl-form">
            <dt style="margin-bottom: 20px">
              <span>公司OKR ( 根组织OKR ) 审批人设置</span>
            </dt>
            <el-form-item label="审批人：">
              <el-input
                v-model="approvalNameStr"
                :disabled="true"
                placeholder="请设置公司OKR（根组织OKR）审批人"
                style="width: 350px"
                class="tl-input"
              ></el-input>
              <el-button
                type="primary"
                style="margin-left: 20px"
                class="tl-btn amt-bg-slip"
                v-if="hasPower('tenant-okr-rootorg-user-save')"
                @click="okrspUserexist = true"
                >设置</el-button
              >
            </el-form-item>
          </el-form>
        </dl>
        <dl class="dl-list">
          <el-form ref="form" label-width="130px" class="tl-form">
            <dt style="margin-bottom: 20px">
              <span>公司OKR ( 根组织OKR ) 复盘沟通人设置</span>
            </dt>
            <el-form-item label="复盘沟通人：">
              <el-input
                v-model="talkNameStr"
                :disabled="true"
                placeholder="请设置公司OKR（根组织OKR）复盘沟通人"
                style="width: 350px"
                class="tl-input"
              ></el-input>
              <el-button
                v-if="hasPower('tenant-okr-rootorg-user-save')"
                type="primary"
                style="margin-left: 20px"
                class="tl-btn amt-bg-slip"
                @click="okrkhUserexist = true"
                >设置</el-button
              >
            </el-form-item>
          </el-form>
        </dl>
      </div>
    </div>
    <addMember
      v-if="okrspUserexist"
      :exist.sync="okrspUserexist"
      :title="'（根组织ＯＫＲ）审批人'"
      @submitFunctin="getPressUser"
    ></addMember>
    <addMember
      v-if="okrkhUserexist"
      :exist.sync="okrkhUserexist"
      :title="'（根组织ＯＫＲ）考核人'"
      @submitFunctin="getAssessUser"
    ></addMember>
    <!-- <tl-selectMembers
      v-if="okrCheckExist"
      :exist.sync="okrCheckExist"
      @submitFunctin="setCheckUserList"
    ></tl-selectMembers> -->
    <addMember
      v-if="okrCheckExist"
      :selectListed="selectedUserList"
      :exist.sync="okrCheckExist"
      @selectUserCheck="selectUserCheck"
      :userType="true"
      :disabledId="''"
      title="设置OKR审阅人"
      :rouleType="true"
      @submitFunctin="setCheckUserList"
    ></addMember>
  </div>
</template>

<script>
import addMember from '@/components/addMember';
import { mapState } from 'vuex';
import Server from './server';

const server = new Server();
export default {
  name: 'okrPermissions',
  components: {
    addMember,
  },
  data() {
    return {
      okrspUserexist: false,
      okrkhUserexist: false,
      okrCheckExist: false,
      okrspUser: '',
      ruleForm: {},
      server,
      radio: {
        'O-1': 'O',
        'O-2': 'O',
        'O-3': 'S',
      },
      setList: [{
        configItemCode: 'S',
        configType: 'OKR',
        configTypeDetail: 'O-1',
        level: 'T',
      },
      {
        configItemCode: 'O',
        configType: 'OKR',
        configTypeDetail: 'O-2',
        level: 'T',
      },
      {
        configItemCode: 'O',
        configType: 'OKR',
        configTypeDetail: 'O-3',
        level: 'T',
      }],
      sysConfigDtos: [],
      BtnDisabled: true,
      setOkrUser: '',
      okrkhUser: '',
      selectList: [],
      spUser: { type: '0', userName: '', userId: '' },
      khUser: { type: '1', userName: '', userId: '' },
      selectedUserList: [],
      checkUserList: [],
      approvalUserList: [],
      talkUserList: [],

    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
    checkUserNameStr() {
      let str = '';
      if (this.checkUserList.length < 1) {
        return;
      }
      this.checkUserList.forEach((element) => {
        str = `${str}${str ? '、' : ''}${element.userName}`;
      });
      return str;
    },
    approvalNameStr() {
      let str = '';
      if (this.approvalUserList.length < 1) {
        return;
      }
      this.approvalUserList.forEach((element) => {
        str = `${str}${str ? '、' : ''}${element.userName}`;
      });
      return str;
    },
    talkNameStr() {
      let str = '';
      if (this.talkUserList.length < 1) {
        return;
      }
      this.talkUserList.forEach((element) => {
        str = `${str}${str ? '、' : ''}${element.userName}`;
      });
      return str;
    },
  },
  created() {
    this.getOkrCycle();
    // this.rootOrgQuery();
  },
  methods: {
    getPressUser(data) {
      if (data.length == 0) {
        this.$message.error('审批人不能为空');
        return;
      }
      this.approvalUserList = data;
      this.spUser.userName = data[0].userName;
      this.spUser.userId = data[0].userId;
      this.okrspUserexist = false;
      let userIds = '';
      data.forEach((user) => {
        userIds = `${userIds}${userIds ? ',' : ''}${user.userId}`;
      });
      this.submitPersonData({
        configId: '',
        configItemCode: userIds,
        configType: 'OKR',
        configTypeDetail: 'O-5',
        level: 'T',

      });
    },
    getAssessUser(data) {
      if (data.length == 0) {
        this.$message.error('复盘沟通人不能为空');
        return;
      }
      this.talkUserList = data;
      this.khUser.userName = data[0].userName;
      this.khUser.userId = data[0].userId;
      this.okrkhUserexist = false;
      let userIds = '';
      data.forEach((user) => {
        userIds = `${userIds}${userIds ? ',' : ''}${user.userId}`;
      });
      this.submitPersonData({
        configId: '',
        configItemCode: userIds,
        configType: 'OKR',
        configTypeDetail: 'O-6',
        level: 'T',

      });
    },
    setCheckUserList(data) {
      if (data.length == 0) {
        this.$message.error('OKR审阅人不能为空');
        return;
      }
      this.checkUserList = data;
      this.okrCheckExist = false;
      let userIds = '';
      data.forEach((user) => {
        userIds = `${userIds}${userIds ? ',' : ''}${user.userId}`;
      });
      this.submitPersonData({
        configId: '',
        configItemCode: userIds,
        configType: 'OKR',
        configTypeDetail: 'O-4',
        level: 'T',
      });
    },
    getOkrCycle() {
      this.server.configQuery({
        configType: 'OKR',
        level: 'T',
        sourceId: this.userInfo.tenantId,
      })
        .then((res) => {
          this.selectList = res.data;
          this.selectList.forEach((element) => {
            switch (element.configTypeDetail) {
              case 'O-4':
                this.checkUserList = element.userList;
                break;
              case 'O-5':
                this.approvalUserList = element.userList;
                break;
              case 'O-6':
                this.talkUserList = element.userList;
                break;

              default:
                break;
            }
          });
          this.selectList.forEach((item) => {
            this.radio[item.configTypeDetail] = item.configItemCode;
            this.setList.forEach((li, i) => {
              if (li.configTypeDetail == item.configTypeDetail) {
                this.setList[i].configId = item.configId;
                this.setList[i].configItemCode = item.configItemCode;
              }
            });
          });
        });
    },
    // OKR是否可变更
    submitOKRChangeData() {
      this.submitRadioData({
        configItemCode: 'O',
        configType: 'OKR',
        configTypeDetail: 'O-1',
        level: 'T',
      });
    },
    // 周报配置
    submitWeeklyData() {
      this.submitRadioData({
        configItemCode: 'O',
        configType: 'OKR',
        configTypeDetail: 'O-2',
        level: 'T',
      });
    },
    // 综合岗是否可审批
    submitSecretaryData() {
      this.submitRadioData({
        configItemCode: 'O',
        configType: 'OKR',
        configTypeDetail: 'O-3',
        level: 'T',
      });
    },
    submitRadioData(item) {
      const sysConfigDtos = {
        level: 'T',
        configType: 'OKR',
        sourceId: this.userInfo.tenantId,
        configTypeDetail: item.configTypeDetail,
        configId: item.configId || '',
        configItemCode: this.radio[item.configTypeDetail],
      };
      this.server.addOrUpdate(
        sysConfigDtos,
      ).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    submitPersonData(item) {
      const sysConfigDtos = {
        level: 'T',
        configType: 'OKR',
        sourceId: this.userInfo.tenantId,
        configTypeDetail: item.configTypeDetail,
        configId: item.configId || '',
        configItemCode: item.configItemCode,
      };
      this.server.addOrUpdate(
        sysConfigDtos,
      ).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    selectUserCheck() {},
    setMember() {},
  },
  watch: {
    radio: {
      handler() {
        this.BtnDisabled = false;
      },
      deep: true,
    },
    'khUser.userId': {
      handler() {
        this.BtnDisabled = false;
      },
      deep: true,
    },
    'spUser.userId': {
      handler() {
        this.BtnDisabled = false;
      },
      deep: true,
    },
  },
};
</script>
<style lang="css">
.okr-permissions .dl-list .el-radio {
  border-bottom: 0ch;
  padding: 10px 0;
}
.okr-permissions .tl-radio {
  margin: 0;
}
.okr-permissions .dl-list {
  margin: 0 0 15px 0;
}
.okr-permissions .check-tip {
  font-size: 12px;
  color: #d0cbcb;
  margin-left: 10px;
}
</style>