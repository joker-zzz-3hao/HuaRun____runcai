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
    title="编辑字典"
    direction="rtl"
    :modal="false"
    :visible.sync="visible"
    :wrapperClosable="false"
    class="tl-drawer tl-drawer-dic"
  >
    <div class="modelCreate">
      <el-form ref="dicForm" :model="formData" label-width="80px">
        <el-form-item
          label="字典编号"
          prop="code"
          :rules="[
            { required: true, validator: validateDicCode, trigger: 'blur' },
          ]"
        >
          <el-input
            v-model.trim="formData.code"
            :disabled="this.optionType == 'edit'"
            maxlength="50"
            clearable
            style="width: 90%"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="字典名称"
          prop="name"
          :rules="[
            { required: true, validator: validateDicName, trigger: 'blur' },
          ]"
        >
          <el-input
            v-model.trim="formData.name"
            maxlength="50"
            clearable
            style="width: 90%"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="enabledFlag"
          :rules="[
            { required: true, message: '请输选择请用状态', trigger: 'blur' },
          ]"
        >
          <el-radio-group v-model="formData.enabledFlag">
            <el-radio :label="'Y'">启用</el-radio>
            <el-radio :label="'N'">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input
            v-model.trim="formData.description"
            maxlength="100"
            clearable
            style="width: 90%"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form
        :rules="formTableData.rules"
        :model="formTableData"
        ref="formTable"
      >
        <el-table
          ref="dicTable"
          v-loading="tableLoading"
          :data="formTableData.tableData"
          style="width: 90%"
        >
          <el-table-column label="字典键" prop="value">
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableData.' + scope.$index + '.value'"
                :rules="formTableData.rules.value"
              >
                <el-input
                  v-model.trim="scope.row.value"
                  maxlength="50"
                  clearable
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="字典值" prop="meaning">
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableData.' + scope.$index + '.meaning'"
                :rules="formTableData.rules.meaning"
              >
                <el-input
                  v-model.trim="scope.row.meaning"
                  maxlength="50"
                  clearable
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="70" label="字典排序" prop="orderSeq">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.orderSeq"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="50" prop="enabledFlag">
            <template slot-scope="scope">
              <div @click.capture.stop="dataChange(scope.row)">
                <el-switch
                  active-value="Y"
                  inactive-value="N"
                  v-model="scope.row.enabledFlag"
                  active-color="#13ce66"
                ></el-switch>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="description">
            <template slot-scope="scope">
              <el-input
                v-model.trim="scope.row.description"
                maxlength="50"
                clearable
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="150" prop="createTime">
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.createTime
                    ? dateFormat(
                        "YYYY-mm-dd HH:MM",
                        new Date(scope.row.createTime)
                      )
                    : "--"
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="code" width="50">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteItem(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="addItem">新增</el-button>
      </el-form>
    </div>
    <div class="operating-box">
      <el-button
        type="primary"
        class="tl-btn amt-bg-slip"
        :loading="loading"
        @click="save"
        >确定</el-button
      >
      <el-button
        class="tl-btn amt-border-fadeout"
        :disabled="loading"
        @click="cancel"
        >取消</el-button
      >
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
    codeId: {
      type: String,
      default() {
        return '';
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
      formTableData: {
        rules: {
          value: {
            type: 'string',
            required: true,
            message: '请填写字典键',
            trigger: 'blur',
          },
          meaning: {
            type: 'string',
            required: true,
            message: '请填写字典值',
            trigger: 'blur',
          },
        },
        tableData: [],
      },
      formData: {
        code: '',
        name: '',
        enabledFlag: 'Y',
        description: '',
        subList: [],
        codeId: this.codeId,
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
      if (this.optionType == 'edit') {
        this.dicTitle = '编辑字典';
        this.tableLoading = true;
        this.server.queryDicDetail({ codeId: this.codeId }).then((res) => {
          if (res.code == 200) {
            this.formData.code = res.data.code;
            this.initCode = res.data.code;
            this.formData.name = res.data.name;
            this.initName = res.data.name;
            this.formData.enabledFlag = res.data.enabledFlag;
            this.formData.description = res.data.description;
            this.formTableData.tableData = res.data.subList;
            // 添加字段
            for (const item of this.formTableData.tableData) {
              item.randomId = '';// 添加随机id，用于删除环节
            }
          }
          this.tableLoading = false;
        });
      }
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
        this.formData.subList = this.formTableData.tableData;
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
    addItem() { // 添加本地数据
      this.formTableData.tableData.push({
        meaning: '',
        value: '',
        orderSeq: '',
        enabledFlag: 'Y',
        description: '',
        randomId: Math.random().toString(36).substr(3), // 添加随机id，用于删除环节
      });
    },
    deleteItem(item) {
      if (item.randomId) { // 删除本地数据
        this.formTableData.tableData = this.formTableData.tableData.filter((dicItem) => dicItem.randomId != item.randomId);
      } else { // 删除数据库数据
        this.$confirm('是否确认删除该数据？，删除将无法恢复').then(() => {
          this.server.deleteDicItem({ codeValueId: item.codeValueId }).then((res) => {
            if (res.code == 200) {
              this.formTableData.tableData = this.formTableData.tableData.filter(
                (dicItem) => dicItem.codeValueId != item.codeValueId,
              );
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
  width: 1000px !important;
}
</style>