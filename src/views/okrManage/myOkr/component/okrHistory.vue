<template>
  <div>
    <el-table :data="historyOKRList">
      <el-table-column width="100" prop="typeName"></el-table-column>
      <el-table-column prop="versionName"></el-table-column>
      <el-table-column prop="objectName"></el-table-column>
      <el-table-column prop="okrWeight">
        <template slot-scope="scope">
          <span>权重</span>
          <span>{{scope.row.okrWeight}}%</span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="100" property="guanlianId">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.checkFlag"
            @change="selectDepartokr(scope.$index, scope.row)"
          ></el-checkbox>关联
        </template>
      </el-table-column>-->
    </el-table>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="summitUpdate">更新</el-button>
    </span>-->
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'okrHistory',
  props: {
    server: {
      type: Object,
      required: true,
    },
    okrId: {
      type: String,
      defualt: '',
    },
    okrDetailId: {
      type: String,
      defualt: '',
    },

  },
  data() {
    return {
      historyOKRList: [], // 历史版本okr
      dialogTitle: '历史版本', // 弹框标题
      oldOKRList: [],
    };
  },
  created() {
    this.searchOkr();
  },
  methods: {
    ...mapMutations('common', ['setMyokrDrawer']),
    searchOkr() {
      // this.okrDetailId = this.okrId;
      this.server.selectOkrHistoryVersion({ okrDetailId: this.okrDetailId }).then((res) => {
        if (res.code == 200) {
          this.oldOKRList = res.data;
          this.oldOKRList.forEach((oitem) => {
            this.historyOKRList.push({
              typeName: '目标O',
              objectName: oitem.okrDetailObjectKr,
              guanlianId: oitem.detailId,
              checkFlag: false,
              version: oitem.okrDetailVersion,
              versionName: oitem.isTrue === 1 ? '最新版本' : `历史版本${oitem.okrDetailVersion}`,
              isTrue: oitem.isTrue, // 是否为最新版本
              okrWeight: oitem.okrWeight, // 权重
              okrDetailParentObjectKr: oitem.okrDetailParentObjectKr, // 承接的okr
              okrDetailParentVersion: oitem.okrDetailParentVersion, // 承接的版本
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
      this.searchOkr();
    },
    // 关闭抽屉
    close() {
      this.setMyokrDrawer(false);
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