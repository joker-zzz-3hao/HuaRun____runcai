<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    :before-close="close"
    :close-on-click-modal="false"
    custom-class="add-members"
    title="请完善项目经理信息，否则无法维护项目成员"
    class="tl-dialog"
  >
    <el-form
      ref="projectForm"
      :model="formData"
      label-width="100px"
      :rules="rules"
      class="tl-form"
    >
      <el-form-item label="项目经理" required>
        <el-col :span="8">
          <el-form-item prop="projectManager">
            <el-select
              v-model="formData.projectManager"
              placeholder="请选择"
              filterable
              popper-class="select-dialog"
              class="tl-select"
              :disabled="formData.projectManager != ''"
            >
              <el-option
                v-for="(item, index) in projectManagerList"
                :key="index + item.userAccount"
                :label="item.userName"
                :value="item.userAccount"
              >
                <dl class="user-info">
                  <dd>{{ item.userName }}</dd>
                  <dd>{{ item.orgName }}</dd>
                </dl>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="7">
          <el-form-item prop="userCompany" label="所属公司">
            <el-select
              v-model="formData.userCompany"
              placeholder="请选择所属公司"
              popper-class="select-dialog"
              class="tl-select"
            >
              <el-option
                v-for="item in companyList"
                :key="item.value"
                :label="item.meaning"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="7">
          <el-form-item prop="userLevel" label="级别">
            <el-select
              v-model="formData.userLevel"
              placeholder="请选择级别"
              popper-class="select-dialog"
              class="tl-select"
            >
              <el-option
                v-for="item in levelList"
                :key="item.value"
                :label="item.meaning"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
    <div class="operating-box">
      <el-button
        :loading="commitLoading"
        type="primary"
        @click="checkManager"
        class="tl-btn amt-bg-slip"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import CONST from '../../const';

export default {
  name: 'checkManager',
  data() {
    return {
      CONST,
      visible: false,
      loading: false,
      commitLoading: false,
      levelList: [],
      codes: [],
      funcList: [],
      companyList: [],
      projectManagerList: [],
      formData: {
        projectManager: '',
        userCompany: '',
        userLevel: '',
      },
      rules: {
        projectManager: [
          { required: true, message: '请选择项目经理', trigger: 'change' },
        ],
        userCompany: [
          { required: true, message: '请选择所属公司', trigger: 'change' },
        ],
        userLevel: [
          { required: true, message: '请选择级别', trigger: 'change' },
        ],
      },
    };
  },
  components: {
  },
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
    baseInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {},
  mounted() {
    this.server.projectUserList({}).then((res) => {
      if (res.code == '200') {
        this.projectManagerList = res.data || [];
        this.formData.projectManager = this.baseInfo.projectManagerCode || '';
      }
    });
    this.server.queryByCodes({
      codes: ['PROJECT_TECH_TYPE', 'PROJECT_EMPLOYEE_LEVEL', 'PROJECT_EMPLOYEE_COMPANY'],
    }).then((res) => {
      if (res.code == '200') {
        this.codes = res.data;
        this.getCodes();
      }
    });
  },
  methods: {
    getCodes() {
      this.codes.forEach((item) => {
        switch (item.code) {
          case 'PROJECT_EMPLOYEE_LEVEL':
            this.levelList = item.subList;
            break;
          case 'PROJECT_TECH_TYPE':
            this.funcList = item.subList;
            break;
          case 'PROJECT_EMPLOYEE_COMPANY':
            this.companyList = item.subList;
            break;
          default:
            break;
        }
      });
    },
    show() {
      this.visible = true;
    },
    checkManager() {
      const self = this;
      self.$refs.projectForm.validate((valid) => {
        if (valid) {
          const params = [];
          const projectManagerObj = self.projectManagerList.filter(
            (item) => item.userAccount == self.formData.projectManager,
          ) || [];
          params.push({
            orgName: projectManagerObj.length > 0 ? projectManagerObj[0].orgName : '',
            projectId: self.$route.query.projectId || '',
            userAccount: projectManagerObj.length > 0 ? projectManagerObj[0].userAccount : '',
            userLevel: self.formData.userLevel,
            userName: projectManagerObj.length > 0 ? projectManagerObj[0].userName : '',
            userPost: '项目经理',
            userCompany: self.formData.userCompany,
            projectUserType: '1',
          });
          self.commitLoading = true;
          self.server.addProjectUser(params).then((res) => {
            self.commitLoading = false;
            if (res.code == '200') {
              self.$emit('checkSuccess');
              self.visible = false;
            }
          });
        }
      });
    },
    close() {
      this.$router.push({
        name: 'projectManage',
      });
      this.visible = false;
    },
    closed() {
      this.visible = false;
    },
  },
  watch: {
    'baseInfo.projectManagerCode': {
      handler(val) {
        if (this.hasValue(val)) {
          this.formData.projectManager = val;
          this.baseInfo.projectUserVoList.forEach((item) => {
            if (item.userAccount == val) {
              this.formData.userLevel = item.userLevel;
              this.formData.userCompany = item.userCompany;
            }
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>