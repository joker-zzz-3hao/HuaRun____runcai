<template>
  <el-dialog
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
    center
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
        <el-form-item label="企业ID" prop="tenantID">
          <el-input
            style="width:320px"
            maxlength="64"
            v-model="form.tenantID"
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
            <div class="list" v-for="(item,index) in menuTreeList" :key="index">{{item}}</div>
            <div>
              <el-popover placement="bottom" trigger="click">
                <el-cascader-panel
                  @change="handleCheckChange"
                  ref="treeMenu"
                  v-model="selectArr"
                  :options="data"
                  :props="{ multiple: true }"
                  node-key="id"
                ></el-cascader-panel>
                <div slot="reference">+</div>
              </el-popover>
            </div>
          </div>
        </el-form-item>

        <!-- <el-form-item label="使用时间" prop="date">
          <el-date-picker
            v-model="form.date"
            @change="changDate"
            :disabled="infoBool"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>-->
        <!-- <el-form-item label="租户状态">
          <el-radio-group v-model="form.status">
            <el-radio label="O">启用</el-radio>
            <el-radio label="S">停用</el-radio>
          </el-radio-group>
        </el-form-item>-->
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
      menuTreeList: [],
      server,
      showMenu: false,
      form: {
        tenantName: '',
        applyUser: '',
        mobilePhone: '',
        tenantID: '',
        date: '',
        status: 'O',
        startTime: '',
        endTime: '',
        selectArr: '',
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
        tenantID: [{
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
        date: {
          required: true, message: '请选择开始时间与结束时间', trigger: 'change',
        },
      },
      dialogTableVisible: false,
      dialogVisible: false,
      data: [],
    };
  },
  mounted() {
    this.dialogTableVisible = true;

    this.getqueryMenu();
  },
  methods: {
    changDate(date) {
      // eslint-disable-next-line prefer-destructuring
      this.form.startTime = date[0];
      // eslint-disable-next-line prefer-destructuring
      this.form.endTime = date[1];
    },
    // 获取菜单功能树形结构
    getqueryMenu() {
      this.server.queryMenu()
        .then((res) => {
          this.data = this.getTreeList(res.data, true);
        });
    },
    // 递归修改符合element tree结构数据
    getTreeList(data, disabled) {
      if (data) {
        return data.map((item) => ({
          id: item.functionId,
          label: item.functionName,
          value: item.functionId,
          disabled: this.infoBool,
          children: this.getTreeList(item.children, disabled),
        }));
      }
    },
    // 获取租户信息
    getTenant() {
      this.server.getTenant({ tenantId: this.tenantId })
        .then((res) => {
          this.form.tenantName = res.data.tenantName;
          this.form.applyUser = res.data.applyUser;
          this.form.mobilePhone = res.data.mobilePhone;
          this.form.tenantID = res.data.tenantID;
          this.form.status = res.data.status;
          // this.form.date = [new Date(res.data.startTime), new Date(res.data.endTime)];
          // this.form.startTime = res.data.startTime;
          // this.form.endTime = res.data.endTime;
          const keys = res.data.menuTree.map((item) => item.functionId);
          this.$nextTick(() => {
            this.$refs.treeMenu.setCheckedKeys(keys);
          });
        });
    },
    // 校验数据填写格式
    validateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // eslint-disable-next-line no-unused-expressions
          this.tenantId ? this.pudateForm() : this.creatForm();
        } else {
          return false;
        }
      });
    },
    // 获取选中tree key值 展示选中
    handleCheckChange() {
      console.log(this.selectArr);
      const keys = this.$refs.treeMenu.getCheckedNodes();
      // eslint-disable-next-line array-callback-return
      const keyCheck = keys.map((item) => {
        if (item.children.length == 0) {
          return item.data.label;
        }
      });
      // eslint-disable-next-line array-callback-return
      this.menuTreeList = keyCheck.filter((item) => {
        if (item) {
          return item;
        }
      });
      this.form.menuTree = keys.map((item) => ({ functionId: item.data.id }));
    },
    // 提交编辑数据
    pudateForm() {
      this.server.updateTenant({
        tenantName: this.form.tenantName,
        tenantId: this.form.tenantID,
        applyUser: this.form.applyUser,
        mobilePhone: this.form.mobilePhone,
        status: this.form.status,
        menuTree: this.form.menuTree,
      })
        .then((res) => {
          if (res.code == 200) {
            this.$emit('getTenantList');
            this.$message.success(res.msg);
            this.closed();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    // 提交创建数据
    creatForm() {
      this.server.insertTenant({
        tenantName: this.form.tenantName,
        tenantId: this.form.tenantID,
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
