<template>
  <div>
    <!-- okr折叠面板 -->
    <el-form v-model="formData">
      <elcollapse class="collapse" v-model="activeList">
        <elcollapseitem
          ref="okrcoll"
          v-for="(item, index) in tableList"
          :key="item.detailId+index"
          :name="index"
          :disabled="disabled"
          @click.native.stop="opensome(item)"
        >
          <template slot="title">
            <ul class="detail">
              <li>
                <span v-if="showOKRInfoLabel">目标O：</span>
                <span>{{item.okrDetailObjectKr}}</span>
              </li>
              <li class="hideEdit">
                <span>{{item.okrWeight}}%</span>
              </li>
              <li>
                <span class="progresswidth">
                  <el-progress
                    :stroke-width="10"
                    :percentage="parseInt(item.okrDetailProgress, 10)"
                  ></el-progress>
                </span>
              </li>
              <!-- 承接地图 -->
              <li v-if="showParentOkr">
                <span>{{item.parentObjectKr}}</span>
                <!-- 是变更且有更新显示icon -->
                <span v-if="canWrite && item.parentUpdate">
                  <el-popover
                    placement="top-start"
                    width="200"
                    trigger="hover"
                    :append-to-body="false"
                  >
                    <span>
                      您承接的OKR有变更，
                      <a @click="goUndertake(index)">查看详情</a>
                    </span>
                    <i class="el-icon-warning" slot="reference"></i>
                  </el-popover>
                </span>
              </li>
            </ul>
            <!-- 可在折叠面板title处添加内容 -->
            <slot name="head-bar" :okritem="item"></slot>
          </template>
          <div v-for="(kritem, krIndex) in item.krList" :key="kritem.detailId+krIndex">
            <ul class="detail">
              <li>
                <span v-if="showOKRInfoLabel">关键行动KR：</span>
                <span>{{kritem.okrDetailObjectKr}}</span>
              </li>
              <li class="hideEdit">
                <span>{{kritem.okrWeight}}%</span>
              </li>
              <li>
                <span class="progresswidth">
                  <el-progress
                    :stroke-width="10"
                    :percentage="parseInt(kritem.okrDetailProgress, 10)"
                  ></el-progress>
                </span>
              </li>
              <li>
                <!-- okrDetailConfidence -->
                <span>{{CONFIDENCE_MAP[kritem.okrDetailConfidence]}}</span>
              </li>
            </ul>
            <!-- 可在折叠面板body处添加内容 -->
            <slot name="body-bar" :okritem="kritem"></slot>
          </div>
          <slot name="addkr-bar" :oitem="item"></slot>
        </elcollapseitem>
      </elcollapse>
    </el-form>
  </div>
</template>

<script>
import elcollapse from '@/components/collapse/collapse';
import elcollapseitem from '@/components/collapse/collapse-item';

const CONFIDENCE_MAP = {
  1: '无风险',
  2: '风险可控',
  3: '失控',
};

export default {
  name: 'okrCollapse',
  components: {
    elcollapse, elcollapseitem,
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
    opensome(item) {
      console.log('点击了面板', item);
      // 起草中打开编辑页
      if (['6', '8'].includes(this.status)) {
        this.$emit('goDraft', item);
      } else {
        this.$emit('openDialog', item);
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