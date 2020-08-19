<template>
  <div>
    <el-table :data="historyOKRList">
      <el-table-column prop="okrDetailVersion"></el-table-column>
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
    },
    dialogExist: {
      type: Boolean,
      default: true,
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
    // this.searchOkr();
  },
  methods: {
    ...mapMutations('common', ['setMyokrDrawer']),
    searchOkr() {
      this.searchForm = { okrId: this.okrId };
      this.server.selectOkrHistoryVersion({ okrDetailId: this.okrDetailId }).then((res) => {
        if (res.code == 200) {
          this.oldOKRList = res.data;
          this.server.getokrDetail(this.searchForm).then((response) => {
            if (response.code == 200 && response.data.okrDetails.length > 0) {
              console.log('搜索条件', this.searchForm);
              // 重新排列okr层级
              response.data.okrDetails.forEach((item) => {
                // 如果是当前查看的okr
                if (this.okrDetailId == item.okrDetailId) {
                  // Detail里的是最新版本
                  this.historyOKRList.push({
                    typeName: '目标O',
                    objectName: item.okrDetailObjectKr,
                    guanlianId: item.detailId,
                    checkFlag: false,
                    version: 'new',
                    versionName: '最新版本',
                  });
                  // 将历史版本插入
                  this.oldOKRList.forEach((oitem) => {
                    if (oitem.isTrue !== 1) {
                      this.historyOKRList.push({
                        typeName: '目标O',
                        objectName: oitem.okrDetailObjectKr,
                        guanlianId: oitem.detailId,
                        checkFlag: false,
                        version: oitem.okrDetailVersion,
                        versionName: `历史版本${oitem.okrDetailVersion}`,
                      });
                    }
                  });
                } else {
                  // 不是当前查看的，版本显示--
                  this.historyOKRList.push({
                    typeName: '目标O',
                    objectName: item.okrDetailObjectKr,
                    guanlianId: item.detailId,
                    checkFlag: false,
                    version: '',
                    versionName: '--',
                  });
                }
                // 将kr提上一层级
                item.krList.forEach((krItem, index) => {
                  //  如果是当前查看的okr
                  if (this.okrDetailId == krItem.okrDetailId) {
                  // Detail里的是最新版本
                    this.historyOKRList.push({
                      typeName: `KR${index}`,
                      objectName: krItem.okrDetailObjectKr,
                      guanlianId: krItem.detailId,
                      checkFlag: false,
                    });
                    // 将历史版本插入
                    this.oldOKRList.forEach((kritem) => {
                      if (kritem.isTrue !== 1) {
                        this.historyOKRList.push({
                          typeName: `KR${index}`,
                          objectName: kritem.okrDetailObjectKr,
                          guanlianId: kritem.detailId,
                          checkFlag: false,
                          version: kritem.okrDetailVersion,
                          versionName: `历史版本${kritem.okrDetailVersion}`,
                        });
                      }
                    });
                  } else {
                    this.historyOKRList.push({
                      typeName: `KR${index}`,
                      objectName: krItem.okrDetailObjectKr,
                      guanlianId: krItem.detailId,
                      checkFlag: false,
                      version: '',
                      versionName: '--',
                    });
                  }
                });
              });
            }
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