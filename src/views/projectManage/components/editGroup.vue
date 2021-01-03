<template>
  <el-dialog
    title="编辑小组"
    :visible="visible"
    @closed="close"
    :before-close="close"
    :append-to-body="true"
    :close-on-click-modal="false"
    custom-class="custom-dialog"
    class="tl-dialog"
    :destroy-on-close="true"
    width="600px"
  >
    <el-scrollbar>
      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="tl-form"
      >
        <el-form-item label="小组名称" prop="projectTeamName">
          <el-input
            maxlength="20"
            v-model.trim="params.projectTeamName"
            placeholder="请输入小组名称"
            class="tl-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="小组描述" prop="projectDescription">
          <el-input
            type="textarea"
            maxlength="200"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入小组内容描述"
            v-model="params.projectDescription"
            class="tl-textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="设置组长" prop="projectTeamLeader">
          <el-select v-model="params.projectTeamLeader">
            <el-option
              v-for="item in summaryList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="tl-btn amt-bg-slip" @click="submitForm"
        >确定</el-button
      >
      <el-button class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'createManage',
  data() {
    return {
      server,
      visible: false,
      params: {},
      summaryList: [],
      listInfo: {},
      rules: {
        projectTeamName: [
          { required: true, message: '请输入小组名称', trigger: 'blur' },
        ],
        projectDescription: [
          { required: true, message: '请输入小组内容描述', trigger: 'blur' },
        ],
        projectTeamLeader: [
          { required: true, message: '设置组长', trigger: 'change' },
        ],
      },
    };
  },
  components: {},

  computed: {},
  mounted() {

  },
  methods: {
    getUser() {
      this.server.queryTeamUser({
        projectId: this.$route.query.projectId || '',
        projectTeamId: this.params.projectTeamId,
      }).then((res) => {
        if (res.code == '200') {
          this.summaryList = res.data;
        }
      });
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.submit();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    submit() {
      const { params } = this;
      params.projectId = this.$route.query.projectId;
      this.server.saveOrUpdateProjectTeam(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('创建成功');
          this.$emit('getList');
          this.close();
        }
      });
    },
    show(data) {
      this.params = data;
      this.$nextTick(() => {
        this.getUser();
      });
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
  },
  watch: {},
};
</script>