<template>
  <div>
    <el-table :data="historyOKRList">
      <el-table-column width="150" prop="typeName"></el-table-column>
      <el-table-column prop="objectName"></el-table-column>

      <!-- <el-table-column width="300" property="guanlianId"></el-table-column> -->
    </el-table>
  </div>
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
  },
  data() {
    return {
      historyOKRList: [], // 历史版本okr
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
  },
  watch: {
    okrid: {
      handler() {
        this.searchOkr();
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style>
</style>