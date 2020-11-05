<template>
  <el-drawer
    :wrapperClosable="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    :visible.sync="createokrDrawer"
    custom-class="custom-drawer create-okr"
    class="tl-drawer"
    :before-close="close"
    @closed="closed"
  >
    <div slot="title" class="flex-sb">
      <div v-if="writeInfo.canWrite == 'draft'" class="drawer-title">
        编辑OKR
      </div>
      <div v-else class="drawer-title">创建OKR</div>
      <!-- <div class="icon-save" v-if="showAuto">
        <i></i>
        <em>已自动保存</em>
      </div> -->
    </div>
    <el-scrollbar ref="okrFormscrollbar">
      <div class="cont-box">
        <template v-if="hasValue(searchForm.modifyReason)">
          <el-alert type="warning" class="tl-alert">
            <div slot="title">
              <div class="alert-title">审批退回原因：</div>
              <div class="alert-cont">{{ searchForm.modifyReason }}</div>
            </div>
          </el-alert>
        </template>
        <div class="allocation-info">
          <dl>
            <dt>目标周期</dt>
            <dd>
              <el-select
                v-model="searchForm.periodId"
                placeholder="请选择目标周期"
                :popper-append-to-body="false"
                popper-class="tl-select-dropdown"
                class="tl-select"
              >
                <el-option
                  v-for="item in periodList"
                  :key="item.periodId"
                  :label="item.periodName"
                  :value="item.periodId"
                ></el-option>
              </el-select>
            </dd>
          </dl>
          <dl>
            <dt>OKR类型</dt>
            <dd>
              <el-select
                v-if="hasValue(showMoreType)"
                v-model="searchForm.okrType"
                placeholder="请选择类型"
                :popper-append-to-body="false"
                popper-class="tl-select-dropdown"
                class="tl-select"
              >
                <el-option
                  v-for="(item, index) in okrTypeList"
                  :key="item.id + index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <span v-else>{{ CONST.OKR_TYPE_MAP[searchForm.okrType] }}</span>
            </dd>
          </dl>
          <dl class="user-info">
            <dt>负责人</dt>
            <dd v-if="hasValue(userInfo.headUrl)">
              <img :src="userInfo.headUrl" alt />
            </dd>
            <dd v-else class="user-name">
              <em>{{ cutName(userName) }}</em>
            </dd>
            <dd>{{ userName }}</dd>
          </dl>
        </div>
        <div class="okr-info">
          <el-form :model="formData" ref="dataForm" class="tl-form">
            <elcollapse class="tl-collapse" v-model="activeList">
              <elcollapseitem
                ref="okrcoll"
                v-for="(oitem, index) in formData.okrInfoList.slice(
                  0,
                  currentPage * 5
                )"
                :key="oitem.id"
                :name="index"
              >
                <template slot="title">
                  <dl class="collpase-panel has-third-child">
                    <dt class="is-edit">
                      <span>目标{{ index + 1 }}</span>
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
                          'is-disabled': formData.okrInfoList.length === 1,
                        }"
                        effect="dark"
                        :content="
                          formData.okrInfoList.length > 1
                            ? '删除'
                            : '至少有一个目标'
                        "
                        placement="top"
                        popper-class="tl-tooltip-popper"
                        @click.native="
                          formData.okrInfoList.length > 1 && deleteobject(index)
                        "
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
                          <el-popover
                            :content="lastWeightmsg"
                            placement="top-start"
                            :value="oitem.showTip"
                            trigger="manual"
                            class="weight-tip"
                            :append-to-body="false"
                            popper-class="weight-tip"
                          >
                            <el-input-number
                              slot="reference"
                              v-model="oitem.okrWeight"
                              controls-position="right"
                              :min="0"
                              :max="100"
                              :step="0.1"
                              step-strictly
                              class="tl-input-number"
                              @focus="showTip('o', index, 0)"
                              @blur="hideTip('o', index, 0)"
                            ></el-input-number>
                          </el-popover>
                          <span>%</span>
                        </el-form-item>
                      </div>
                      <div>
                        <i></i>
                        <span>当前进度</span>
                        <el-form-item>
                          <!-- <el-input-number
                            v-model="oitem.okrDetailProgress"
                            controls-position="right"
                            :min="0"
                            :max="100"
                            :step="1"
                            :precision="0"
                            class="tl-input-number"
                          ></el-input-number> -->
                          <span>0 %</span>
                        </el-form-item>
                      </div>
                      <div>
                        <i></i>
                        <span>关联父目标</span>
                        <template
                          v-if="
                            (oitem.undertakeOkrVo &&
                              oitem.undertakeOkrVo.undertakeOkrDetailId) ||
                            oitem.cultureId
                          "
                        >
                          <em
                            v-if="
                              hasValue(oitem.undertakeOkrVo.undertakeOkrContent)
                            "
                            @click="openUndertake(index)"
                            >{{ oitem.undertakeOkrVo.undertakeOkrContent }}</em
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
                        'okrInfoList.' +
                        index +
                        '.krList.' +
                        kindex +
                        '.okrWeight'
                      "
                      :rules="[
                        {
                          trigger: 'blur',
                          validator: validatePercent,
                          required: true,
                        },
                      ]"
                    >
                      <el-popover
                        :content="lastWeightmsg"
                        placement="top-start"
                        :value="kitem.showTip"
                        trigger="manual"
                        class="weight-tip"
                        :append-to-body="false"
                        popper-class="weight-tip"
                      >
                        <el-input-number
                          slot="reference"
                          v-model.trim="kitem.okrWeight"
                          controls-position="right"
                          :min="0"
                          :max="100"
                          :step="0.1"
                          step-strictly
                          class="tl-input-number"
                          @focus="showTip('kr', index, kindex)"
                          @blur="hideTip('kr', index, kindex)"
                        ></el-input-number>
                      </el-popover>
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
                    <el-form-item label="考核指标">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 8 }"
                        placeholder="请输入考核指标"
                        v-model="kitem.checkQuota"
                        maxlength="1500"
                        class="tl-textarea"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="衡量办法">
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
        </div>
      </div>
    </el-scrollbar>
    <div class="operating-box">
      <div class="flex-auto" v-if="writeInfo.okrStatus != '8'">
        <el-button
          :disabled="!hasPower('okr-draft-save')"
          plain
          @click="saveDraft"
          class="tl-btn amt-border-fadeout"
          >保存为草稿</el-button
        >
      </div>
      <el-button
        :disabled="!hasPower('okr-create')"
        type="primary"
        @click="summit"
        class="tl-btn amt-bg-slip"
        :loading="createokrDrawer && okrLoading"
        >提交</el-button
      >
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
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
  </el-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import confidenceSelect from '@/components/confidenceSelect';
import elcollapse from '@/components/collapse/collapse';
import elcollapseitem from '@/components/collapse/collapse-item';
import validateMixin from '@/mixin/validateMixin';
import undertakeTable from './component/undertakeTable';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'writeOkr',
  mixins: [validateMixin],
  components: {
    elcollapse,
    elcollapseitem,
    'undertake-table': undertakeTable,
    'tl-confidence': confidenceSelect,
  },
  props: {
    writeInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    userName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      server,
      CONST,
      searchForm: {
        periodId: '',
        userId: '',
        tenantId: '',
        timecycle: '',
        okrCycle: {},
        okrType: null,
        okrStatus: '',
        draftParams: '',
        draftId: '',
      },
      canWrite: true, // true写okr false changeokr
      periodList: [],
      temPeriod: '',
      selectPeriod: '',
      showMoreType: false,
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
      dialogVisible: false, // 弹出框打开关闭
      selectIndex: '', // 选择o的序号
      innerDrawer: false,
      periodName: '', // 周期名
      reason: {},
      visibleQuota: false, // 考核的弹窗
      loading: false,
      activeList: [0],
      currentPage: 1,
      // errormsg
      oerror: '',
      krerror: '',
      checkerror: '',
      judgeerror: '',
      weighterror: '',
      // 权重计算
      lastWeightmsg: '剩余权重 计算中...',
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      roleCode: (state) => state.roleCode,
      showAuto: (state) => state.showAuto,
      createokrDrawer: (state) => state.createokrDrawer,
      okrLoading: (state) => state.okrLoading,
    }),
    okrTypeList() {
      // okr类型
      // if (this.roleCode.includes('ORG_ADMIN')) {
      //   return this.CONST.OKR_TYPE_LIST.filter(
      //     (item) => item.id == 1,
      //   );
      // } return this.CONST.OKR_TYPE_LIST.filter(
      //   (item) => item.id == 2,
      // );

      return this.CONST.OKR_TYPE_LIST;
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('scroll', this.onScroll, true);
    });
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll, true);
  },
  created() {
    if (this.roleCode.includes('PUBLIC') && this.roleCode.includes('TEAM_ADMIN')) {
      this.showMoreType = true;
    }
  },
  methods: {
    ...mapMutations('common', ['setokrSuccess', 'setCreateokrDrawer', 'setShowAuto', 'setLoading']),
    showOkrDialog(periodId = '') {
      this.selectPeriod = periodId;
      this.init();
      this.setCreateokrDrawer(true);
      this.setokrSuccess(false);
    },
    closed() {
      if (this.showAuto) {
        this.setokrSuccess(true);
      }
      this.$emit('update:exist', false);
      this.setShowAuto(false);
    },
    close() {
      this.setCreateokrDrawer(false);
    },
    init() {
      // okr类型
      if (this.roleCode.includes('ORG_ADMIN')) {
        this.searchForm.okrType = 1;
      } else { this.searchForm.okrType = 2; }
      if (this.writeInfo.canWrite == 'draft') {
        this.searchForm.okrStatus = this.writeInfo.okrStatus || '';
        this.searchForm.draftParams = this.writeInfo.draftParams || '';
        this.searchForm.draftId = this.writeInfo.draftId || '';
        this.searchForm.approvalId = this.writeInfo.approvalId || '';
        this.searchForm.modifyReason = this.writeInfo.modifyReason || '';
        this.searchForm.approvalType = this.writeInfo.approvalType || '';
        this.searchForm.okrType = JSON.parse(this.searchForm.draftParams).okrBelongType;
        this.temPeriod = JSON.parse(this.searchForm.draftParams).periodId;
        this.getOkrDraftById();
      }
      // 周期
      this.server.getOkrCycleList().then((res) => {
        if (res.code == 200) {
          this.periodList = res.data || [];
          this.searchForm.okrCycle = this.periodList.filter((item) => item.checkStatus == '1')[0] || {};
          if (this.temPeriod) {
            this.searchForm.periodId = this.temPeriod;
          } else {
            this.searchForm.periodId = this.selectPeriod || this.searchForm.okrCycle.periodId;
          }
        }
      });
    },

    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
    },
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
          console.log('123', item.undertakeOkrVo.undertakeOkrContent);
          // this.$forceUpdate();
        });
      }
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
      // errormsg
      this.oerror = '';
      this.krerror = '';
      this.checkerror = '';
      this.judgeerror = '';
      this.weighterror = '';
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
          this.$xconfirm({
            content: '',
            title: '提交后将会流转至上级领导审批且不能撤回，请确定填写无误后提交',
          }).then(() => {
            if (this.searchForm.approvalType == 1) {
              this.summitChange();
            } else {
              this.summitNew();
            }
          }).catch(() => {});
        } else {
          this.$message.error(`您有 ${this.oerror} ${this.krerror} ${this.weighterror} ${this.checkerror} ${this.judgeerror}未填写`);
        }
      });
    },

    // 保存草稿
    saveDraft() {
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
            this.$message('已保存');
            this.$refs.dataForm.resetFields();
            this.setokrSuccess(true);
            this.close();
          }
        });
      }
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

    // 获取滚动条当前的位置
    getScrollTop() {
      let scrollTop = 0;
      scrollTop = this.$refs.okrFormscrollbar.wrap.scrollTop;
      return scrollTop;
    },
    // 获取当前可视范围的高度
    getClientHeight() {
      let clientHeight = 0;

      clientHeight = this.$refs.okrFormscrollbar.$el.offsetWidth;
      return clientHeight;
    },

    // 滚动事件触发下拉加载
    onScroll() {
      if (this.getScrollTop() / this.getClientHeight() >= this.currentPage / 2) {
        this.currentPage += 1;
        console.log('fanyele', this.currentPage);
      }
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
  },
  watch: {
    'searchForm.periodId': {
      handler(newVal) {
        if (newVal) {
          console.log('这是草稿');
          this.searchForm.okrCycle = this.periodList.filter(
            (citem) => citem.periodId === newVal,
          )[0] || {};
          this.periodName = this.searchForm.okrCycle.periodName;
          if (this.selectIndex !== '' && this.writeInfo.canWrite != 'draft') {
            for (let i = 0; i < this.formData.okrInfoList.length; i += 1) {
              this.formData.okrInfoList[i].undertakeOkrVo = {};
              this.formData.okrInfoList[i].cultureId = '';
              this.formData.okrInfoList[i].cultureName = '';
            }
          }
        }
      },
      immediate: false,
    },
    'searchForm.okrType': {
      handler() {
        if (this.writeInfo.canWrite != 'draft') {
          for (let i = 0; i < this.formData.okrInfoList.length; i += 1) {
            this.formData.okrInfoList[i].undertakeOkrVo = {};
            this.formData.okrInfoList[i].cultureId = '';
            this.formData.okrInfoList[i].cultureName = '';
          }
        }
      },
      immediate: false,
    },
  },
};
</script>