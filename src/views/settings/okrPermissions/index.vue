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
            <span>是否可编辑</span>
          </dt>
          <dd>
            <el-radio v-model="radio['O-1']" label="O" class="tl-radio">开启 ( 开启后OKR在审核后可再次编辑 )</el-radio>
            <el-radio v-model="radio['O-1']" label="S" class="tl-radio">关闭 ( 开启后OKR在审核后不可再次编辑 )</el-radio>
          </dd>
          <dt>
            <em>OKR</em>
            <span>制定个人OKR</span>
          </dt>
          <dd>
            <el-radio v-model="radio['O-2']" label="O" class="tl-radio">开启 ( 开启后员工可制定个人OKR )</el-radio>
            <el-radio v-model="radio['O-2']" label="S" class="tl-radio">关闭 ( 关闭后员工不可制定个人OK )</el-radio>
          </dd>
          <dt>
            <em>OKR</em>
            <span>制定团队OKR</span>
          </dt>
          <dd>
            <el-radio v-model="radio['O-3']" label="O" class="tl-radio">开启 ( 开启后部门负责人可制定部门OKR )</el-radio>
            <el-radio v-model="radio['O-3']" label="S" class="tl-radio">关闭 ( 关闭后部门负责人不可制定部门OKR )</el-radio>
          </dd>
        </dl>
        <el-form ref="form" label-width="110px">
          <dt>
            <span>公司ＯＫＲ（根组织ＯＫＲ）审批人设置</span>
          </dt>
          <el-form-item label="设置审批人：" :inline="true">
            <el-input
              v-model="spUser.userName"
              :disabled="true"
              placeholder="请设置公司OKR（根组织OKR）审批人"
              style="width:350px"
              class="tl-input"
            ></el-input>
            <el-button type="primary" class="tl-btn amt-bg-slip" @click="okrspUserexist=true">设置</el-button>
          </el-form-item>
          <dt>
            <span>公司ＯＫＲ（根组织ＯＫＲ）考核人设置</span>
          </dt>
          <el-form-item label="设置审批人：" :inline="true" prop>
            <el-input
              v-model="khUser.userName"
              :disabled="true"
              placeholder="请设置公司OKR（根组织OKR）审批人"
              style="width:350px"
              class="tl-input"
            ></el-input>
            <el-button type="primary" class="tl-btn amt-bg-slip" @click="okrkhUserexist=true">设置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="operating-box">
        <el-button
          type="primary"
          :disabled="BtnDisabled"
          @click="getSave"
          class="tl-btn amt-bg-slip"
        >保存更改</el-button>
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
      okrspUser: '',
      ruleForm: {},
      server,
      radio: {
        'O-1': 'O',
        'O-2': 'O',
        'O-3': 'O',
      },
      setList: [{
        configItemCode: 'O',
        configType: 'OKR',
        configTypeDetail: 'O-1',
        level: 'T',
      },
      {
        configItemCode: 'O',
        configType: 'OKR',
        configTypeDetail: 'O-2',
        level: 'T',
      }, {
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
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  created() {
    this.getOkrCycle();
    this.rootOrgQuery();
  },
  methods: {
    getPressUser(data) {
      this.spUser.userName = data[0].userName;
      this.spUser.userId = data[0].userId;
      this.okrspUserexist = false;
    },
    getAssessUser(data) {
      this.khUser.userName = data[0].userName;
      this.khUser.userId = data[0].userId;
      this.okrkhUserexist = false;
    },
    getOkrCycle() {
      this.server.configQuery({
        configType: 'OKR',
        level: 'T',
        sourceId: this.userInfo.tenantId,
      })
        .then((res) => {
          this.selectList = res.data;
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
    getSave() {
      if (this.spUser.userName == '' || this.khUser.userName == '') {
        this.$message.error('请设置审批人与考核人');
        return false;
      }
      const sysConfigDtos = this.setList.map((item) => ({
        level: 'T',
        configType: 'OKR',
        tenantId: this.userInfo.tenantId,
        configTypeDetail: item.configTypeDetail,
        configId: item.configId || '',
        configItemCode: this.radio[item.configTypeDetail],
      }));
      this.server.addOrUpdate(
        sysConfigDtos,
      ).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
      this.rootOrgSave();
    },
    rootOrgQuery() {
      this.server.rootOrgQuery().then((res) => {
        if (res.code == 200) {
          if (res.data.length > 0) {
            // eslint-disable-next-line prefer-destructuring
            this.spUser = res.data.filter((item) => item.type == '0')[0];
            // eslint-disable-next-line prefer-destructuring
            this.khUser = res.data.filter((item) => item.type == '1')[0];
          }
        }
      });
    },
    rootOrgSave() {
      const setUser = [this.spUser, this.khUser];
      this.server.rootOrgSave(setUser).then((res) => {
        console.log(res);
      });
    },
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
    'spUser.userInfo': {
      handler() {
        this.BtnDisabled = false;
      },
      deep: true,
    },
  },
};
</script>