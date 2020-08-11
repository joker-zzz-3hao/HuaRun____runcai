<template>
  <div>
    <!-- okr -->
    <el-table :data="departokrList">
      <el-table-column width="150" prop="typeName"></el-table-column>
      <el-table-column prop="okrDetailObjectKr"></el-table-column>
      <el-table-column width="300">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.checkFlag"
            @change="selectDepartokr(scope.$index, scope.row)"
          ></el-checkbox>关联
        </template>
      </el-table-column>
      <!-- <el-table-column width="300" property="okrParentDetailId"></el-table-column> -->
    </el-table>
    <!-- 价值观 -->
    <el-table :data="philosophyList">
      <el-table-column prop="cultureDesc"></el-table-column>
      <el-table-column width="300">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.checkFlag"
            @change="selectphilosophy(scope.$index, scope.row)"
          ></el-checkbox>关联
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'okrHistory',
  props: {
    departokrList: {
      type: Array,
    },
    philosophyList: {
      type: Array,
    },
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    // 选择关联的okr
    selectDepartokr(index, row) {
      this.departokrList.forEach((item, i) => {
        this.departokrList[i].checkFlag = false;
      });
      this.departokrList[index].checkFlag = true;
      this.selection = row;
      this.$emit('selectDepart', this.selection);
    },
    // 选择关联的价值观
    selectphilosophy(index, row) {
      this.philosophyList.forEach((item, i) => {
        this.philosophyList[i].checkFlag = false;
      });
      this.philosophyList[index].checkFlag = true;
      this.selection = row;
      this.$emit('selectPhil', this.selection);
    },
  },
  watch: {
  },
};
</script>

<style>
</style>