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
          <div class="list" v-for="(item,index) in menuTreeList" :key="index">
            <span>{{item.label}}</span>
            <i class="el-icon-error" @click.stop="clearNode(item)"></i>
          </div>
          <el-popover placement="bottom" trigger="click">
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
              <div>
                <el-button type="text" @click="saveTree">确认</el-button>
                <el-button type="text" @click="clearNodeAll">清空</el-button>
              </div>
            </div>

            <div slot="reference">
              <i class="el-icon-circle-plus-outline"></i>
            </div>
          </el-popover>
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
          this.changeOrgId(this.rowData.agentOrg);
        });
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // eslint-disable-next-line no-unused-expressions
          console.log(1);
        } else {
          return false;
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