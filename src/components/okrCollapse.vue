<template>
  <div>
    <!-- okr折叠面板 -->
    <el-form :model="formData" ref="changeForm" v-if="formData.tableList.length > 0">
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
              <!-- 变更有承接项时 -->
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
              <!-- 变更or创建无承接项时 -->
              <li v-else-if="showParentOkr">
                <p
                  @click="goUndertake(index,'new')"
                  v-if="(item.undertakeOkrVo && item.undertakeOkrVo.undertakeOkrContent) || item.cultureName"
                >
                  <a
                    v-if="item.undertakeOkrVo && item.undertakeOkrVo.undertakeOkrContent"
                  >{{item.undertakeOkrVo.undertakeOkrContent}}</a>
                  <a v-if="item.cultureName">{{item.cultureName}}</a>
                </p>
                <el-button
                  plain
                  icon="el-icon-plus"
                  @click.native="goUndertake(index,'new')"
                  v-else
                >
                  关联
                  <span class="lines"></span>
                </el-button>
              </li>
              <!-- 详情 -->
              <li v-else-if="item.okrParentId">
                <span>目标承接自</span>
                <span>{{item.parentObjectKr}}</span>
              </li>
            </ul>
            <!-- 可在折叠面板title处添加内容 -->
            <slot name="head-bar" :okritem="item"></slot>
          </template>
          <dl
            v-for="(kritem, krIndex) in item.krList"
            :key="kritem.okrDetailId+krIndex"
            class="detail"
          >
            <dd class="hideEdit">
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
            </dd>
            <!-- <dl class="detail"> -->
            <dd class="hideEdit">
              <span>权重</span>
              <el-form-item v-if="canWrite && kritem.showWeightEdit">
                <el-input-number
                  v-model="kritem.okrWeight"
                  controls-position="right"
                  :min="0"
                  :max="100"
                  :step="1"
                  :precision="0"
                ></el-input-number>%
              </el-form-item>
              <span v-else>{{kritem.okrWeight}}%</span>
              <i
                v-if="canWrite"
                class="el-icon-edit"
                @click="showKRInput(index,krIndex,'showWeightEdit')"
              ></i>
            </dd>
            <dd>
              <span>当前进度</span>
              <span class="progresswidth">
                <el-progress
                  :stroke-width="10"
                  :percentage="parseInt(kritem.okrDetailProgress, 10)"
                ></el-progress>
              </span>
            </dd>
            <dd style="display:flex">
              <span>风险状态</span>
              <span>{{CONST.CONFIDENCE_MAP[kritem.okrDetailConfidence]}}</span>
            </dd>
            <!-- </dl> -->
            <!-- 可在折叠面板body处添加内容 -->
            <slot name="body-bar" :okritem="kritem"></slot>
          </dl>
          <div v-if="item.newkrList">
            <dl v-for="(newItem, kindex) in item.newkrList" :key="kindex">
              <dt>KR</dt>
              <dd class="objectdd">
                <el-form-item
                  :prop="'tableList.' + index + '.newkrList.' + kindex + '.okrDetailObjectKr'"
                >
                  <!-- 不强制刷新无法输入 -->
                  <el-input
                    placeholder="请输入关键结果"
                    v-model="newItem.okrDetailObjectKr"
                    @input="updateokrCollapse"
                  ></el-input>
                </el-form-item>
                <el-form-item label="权重">
                  <el-input-number
                    v-model="newItem.okrWeight"
                    controls-position="right"
                    :min="0"
                    :max="100"
                    :step="1"
                    :precision="0"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="当前进度">
                  <el-input-number
                    v-model="newItem.okrDetailProgress"
                    controls-position="right"
                    :min="0"
                    :max="100"
                    :step="1"
                    :precision="0"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="风险状态">
                  <el-popover
                    placement="bottom"
                    width="400"
                    trigger="click"
                    :append-to-body="false"
                  >
                    <el-radio-group
                      v-model="newItem.okrDetailConfidence"
                      @change="updateokrCollapse"
                    >
                      <el-radio-button
                        v-for="citem in CONST.CONFIDENCE"
                        :key="citem.value"
                        :label="citem.value"
                      >{{citem.label}}</el-radio-button>
                    </el-radio-group>
                    <el-button
                      slot="reference"
                    >{{CONST.CONFIDENCE_MAP[newItem.okrDetailConfidence]}}</el-button>
                  </el-popover>
                </el-form-item>
                <el-button @click="deletekr(item,kindex)">删kr</el-button>
              </dd>
            </dl>
          </div>
          <div style="display:none">{{item.newkrList}}</div>
          <el-button v-if="canWrite" @click="addkr(item,'kr')">增加kr</el-button>
          <!-- <slot name="addkr-bar" :oitem="item"></slot> -->
        </elcollapseitem>
      </elcollapse>
    </el-form>
  </div>
</template>

<script>
import validateMixin from '@/mixin/validateMixin';
import elcollapse from '@/components/collapse/collapse';
import elcollapseitem from '@/components/collapse/collapse-item';
import CONST from './const';

export default {
  name: 'okrCollapse',
  mixins: [validateMixin],
  components: {
    elcollapse,
    elcollapseitem,
  },
  data() {
    return {
      CONST,
      okrmain: {},
      formData: { tableList: [] },
      innerActiveList: [],
    };
  },
  props: {
    tableList: {
      type: Array,
      default() {
        return [];
      },
    },
    okrid: {
      type: String,
      default: '',
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
      this.$emit('openUndertake', undertakeInfo);
    },
    // 改变tableList后强制渲染
    updateokrCollapse() {
      this.$forceUpdate();
    },
    // 增加kr
    addkr(okritem) {
      if (!okritem.newkrList) {
        okritem.newkrList = [];
      }
      okritem.newkrList.push({
        okrDetailObjectKr: '',
        okrWeight: 0,
        okrDetailProgress: 0,
        okrDetailConfidence: 1,
      });
      this.$forceUpdate();
    },
    // 删除kr
    deletekr(okritem, krindex) {
      okritem.newkrList.splice(krindex, 1);
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