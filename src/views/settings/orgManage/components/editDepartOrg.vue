<template>
  <el-dialog
    @click.native="closeshowMember"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    title="设置代理部门"
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
        <span>{{rowData.orgName}}</span>
      </el-form-item>

      <el-form-item label="菜单权限">
        <div class="menuTreeList">
          <div class="postMenu">
            <el-cascader-panel
              change-on-select
              @change="handleCheckChange"
              ref="treeMenu"
              v-model="selectArr"
              :options="data"
              :props="{ multiple: true,value:'orgId',children:'sonTree',
                label:'orgName',checkStrictly:true,emitPath:false }"
              node-key="id"
            ></el-cascader-panel>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" class="tl-btn amt-bg-slip">确定</el-button>
      <el-button plain @click="close" class="tl-btn amt-border-fadeout">取 消</el-button>
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
    rowData: {
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
    };
  },

  mounted() {
    this.dialogTableVisible = true;
    this.getqueryMenu();
  },
  methods: {
    handleCheckChange(data) {
      console.log(data);
    },
    saveTree() {
      const node = this.$refs.treeMenu.getCheckedNodes();
      this.menuTreeList = node;
    },
    changeOrgId(data) {
      const list = data.split(',');
      const orgId = list.map((item) => item.split('/')[1]);
      this.orgIdList = orgId.map((item) => ({ orgId: item }));
      this.selectArr = orgId;
    },
    clearNodeAll() {
      this.$refs.treeMenu.clearCheckedNodes();
      this.menuTreeList = [];
    },

    getqueryMenu() {
      this.server.getOrg()
        .then((res) => {
          this.data = res.data;
          if (this.rowData.agentOrg) {
            this.changeOrgId(this.rowData.agentOrg);
          }
        });
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // eslint-disable-next-line no-unused-expressions
          this.setLeader();
        } else {
          return false;
        }
      });
    },
    setLeader() {
      const newOrgIdList = this.selectArr.map((item) => ({ orgId: item }));
      const { orgIdList } = this;
      this.server.setDepartLeader({
        userId: this.rowData.userId,
        orgIdList,
        newOrgIdList,
        roleCode: 'ORG_ADMIN',
      }).then((res) => {
        console.log(res);
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
};
</script>