<!--
  功能：
  作者：王志任
  时间：2020年08月04日 15:38:15
  备注：
-->
<template>
  <el-drawer
    :modal-append-to-body="false"
    :before-close="cancel"
    @closed="closed"
    :close-on-click-modal="false"
    title
    direction="rtl"
    :modal="false"
    :visible.sync="visible"
    :wrapperClosable="false"
    class="tl-drawer tl-drawer-dic"
  >
    <div class="modelCreate">
      <el-form ref="form" :model="formData">
        <el-form-item label="任务过程名称">
          <el-input placeholder="请输入任务标题" v-model="formData.processName"></el-input>
        </el-form-item>
        <el-form-item label="显示排序">
          <el-input type="number" v-model="formData.processName"></el-input>
        </el-form-item>
        <el-form-item>
          <h1>任务过程使用范围设置</h1>
          <div style="display:flex;flex-direction: column;">
            <el-checkbox v-model="teamUser" @change="selectTeamUser">
              团队申请
              <span>(创建后的任务过程其组织下成员均可使用)</span>
            </el-checkbox>
            <p>温馨提示：团队使用的任务过程只允许部门负责人进行创建</p>
            <el-checkbox v-model="localUser" @change="selectLocalUser">
              小范围使用
              <span>(所加入的成员均可使用)</span>
            </el-checkbox>
            <div v-if="localUser">
              <span>添加成员</span>
              <i style="cursor:pointer" @click="addMember" class="el-icon-plus"></i>
              <el-select
                v-model.trim="formData.userIdList"
                filterable
                placeholder="请输入成员姓名"
                remote
                :remote-method="remoteMethod"
                @visible-change="visibleChange"
                clearable
                multiple
              >
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                >
                  <span style="float:left">
                    <el-avatar :size="30" :src="item.headUrl" @error="errorHandler">
                      <div v-if="item.userName" class="user-name">
                        <em>{{item.userName.substring(item.userName.length-2)}}</em>
                      </div>
                    </el-avatar>
                  </span>
                  <span style="float:left;marginLeft:5px">{{item.userName}}</span>
                  <!-- <span style="float: right">
                  <el-checkbox @change="selectChange(item)" v-model="item.userId"></el-checkbox>
                  </span>-->
                </el-option>
              </el-select>
            </div>
            <el-checkbox v-model="personalUser" @change="selectPersonalUser">个人使用</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item>
          <h1>任务过程使用范围设置</h1>
          <p></p>
        </el-form-item>
      </el-form>
    </div>
    <div class="operating-box">
      <el-button type="primary" class="tl-btn amt-bg-slip" :loading="loading" @click="save">确定</el-button>
      <el-button class="tl-btn amt-border-fadeout" :disabled="loading" @click="cancel">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import validateMixin from '../validateMixin';

export default {
  name: 'createdic',
  mixins: [validateMixin],
  components: {
  },
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
    optionType: {
      type: String,
      default() {
        return 'add';
      },
    },
    processObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
      tableLoading: false,
      initCode: '',
      initName: '',
      dicTitle: '新增字典',
      formData: {
        available: 1,
        processType: '1',
        orgId: '',
        processName: '',
        userIdList: [],
      },

    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.visible = true;
  },
  computed: {},
  methods: {
    init() {
      this.formData = this.processObj;
    },
    close(status) {
      this.visible = false;
      this.$emit('closeDicDialog', { refreshPage: status == 'refreshPage' });
    },
    closed() {
      this.$emit('update:showEditDicDialog', false);
    },
    save() {
      let successTip = '新增成功';
      if (this.optionType == 'edit') {
        successTip = '编辑成功';
      }
      // 校验
      const v1 = new Promise((resolve) => {
        this.$refs.dicForm.validate((valid) => {
          if (valid) resolve();
        });
      });
      const v2 = new Promise((resolve) => {
        this.$refs.formTable.validate((valid) => {
          if (valid) resolve();
        });
      });
      Promise.all([v1, v2]).then(() => {
        this.loading = true;
        this.server.addOrUpdate(this.formData).then((res) => {
          if (res.code == 200) {
            this.$message.success(successTip);
            this.close('refreshPage');
          }
          this.loading = false;
        });
      });
    },
    cancel() {
      this.close();
    },

    deleteItem(item) {
      if (item.randomId) { // 删除本地数据
      } else { // 删除数据库数据
        this.$confirm('是否确认删除该数据？，删除将无法恢复').then(() => {
          this.server.deleteDicItem({ codeValueId: item.codeValueId }).then((res) => {
            if (res.code == 200) {
              this.$message.success('删除成功');
            }
          });
        });
      }
    },
    dataChange(dicItem) {
      dicItem.enabledFlag = dicItem.enabledFlag == 'Y' ? 'N' : 'Y';
    },

  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
<style >
.tl-drawer-dic .el-drawer {
  width: 700px !important;
}
</style>