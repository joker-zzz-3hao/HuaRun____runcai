<template>
  <div class="tl-table-fix">
    <!-- <ul class="tl-thead">
      <li></li>
      <li></li>
      <li>权重</li>
      <li>进度</li>
      <li>风险状态</li>
      <li>承接地图</li>
      <li>更新进度</li>
    </ul>-->
    <el-table :data="tableList" class="tl-table" row-key="okrDetailId" :expand-row-keys="expands">
      <el-table-column type="expand" width="5%">
        <template slot-scope="scope">
          <dl v-for="kritem in scope.row.krList" :key="kritem.krId" class="sub-tr">
            <dd class="okr-line"></dd>
            <!-- kr名称 -->
            <dd class="okr-kr-name" @click="opensome(kritem)">
              <span>KR</span>
              <em>{{kritem.okrDetailObjectKr}}</em>
            </dd>
            <!-- kr权重 -->
            <dd class="okr-proportion">{{kritem.okrWeight}}%</dd>
            <!-- kr进度 -->
            <dd class="okr-progress">
              <tl-process :data="kritem.okrDetailProgress"></tl-process>
            </dd>
            <!-- kr风险状态 -->
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
            <!-- kr承接项 -->
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
          <span @click="opensome(scope.row)">目标</span>
          <em @click="opensome(scope.row)">{{scope.row.okrDetailObjectKr}}</em>
        </template>
      </el-table-column>
      <!-- o label="权重" -->
      <el-table-column prop="okrWeight" width="6%">
        <template slot-scope="scope">{{scope.row.okrWeight}}%</template>
      </el-table-column>
      <!-- o label="进度" -->
      <el-table-column prop="okrDetailProgress" width="16%">
        <template slot-scope="scope">
          <tl-process :data="scope.row.okrDetailProgress"></tl-process>
        </template>
      </el-table-column>
      <!-- o无风险状态 label="风险状态" -->
      <el-table-column width="15%"></el-table-column>
      <!-- o label="承接地图" -->
      <el-table-column width="8%">
        <template slot-scope="scope">
          <slot name="head-undertake" :okritem="scope.row"></slot>
        </template>
      </el-table-column>
      <!-- label="更新进度"  -->
      <el-table-column width="8%">
        <template slot-scope="scope">
          <slot name="weight-bar" :okritem="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
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
    expands: {
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
  },
  computed: {

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