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
      <el-form ref="projectForm" label-width="80px" class="tl-form">
        <el-form-item label="小组名称" prop="projectName">
          <el-input
            maxlength="20"
            v-model="params.projectTeamName"
            placeholder="请输入小组名称"
            class="tl-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="小组描述" prop="projectName">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入小组内容描述"
            v-model="params.projectDescription"
            class="tl-textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="设置组长" prop="projectName">
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
      <el-button type="primary" class="tl-btn amt-bg-slip" @click="submit"
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
    };
  },
  components: {},

  computed: {},
  mounted() {
    this.getUser();
  },
  methods: {
    getUser() {
      this.server.summaryList({
        projectId: this.$route.query.projectId || '',
      }).then((res) => {
        if (res.code == '200') {
          this.summaryList = res.data;
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
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
  },
  watch: {},
};
</script>