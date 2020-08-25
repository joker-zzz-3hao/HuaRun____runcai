<template>
  <div>
    <!-- okr -->
    <el-table :data="departokrList">
      <el-table-column width="150" prop="typeName"></el-table-column>
      <el-table-column v-if="!showPhil" width="150" prop="okrDetailVersion">
        <template slot-scope="scope">
          <div v-if="scope.row.currentOption">「历史版本{{scope.row.okrDetailVersion}}」</div>
          <div v-else>「最新版本」</div>
        </template>
      </el-table-column>
      <el-table-column width="150" prop="okrDetailObjectKr"></el-table-column>
      <el-table-column>
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
    <div v-if="showPhil">公司管理价值观</div>
    <el-table v-if="showPhil" :data="philosophyList">
      <el-table-column width="300" prop="cultureDesc"></el-table-column>
      <el-table-column>
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
  name: 'undertakeTable',
  props: {
    departokrList: {
      type: Array,
    },
    philosophyList: {
      type: Array,
    },
    showPhil: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectDepartRow: {},
      selectPhilRow: {},

    };
  },
  created() {
  },
  methods: {
    // 选择关联的okr
    selectDepartokr(index, row) {
      this.departokrList.forEach((item, i) => {
        if (index != i) {
          this.departokrList[i].checkFlag = false;
        }
      });
      this.selectDepartRow = row;
    },
    // 选择关联的价值观
    selectphilosophy(index, row) {
      this.philosophyList.forEach((item, i) => {
        if (index != i) {
          this.philosophyList[i].checkFlag = false;
        }
        console.log(i, this.philosophyList[i].checkFlag);
      });
      this.selectPhilRow = row;
    },
  },
  watch: {
  },
};
</script>

<style>
</style>