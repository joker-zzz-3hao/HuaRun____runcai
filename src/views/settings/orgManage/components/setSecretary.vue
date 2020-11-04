<template>
  <el-dialog
    @click.native="closeshowMember"
    :modal-append-to-body="false"
    :append-to-body="true"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    title="设置综合岗"
    :visible.sync="dialogTableVisible"
    class="tl-dialog"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      :label-position="labelPosition"
      class="tl-form"
    >
      <el-form-item label="当前部门">
        <span>{{ userData.orgName }}</span>
      </el-form-item>
      <el-form-item label="当前人员">
        <span>{{ userData.userName }}</span>
      </el-form-item>

      <el-form-item label="设置综合岗">
        <div class="menuTreeList">
          <div class="postMenu">
            <el-cascader-panel
              change-on-select
              ref="treeMenu"
              v-model="selectArr"
              :options="data"
              :props="{
                multiple: true,
                value: 'orgId',
                children: 'sonTree',
                label: 'orgName',
                checkStrictly: true,
                emitPath: false,
              }"
              node-key="id"
            ></el-cascader-panel>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" class="tl-btn amt-bg-slip"
        >确定</el-button
      >
      <el-button plain @click="close" class="tl-btn amt-border-fadeout"
        >取 消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'home',
  props: {
    title: {
      type: String,
      required: true,
    },
    userData: {
      type: [Object, String],
      required: false,
    },
  },
  data() {
    return {
      listOrgId: '',
      orgIdList: [],
      server,
      labelPosition: 'left',
      menuTreeList: [],
      selectArr: [],
      list: [],
      showMenu: false,
      form: {
        roleCode: '',
        roleName: '',
        functionList: [],
      },
      dialogTableVisible: false,
      dialogVisible: false,
      data: [],
      selectList: [],
      rules: {
        roleCode: [
          { required: true, message: '请输入角色编号', trigger: 'blur' },
          {
            pattern: /^[0-9a-zA-Z]+$/,
            message: '请输入数字或者英文字母',
            trigger: 'blur',
          },
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            pattern: /^[\u0391-\uFFE5A-Za-z]+$/,
            message: '只允许输入中文或者字母',
            trigger: 'blur',
          },
        ],
      },
      tempSelectedNode: [],
      initPage: true,
    };
  },

  mounted() {
    this.dialogTableVisible = true;
    this.getqueryMenu();
  },
  methods: {
    saveTree() {
      const node = this.$refs.treeMenu.getCheckedNodes();
      this.menuTreeList = node;
    },
    changeOrgId(data) {
      this.initPage = true;
      const list = data.split(',');
      const orgId = list.map((item) => item.split('/')[1]);
      this.orgIdList = orgId.map((item) => ({ orgId: item }));
      this.selectArr = orgId;
      this.tempSelectedNode = [...this.selectArr];
      this.$nextTick(() => {
        this.initPage = false;
      });
    },
    clearNodeAll() {
      this.$refs.treeMenu.clearCheckedNodes();
      this.menuTreeList = [];
    },

    getqueryMenu() {
      this.server.getOrg()
        .then((res) => {
          this.data = res.data;
          if (this.userData.teamAdmin) {
            this.changeOrgId(this.userData.teamAdmin);
          } else {
            this.initPage = false;
          }
        });
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // eslint-disable-next-line no-unused-expressions
          this.setSecretary();
        } else {
          return false;
        }
      });
    },
    setSecretary() {
      const newOrgIdList = this.selectArr.map((item) => ({ orgId: item }));
      const { orgIdList } = this;
      if (newOrgIdList.length == 0 && orgIdList.length == 0) {
        this.closed();
        return;
      }
      this.server.setSecretary({
        newOrgIdList,
        orgIdList,
        userId: this.userData.userId,
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.$emit('searchList');
          this.closed();
        }
      });
    },
    close() {
      this.dialogTableVisible = false;
    },
    closed() {
      this.$emit('update:exist', false);
    },
    showMember() {
      this.dialogVisible = !this.dialogVisible;
    },
    closeshowMember() {
      this.dialogVisible = false;
    },
  },
  watch: {
    selectArr: {
      handler(data) {
        if (this.initPage) {
          return;
        }
        let temparr = data;
        this.selectArr.forEach((newVal) => {
          this.tempSelectedNode.forEach((oldVal) => {
            if (newVal == oldVal) {
              temparr = temparr.filter((item) => item != newVal);
            }
          });
        });
        this.tempSelectedNode = [...this.selectArr];
        // 获取最后一次选中的节点,取消的不算
        if (temparr.length == 0) {
          return;
        }
        this.server.queryOrgAdmin({
          orgId: temparr[0],
        }).then((res) => {
          // 如果选中的部门负责人/代理负责人已经是该用户了，则不能够设置该用户为该部门的综合岗
          if (res.data.orgAdminUserName == this.userData.userName) {
            this.$alert(`'${this.userData.userName}'已经是该部门负责人，不能再设置为综合岗。`, '提示', {
              confirmButtonText: '取消',
              type: 'warning',
              closeOnClickModal: false,
              callback: () => {
                // 取消该组织的勾选
                this.selectArr = this.selectArr.filter((item) => temparr[0] != item);
                this.$forceUpdate();
              },
            });
          } else if (!!res.data.teamAdminUserName && this.userData.userName != res.data.teamAdminUserName) {
            this.$confirm(`目前该部门的综合岗是'${res.data.teamAdminUserName}'，是否将其替换为'${this.userData.userName}'？`, '提示', {
              confirmButtonText: '替换',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal: false,
            }).then(() => {

            }).catch(() => {
              // 取消该组织的勾选
              this.selectArr = this.selectArr.filter((item) => temparr[0] != item);
            });
          }
        });
      },
    },
  },
};
</script>