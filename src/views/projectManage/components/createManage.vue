<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      @closed="closed"
      @close="closed"
      title="创建虚拟项目"
      :close-on-click-modal="false"
    >
      <el-form
        ref="projectForm"
        :model="formData"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model.trim="formData.projectName"
            maxlength="20"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="项目描述" prop="projectDesc">
          <el-input
            v-model.trim="formData.projectDesc"
            maxlength="200"
            type="textarea"
            clearable
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
          ></el-cascader>
        </el-form-item>
        <el-form-item label="项目经理" prop="projectManager">
          <el-select
            v-model="formData.projectManager"
            placeholder="请选择"
            filterable
            popper-class="tl-select-dropdown user-list"
            class="tl-select"
          >
            <el-option
              v-for="(item, index) in projectManagerList"
              :key="index + item.userAccount"
              :label="item.userName"
              :value="item.userAccount"
            >
              <dl class="user-info">
                <dt>
                  <!-- 这里如果用户上传了图片 则调取上传图片 -->
                  <img v-if="false" :src="item.headUrl" alt />
                  <div v-else-if="item.userName" class="user-name">
                    <em>{{
                      item.userName.substring(item.userName.length - 2)
                    }}</em>
                  </div>
                </dt>
                <dd>{{ item.userName }}</dd>
                <dd>{{ item.orgName }}</dd>
              </dl>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType">
          <el-select
            v-model="formData.projectType"
            placeholder="请选择项目类型"
            class="tl-select"
          >
            <el-option
              v-for="item in CONST.PROJECT_TYPE_LIST"
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
            class="tl-select"
          >
            <el-option
              v-for="item in CONST.THROW_TYPE_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目总预算" prop="totalBudget">
          <el-input-number
            v-model="formData.totalBudget"
            controls-position="right"
            :min="0"
          ></el-input-number>
          万
          <el-select v-model="formData.currency" placeholder="请选择币种">
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
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="sortIndex">
          <el-button :loading="loading" @click="createManage">确定</el-button>
          <el-button :disabled="loading" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
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
        totalBudget: 0,
        currency: '0',
        projectDate: [],
        startDate: '',
        endDate: '',
        orgIdList: [],
      },
      projectManagerList: [],
      projectTypeList: [],
      throwTypeList: [],
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
        projectType: [
          { required: true, message: '请选择项目类型', trigger: 'change' },
        ],
        throwType: [
          { required: true, message: '请选择投入类型', trigger: 'change' },
        ],
        totalBudget: [
          { required: true, message: '请选择投入类型', trigger: 'change' },
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
  },
  computed: {},
  mounted() {
    this.getProjectOrg();
    this.getUserList();
  },
  methods: {
    show() {
      this.visible = true;
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
          this.server.createProject({
            projectNameCn: this.formData.projectName,
            projectDescription: this.formData.projectDesc,
            projectManagerCode: this.formData.projectManager,
            projectManager: projectManagerObj.length > 0 ? projectManagerObj.userName : this.formData.projectManager,
            projectType: this.formData.projectType,
            projectTypeCode: this.formData.projectType,
            projectInputType: this.formData.throwType,
            projectInputTypeCode: this.formData.throwType,
            projectBudget: this.formData.totalBudget,
            projectCurrency: this.formData.currency,
            projectCurrencyCode: this.formData.currency,
            projectBeginDate: this.formData.startDate,
            projectEndDate: this.formData.endDate,
            projectApplyDepCode: this.formData.orgIdList.length > 0 ? this.formData.orgIdList[this.formData.orgIdList.length - 1] : '',
          }).then((res) => {
            if (res.code == '200') {
              this.$emit('success');
              this.visible = false;
            }
          });
        }
      });
    },
    closed() {
      this.visible = false;
    },
    cancel() {},
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