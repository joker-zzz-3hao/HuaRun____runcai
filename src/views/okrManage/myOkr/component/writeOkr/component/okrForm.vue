<template>
  <div class="okr-info">
    <el-form :model="formData" ref="dataForm" class="tl-form">
      <elcollapse class="tl-collapse" v-model="activeList">
        <elcollapseitem
          ref="okrcoll"
          v-for="(oitem, index) in formData.okrInfoList"
          :key="oitem.id"
          :name="index"
        >
          <template slot="title">
            <dl class="collpase-panel has-third-child">
              <dt class="is-edit">
                <span>目标{{ index + 1 + preIndex }}</span>
                <div>
                  <el-form-item
                    :prop="'okrInfoList.' + index + '.okrDetailObjectKr'"
                    :rules="[
                      {
                        trigger: 'blur',
                        validator: validateObjectName,
                        required: true,
                      },
                    ]"
                  >
                    <el-input
                      placeholder="请输入目标名称"
                      v-model="oitem.okrDetailObjectKr"
                      class="tl-input"
                      maxlength="200"
                    ></el-input>
                  </el-form-item>
                </div>
                <el-tooltip
                  class="icon-clear"
                  :class="{
                    'is-disabled': isnew && formData.okrInfoList.length === 1,
                  }"
                  effect="dark"
                  :content="
                    formData.okrInfoList.length > 1 ? '删除' : '至少有一个目标'
                  "
                  placement="top"
                  popper-class="tl-tooltip-popper"
                  @click.native="
                    (!isnew || formData.okrInfoList.length > 1) &&
                      deleteobject(index)
                  "
                  :disabled="!isnew && formData.okrInfoList.length == 1"
                >
                  <i class="el-icon-minus"></i>
                </el-tooltip>
              </dt>
              <dd class="is-edit has-third-child">
                <div>
                  <i class="el-icon-medal"></i>
                  <span>权重</span>
                  <el-form-item
                    :prop="'okrInfoList.' + index + '.okrWeight'"
                    :rules="[
                      {
                        trigger: 'blur',
                        validator: validatePercent,
                        required: true,
                      },
                    ]"
                  >
                    <el-input-number
                      v-model="oitem.okrWeight"
                      controls-position="right"
                      :min="0"
                      :max="100"
                      :step="0.1"
                      step-strictly
                      class="tl-input-number"
                    ></el-input-number>
                    <span>%</span>
                  </el-form-item>
                </div>
                <div>
                  <i class="el-icon-odometer"></i>
                  <span>当前进度</span>
                  <el-form-item>
                    <span>0 %</span>
                  </el-form-item>
                </div>
                <div>
                  <i class="el-icon-attract"></i>
                  <span>关联父目标</span>
                  <template
                    v-if="
                      (oitem.undertakeOkrVo &&
                        oitem.undertakeOkrVo.undertakeOkrDetailId) ||
                      oitem.cultureId
                    "
                  >
                    <em
                      v-if="oitem.undertakeOkrVo.undertakeOkrContent"
                      @click="openUndertake(index)"
                      >{{ oitem.undertakeOkrVo.undertakeOkrContent }}</em
                    >
                    <em
                      v-if="
                        oitem.undertakeOkrVo.undertakeOkrContent &&
                        oitem.cultureId
                      "
                      >、</em
                    >
                    <em
                      v-if="hasValue(oitem.cultureId)"
                      @click="openUndertake(index)"
                      >{{ oitem.cultureName }}</em
                    >
                  </template>
                  <el-button
                    type="text"
                    @click.native="openUndertake(index)"
                    class="tl-btn dotted-line"
                    v-else
                  >
                    <i class="el-icon-plus"></i>
                    关联
                  </el-button>
                </div>
              </dd>
            </dl>
          </template>
          <dl
            class="collpase-panel has-third-child"
            v-for="(kitem, kindex) in oitem.krList"
            :key="kitem.id"
          >
            <dt class="is-edit">
              <span>KR{{ kindex + 1 }}</span>
              <div>
                <el-form-item
                  :prop="
                    'okrInfoList.' +
                    index +
                    '.krList.' +
                    kindex +
                    '.okrDetailObjectKr'
                  "
                  :rules="[
                    {
                      required: true,
                      trigger: 'blur',
                      validator: validateKRName,
                    },
                  ]"
                >
                  <el-input
                    placeholder="请输入关键结果"
                    v-model="kitem.okrDetailObjectKr"
                    class="tl-input"
                    maxlength="500"
                  ></el-input>
                </el-form-item>
              </div>
              <el-tooltip
                class="icon-clear"
                :class="{ 'is-disabled': oitem.krList.length === 1 }"
                effect="dark"
                :content="
                  oitem.krList.length > 1 ? '删除' : '至少有一个关键结果'
                "
                placement="top"
                popper-class="tl-tooltip-popper"
                @click.native="
                  oitem.krList.length > 1 && deletekr(index, kindex)
                "
              >
                <i class="el-icon-minus"></i>
              </el-tooltip>
            </dt>
            <dd class="has-third-child">
              <el-form-item
                label="权重"
                :prop="
                  'okrInfoList.' + index + '.krList.' + kindex + '.okrWeight'
                "
                :rules="[
                  {
                    trigger: 'blur',
                    validator: validatePercent,
                    required: true,
                  },
                ]"
              >
                <el-input-number
                  v-model.trim="kitem.okrWeight"
                  controls-position="right"
                  :min="0"
                  :max="100"
                  :step="0.1"
                  step-strictly
                  class="tl-input-number"
                ></el-input-number>
                <span>%</span>
              </el-form-item>
              <el-form-item label="当前进度">
                <el-input-number
                  v-model.trim="kitem.okrDetailProgress"
                  controls-position="right"
                  :min="0"
                  :max="100"
                  :step="1"
                  :precision="0"
                  class="tl-input-number"
                ></el-input-number>
                <span>%</span>
              </el-form-item>
              <el-form-item label="信心指数">
                <tl-confidence
                  v-model="kitem.okrDetailConfidence"
                ></tl-confidence>
              </el-form-item>
            </dd>
            <dd>
              <div @click="openMore(kitem)">
                <span>考核办法（如有）</span>
                <i
                  class="el-icon-arrow-right"
                  :class="{ 'is-active': kitem.openMore }"
                ></i>
              </div>
              <el-form-item label="考核指标" v-show="kitem.openMore">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 8 }"
                  placeholder="请输入考核指标"
                  v-model="kitem.checkQuota"
                  maxlength="1500"
                  class="tl-textarea"
                ></el-input>
              </el-form-item>
              <el-form-item label="衡量办法" v-show="kitem.openMore">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 8 }"
                  placeholder="请输入衡量办法"
                  v-model="kitem.judgeMethod"
                  maxlength="1500"
                  class="tl-textarea"
                ></el-input>
              </el-form-item>
            </dd>
          </dl>
          <el-button
            type="text"
            @click="addkr(index)"
            class="tl-btn sub-list-add"
          >
            <i class="el-icon-plus"></i>添加关键结果
          </el-button>
        </elcollapseitem>
      </elcollapse>
      <div class="btn-box">
        <el-button
          type="text"
          @click="addobject()"
          class="tl-btn dotted-line list-add"
        >
          <i class="el-icon-plus"></i>添加目标
        </el-button>
      </div>
    </el-form>

    <!-- 变更原因 -->
    <div v-if="searchForm.approvalType == 1">
      <span>变更原因</span>
      <el-form :model="reason" ref="reasonForm">
        <el-form-item
          prop="modifyReason"
          :rules="[
            { trigger: 'blur', message: '变更原因不能为空', required: true },
          ]"
        >
          <el-input
            maxlength="200"
            type="textarea"
            v-model="reason.modifyReason"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 关联承接项抽屉 -->
    <el-drawer
      :wrapperClosable="false"
      :visible.sync="innerDrawer"
      :modal="false"
      :append-to-body="true"
      custom-class="custom-drawer associated-undertaking"
      class="tl-drawer"
    >
      <div slot="title" class="flex-sb">
        <div class="drawer-title">关联父目标</div>
      </div>
      <undertake-table
        v-if="selectIndex !== '' && innerDrawer"
        ref="undertake"
        :server="server"
        :periodName="periodName"
        :selectRadioDepart="
          formData.okrInfoList[this.selectIndex].currentOption
        "
        :selectRadioPhil.sync="formData.okrInfoList[this.selectIndex].cultureId"
        :okrBelongType="searchForm.okrType"
      ></undertake-table>
      <div class="operating-box">
        <el-button
          type="primary"
          @click="summitUndertake()"
          class="tl-btn amt-bg-slip"
          >确定</el-button
        >
        <el-button
          @click="innerDrawer = false"
          plain
          class="tl-btn amt-border-fadeout"
          >取消</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import confidenceSelect from '@/components/confidenceSelect';
import elcollapse from '@/components/collapse/collapse';
import elcollapseitem from '@/components/collapse/collapse-item';
import validateMixin from '@/mixin/validateMixin';
import undertakeTable from './undertakeTable';

// 自动保存时间 30秒
const TIME_INTERVAL = 30 * 1000;

export default {
  name: 'orkForm',
  mixins: [validateMixin],
  components: {
    elcollapse,
    elcollapseitem,
    'undertake-table': undertakeTable,
    'tl-confidence': confidenceSelect,
  },
  data() {
    return {
      formData: {
        okrBelongType: '',
        okrInfoList: [{
          // id: 0,
          okrDetailObjectKr: '',
          okrWeight: 0,
          okrDetailProgress: 0,
          cultureId: '',
          currentOption: '',
          krList: [{
          // id: 0,
            okrDetailObjectKr: '',
            okrWeight: 0,
            okrDetailProgress: 0,
            okrDetailConfidence: '1',
            checkQuota: '',
            judgeMethod: '',
          }],
          undertakeOkrVo: {},
        }],
      },
      // departokrList: [], // 可关联承接的okr
      // departokrObject: '{}', // 可关联承接的okr
      // philosophyList: [], // 价值观
      // philosophyObject: '{}', // 价值观
      okrPeriod: {}, // 周期
      dialogVisible: false, // 弹出框打开关闭
      selectIndex: '', // 选择o的序号
      innerDrawer: false,
      periodName: '', // 周期名
      reason: {},
      visibleQuota: false, // 考核的弹窗
      loading: false,
      activeList: [0],
      lastWeightmsg: '剩余权重 计算中...',
    };
  },
  props: {
    searchForm: {
      type: Object,
    },
    server: {
      type: Object,
      required: true,
    },
    isnew: {
      type: Boolean,
      default: true,
    },
    preIndex: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    // activeList() {
    //   const activeLength = this.formData.okrInfoList.length;
    //   console.log([...new Array(activeLength).keys()]);
    //   return [...new Array(activeLength).keys()];
    // },

  },
  mounted() {
    if (!this.isnew) {
      this.deleteobject(0);
    }
  },
  created() {
    if (['6', '8'].includes(this.searchForm.okrStatus)) {
      this.getOkrDraftById();
    }
    // 自动保存去掉
    // if (this.searchForm.okrStatus != '8' && this.isnew) {
    //   this.autosave();
    // }
  },
  methods: {
    ...mapMutations('common', ['setokrSuccess', 'setCreateokrDrawer', 'setShowAuto', 'setLoading']),
    // 获取暂存的草稿
    getOkrDraftById() {
      this.formData = JSON.parse(this.searchForm.draftParams);
      //
      if (this.formData.okrInfoList.length > 0) {
        this.formData.okrInfoList.forEach((item) => {
          item.undertakeOkrVo = item.undertakeOkrVo || {};
          item.undertakeOkrDto = item.undertakeOkrDto || {};
          if (item.undertakeOkrVo.undertakeOkrDetailId) {
            item.currentOption = item.undertakeOkrVo.undertakeOkrDetailId + item.undertakeOkrVo.undertakeOkrVersion;
          } else if (item.undertakeOkrDto.undertakeOkrDetailId) {
            this.$set(item, 'undertakeOkrVo', item.undertakeOkrDto);
            item.currentOption = item.undertakeOkrDto.undertakeOkrDetailId + item.undertakeOkrDto.undertakeOkrVersion;
          } else {
            item.currentOption = '';
          }
          // this.$forceUpdate();
        });
      }
    },
    // 自动保存
    autosave() {
      this.timedInterval = setInterval(() => {
        this.saveDraft('auto');
      }, TIME_INTERVAL);
    },
    // 增加kr
    addkr(oindex) {
      if (this.formData.okrInfoList[oindex].krList.length > 20) {
        this.$message('最多能创建20个关键结果KR');
        return;
      }
      this.formData.okrInfoList[oindex].krList.push({
        // id: this.formData.okrInfoList[oindex].krList.length,
        okrDetailObjectKr: '',
        okrWeight: 0,
        okrDetailProgress: 0,
        okrDetailConfidence: '1',
        checkQuota: '',
        judgeMethod: '',
      });
    },
    // 删除kr
    deletekr(oindex, krindex) {
      if (this.formData.okrInfoList[oindex].krList.length <= 1) {
        this.$message('至少有一个关键结果');
        return;
      }
      this.formData.okrInfoList[oindex].krList.splice(krindex, 1);
    },
    // 增加o
    addobject() {
      if (this.formData.okrInfoList.length > 20) {
        this.$message('最多能创建20个目标O');
        return;
      }
      this.formData.okrInfoList.push({
        // id: this.formData.okrInfoList.length,
        okrDetailObjectKr: '',
        okrWeight: 0,
        okrDetailProgress: 0,
        okrParentDetailId: '',
        cultureId: '',
        currentOption: '',
        krList: [{
          okrDetailObjectKr: '',
          okrWeight: 0,
          okrDetailProgress: 0,
          okrDetailConfidence: '1',
          checkQuota: '',
          judgeMethod: '',
        }],
        undertakeOkrVo: {},
      });
      // 自动打开新增加的
      if (this.formData.okrInfoList.length > 0) {
        const newOpen = [this.formData.okrInfoList.length - 1];
        this.activeList = this.activeList.concat(newOpen);
      }
    },
    // 删除o
    deleteobject(oindex) {
      this.formData.okrInfoList.splice(oindex, 1);
    },

    openUndertake(index) {
      // 选择o的序号，打开关联承接弹框
      // 选择radioDepart radioPhil
      this.selectIndex = index;
      if (this.formData.okrInfoList[this.selectIndex].undertakeOkrVo) {
        // eslint-disable-next-line max-len
        this.formData.okrInfoList[this.selectIndex].currentOption = this.formData.okrInfoList[this.selectIndex].undertakeOkrVo
          .undertakeOkrDetailId
          + this.formData.okrInfoList[this.selectIndex].undertakeOkrVo
            .undertakeOkrVersion || '';
      }
      this.innerDrawer = true;
    },
    // 提交关联，给选中的o加上承接项和价值观
    summitUndertake() {
      this.selectDepartRow = this.$refs.undertake.selectDepartRow;
      this.selectPhilRow = this.$refs.undertake.selectPhilRow;
      console.log(' 提交关联', this.$refs.undertake.selectDepartRow);
      // eslint-disable-next-line max-len
      // 承接项的id、版本、名称
      this.formData.okrInfoList[this.selectIndex].undertakeOkrVo.undertakeOkrDetailId = this.selectDepartRow.okrDetailId || '';
      this.formData.okrInfoList[this.selectIndex].undertakeOkrVo.undertakeOkrVersion = this.selectDepartRow.okrDetailVersion || '';
      this.formData.okrInfoList[this.selectIndex].undertakeOkrVo.undertakeOkrContent = this.selectDepartRow.okrDetailObjectKr || '';
      // 价值观的id、内容
      this.formData.okrInfoList[this.selectIndex].cultureId = this.selectPhilRow.id || '';
      this.formData.okrInfoList[this.selectIndex].cultureName = this.selectPhilRow.cultureName || '';
      this.innerDrawer = false;
    },
    // 提交表单
    summit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          // 校验权重比例
          let opercent = 0;
          let keypercent = 0;
          try {
            this.formData.okrInfoList.forEach((oitem) => {
              opercent += oitem.okrWeight;
              keypercent = 0;
              oitem.krList.forEach((kitem) => {
                keypercent += kitem.okrWeight;
              });
              if (keypercent != 100) {
                this.$message.error('结果KR权重值总和必须为100');
                throw Error();
              }
            });
            if (opercent != 100) {
              this.$message.error('目标O权重值总和必须为100');
              throw Error();
            }
          } catch (e) {
            return;
          }

          if (this.searchForm.okrCycle.periodId) {
            this.formData.periodId = this.searchForm.okrCycle.periodId;
          } else {
            this.$message.error('请选择目标周期');
            return;
          }
          this.formData.okrBelongType = this.searchForm.okrType;
          this.formData.okrDraftId = this.searchForm.draftId;
          this.formData.approvalId = this.searchForm.approvalId;
          if (this.searchForm.approvalType == 1) {
            this.summitChange();
          } else {
            this.summitNew();
          }
        }
      });
    },

    // 保存草稿
    saveDraft(type = '') {
      if (this.formData.okrInfoList.length == 1
      && this.formData.okrInfoList[0].okrDetailObjectKr == ''
      && this.formData.okrInfoList[0].krList[0].okrDetailObjectKr == ''
      ) {
        return;
      }
      if (this.searchForm.okrCycle.periodId) {
        this.formData.periodId = this.searchForm.okrCycle.periodId;
      } else {
        this.$message.error('请选择目标周期');
        return;
      }
      // 校验是否有更改
      let hasChange = true;
      this.formData.okrInfoList.forEach((item) => {
        if (item.okrDetailObjectKr) {
          hasChange = false;
          return;
        }
        item.krList.forEach((kritem) => {
          if (kritem.okrDetailObjectKr) {
            hasChange = false;
          }
        });
      });
      if (hasChange) {
        return;
      }
      if (this.formData.okrInfoList.length > 0) {
        this.formData.okrBelongType = this.searchForm.okrType;
        this.formData.okrDraftId = this.searchForm.draftId;
        this.server.saveOkrDraft(this.formData).then((res) => {
          if (res.code == 200) {
            if (type) {
              this.searchForm.draftId = res.data.id;
              this.setShowAuto(true);
              // this.timedShow = setInterval(() => {
              //   this.setShowAuto(false);
              // }, 3000);
            } else {
              this.$message('已保存');
              this.$refs.dataForm.resetFields();
              this.setokrSuccess(true);
              this.close();
            }
          }
        });
      }
    },
    // 关闭
    close() {
      this.setCreateokrDrawer(false);
      this.setShowAuto(false);
    },
    // 新建okr
    summitNew() {
      this.loading = true;
      this.setLoading(true);
      this.server.addokr(this.formData).then((res) => {
        if (res.code == 200) {
          this.$message.success('创建成功，请等待上级领导审批。');
          this.$refs.dataForm.resetFields();
          this.setokrSuccess(true);
          this.close();
        } else if (res.code == 30000) {
          if (res.msg.indexOf('权重') != -1) {
            this.$message.error(res.msg);
            this.loading = false;
            return;
          }
          this.$xconfirm({
            content: '',
            title: '当前周期已提交，是否保存为草稿？',
          }).then(() => {
            // 提交确认弹窗
            this.saveDraft();
          }).catch(() => {});
        }
        if (res.code) {
          this.loading = false;
          this.setLoading(false);
        }
      });
    },
    // 变更
    summitChange() {
      // 拼入参
      this.formData.okrInfoList.forEach((item) => {
        // 新增或变更承接项
        if (item.undertakeOkrVo) {
          item.undertakeOkr = item.undertakeOkrVo;
          // 原有承接不改变
        }
      });

      const formChangeData = {
        okrInfoList: this.formData.okrInfoList,
        periodId: this.formData.periodId,
        okrProgress: this.formData.okrProgress,
        modifyReason: this.reason.modifyReason,
        okrMainId: this.formData.okrMainId,
        okrBelongType: this.formData.okrBelongType,
        approvalId: this.formData.approvalId,
      };
      this.server.modifyOkrInfo(formChangeData).then((res) => {
        if (res.code == 200) {
          this.$message.success('提交成功');
          this.close();
        } else if (res.code === 30000) {
          this.$message.warning('变更申请正在审批中，请勿重复提交');
        }
      });
    },
    showTip(type, oindex, krindex) {
      if (type == 'o') {
        let opercent = 0;
        this.formData.okrInfoList.forEach((oitem) => {
          opercent += oitem.okrWeight;
        });
        this.lastWeightmsg = `剩余可填权重${100 - opercent}%`;
        this.formData.okrInfoList[oindex].showTip = true;
        this.$forceUpdate();
      } else {
        let keypercent = 0;
        this.formData.okrInfoList[oindex].krList.forEach((kitem) => {
          keypercent += kitem.okrWeight;
        });
        this.lastWeightmsg = `剩余可填权重${100 - keypercent}%`;
        this.formData.okrInfoList[oindex].krList[krindex].showTip = true;
        this.$forceUpdate();
      }
    },
    hideTip(type, oindex, krindex) {
      if (type == 'o') {
        this.formData.okrInfoList[oindex].showTip = false;
      } else {
        this.formData.okrInfoList[oindex].krList[krindex].showTip = false;
      }
      this.lastWeightmsg = '剩余权重 计算中...';
    },
    // 展开考核指标衡量办法
    openMore(item) {
      item.openMore = !item.openMore;
      this.$forceUpdate();
    },
  },
  watch: {
    'searchForm.okrCycle': {
      handler(newVal) {
        if (newVal && newVal.periodId) {
          this.periodName = newVal.periodName;
          if (this.selectIndex !== '') {
            console.log(newVal, this.selectIndex);
            for (let i = 0; i < this.formData.okrInfoList.length; i += 1) {
              this.formData.okrInfoList[i].undertakeOkrVo = {};
              this.formData.okrInfoList[i].cultureId = '';
              this.formData.okrInfoList[i].cultureName = '';
            }
          }
        }
      },
      deep: true,
    },
    'searchForm.okrType': {
      handler() {
        for (let i = 0; i < this.formData.okrInfoList.length; i += 1) {
          this.formData.okrInfoList[i].undertakeOkrVo = {};
          this.formData.okrInfoList[i].cultureId = '';
          this.formData.okrInfoList[i].cultureName = '';
        }
      },
    },
    searchForm: {
      handler() {
        if (['6', '8'].includes(this.searchForm.okrStatus)) {
          this.getOkrDraftById();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  beforeDestroy() {
    clearInterval(this.timedInterval);
  },
};
</script>