<template>
  <el-table :data="tableList" @row-click="opensome" class="tl-table">
    <el-table-column type="expand" width="5%">
      <template slot-scope="scope">
        <dl
          v-for="kritem in scope.row.krList"
          :key="kritem.krId"
          @click="opensome(kritem)"
          class="sub-tr"
        >
          <dd class="okr-line"></dd>
          <dd class="okr-o-name">
            <span>KR</span>
            <em>{{kritem.okrDetailObjectKr}}</em>
          </dd>
          <dd class="okr-proportion">{{kritem.okrWeight}}%</dd>
          <dd class="okr-progress">
            <tl-process :data="kritem.okrDetailProgress"></tl-process>
          </dd>
          <dd class="okr-risk">
            <div class="state-grid">
              <div
                :class="{'is-no-risk': kritem.okrDetailConfidence == 1,
                    'is-risks': kritem.okrDetailConfidence == 2,
                    'is-uncontrollable': kritem.okrDetailConfidence == 3}"
              ></div>
              <div
                :class="{'is-risks': kritem.okrDetailConfidence == 2,
                    'is-uncontrollable': kritem.okrDetailConfidence == 3}"
              ></div>
              <div :class="{'is-uncontrollable': kritem.okrDetailConfidence == 3}"></div>
            </div>
            <div class="state-txt">{{CONFIDENCE_MAP[kritem.okrDetailConfidence]}}</div>
          </dd>
          <dd class="okr-undertake">
            <slot name="body-bar" :okritem="kritem"></slot>
          </dd>
          <dd class="okr-update"></dd>
        </dl>
      </template>
    </el-table-column>
    <!-- 目标O名称 无label -->
    <el-table-column prop="okrDetailObjectKr" width="42%">
      <template slot-scope="scope">
        <span>目标</span>
        <em>{{scope.row.okrDetailObjectKr}}</em>
      </template>
    </el-table-column>
    <el-table-column prop="okrWeight" label="权重" width="6%">
      <template slot-scope="scope">{{scope.row.okrWeight}}%</template>
    </el-table-column>
    <el-table-column prop="okrDetailProgress" label="进度" width="16%">
      <template slot-scope="scope">
        <tl-process :data="scope.row.okrDetailProgress"></tl-process>
      </template>
    </el-table-column>
    <el-table-column label="风险状态" width="15%"></el-table-column>
    <el-table-column label="承接地图" width="8%">
      <template slot-scope="scope">
        <slot name="head-undertake" :okritem="scope.row"></slot>
      </template>
    </el-table-column>
    <el-table-column label="更新进度" width="8%">
      <template slot-scope="scope">
        <slot name="weight-bar" :okritem="scope.row"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import process from '@/components/process';

const CONFIDENCE_MAP = {
  1: '无风险',
  2: '风险可控',
  3: '失控',
};

export default {
  name: 'okrTable',
  components: {
    'tl-process': process,
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