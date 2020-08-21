<template>
  <div>
    <!-- 填写表单&详情 -->
    <div>
      <el-form :model="formData" ref="dataForm">
        <dl class="okuang" v-for="(oitem,index) in formData.okrInfoList" :key="index">
          <dt>目标名称</dt>
          <dd class="objectdd">
            <el-form-item
              :prop="'okrInfoList.' + index + '.okrDetailObjectKr'"
              :rules="[{trigger: 'blur', message: '请填写目标O名称',required:true}]"
            >
              <el-input v-model="oitem.okrDetailObjectKr"></el-input>
            </el-form-item>
            <el-form-item label="权重">
              <el-input-number
                v-model="oitem.okrWeight"
                controls-position="right"
                :min="0"
                :max="100"
                :step="1"
                :precision="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="当前进度">
              <el-input-number
                v-model="oitem.okrDetailProgress"
                controls-position="right"
                :min="0"
                :max="100"
                :step="1"
                :precision="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="关联承接项">
              <el-button @click="openUndertake(index)">关联承接项</el-button>
            </el-form-item>
          </dd>
          <dd>
            <dl v-for="(kitem, kindex) in oitem.krList" :key="kindex">
              <dt>关键结果</dt>
              <dd class="objectdd">
                <el-form-item
                  :prop="'okrInfoList.' + index + '.krList.' + kindex + '.okrDetailObjectKr'"
                  :rules="[{required:true, trigger:'blur', message: '请填写关键结果KR名称'}]"
                >
                  <el-input v-model="kitem.okrDetailObjectKr"></el-input>
                </el-form-item>
                <el-form-item label="权重">
                  <el-input-number
                    v-model.trim="kitem.okrWeight"
                    controls-position="right"
                    :min="0"
                    :max="100"
                    :step="1"
                    :precision="0"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="当前进度">
                  <el-input-number
                    v-model.trim="kitem.okrDetailProgress"
                    controls-position="right"
                    :min="0"
                    :max="100"
                    :step="1"
                    :precision="0"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="风险状态">
                  <el-popover placement="right" width="400" trigger="click" :append-to-body="false">
                    <el-radio-group v-model="kitem.okrDetailConfidence">
                      <el-radio-button
                        v-for="citem in CONST.CONFIDENCE"
                        :key="citem.value"
                        :label="citem.value"
                      >{{citem.label}}</el-radio-button>
                    </el-radio-group>

                    <el-button
                      slot="reference"
                    >{{CONST.CONFIDENCE_MAP[kitem.okrDetailConfidence||'1']}}</el-button>
                  </el-popover>
                </el-form-item>
                <el-button @click="deletekr(index,kindex)">删kr</el-button>
              </dd>
            </dl>
          </dd>
          <dd class="objectdd">
            <el-button @click="addkr(index)">加kr</el-button>
          </dd>
          <dd class="objectdd">
            <el-button @click="deleteobject(index)">删O</el-button>
          </dd>
        </dl>
      </el-form>

      <el-button @click="addobject()">加一个O</el-button>
      <el-button v-if="isnew" @click="summit()">提交</el-button>
      <el-button v-if="isnew && searchForm.okrStatus != '8'" @click="saveDraft()">保存为草稿</el-button>
      <el-button v-if="isnew && searchForm.okrStatus == '6'" @click="deleteDraft()">删除草稿</el-button>
    </div>
    <el-drawer title="关联承接项" :modal="false" :visible.sync="innerDrawer">
      <undertake-table
        v-if="selectIndex !== ''"
        ref="undertake"
        :departokrList="formData.okrInfoList[this.selectIndex].departokrList"
        :philosophyList="formData.okrInfoList[this.selectIndex].philosophyList"
      ></undertake-table>
      <el-button type="primary" @click="summitUndertake()">确 定</el-button>
      <el-button @click="innerDrawer = false">取 消</el-button>
    </el-drawer>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import undertakeTable from './undertakeTable';
import CONST from '../const';

const TIME_INTERVAL = 60 * 1000;

export default {
  name: 'orkForm',
  components: {
    'undertake-table': undertakeTable,
  },
  data() {
    return {
      CONST,
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
            okrDetailConfidence: 1,
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
    canWrite: {
      type: Boolean,
      default: true,
    },
    isnew: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    if (!this.isnew) {
      this.deleteobject(0);
    }
  },
  created() {
    console.log('到里面了', this.searchForm);
    if (this.searchForm.okrStatus == '6' || this.searchForm.okrStatus == '8') {
      this.getOkrDraftById();
    }
  },
  methods: {
    ...mapMutations('common', ['setMyokrDrawer', 'setCreateokrDrawer']),
    // 获取暂存的草稿
    getOkrDraftById() {
      console.log('获取暂存的草稿', this.searchForm.draftParams);
      this.formData = JSON.parse(this.searchForm.draftParams);
      console.log('获取暂存的草稿', this.formData);
      this.searchOkr();
      this.getCultureList();
    },
    // 自动保存
    autosave() {
      this.timedInterval = setInterval(() => {
        this.saveDraft();
      }, TIME_INTERVAL);
    },
    // 增加kr
    addkr(oindex) {
      console.log(this.formData.okrInfoList);
      this.formData.okrInfoList[oindex].krList.push({
        // id: this.formData.okrInfoList[oindex].krList.length,
        okrDetailObjectKr: '',
        okrWeight: 0,
        okrDetailProgress: 0,
        okrDetailConfidence: 1,
      });
    },
    // 删除kr
    deletekr(oindex, krindex) {
      if (this.formData.okrInfoList[oindex].krList.length <= 1) {
        this.$message('至少有一个kr');
        return;
      }
      this.formData.okrInfoList[oindex].krList.splice(krindex, 1);
    },
    // 增加o
    addobject() {
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
        }],
        undertakeOkrVo: {},
        departokrList: this.departokrObject ? JSON.parse(this.departokrObject) : [],
        philosophyList: this.philosophyObject ? JSON.parse(this.philosophyObject) : [],
      });
      console.log(this.formData.okrInfoList);
    },
    // 删除o
    deleteobject(oindex) {
      this.formData.okrInfoList.splice(oindex, 1);
    },
    // 查可关联承接的okr
    searchOkr() {
      this.server.getUndertakeOkr({ periodId: this.searchForm.okrCycle.periodId || this.formData.periodId }).then((res) => {
        if (res.code == 200) {
          console.log('关联表', res.data);
          this.okrPeriod = res.data.parentUndertakeOkrInfoResult.okrPeriodEntity;
          res.data.parentUndertakeOkrInfoResult.okrList.forEach((item) => {
            this.departokrList.push({
              typeName: '目标O',
              okrDetailObjectKr: item.o.okrDetailObjectKr,
              okrDetailId: item.o.okrDetailId,
              okrDetailVersion: item.o.okrDetailVersion,
              checkFlag: false,
            });
            if (item.krList && item.krList.length > 0) {
              item.krList.forEach((krItem, index) => {
                this.departokrList.push({
                  typeName: `KR${index}`,
                  okrDetailObjectKr: krItem.okrDetailObjectKr,
                  okrDetailId: krItem.okrDetailId,
                  okrDetailVersion: krItem.okrDetailVersion,
                  checkFlag: false,
                });
              });
            }
          });
          // 将可承接列表转换成字符串
          this.departokrObject = JSON.stringify(this.departokrList);
          // 给已有的o加上可承接列表
          if (this.formData.okrInfoList.length > 0) {
            this.formData.okrInfoList.forEach((item) => {
              item.departokrList = JSON.parse(this.departokrObject);
              // 如果是草稿，选中已保存的承接项
              if (['6', '8'].includes(this.searchForm.okrStatus) && item.undertakeOkrVo.undertakeOkrDetailId) {
                item.departokrList.forEach((pitem) => {
                  if (item.undertakeOkrVo.undertakeOkrDetailId == pitem.okrDetailId) {
                    pitem.checkFlag = true;
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
          this.philosophyList = res.data;
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
                    pitem.checkFlag = true;
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
      this.selectIndex = index;
      // this.dialogVisible = true;
      this.innerDrawer = true;
    },
    // 提交关联，给选中的o加上承接项和价值观
    summitUndertake() {
      this.selectDepartRow = this.$refs.undertake.selectDepartRow;
      this.selectPhilRow = this.$refs.undertake.selectPhilRow;
      // eslint-disable-next-line max-len
      this.formData.okrInfoList[this.selectIndex].undertakeOkrVo.undertakeOkrDetailId = this.selectDepartRow.checkFlag ? this.selectDepartRow.okrDetailId : '';
      this.formData.okrInfoList[this.selectIndex].undertakeOkrVo.undertakeOkrVersion = this.selectDepartRow.checkFlag ? this.selectDepartRow.okrDetailVersion : '';
      // TODO:价值观的id
      this.formData.okrInfoList[this.selectIndex].cultureId = this.selectPhilRow.checkFlag ? this.selectPhilRow.id : '';
      console.log('关联', this.formData.okrInfoList[this.selectIndex].undertakeOkrVo);
      this.innerDrawer = false;
    },
    // 校验表单
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
            this.$message('o权重相加不等100~');
            return;
          }
          if (keypercent != 100) {
            this.$message('kr权重相加不等100~');
            return;
          }
          this.formData.okrBelongType = this.searchForm.okrType;
          this.formData.periodId = this.searchForm.okrCycle.periodId;
          this.formData.okrDraftId = this.searchForm.draftId;
          console.log('提交结果', this.formData);
          this.server.addokr(this.formData).then((res) => {
            if (res.code == 200) {
              this.$message('提交成功~');
              this.$refs.dataForm.resetFields();
              this.setCreateokrDrawer(false);
              this.setMyokrDrawer(false);
              // this.$emit('handleClose');
              // this.$router.push({ name: 'myOkr', params: { activeName: 'myokr' } });
            }
          });
        }
      });
    },
    // 保存草稿
    saveDraft() {
      this.formData.okrInfoList.forEach((oitem) => {
        delete oitem.departokrList;
        delete oitem.philosophyList;
      });
      this.formData.okrBelongType = this.searchForm.okrType;
      this.formData.periodId = this.searchForm.okrCycle.periodId;
      this.formData.okrDraftId = this.searchForm.draftId;
      this.server.saveOkrDraft(this.formData).then((res) => {
        if (res.code == 200) {
          this.$message('提交成功~');
          this.$refs.dataForm.resetFields();
          // this.$router.push({ name: 'myOkr', params: { activeName: 'myokr' } });
          this.setCreateokrDrawer(false);
          this.setMyokrDrawer(false);
        }
      });
    },
    deleteDraft() {
      this.server.deleteOkrDraft({ okrDraftId: this.searchForm.draftId }).then((res) => {
        if (res.code == 200) {
          this.$message('提交成功~');
          // this.$router.push({ name: 'myOkr', params: { activeName: 'myokr' } });
          this.setMyokrDrawer(false);
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
        }
      },
      deep: true,
      immediate: true,
    },
    'searchForm.okrStatus': {
      handler(newVal) {
        console.log('获取暂存的草稿', newVal);
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
</style>