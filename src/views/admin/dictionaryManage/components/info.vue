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
    title="详情"
    direction="rtl"
    size="35%"
    :modal="false"
    :visible.sync="visible"
    :wrapperClosable="false"
    class="tl-drawer"
  >
    <div class="modelCreate">
      <el-form ref="dicForm" label-width="80px">
        <el-form-item label="字典编号">
          <span>{{dicInfo.code}}</span>
        </el-form-item>
        <el-form-item label="字典名称">
          <span>{{dicInfo.name}}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span>{{dicInfo.enabledFlag == "Y" ?"启用" :"停用"}}</span>
        </el-form-item>
        <el-form-item label="备注">
          <span>{{dicInfo.description}}</span>
        </el-form-item>
      </el-form>
      <el-table ref="dicTable" v-loading="tableLoading" :data="dicInfo.subList">
        <el-table-column label="字典键" prop="value"></el-table-column>
        <el-table-column label="字典值" prop="meaning"></el-table-column>
        <el-table-column label="字典排序" prop="orderSeq"></el-table-column>
        <el-table-column label="状态" prop="enabledFlag">
          <template slot-scope="scope">
            <el-switch
              active-value="Y"
              inactive-value="N"
              v-model="scope.row.enabledFlag"
              active-color="#13ce66"
              disabled
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="description"></el-table-column>
        <el-table-column label="创建时间" prop="createTime">
          <template slot-scope="scope">
            <div>{{dateFormat('YYYY-mm-dd HH:MM:SS',new Date(scope.row.createTime) )}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-button @click="cancel">确定</el-button>
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
      dicInfo: {},
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
      this.visible = true;
      this.tableLoading = true;
      this.server.queryDicDetail({ codeId: this.codeId }).then((res) => {
        if (res.code == 200) {
          this.dicInfo = res.data;
        }
        this.tableLoading = false;
      });
    },
    cancel() {
      this.visible = false;
      this.$emit('closeDicDialog', { refreshPage: false });
    },
    closed() {
      this.$emit('update:showEditDicDialog', false);
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
<style lang="css">
.el-avatar,
.el-drawer {
  overflow: auto;
}
</style>