<template>
  <div class="tl-table-fix">
    <ul class="tl-thead">
      <li class="fold" :class="{ 'is-toggle': expands.length > 0 }">
        <span v-if="expands.length > 0" @click="handleOpen">全部收起</span>
        <span v-else @click="handleOpen">全部展开</span>
        <i class="el-icon-arrow-right" @click="handleOpen"></i>
      </li>
      <li>权重</li>
      <li>进度</li>
    </ul>
    <el-table
      :data="tableList"
      class="tl-table"
      row-key="okrDetailId"
      :expand-row-keys="expands"
      @expand-change="echange"
    >
      <el-table-column type="expand" width="5%">
        <template slot-scope="scope">
          <dl
            v-for="(kritem, krindex) in scope.row.krList"
            :key="kritem.krId"
            class="sub-tr"
          >
            <dd class="okr-line"></dd>
            <!-- kr名称 -->
            <dd class="okr-kr-name tag-kind">
              <span class="kind-child">KR{{ krindex + 1 }}</span>
              <el-tooltip
                effect="dark"
                placement="top"
                popper-class="tl-tooltip-popper"
              >
                <div slot="content">{{ kritem.okrDetailObjectKr }}</div>
                <em>{{ kritem.okrDetailObjectKr }}</em>
              </el-tooltip>
            </dd>
            <!-- kr权重 -->
            <dd class="okr-proportion">{{ kritem.okrWeight }}%</dd>
            <!-- kr进度 -->
            <dd class="okr-progress">
              <tl-process
                :data="parseInt(kritem.okrDetailProgress, 10)"
              ></tl-process>
            </dd>
          </dl>
        </template>
      </el-table-column>
      <!-- 目标O名称 无label -->
      <el-table-column prop="okrDetailObjectKr" width="69%">
        <template slot-scope="scope">
          <div class="tag-kind">
            <span class="kind-parent">目标{{ scope.$index + 1 }}</span>
            <!-- kr数量  -->
            <span class="kr-num">「{{ scope.row.krList.length }}个KR」</span>
            <el-tooltip
              effect="dark"
              placement="top"
              popper-class="tl-tooltip-popper"
            >
              <div slot="content">{{ scope.row.okrDetailObjectKr }}</div>
              <em>{{ scope.row.okrDetailObjectKr }}</em>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <!-- o label="权重" -->
      <el-table-column prop="okrWeight" width="8%">
        <template slot-scope="scope">{{ scope.row.okrWeight }}%</template>
      </el-table-column>
      <!-- o label="进度" -->
      <el-table-column prop="okrDetailProgress" width="18%">
        <template slot-scope="scope">
          <em class="progress-number">{{ scope.row.okrDetailProgress }}%</em>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import process from '@/components/process';

const CONFIDENCE_MAP = {
  1: '高',
  2: '中',
  3: '低',
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
    showUpdate: {
      type: Boolean,
      default: true,
    },
    status: {
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
      // 起草中，已退回打开编辑页
      if (['6', '8'].includes(this.status)) {
        this.$emit('goDraft', row);
      } else {
        this.$emit('openDialog', row);
      }
    },
    // 展示收起
    handleOpen() {
      if (this.expands.length == 0) {
        let allexpands = [];
        allexpands = this.tableList.map((item) => item.okrDetailId);
        // this.tableList.forEach((item) => {
        //   this.expands.push(item.okrDetailId);
        //   console.log(item);
        // });
        this.$emit('update:expands', allexpands);
      } else {
        this.$emit('update:expands', []);
        // this.expands = [];
      }
    },
    echange(a, b) {
      const result = b.map((ii) => ii.okrDetailId);
      this.$emit('update:expands', result);
    },
  },
  watch: {

  },
};
</script>