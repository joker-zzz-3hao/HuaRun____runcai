<!--
  功能：
  作者：王志任
  时间：2020年08月04日 15:38:15
  备注：
-->
<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      @close="close"
      :title="dicTitle"
      :close-on-click-modal="false"
    >
      <div>
        <el-form ref="dicForm" :model="formData">
          <el-form-item
            label="字典编号"
            prop="code"
            :rules="[{required:true,validator:validateDicCode,trigger:'blur'}]"
          >
            <el-input
              v-model.trim="formData.code"
              :disabled="this.optionType == 'edit'"
              maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="字典名称"
            prop="name"
            :rules="[{required:true,message:'请输入字典名称',trigger:'blur'}]"
          >
            <el-input v-model.trim="formData.name" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item
            label="状态"
            prop="enabledFlag"
            :rules="[{required:true,message:'请输选择请用状态',trigger:'blur'}]"
          >
            <el-radio-group v-model="formData.enabledFlag">
              <el-radio :label="'Y'">启用</el-radio>
              <el-radio :label="'N'">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input v-model.trim="formData.description" maxlength="100"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button @click="addItem">新增</el-button>
        <el-table ref="dicTable" v-loading="tableLoading" :data="tableData">
          <el-table-column label="字典键" prop="value">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.value" maxlength="50"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="字典值" prop="meaning">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.meaning" maxlength="50"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="字典排序" prop="orderSeq">
            <template slot-scope="scope">
              <el-input-number
                v-model.trim="scope.row.orderSeq"
                controls-position="right"
                :min="1"
                :max="1000"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="enabledFlag">
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
              <el-input v-model.trim="scope.row.description" maxlength="50"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime">
            <template slot-scope="scope">
              <span>{{scope.row.createTime ?scope.row.createTime :'--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="code">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteItem(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-button :loading="loading" @click="save">确定</el-button>
        <el-button :disabled="loading" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import validateMixin from '../validateMixin';

export default {
  name: 'createOrEditUser',
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
      dicTitle: '新增字典',
      tableData: [],
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
  mounted() {},
  computed: {},
  methods: {
    init() {
      if (this.optionType == 'edit') {
        this.dicTitle = '编辑字典';
        this.tableLoading = true;
        this.server.queryDicDetail({ codeId: this.codeId }).then((res) => {
          if (res.code == 200) {
            this.formData.code = res.data.code;
            this.formData.name = res.data.name;
            this.formData.enabledFlag = res.data.enabledFlag;
            this.formData.description = res.data.description;
            this.tableData = res.data.subList;
            // 添加字段
            for (const item of this.tableData) {
              item.randomId = '';// 添加随机id，用于删除环节
            }
          }
          this.tableLoading = false;
        });
      }
    },

    show() {
      this.visible = true;
    },
    close(status) {
      this.visible = false;
      this.$emit('closeDicDialog', { refreshPage: status == 'refreshPage' });
    },

    save() {
      let successTip = '新增成功';
      if (this.optionType == 'edit') {
        successTip = '编辑成功';
      }
      this.$refs.dicForm.validate((valid) => {
        if (valid) {
          this.formData.subList = this.tableData;
          this.loading = true;
          this.server.addOrUpdate(this.formData).then((res) => {
            if (res.code == 200) {
              this.$message.success(successTip);
              this.close('refreshPage');
            }
            this.loading = false;
          });
        }
      });
    },
    cancel() {
      this.close();
    },
    addItem() { // 添加本地数据
      const randomId = Math.random().toString(36).substr(3);
      this.tableData.push({
        meaning: '',
        value: '',
        orderSeq: '',
        enabledFlag: 'Y',
        description: '',
        randomId, // 添加随机id，用于删除环节
      });
    },
    deleteItem(item) {
      if (item.randomId) { // 删除本地数据
        this.tableData = this.tableData.filter((dicItem) => dicItem.randomId != item.randomId);
      } else { // 删除数据库数据
        this.$confirm('是否确认删除该数据？，删除将无法恢复').then(() => {
          this.server.deleteDicItem({ codeValueId: item.codeValueId }).then((res) => {
            if (res.code == 200) {
              this.tableData = this.tableData.filter((dicItem) => dicItem.codeValueId != item.codeValueId);
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