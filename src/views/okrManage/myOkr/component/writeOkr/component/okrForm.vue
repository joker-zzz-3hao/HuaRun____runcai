<template>
  <div class="okr-info">
    <div class="tl-diy-timeline">
      <el-form :model="formData" ref="dataForm" class="tl-form">
        <dl class="timeline-list" v-for="(oitem,index) in formData.okrInfoList" :key="oitem.id">
          <dt>
            <div class="list-info">
              <div class="list-title">目标名称</div>
              <div class="list-cont">
                <el-form-item
                  :prop="'okrInfoList.' + index + '.okrDetailObjectKr'"
                  :rules="[{trigger: 'blur',validator:validateObjectName, required:true}]"
                >
                  <el-input
                    placeholder="请输入目标名称"
                    v-model="oitem.okrDetailObjectKr"
                    class="tl-input"
                  ></el-input>
                </el-form-item>
                <div class="item-group">
                  <el-form-item label="权重">
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
                  <el-form-item label="当前进度">
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
                  <el-form-item label="承接自">
                    <p
                      v-if="oitem.undertakeOkrVo.undertakeOkrDetailId || oitem.cultureId"
                      @click="openUndertake(index)"
                    >
                      <a
                        v-if="oitem.undertakeOkrVo.undertakeOkrObjectKr"
                      >{{oitem.undertakeOkrVo.undertakeOkrObjectKr}}</a>
                      <a v-if="oitem.cultureName">{{oitem.cultureName}}</a>
                    </p>
                    <el-button
                      plain
                      icon="el-icon-plus"
                      @click.native="openUndertake(index)"
                      class="tl-btn amt-border-slip"
                      v-else
                    >
                      关联
                      <span class="lines"></span>
                    </el-button>
                  </el-form-item>
                </div>
              </div>
            </div>
            <el-tooltip
              class="icon-clear"
              :class="{'is-disabled':isnew && formData.okrInfoList.length === 1}"
              effect="dark"
              content="删除"
              placement="top"
              popper-class="tl-tooltip-clear"
              @click.native="(!isnew || formData.okrInfoList.length > 1) && deleteobject(index)"
              :disabled="isnew && formData.okrInfoList.length == 1"
            >
              <i class="el-icon-minus"></i>
            </el-tooltip>
          </dt>
          <dd v-for="(kitem, kindex) in oitem.krList" :key="kitem.id">
            <div class="list-info">
              <div class="list-title">关键结果{{kindex+1}}</div>
              <div class="list-cont">
                <el-form-item
                  :prop="'okrInfoList.' + index + '.krList.' + kindex + '.okrDetailObjectKr'"
                  :rules="[{required:true, trigger:'blur',validator:validateKRName}]"
                >
                  <el-input
                    placeholder="请输入关键结果"
                    v-model="kitem.okrDetailObjectKr"
                    class="tl-input"
                  ></el-input>
                </el-form-item>
                <div class="item-group">
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
                </div>
              </div>
            </div>
            <el-tooltip
              class="icon-clear"
              :class="{'is-disabled':isnew && oitem.krList.length === 1}"
              effect="dark"
              content="删除"
              placement="top"
              popper-class="tl-tooltip-clear"
              @click.native="(!isnew || oitem.krList.length > 1) && deletekr(index,kindex)"
              :disabled="isnew && oitem.krList.length == 1"
            >
              <i class="el-icon-minus"></i>
            </el-tooltip>
          </dd>
          <dd>
            <el-button type="text" @click="addkr(index)" class="tl-btn sub-list-add">
              <i class="el-icon-plus"></i>添加关键结果
            </el-button>
          </dd>
        </dl>
      </el-form>
      <el-button type="text" @click="addobject()" class="tl-btn dotted-line list-add">
        <i class="el-icon-plus"></i>添加目标
      </el-button>
    </div>
    <!-- <el-button v-if="isnew && searchForm.okrStatus == '6'" @click="deleteDraft()">删除草稿icon</el-button> -->
    <!-- 关联承接项抽屉 -->
    <el-drawer
      :wrapperClosable="false"
      :visible.sync="innerDrawer"
      :modal="false"
      :append-to-body="true"
      custom-class="diy-drawer associated-undertaking"
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
import validateMixin from '@/mixin/validateMixin';
import undertakeTable from './undertakeTable';

// 自动保存时间 30秒
const TIME_INTERVAL = 30 * 1000;

export default {
  name: 'orkForm',
  mixins: [validateMixin],
  components: {
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
          }],
          undertakeOkrVo: {},
          departokrList: [],
          philosophyList: [],
        }],
      },
      departokrList: [], // 可关联承接的okr
      departokrObject: '', // 可关联承接的okr
      philosophyList: [], // 价值观
      philosophyObject: '', // 价值观
      okrPeriod: {}, // 周期
      dialogVisible: false, // 弹出框打开关闭
      selectIndex: '', // 选择o的序号
      innerDrawer: false,
      periodName: '', // 周期名
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
  },
  mounted() {
    if (!this.isnew) {
      this.deleteobject(0);
      this.searchOkr();
      this.getCultureList();
    }
  },
  created() {
    if (this.searchForm.okrStatus == '6') {
      this.getOkrDraftById();
    }
    // 自动保存
    this.autosave();
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
        }],
        undertakeOkrVo: {},
        departokrList: this.departokrObject ? JSON.parse(this.departokrObject) : [],
        philosophyList: this.philosophyObject ? JSON.parse(this.philosophyObject) : [],
      });
      console.log('addobject增加o', this.departokrObject);
    },
    // 删除o
    deleteobject(oindex) {
      if (this.formData.okrInfoList.length < 1) {
        this.$message('至少有一个目标');
        return;
      }
      this.formData.okrInfoList.splice(oindex, 1);
    },
    // 查可关联承接的okr
    searchOkr() {
      console.log('this.formData.periodId', this.formData.periodId);
      console.log('this.searchForm.periodId', this.searchForm.periodId);
      // eslint-disable-next-line max-len
      this.server.getUndertakeOkr({ periodId: this.searchForm.periodId }).then((res) => {
        if (res.code == 200) {
          // this.okrPeriod = res.data.parentUndertakeOkrInfoResult.okrPeriodEntity || {};
          if (res.data.parentUndertakeOkrInfoResult) {
            this.departokrList = [];
            res.data.parentUndertakeOkrInfoResult.okrList.forEach((item) => {
              this.departokrList.push({
                typeName: '目标O',
                okrKind: 'o',
                okrDetailObjectKr: item.o.okrDetailObjectKr,
                okrDetailId: item.o.okrDetailId,
                okrDetailVersion: item.o.okrDetailVersion,
              });
              if (item.krList && item.krList.length > 0) {
                item.krList.forEach((krItem, index) => {
                  this.departokrList.push({
                    typeName: `KR${index + 1}`,
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
              // 如果是草稿，选中已保存的承接项
              if (['6'].includes(this.searchForm.okrStatus) && item.undertakeOkrVo.undertakeOkrDetailId) {
                item.departokrList.forEach((pitem) => {
                  if (item.undertakeOkrVo.undertakeOkrDetailId == pitem.okrDetailId) {
                    this.$set(item.undertakeOkrVo, 'undertakeOkrObjectKr', pitem.okrDetailObjectKr);
                    console.log('草稿', pitem.undertakeOkrObjectKr);
                    // item.undertakeOkrVo.undertakeOkrObjectKr = pitem.undertakeOkrObjectKr;
                  }
                });
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
              if (['6'].includes(this.searchForm.okrStatus) && item.cultureId) {
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
      this.innerDrawer = true;
      console.log('openUndertake', this.formData.okrInfoList[this.selectIndex].undertakeOkrVo);
    },
    // 提交关联，给选中的o加上承接项和价值观
    summitUndertake() {
      this.selectDepartRow = this.$refs.undertake.selectDepartRow;
      this.selectPhilRow = this.$refs.undertake.selectPhilRow;
      // eslint-disable-next-line max-len
      // 承接项的id、版本、名称
      this.formData.okrInfoList[this.selectIndex].undertakeOkrVo.undertakeOkrDetailId = this.selectDepartRow.okrDetailId || '';
      this.formData.okrInfoList[this.selectIndex].undertakeOkrVo.undertakeOkrVersion = this.selectDepartRow.okrDetailVersion || '';
      this.formData.okrInfoList[this.selectIndex].undertakeOkrVo.undertakeOkrObjectKr = this.selectDepartRow.okrDetailObjectKr || '';
      // TODO:价值观的id
      this.formData.okrInfoList[this.selectIndex].cultureId = this.selectPhilRow.id || '';
      this.formData.okrInfoList[this.selectIndex].cultureName = this.selectPhilRow.cultureDesc || '';
      this.innerDrawer = false;
    },
    // 提交表单
    summit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          // 校验权重比例
          let opercent = 0;
          let keypercent = 0;
          this.formData.okrInfoList.forEach((oitem) => {
            opercent += oitem.okrWeight;
            keypercent = 0;
            oitem.krList.forEach((kitem) => {
              keypercent += kitem.okrWeight;
            });
            delete oitem.departokrList;
            delete oitem.philosophyList;
          });

          if (opercent != 100) {
            this.$message.error('目标O权重值总和必须为100');
            return;
          }
          if (keypercent != 100) {
            this.$message.error('结果KR权重值总和必须为100');
            return;
          }
          this.formData.okrBelongType = this.searchForm.okrType;
          this.formData.periodId = this.searchForm.okrCycle.periodId;
          this.formData.okrDraftId = this.searchForm.draftId;
          console.log('提交结果', this.formData);
          this.server.addokr(this.formData).then((res) => {
            console.log(res);
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
      if (this.formData.okrInfoList.length > 0) {
        this.formData.okrInfoList.forEach((oitem) => {
          if (oitem.departokrList) {
            delete oitem.departokrList;
            delete oitem.philosophyList;
          }
        });
        this.formData.okrBelongType = this.searchForm.okrType;
        this.formData.periodId = this.searchForm.okrCycle.periodId;
        this.formData.okrDraftId = this.searchForm.draftId;
        this.server.saveOkrDraft(this.formData).then((res) => {
          if (res.code == 200) {
            if (type) {
              this.searchForm.draftId = res.data.id;
              this.setShowAuto(true);
              this.timedShow = setInterval(() => {
                this.setShowAuto(false);
              }, 3000);
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

    close() {
      this.setCreateokrDrawer(false);
    },
  },
  watch: {
    'searchForm.okrCycle': {
      handler(newVal) {
        if (newVal && newVal.periodId) {
          this.searchOkr();
          this.getCultureList();
          console.log('周期', newVal);
          this.periodName = newVal.periodName;
        }
      },
      deep: true,
      immediate: true,
    },
    'searchForm.okrStatus': {
      handler(newVal) {
        if (newVal == '6' || newVal == '8') {
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

<style>
.objectdd,
.objectdd div {
  display: inline-block;
}
.okuang {
  margin: 10px;
  border: 1px solid rgb(190, 190, 190);
}
.el-drawer__body {
  overflow: auto;
}
</style>