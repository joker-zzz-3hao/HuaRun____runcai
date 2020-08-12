<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogDetailVisible"
    width="50%"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
  >
    <el-table :data="historyOKRList">
      <el-table-column>版本</el-table-column>
      <el-table-column width="250" prop="typeName"></el-table-column>
      <el-table-column prop="objectName"></el-table-column>
      <el-table-column width="100" property="guanlianId">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.checkFlag"
            @change="selectDepartokr(scope.$index, scope.row)"
          ></el-checkbox>关联
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="summitUpdate">更新</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'okrHistory',
  props: {
    server: {
      type: Object,
      required: true,
    },
    okrId: {
      type: String,
    },
    dialogExist: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      historyOKRList: [], // 历史版本okr
      dialogTitle: 'OKR详情', // 弹框标题
      dialogDetailVisible: false,
    };
  },
  created() {
    // this.searchOkr();
  },
  methods: {
    searchOkr() {
      this.searchForm = { okrId: this.okrId };
      this.server.getokrDetail(this.searchForm).then((res) => {
        if (res.code == 200 && res.data.okrDetails.length > 0) {
          console.log('搜索条件', this.searchForm);
          res.data.okrDetails.forEach((item) => {
            this.historyOKRList.push({
              typeName: '目标O',
              objectName: item.okrDetailObjectKr,
              guanlianId: item.detailId,
              checkFlag: false,
            });
            item.krList.forEach((krItem, index) => {
              this.historyOKRList.push({
                typeName: `KR${index}`,
                objectName: krItem.okrDetailObjectKr,
                guanlianId: krItem.detailId,
                checkFlag: false,
              });
            });
          });
        }
      });
    },
    // 选择关联的okr
    selectDepartokr(index, row) {
      this.departokrList.forEach((item, i) => {
        this.departokrList[i].checkFlag = false;
      });
      this.departokrList[index].checkFlag = true;
      this.selection = row;
    },
    // 打开弹窗
    showOkrDialog() {
      this.dialogDetailVisible = true;
      this.searchOkr();
    },
    // 关闭弹窗
    close() {
      this.dialogDetailVisible = false;
    },
    // 关闭弹窗
    closed() {
      this.$emit('update:dialogExist', false);
    },
    summitUpdate() {
      this.$message('提交成功~');
      this.close();
      // 需刷新列表吗
    },
  },
  watch: {
    // okrid: {
    //   handler() {
    //     this.searchOkr();
    //   },
    //   deep: true,
    //   immediate: true,
    // },
  },
};
</script>

<style>
</style>