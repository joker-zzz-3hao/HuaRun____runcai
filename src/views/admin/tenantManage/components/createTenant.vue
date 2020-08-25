<template>
  <el-dialog
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
  >
    <div class="modelCreate">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="租户名称" prop="tenantName">
          <el-input
            style="width:320px"
            v-model="form.tenantName"
            maxlength="64"
            placeholder="请输入租户名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="企业ID" prop="tenantId">
          <el-input
            style="width:320px"
            maxlength="64"
            v-model="form.tenantId"
            placeholder="请输入企业ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="applyUser">
          <el-input
            style="width:320px"
            maxlength="64"
            v-model="form.applyUser"
            placeholder="请输入申请人"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobilePhone">
          <el-input
            style="width:320px"
            v-model="form.mobilePhone"
            placeholder="请输入联系电话"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="开放菜单功能">
          <div class="menuTreeList">
            <div class="list" v-for="(item,index) in menuTreeList" :key="index">
              <span>{{item.data.functionName}}</span>
              <i class="el-icon-error" @click.stop="clearNode(item)"></i>
            </div>
            <div>
              <el-popover placement="bottom" trigger="click">
                <el-cascader-panel
                  @change="handleCheckChange"
                  ref="treeMenu"
                  v-model.lazy="selectArr"
                  :options="data"
                  :props="{ multiple: true,label:'functionName',value:'functionId',children:'children' }"
                  node-key="value"
                ></el-cascader-panel>
                <div>
                  <el-button type="text" @click="saveTree">确认</el-button>
                  <el-button type="text" @click="clearNodeAll">清空</el-button>
                </div>
                <div slot="reference">
                  <i class="el-icon-circle-plus-outline"></i>
                </div>
              </el-popover>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="validateForm('form')">确定</el-button>
      <el-button @click="close()">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'createTenant',
  props: {
    title: {
      type: String,
      required: true,
    },
    tenantId: {
      type: [String, Number],
      required: false,
    },
    infoBool: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      list: [],
      menuTreeList: [],
      server,
      showMenu: false,
      selectList: [],
      form: {
        tenantName: '',
        applyUser: '',
        mobilePhone: '',
        tenantId: '',
        date: '',
        status: 'O',
        startTime: '',
        endTime: '',
      },
      rules: {
        tenantName: [{ required: true, message: '请输入租户名称', trigger: 'blur' },
          {
            pattern: /^[\u0391-\uFFE5A-Za-z]+$/,
            message: '请输入中文或者字母',
            trigger: 'blur',
          },

        ],
        applyUser: [{ required: true, message: '请输入申请人名称', trigger: 'blur' },
          {
            pattern: /^[\u0391-\uFFE5A-Za-z]+$/,
            message: '请输入中文或者字母',
            trigger: 'blur',
          },
        ],
        tenantId: [{
          required: true, message: '请输入企业ID', trigger: 'blur',
        },
        ],
        mobilePhone: [
          {
            required: true,
            message: '请输入联系电话',
            trigger: 'blur',
          },
          {
            pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            message: '手机号格式不对',
            trigger: 'blur',
          },
        ],
      },
      dialogTableVisible: false,
      dialogVisible: false,
      data: [],
      selectArr: [],
    };
  },
  mounted() {
    this.dialogTableVisible = true;

    this.getqueryMenu();
  },
  methods: {
    saveTree() {
      const keys = this.$refs.treeMenu.getCheckedNodes();
      // eslint-disable-next-line array-callback-return
      const keyCheck = keys.map((item) => {
        if (item.children.length == 0) {
          return item;
        }
      });
      // eslint-disable-next-line array-callback-return
      this.menuTreeList = keyCheck.filter((item) => {
        if (item) {
          return item;
        }
      });
      this.selectList = this.list;
    },
    clearNodeAll() {
      this.$refs.treeMenu.clearCheckedNodes();
      this.menuTreeList = [];
      this.selectList = [];
    },
    clearNode(node) {
      const deleteArr = this.selectArr;
      deleteArr.forEach((item, index) => {
        if (this.boolCheck(item, node)) {
          deleteArr.splice(index, 1);
        }
      });
      this.selectArr = [...deleteArr, []];
      let arr = [];
      this.selectArr.forEach((item) => {
        arr = arr.concat(item);
      });
      this.list = Array.from(new Set(arr));
      this.$nextTick(() => {
        const keys = this.$refs.treeMenu.getCheckedNodes();
        // eslint-disable-next-line array-callback-return
        const keyCheck = keys.map((item) => {
          if (item.children.length == 0) {
            return item;
          }
        });
        // eslint-disable-next-line array-callback-return
        this.menuTreeList = keyCheck.filter((item) => {
          if (item) {
            return item;
          }
        });
      });
    },
    boolCheck(item, node) {
      return item.some((li) => li === node.data.functionId);
    },
    // 获取菜单功能树形结构
    getqueryMenu() {
      this.server.queryMenu()
        .then((res) => {
          this.data = res.data;
        });
    },
    // 校验数据填写格式
    validateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // eslint-disable-next-line no-unused-expressions
          this.creatForm();
        } else {
          return false;
        }
      });
    },
    // 获取选中tree key值 展示选中
    handleCheckChange(data) {
      let arr = [];
      data.forEach((item) => {
        arr = arr.concat(item);
      });
      this.list = Array.from(new Set(arr));
    },
    // 提交创建数据
    creatForm() {
      this.form.menuTree = this.selectList.map((item) => ({ functionId: item }));
      this.server.insertTenant({
        tenantName: this.form.tenantName,
        tenantId: this.form.tenantId,
        applyUser: this.form.applyUser,
        mobilePhone: this.form.mobilePhone,
        startTime: this.form.startTime,
        endTime: this.form.endTime,
        status: this.form.status,
        menuTree: this.form.menuTree,
      })
        .then((res) => {
          if (res.code == 200) {
            this.$emit('getTenantList');
            this.$message.success('创建成功');
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
  },
};
</script>
<style  scoped>
.modelCreate {
  display: flex;
  width: 100%;
  justify-content: center;
}
.menuTreeList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.menuTreeList .list {
  background: #f4f6f8;
  border-radius: 14px;
  padding: 1px 10px;
}
</style>
