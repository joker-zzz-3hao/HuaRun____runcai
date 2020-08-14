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
              <el-button @click="guanlian(index)">关联承接项</el-button>
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
                <el-form-item label="信心指数">
                  <el-popover placement="right" width="400" trigger="click" :append-to-body="false">
                    <el-radio-group v-model="kitem.okrDetailConfidence">
                      <el-radio-button
                        v-for="citem in CONST.CONFIDENCE"
                        :key="citem.value"
                        :label="citem.value"
                      >{{citem.label}}</el-radio-button>
                    </el-radio-group>

                    <el-button slot="reference">信息状态</el-button>
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
    </div>
    <el-dialog
      title="关联承接项"
      :visible.sync="dialogVisible"
      width="30%"
      :modal-append-to-body="false"
    >
      <span slot="title">
        <h3>关联承接项</h3>！仅支持关联一个目标承接项，如需关联多个，建议新增关键目标O
      </span>
      <!-- 可选多部门 -->
      <dl>
        <dd>{{$store.state.common.userInfo.departmentName}}{{okrPeriod.periodDesc}}OKR</dd>
      </dl>
      <undertake-table
        :departokrList="departokrList"
        :philosophyList="philosophyList"
        @selectDepart="changeDepart"
        @selectPhil="changePhil"
      ></undertake-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="summitguanlian()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
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
        }],
      },
      departokrList: [], // 可关联承接的okr
      philosophyList: [], // 价值观
      okrPeriod: {}, // 周期
      dialogVisible: false, // 弹出框打开关闭
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
    this.getCultureList();
  },
  methods: {

    zidongbaocun() {
      this.timedInterval = setInterval(() => {
        this.getMsgNum();
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
      });
      console.log(this.formData.okrInfoList);
    },
    // 删除o
    deleteobject(oindex) {
      this.formData.okrInfoList.splice(oindex, 1);
    },

    guanlian(objectIndex) {
      this.selectObject = objectIndex;
      this.dialogVisible = true;
    },
    // 查可关联承接的okr
    searchOkr() {
      this.server.getUndertakeOkr({ periodId: 'periodId' }).then((res) => {
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
        }
      });
    },
    // 选择关联的okr
    changeDepart(row) {
      this.formData.okrInfoList[this.selectObject].undertakeOkrVo.undertakeOkrDetailId = row.okrDetailId;
      this.formData.okrInfoList[this.selectObject].undertakeOkrVo.undertakeOkrVersion = row.okrDetailVersion;
    },
    // 查公司价值观
    getCultureList() {
      this.server.queryCultureList().then((res) => {
        if (res.code == 200) {
          console.log('价值观', res.data);
          this.philosophyList = res.data;
        }
      });
    },
    // 选择关联的价值观
    changePhil(row) {
      this.formData.okrInfoList[this.selectObject].cultureId = row.id || '1162020375644299264';
      console.log('关联', row);
    },
    // 提交关联
    summitguanlian() {
      this.dialogVisible = false;
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
          this.formData.periodId = 'periodId';
          console.log('提交结果', this.formData);
          this.server.addokr(this.formData).then((res) => {
            if (res.code == 200) {
              this.$message('提交成功~');
              this.$router.push({ name: 'myOkr', params: { activeName: 'myokr' } });
            }
          });
        }
      });
    },
  },
  watch: {
    'searchForm.okrCycle': {
      handler() {
        this.searchOkr();
        this.getCultureList();
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