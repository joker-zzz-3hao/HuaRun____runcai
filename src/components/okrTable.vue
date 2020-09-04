<template>
  <div>
    <!-- okr折叠面板 -->
    <el-form v-if="tableList.length > 0" v-model="formData" class="tl-form">
      <el-table :data="tableList" @row-click="opensome()" class="tl-table">
        <el-table-column type="expand" width="50" class="detail">
          <template slot-scope="scope">
            <div v-for="kritem in scope.row.krList" :key="kritem.krId" @click="opensome(kritem)">
              <!-- kr名称 -->
              <div>
                <em>KR</em>
                {{kritem.okrDetailObjectKr}}
              </div>
              <!-- 权重 -->
              <div>{{kritem.okrWeight}}%</div>
              <!-- 进度 -->
              <div class="progresswidth">
                <el-progress
                  :stroke-width="10"
                  :percentage="parseInt(kritem.okrDetailProgress, 10)"
                ></el-progress>
              </div>
              <!-- 风险状态 -->
              <div>{{CONFIDENCE_MAP[kritem.okrDetailConfidence]}}</div>
              <!-- 承接地图 -->
              <div>
                <slot name="body-bar" :okritem="kritem"></slot>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- 目标O名称 无label -->
        <el-table-column prop="okrDetailObjectKr" width="220" class="detail">
          <template slot-scope="scope">
            <em>目标</em>
            {{scope.row.okrDetailObjectKr}}
          </template>
        </el-table-column>
        <el-table-column prop="okrWeight" label="权重" width="120">
          <template slot-scope="scope">{{scope.row.okrWeight}}%</template>
        </el-table-column>
        <el-table-column prop="okrDetailProgress" label="进度" width="120">
          <template slot-scope="scope">
            <el-progress :stroke-width="10" :percentage="parseInt(scope.row.okrDetailProgress, 10)"></el-progress>
          </template>
        </el-table-column>
        <el-table-column label="风险状态" width="120"></el-table-column>
        <el-table-column label="承接地图" width="120">
          <template slot-scope="scope">
            <slot name="head-undertake" :okritem="scope.row"></slot>
          </template>
        </el-table-column>
        <el-table-column label="更新进度" width="120">
          <template slot-scope="scope">
            <slot name="weight-bar" :okritem="scope.row"></slot>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>

const CONFIDENCE_MAP = {
  1: '无风险',
  2: '风险可控',
  3: '失控',
};

export default {
  name: 'okrTable',
  components: {

  },
  data() {
    return {
      CONFIDENCE_MAP,
      okrmain: {},
      formData: {},
      innerActiveList: [],
    };
  },
  props: {
    tableList: {
      type: Array,
    },
    okrid: {
      type: String,
    },
    // 默认展开的序号数组
    // 如果 disabled为true，需传入activeList
    activeList: {
      type: Array,
      default() {
        return [];
      },
    },
    // disabled(不能收起：true;能收起展开：false)
    disabled: {
      type: Boolean,
      default: false,
    },
    // true写okr false okr详情
    canWrite: {
      type: Boolean,
      default: false,
    },
    // 是否显示承接
    showParentOkr: {
      type: Boolean,
      default: true,
    },
    // 是否显示label
    showOKRInfoLabel: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      defalut: '1',
    },
  },
  mounted() {
    this.innerActiveList = this.activeList;
  },
  created() {

  },
  methods: {
    showInput(index, name) {
      this.tableList[index][name] = true;
      this.$forceUpdate();
    },
    showKRInput(index, krIndex, name) {
      this.tableList[index].krList[krIndex][name] = true;
      this.$forceUpdate();
    },
    goUndertake(index) {
      // 给父组件传打开的命令
      console.log('dakai');
      this.$emit('openUndertake', index);
    },
    // 改变tableList后强制渲染
    updateokrCollapse() {
      this.$forceUpdate();
    },
    opensome(row) {
      console.log('点击了面板', row);
      // 起草中打开编辑页
      if (['6'].includes(this.status)) {
        this.$emit('goDraft', row);
      } else {
        this.$emit('openDialog', row);
      }
    },
  },
  watch: {

  },
};
</script>

<style>
.collapse span,
.collapsetitle span {
  margin-left: 10px;
}

.collapsetitle {
  margin-left: 250px;
}
.progresswidth {
  width: 150px;
  display: inline-block;
}
.detail,
.detail li {
  display: inline-flex;
}
.hideEdit {
  display: inline-flex;
}
.hideEdit .el-icon-edit {
  opacity: 0;
}
.hideEdit:hover .el-icon-edit {
  opacity: 1;
}
</style>