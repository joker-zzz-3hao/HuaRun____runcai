<template>
  <div class="okr-info">
    <el-form :model="formData" ref="dataForm" class="tl-form">
      <elcollapse class="tl-collapse" v-model="activeList">
        <elcollapseitem
          ref="okrcoll"
          v-for="(oitem,index) in formData.okrInfoList"
          :key="oitem.id"
          :name="index"
        >
          <template slot="title">
            <dl class="collpase-panel has-third-child">
              <dt class="is-edit">
                <span>目标{{index+1+preIndex}}</span>
                <div>
                  <el-form-item
                    :prop="'okrInfoList.' + index + '.okrDetailObjectKr'"
                    :rules="[{trigger: 'blur',validator:validateObjectName, required:true}]"
                  >
                    <el-input
                      placeholder="请输入目标名称"
                      v-model="oitem.okrDetailObjectKr"
                      class="tl-input"
                      maxlength="50"
                    ></el-input>
                  </el-form-item>
                </div>
                <el-tooltip
                  class="icon-clear"
                  :class="{'is-disabled':isnew && formData.okrInfoList.length === 1}"
                  effect="dark"
                  :content="formData.okrInfoList.length > 1 ? '删除' : '至少有一个目标'"
                  placement="top"
                  popper-class="tl-tooltip-popper"
                  @click.native="(!isnew || formData.okrInfoList.length > 1) && deleteobject(index)"
                  :disabled="!isnew && formData.okrInfoList.length == 1"
                >
                  <i class="el-icon-minus"></i>
                </el-tooltip>
              </dt>
              <dd class="is-edit has-third-child">
                <div>
                  <i class="el-icon-medal"></i>
                  <span>权重</span>
                  <el-form-item>
                    <el-input-number
                      v-model="oitem.okrWeight"
                      controls-position="right"
                      :min="0"
                      :max="100"
                      :step="1"
                      :precision="0"
                      class="tl-input-number"
                    ></el-input-number>
                    <span>%</span>
                  </el-form-item>
                </div>
                <div>
                  <i class="el-icon-odometer"></i>
                  <span>当前进度</span>
                  <el-form-item>
                    <el-input-number
                      v-model="oitem.okrDetailProgress"
                      controls-position="right"
                      :min="0"
                      :max="100"
                      :step="1"
                      :precision="0"
                      class="tl-input-number"
                    ></el-input-number>
                    <span>%</span>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item>
                    <i class="el-icon-attract"></i>
                    <span>关联父目标</span>
                    <p
                      v-if="(oitem.undertakeOkrVo && oitem.undertakeOkrVo.undertakeOkrDetailId)
                      || oitem.cultureId"
                      @click="openUndertake(index)"
                    >
                      <a
                        v-if="oitem.undertakeOkrVo.undertakeOkrContent"
                      >{{oitem.undertakeOkrVo.undertakeOkrContent}}</a>
                      <a v-if="oitem.cultureName">{{oitem.cultureName}}</a>
                    </p>
                    <el-button
                      type="text"
                      @click.native="openUndertake(index)"
                      class="tl-btn dotted-line"
                      v-else
                    >
                      <i class="el-icon-plus"></i>
                      关联
                    </el-button>
                  </el-form-item>
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
              <span>KR{{kindex+1}}</span>
              <div>
                <el-form-item
                  :prop="'okrInfoList.' + index + '.krList.' + kindex + '.okrDetailObjectKr'"
                  :rules="[{required:true, trigger:'blur',validator:validateKRName}]"
                >
                  <el-input
                    placeholder="请输入关键结果"
                    v-model="kitem.okrDetailObjectKr"
                    class="tl-input"
                    maxlength="100"
                  ></el-input>
                </el-form-item>
              </div>
              <el-tooltip
                class="icon-clear"
                :class="{'is-disabled':oitem.krList.length === 1}"
                effect="dark"
                :content="oitem.krList.length > 1 ? '删除' : '至少有一个关键结果'"
                placement="top"
                popper-class="tl-tooltip-popper"
                @click.native="(oitem.krList.length > 1) && deletekr(index,kindex)"
              >
                <i class="el-icon-minus"></i>
              </el-tooltip>
            </dt>
            <dd class="has-third-child">
              <el-form-item label="权重">
                <el-input-number
                  v-model.trim="kitem.okrWeight"
                  controls-position="right"
                  :min="0"
                  :max="100"
                  :step="1"
                  :precision="0"
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
              <el-form-item label="风险状态">
                <tl-confidence v-model="kitem.okrDetailConfidence"></tl-confidence>
              </el-form-item>
            </dd>
            <dd>
              <el-form-item
                label="考核指标"
                :prop="'okrInfoList.' + index + '.krList.' + kindex + '.checkQuota'"
                :rules="[{required:true, trigger:'blur',message:'请输入考核指标'}]"
              >
                <el-input
                  placeholder="请输入考核指标"
                  v-model="kitem.checkQuota"
                  maxlength="50"
                  class="tl-input"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="衡量办法"
                :prop="'okrInfoList.' + index + '.krList.' + kindex + '.judgeMethod'"
                :rules="[{required:true, trigger:'blur',message:'请输入衡量办法'}]"
              >
                <el-input
                  placeholder="请输入衡量办法"
                  v-model="kitem.judgeMethod"
                  maxlength="50"
                  class="tl-input"
                ></el-input>
              </el-form-item>
            </dd>
          </dl>
          <el-button type="text" @click="addkr(index)" class="tl-btn sub-list-add">
            <i class="el-icon-plus"></i>添加关键结果
          </el-button>
        </elcollapseitem>
      </elcollapse>
      <div class="btn-box">
        <el-button type="text" @click="addobject()" class="tl-btn dotted-line list-add">
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
          :rules="[{trigger: 'blur',message:'变更原因不能为空', required:true}]"
        >
          <el-input maxlength="200" type="textarea" v-model="reason.modifyReason"></el-input>
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
        <div class="drawer-title">关联承接项</div>
      </div>
      <undertake-table
        v-if="selectIndex !== ''"
        ref="undertake"
        :departokrList="formData.okrInfoList[this.selectIndex].departokrList"
        :philosophyList="formData.okrInfoList[this.selectIndex].philosophyList"
        :periodName="periodName"
        :selectRadioDepart.sync="formData.okrInfoList[this.selectIndex].undertakeOkrVo.undertakeOkrDetailId"
        :selectRadioPhil.sync="formData.okrInfoList[this.selectIndex].cultureId"
      ></undertake-table>
      <div class="operating-box">
        <el-button type="primary" @click="summitUndertake()" class="tl-btn amt-bg-slip">确定</el-button>
        <el-button @click="innerDrawer = false" plain class="tl-btn amt-border-fadeout">取消</el-button>
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
          departokrList: [],
          philosophyList: [],
        }],
      },
      departokrList: [], // 可关联承接的okr
      departokrObject: '{}', // 可关联承接的okr
      philosophyList: [], // 价值观
      philosophyObject: '{}', // 价值观
      okrPeriod: {}, // 周期
      dialogVisible: false, // 弹出框打开关闭
      selectIndex: '', // 选择o的序号
      innerDrawer: false,
      periodName: '', // 周期名
      reason: {},
      visibleQuota: false, // 考核的弹窗
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
    activeList() {
      const activeLength = this.formData.okrInfoList.length;
      console.log([...new Array(activeLength).keys()]);
      return [...new Array(activeLength).keys()];
    },
  },
  mounted() {
    if (!this.isnew) {
      this.deleteobject(0);
      this.searchOkr();
      this.getCultureList();
    }
  },
  created() {
    if (['6', '8'].includes(this.searchForm.okrStatus)) {
      this.getOkrDraftById();
    }
    if (this.searchForm.okrStatus != '8' && this.isnew) {
      this.autosave();
    }
    // 自动保存
  },
  methods: {
    ...mapMutations('common', ['setokrSuccess', 'setCreateokrDrawer', 'setShowAuto']),
    // 获取暂存的草稿
    getOkrDraftById() {
      this.formData = JSON.parse(this.searchForm.draftParams);
      this.searchOkr();
      this.getCultureList();
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
        krList: [{
          okrDetailObjectKr: '',
          okrWeight: 0,
          okrDetailProgress: 0,
          okrDetailConfidence: '1',
          checkQuota: '',
          judgeMethod: '',
        }],
        undertakeOkrVo: {},
        departokrList: this.departokrObject ? JSON.parse(this.departokrObject) : [],
        philosophyList: this.philosophyObject ? JSON.parse(this.philosophyObject) : [],
      });
    },
    // 删除o
    deleteobject(oindex) {
      this.formData.okrInfoList.splice(oindex, 1);
    },
    // 查可关联承接的okr
    searchOkr() {
      // eslint-disable-next-line max-len
      this.server.getUndertakeOkr({ periodId: this.searchForm.periodId }).then((res) => {
        if (res.code == 200) {
          // this.okrPeriod = res.data.parentUndertakeOkrInfoResult.okrPeriodEntity || {};
          if (res.data.parentUndertakeOkrInfoResult) {
            this.selectIndex = '';
            this.departokrList = [];
            res.data.parentUndertakeOkrInfoResult.okrList.forEach((item) => {
              this.departokrList.push({
                typeName: '目标',
                okrKind: 'o',
                okrDetailObjectKr: item.o.okrDetailObjectKr,
                okrDetailId: item.o.okrDetailId,
                okrDetailVersion: item.o.okrDetailVersion,
              });
              if (item.krList && item.krList.length > 0) {
                item.krList.forEach((krItem) => {
                  this.departokrList.push({
                    typeName: 'KR',
                    okrKind: 'k',
                    okrDetailObjectKr: krItem.okrDetailObjectKr,
                    okrDetailId: krItem.okrDetailId,
                    okrDetailVersion: krItem.okrDetailVersion,
                  });
                });
              }
            });
          } else {
            this.departokrList = [];
          }
          // 将可承接列表转换成字符串
          this.departokrObject = JSON.stringify(this.departokrList);
          // 给已有的o加上可承接列表
          if (this.formData.okrInfoList.length > 0) {
            this.formData.okrInfoList.forEach((item) => {
              item.departokrList = JSON.parse(this.departokrObject);
              item.undertakeOkrVo = item.undertakeOkrVo || {};
              item.undertakeOkrDto = item.undertakeOkrDto || {};
              // 如果是草稿，选中已保存的承接项
              if (['6', '8'].includes(this.searchForm.okrStatus)
               && (item.undertakeOkrVo.undertakeOkrDetailId || item.undertakeOkrDto.undertakeOkrDetailId)) {
                item.departokrList.forEach((pitem) => {
                  if (item.undertakeOkrVo.undertakeOkrDetailId == pitem.okrDetailId) {
                    this.$set(item.undertakeOkrVo, 'undertakeOkrContent', pitem.okrDetailObjectKr);
                    this.$set(item.undertakeOkrVo, 'undertakeOkrDetailId', pitem.okrDetailId);
                  }
                  if (item.undertakeOkrDto.undertakeOkrDetailId == pitem.okrDetailId) {
                    this.$set(item, 'undertakeOkrVo', item.undertakeOkrDto);
                    this.$set(item.undertakeOkrVo, 'undertakeOkrContent', pitem.okrDetailObjectKr);
                    this.$set(item.undertakeOkrVo, 'undertakeOkrDetailId', pitem.okrDetailId);
                    this.$forceUpdate();
                  }
                });
              } else {
                item.undertakeOkrVo = {};
                item.cultureId = '';
                item.cultureName = '';
              }
            });
          }
        } else {
          this.departokrObject = JSON.stringify(this.departokrList);
        }
      });
    },

    // 查公司价值观
    getCultureList() {
      this.server.queryCultureList().then((res) => {
        if (res.code == 200) {
          this.philosophyList = res.data || [];
          // 将价值观列表转换成字符串
          this.philosophyObject = JSON.stringify(this.philosophyList);
          // 给已有的o加上价值观
          if (this.formData.okrInfoList.length > 0) {
            this.formData.okrInfoList.forEach((item) => {
              item.philosophyList = JSON.parse(this.philosophyObject);
              // 如果是草稿，选中已保存的价值观
              if (['6', '8'].includes(this.searchForm.okrStatus) && item.cultureId) {
                item.philosophyList.forEach((pitem) => {
                  if (item.cultureId == pitem.id) {
                    this.$set(item, 'cultureName', pitem.cultureName);
                    // item.cultureName = pitem.cultureName;
                  }
                });
              }
            });
          }
        } else {
          this.philosophyObject = JSON.stringify(this.philosophyList);
        }
      });
    },
    openUndertake(index) {
      // 选择o的序号，打开关联承接弹框
      // 选择radioDepart radioPhil
      this.selectIndex = index;
      //  校验承接列表是否为空
      if (!this.formData.okrInfoList[this.selectIndex].departokrList
      || !this.formData.okrInfoList[this.selectIndex].philosophyList) {
        this.formData.okrInfoList[this.selectIndex].departokrList = JSON.parse(this.departokrObject);
        this.formData.okrInfoList[this.selectIndex].departokrList = JSON.parse(this.philosophyObject);
      }
      this.innerDrawer = true;
    },
    // 提交关联，给选中的o加上承接项和价值观
    summitUndertake() {
      this.selectDepartRow = this.$refs.undertake.selectDepartRow;
      this.selectPhilRow = this.$refs.undertake.selectPhilRow;
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
      this.server.addokr(this.formData).then((res) => {
        if (res.code == 200) {
          this.$message.success('创建成功，请等待上级领导审批。');
          this.$refs.dataForm.resetFields();
          this.setokrSuccess(true);
          this.close();
        } else if (res.code == 30000) {
          this.$xconfirm({
            content: '',
            title: '当前周期已提交，是否保存为草稿？',
          }).then(() => {
            // 提交确认弹窗
            this.saveDraft();
          }).catch(() => {});
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
  },
  watch: {
    'searchForm.okrCycle': {
      handler(newVal) {
        if (newVal && newVal.periodId) {
          this.searchOkr();
          this.getCultureList();
          this.periodName = newVal.periodName;
        }
      },
      deep: true,
      immediate: true,
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
    clearInterval(this.timedShow);
  },
};
</script>