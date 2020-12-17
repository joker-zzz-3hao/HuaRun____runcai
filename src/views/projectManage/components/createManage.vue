<template>
  <el-dialog
    title="创建虚拟项目"
    :visible="visible"
    @closed="close"
    :before-close="close"
    :append-to-body="true"
    :close-on-click-modal="false"
    custom-class="custom-dialog creat-project"
    class="tl-dialog"
  >
    <el-form
      ref="projectForm"
      :model="formData"
      label-width="110px"
      :rules="rules"
      class="tl-form"
    >
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model.trim="formData.projectName"
          maxlength="20"
          clearable
          class="tl-input"
        ></el-input>
      </el-form-item>
      <el-form-item label="项目描述" prop="projectDesc">
        <el-input
          v-model.trim="formData.projectDesc"
          maxlength="200"
          type="textarea"
          clearable
          class="tl-textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="申请部门" prop="orgIdList">
        <el-cascader
          ref="cascader"
          v-model="formData.orgIdList"
          :options="departmentData"
          :show-all-levels="false"
          :props="{
            checkStrictly: true,
            value: 'orgId',
            label: 'orgName',
            children: 'children',
          }"
          @change="selectIdChange"
          popper-class="tl-cascader-popper"
          class="tl-cascader"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="项目经理" required>
        <el-col :span="8">
          <el-form-item prop="projectManager">
            <el-select
              v-model="formData.projectManager"
              placeholder="请选择"
              filterable
              popper-class="select-dialog"
              class="tl-select"
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
          <el-form-item prop="userCompany">
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
          <el-form-item prop="userLevel">
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
      <el-form-item label="项目类型" prop="projectType">
        <el-select
          v-model="formData.projectType"
          placeholder="请选择项目类型"
          popper-class="select-dialog"
          class="tl-select"
        >
          <el-option
            v-for="item in CONST.PROJECT_TYPE_CREATE_LIST"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投入类型" prop="throwType">
        <el-select
          v-model="formData.throwType"
          placeholder="请选择投入类型"
          popper-class="select-dialog"
          class="tl-select"
        >
          <el-option
            v-for="item in CONST.THROW_TYPE_CREATE_LIST"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内部顾问预算" prop="insideBudget" >
        <el-input-number
          v-model="formData.insideBudget"
          controls-position="right"
          :min="0"
          :max="50000000"
          class="tl-input-number"
        ></el-input-number>
        <span>元</span>

        <el-select
          v-model="formData.currency"
          placeholder="请选择币种"
          popper-class="select-dialog"
          class="tl-select"
        >
          <el-option
            v-for="item in CONST.CURRENCY_LIST"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="外部顾问预算" prop="outerConsultBudget">
        <el-input-number
          v-model="formData.outerConsultBudget"
          controls-position="right"
          :min="0"
          :max="50000000"
          class="tl-input-number"
        ></el-input-number>
        <span>元</span>

        <el-select
          v-model="formData.currency"
          placeholder="请选择币种"
          popper-class="select-dialog"
          class="tl-select"
        >
          <el-option
            v-for="item in CONST.CURRENCY_LIST"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目周期" prop="projectDate">
        <el-date-picker
          v-model="formData.projectDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="changeDate"
          popper-class="tl-range-popper"
          class="tl-range-editor"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        :loading="loading"
        type="primary"
        @click="createManage"
        class="tl-btn amt-bg-slip"
        >确定</el-button
      >
      <el-button
        :disabled="loading"
        plain
        @click="close"
        class="tl-btn amt-border-fadeout"
        >取消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import validateMixin from '@/mixin/validateMixin';
import CONST from '../const';

export default {
  name: 'createManage',
  data() {
    return {
      CONST,
      visible: false,
      loading: false,
      formData: {
        projectName: '',
        projectDesc: '',
        projectManager: '',
        userCompany: '',
        insideBudget: 0,
        outerConsultBudget: 0,
        currency: '1',
        projectDate: [],
        userLevel: '',
        startDate: '',
        endDate: '',
        orgIdList: [],
      },
      projectManagerList: [],
      projectTypeList: [],
      levelList: [],
      funcList: [],
      companyList: [],
      departmentData: [],
      rules: {
        projectName: [
          {
            validator: this.validateProjectName, required: true, message: '请输入项目名称', trigger: 'blur',
          },
        ],
        projectDesc: [
          { required: true, message: '请输入项目描述', trigger: 'blur' },
        ],
        projectManager: [
          { required: true, message: '请选择项目经理', trigger: 'change' },
        ],
        userCompany: [
          { required: true, message: '请选择所属公司', trigger: 'change' },
        ],
        userLevel: [
          { required: true, message: '请选择级别', trigger: 'change' },
        ],
        projectType: [
          { required: true, message: '请选择项目类型', trigger: 'change' },
        ],
        throwType: [
          { required: true, message: '请选择投入类型', trigger: 'change' },
        ],

        insideBudget: [
          { required: true, message: '请选择内部顾问预算', trigger: 'change' },
        ],
        outerConsultBudget: [
          { required: true, message: '请选择外部顾问预算', trigger: 'change' },
        ],
        projectDate: [
          { required: true, message: '请选择项目周期', trigger: 'change' },
        ],
        orgIdList: [
          { required: true, message: '请选择申请部门', trigger: 'change' },
        ],
      },
    };
  },
  mixins: [validateMixin],
  components: {},
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
    codes: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {},
  mounted() {
    this.getProjectOrg();
    this.getUserList();
  },
  methods: {
    show() {
      this.visible = true;
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
    getUserList() {
      this.server.projectUserList({}).then((res) => {
        if (res.code == '200') {
          this.projectManagerList = res.data;
        }
      });
    },
    createManage() {
      this.$refs.projectForm.validate((valid) => {
        if (valid) {
          const projectManagerObj = this.projectManagerList.filter(
            (item) => item.userId == this.formData.projectManager,
          ) || [];
          const throwTypeObj = this.CONST.THROW_TYPE_LIST.filter(
            (item) => item.value == this.formData.throwType,
          ) || [];
          const projectTypeObj = this.CONST.PROJECT_TYPE_LIST.filter(
            (item) => item.value == this.formData.projectType,
          ) || [];
          const currencyObj = this.CONST.CURRENCY_LIST.filter(
            (item) => item.value == this.formData.currency,
          ) || [];
          this.loading = true;
          this.server.createProject({
            projectNameCn: this.formData.projectName,
            projectDescription: this.formData.projectDesc,
            projectManagerCode: this.formData.projectManager,
            projectManager: projectManagerObj.length > 0 ? projectManagerObj[0].userName : this.formData.projectManager,
            projectType: projectTypeObj.length > 0 ? projectTypeObj[0].label : this.formData.projectType,
            projectTypeCode: this.formData.projectType,
            projectInputType: throwTypeObj.length > 0 ? throwTypeObj[0].label : this.formData.throwType,
            projectInputTypeCode: this.formData.throwType,
            projectBudget: this.formData.totalBudget,
            projectCurrency: currencyObj.length > 0 ? currencyObj[0].label : this.formData.currency,
            projectCurrencyCode: this.formData.currency,
            projectBeginDate: this.formData.startDate,
            projectEndDate: this.formData.endDate,
            userLevel: this.formData.userLevel,
            userCompany: this.formData.userCompany,
            projectApplyDepCode: this.formData.orgIdList.length > 0 ? this.formData.orgIdList[this.formData.orgIdList.length - 1] : '',
          }).then((res) => {
            this.loading = false;
            if (res.code == '200') {
              this.$emit('success');
              this.visible = false;
            }
          });
        }
      });
    },
    close() {
      this.visible = false;
    },
    cancel() {
      this.close();
    },
    changeDate(data) {
      if (data && data.length > 0) {
        this.formData.startDate = data[0] || '';
        this.formData.endDate = data[1] || '';
      }
    },
    selectIdChange(data) {
      console.log(data);
      console.log(this.formData.orgIdList);
      this.$refs.cascader.dropDownVisible = false;
    },
    getProjectOrg() {
      this.server.getOrgTable().then((res) => {
        if (res.code == '200') {
          if (res.data) {
            this.departmentData = [];
            this.departmentData.push(res.data);
            this.orgFullId = this.departmentData[0].orgFullId;
          }
        }
      });
    },
  },
  watch: {},
};
</script>