<template>
  <div>
    <!-- okr折叠面板 -->
    <el-form :model="formData" ref="changeForm">
      <elcollapse class="collapse" v-model="activeList">
        <elcollapseitem
          ref="okrcoll"
          v-for="(item, index) in formData.tableList"
          :key="item.okrDetailId+index"
          :name="index"
          :disabled="disabled"
        >
          <template slot="title">
            <div class="hideEdit">
              <span v-if="showOKRInfoLabel">目标：</span>
              <el-form-item
                style="display:inline-block"
                v-if="canWrite && item.showTitleEdit"
                :prop="'tableList.' + index + '.okrDetailObjectKr'"
                :rules="[{trigger: 'blur',validator:validateObjectName, required:true}]"
              >
                <el-input placeholder="请输入目标名称" v-model="item.okrDetailObjectKr"></el-input>
              </el-form-item>
              <span v-else>{{item.okrDetailObjectKr}}</span>
              <!-- 做成hover -->
              <i v-if="canWrite" class="el-icon-edit" @click="showInput(index,'showTitleEdit')"></i>
            </div>
            <ul class="detail">
              <li class="hideEdit">
                <span>权重</span>
                <el-form-item v-if="canWrite && item.showWeightEdit">
                  <el-input-number
                    v-model="item.okrWeight"
                    controls-position="right"
                    :min="0"
                    :max="100"
                    :step="1"
                    :precision="0"
                  ></el-input-number>
                </el-form-item>
                <span v-else>{{item.okrWeight}}%</span>
                <i v-if="canWrite" class="el-icon-edit" @click="showInput(index,'showWeightEdit')"></i>
              </li>
              <li>
                <span>当前进度</span>
                <span class="progresswidth">
                  <el-progress
                    :stroke-width="10"
                    :percentage="parseInt(item.okrDetailProgress, 10)"
                  ></el-progress>
                </span>
              </li>
              <!-- 有承接项时 -->
              <li v-if="showParentOkr && item.okrParentId">
                <span>目标承接自</span>
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
                      <a @click="goUndertake(index,'change')">查看详情</a>
                    </span>
                    <i class="el-icon-warning" slot="reference"></i>
                  </el-popover>
                </span>
              </li>
              <!-- 无承接项时 -->
              <li v-else-if="showParentOkr">
                <a @click="goUndertake(index,'new')">
                  <span
                    v-if="(item.undertakeOkrVo && item.undertakeOkrVo.undertakeOkrObjectKr) || item.cultureName"
                  >{{item.undertakeOkrVo.undertakeOkrObjectKr}}{{item.cultureName}}</span>
                  <span v-else>+关联</span>
                </a>
              </li>
            </ul>
            <!-- 可在折叠面板title处添加内容 -->
            <slot name="head-bar" :okritem="item"></slot>
          </template>
          <div v-for="(kritem, krIndex) in item.krList" :key="kritem.okrDetailId+krIndex">
            <div class="hideEdit">
              <span v-if="showOKRInfoLabel">KR</span>
              <el-form-item
                style="display:inline-block"
                v-if="canWrite && kritem.showTitleEdit"
                :prop="'tableList.' + index + '.krList.' + krIndex + '.okrDetailObjectKr'"
                :rules="[{required:true, trigger:'blur',validator:validateKRName}]"
              >
                <el-input placeholder="请输入关键结果" v-model="kritem.okrDetailObjectKr"></el-input>
              </el-form-item>
              <span v-else>
                <span>{{krIndex+1}}</span>
                {{kritem.okrDetailObjectKr}}
              </span>
              <!-- 做成hover -->
              <i
                v-if="canWrite"
                class="el-icon-edit"
                @click="showKRInput(index,krIndex,'showTitleEdit')"
              ></i>
            </div>
            <ul class="detail">
              <li class="hideEdit">
                <span>分权重</span>
                <el-form-item v-if="canWrite && kritem.showWeightEdit">
                  <el-input-number
                    v-model="kritem.okrWeight"
                    controls-position="right"
                    :min="0"
                    :max="100"
                    :step="1"
                    :precision="0"
                  ></el-input-number>
                </el-form-item>
                <span v-else>{{kritem.okrWeight}}%</span>
                <i
                  v-if="canWrite"
                  class="el-icon-edit"
                  @click="showKRInput(index,krIndex,'showWeightEdit')"
                ></i>
              </li>
              <li>
                <span>当前进度</span>
                <span class="progresswidth">
                  <el-progress
                    :stroke-width="10"
                    :percentage="parseInt(kritem.okrDetailProgress, 10)"
                  ></el-progress>
                </span>
              </li>
              <li>
                <span>风险状态</span>
                <!-- okrDetailConfidence -->
                <span>{{kritem.okrDetailConfidence}}</span>
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
import validateMixin from '@/mixin/validateMixin';
import elcollapse from '@/components/collapse/collapse';
import elcollapseitem from '@/components/collapse/collapse-item';

export default {
  name: 'okrCollapse',
  mixins: [validateMixin],
  components: {
    elcollapse, elcollapseitem,
  },
  data() {
    return {
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
    goUndertake(index, type) {
      // 给父组件传打开的命令
      const undertakeInfo = {
        num: parseInt(index, 10),
        type,
      };
      console.log('dakai', undertakeInfo);
      this.$emit('openUndertake', undertakeInfo);
    },
    // 改变tableList后强制渲染
    updateokrCollapse() {
      this.$forceUpdate();
    },
  },
  watch: {
    tableList: {
      handler(newVal) {
        if (newVal) {
          this.formData.tableList = this.tableList;
          this.$forceUpdate();
        }
      },
      immediate: true,
      deep: true,
    },
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
  display: flex;
}

.hideEdit .el-icon-edit {
  opacity: 0;
}
.hideEdit:hover .el-icon-edit {
  opacity: 1;
}
</style>