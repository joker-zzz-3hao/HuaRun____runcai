<template>
  <div>
    <div>
      <span>{{okrmain.orgName}}{{okrmain.periodName}}OKR</span>
    </div>
    <el-table :data="historyOKRList">
      <el-table-column width="100" prop="okrDetailType">
        <template slot-scope="scope">
          <span v-if="scope.row.okrDetailType === 0">目标</span>
          <span v-else>KR</span>
        </template>
      </el-table-column>
      <el-table-column prop="versionName">
        <template slot-scope="scope">
          <div>{{scope.row.versionName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="objectName">
        <template slot-scope="scope">
          <div>{{scope.row.objectName}}</div>
          <div v-if="scope.row.modifyReason">变更原因：{{scope.row.modifyReason}}</div>
        </template>
      </el-table-column>
      <!-- 权重暂时不加 -->
      <!-- <el-table-column prop="okrWeight">
        <template slot-scope="scope">
          <span>权重</span>
          <span>{{scope.row.okrWeight}}%</span>
        </template>
      </el-table-column>-->
    </el-table>
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
    okrmain: {
      type: Object,
      defualt() {
        return {};
      },
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
      this.server.selectOkrHistoryVersion({ okrDetailId: this.okrDetailId }).then((res) => {
        if (res.code == 200) {
          this.oldOKRList = res.data;
          this.oldOKRList.forEach((oitem) => {
            this.historyOKRList.push({
              okrDetailType: oitem.okrDetailType,
              objectName: oitem.okrDetailObjectKr,
              guanlianId: oitem.detailId,
              checkFlag: false,
              version: oitem.okrDetailVersion,
              versionName: oitem.isTrue === 1 ? '「最新版本」' : `「历史版本${oitem.okrDetailVersion}」`,
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
  },
};
</script>

<style>
</style>