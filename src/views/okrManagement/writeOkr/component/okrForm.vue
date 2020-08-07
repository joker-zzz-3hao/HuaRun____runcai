<template>
  <div>
    <!-- 填写表单&详情 -->
    <div>
      <el-form :model="formData" ref="dataForm">
        <dl class="okuang" v-for="(oitem,index) in formData.okrInfoList" :key="index">
          <dt>目标名称</dt>
          <dd class="objectdd">
            <el-form-item
              prop="okrDetailObjectKr"
              :rules="[{trigger: 'blur' , message: '请填写目标名称'}]"
            >
              <el-input v-if="canWrite" v-model="oitem.okrDetailObjectKr"></el-input>
              <span v-else>{{oitem.okrDetailObjectKr}}</span>
            </el-form-item>
            <el-form-item label="权重">
              <el-input-number
                v-if="canWrite"
                v-model="oitem.okrWeight"
                controls-position="right"
                :min="0"
                :max="100"
              ></el-input-number>
              <span v-else>{{oitem.okrWeight}}</span>
            </el-form-item>
            <el-form-item label="当前进度">
              <el-input-number
                v-if="canWrite"
                v-model="oitem.okrDetailProgress"
                controls-position="right"
                :min="0"
                :max="100"
              ></el-input-number>
              <span v-else>{{oitem.okrDetailProgress}}</span>
            </el-form-item>
            <el-form-item label="关联承接项">
              <el-button @click="guanlian(index)">关联承接项</el-button>
              <span></span>
            </el-form-item>
          </dd>
          <dd>
            <dl v-for="(kitem, kindex) in oitem.krInfoVoList" :key="kindex">
              <dt>关键结果</dt>
              <dd class="objectdd">
                <el-form-item
                  prop="okrDetailObjectKr"
                  :rules="[{trigger: 'blur' , message: '请填写目标名称'}]"
                >
                  <el-input v-if="canWrite" v-model="kitem.okrDetailObjectKr"></el-input>
                  <span v-else>{{kitem.okrDetailObjectKr}}</span>
                </el-form-item>
                <el-form-item label="权重">
                  <el-input-number
                    v-if="canWrite"
                    v-model="kitem.okrWeight"
                    controls-position="right"
                    :min="0"
                    :max="100"
                  ></el-input-number>
                  <span v-else>{{kitem.okrWeight}}</span>
                </el-form-item>
                <el-form-item label="当前进度">
                  <el-input-number
                    v-if="canWrite"
                    v-model="kitem.okrDetailProgress"
                    controls-position="right"
                    :min="0"
                    :max="100"
                  ></el-input-number>
                  <span v-else>{{kitem.okrDetailProgress}}</span>
                </el-form-item>
                <el-form-item label="信心指数">
                  <!-- <el-rate
                    v-if="canWrite"
                    v-model="kitem.rate"
                    :icon-classes="['el-icon-house','el-icon-house','el-icon-house']"
                    void-icon-class="el-icon-house"
                  ></el-rate>-->
                  <el-popover v-if="canWrite" placement="right" width="400" trigger="click">
                    <el-radio-group v-model="kitem.okrDetailConfidence">
                      <el-radio-button
                        v-for="citem in CONST.CONFIDENCE"
                        :key="citem.value"
                        :label="citem.value"
                      >{{citem.label}}</el-radio-button>
                    </el-radio-group>

                    <el-button slot="reference">信息状态</el-button>
                  </el-popover>
                  <span v-else>{{kitem.okrDetailConfidence}}</span>
                </el-form-item>
                <el-button v-if="canWrite" @click="deletekr(index,kindex)">删kr</el-button>
              </dd>
            </dl>
          </dd>
          <dd class="objectdd">
            <el-button v-if="canWrite" @click="addkr(index)">加kr</el-button>
          </dd>
          <dd class="objectdd">
            <el-button v-if="canWrite" @click="deleteobject(index)">删O</el-button>
          </dd>
        </dl>
      </el-form>

      <el-button v-if="canWrite" @click="addobject()">加一个O</el-button>
      <el-button v-if="canWrite" @click="summit()">提交</el-button>
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
        <dd>{{$store.state.common.userInfo.departmentName}}{{this.searchForm.timecycle}}OKR</dd>
      </dl>
      <!-- okr -->
      <el-table :data="departokrList">
        <el-table-column width="150" prop="typeName"></el-table-column>
        <el-table-column prop="okrDetailObjectKr"></el-table-column>
        <el-table-column width="300">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.checkFlag"
              @change="selectDepartokr(scope.$index, scope.row)"
            ></el-checkbox>关联
          </template>
        </el-table-column>
        <!-- <el-table-column width="300" property="okrParentDetailId"></el-table-column> -->
      </el-table>
      <!-- 价值观 -->
      <el-table :data="philosophyList">
        <el-table-column prop="philosophy"></el-table-column>
        <el-table-column width="300">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.checkFlag"
              @change="selectphilosophy(scope.$index, scope.row)"
            ></el-checkbox>关联
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="summitguanlian()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 可修改 -->
  </div>
</template>

<script>

import CONST from '../const';

const TIME_INTERVAL = 60 * 1000;

export default {
  name: 'orkForm',
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
          krInfoVoList: [{
            // id: 0,
            okrDetailObjectKr: '',
            okrWeight: 0,
            okrDetailProgress: 0,
            okrDetailConfidence: '',
          }],
        }],
      },
      departokrList: [], // 可关联承接的okr
      philosophyList: [], // 价值观
      pselection: [], // 已选价值观
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
  },
  created() {
    this.getjiazhiguan();
  },
  methods: {
    getjiazhiguan() {
      this.server.getphilosophy().then((res) => {
        if (res.code == 200) {
          console.log('价值观', res.data);
          this.philosophyList = res.data;
        }
      });
    },
    zidongbaocun() {
      this.timedInterval = setInterval(() => {
        this.getMsgNum();
      }, TIME_INTERVAL);
    },
    // 增加kr
    addkr(oindex) {
      console.log(this.formData.okrInfoList);
      this.formData.okrInfoList[oindex].krInfoVoList.push({
        // id: this.formData.okrInfoList[oindex].krInfoVoList.length,
        okrDetailObjectKr: '',
        okrWeight: 0,
        okrDetailProgress: 0,
        okrDetailConfidence: '',
      });
    },
    // 删除kr
    deletekr(oindex, krindex) {
      this.formData.okrInfoList[oindex].krInfoVoList.splice(krindex, 1);
    },
    // 增加o
    addobject() {
      this.formData.okrInfoList.push({
        // id: this.formData.okrInfoList.length,
        okrDetailObjectKr: '',
        okrWeight: 0,
        okrDetailProgress: 0,
        okrParentDetailId: '',
        jiazhiguanId: '',
        krInfoVoList: [{
          okrDetailObjectKr: '',
          okrWeight: 0,
          okrDetailProgress: 0,
        }],
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
    searchOkr() {
      this.server.getokrdata(this.searchForm).then((res) => {
        if (res.code == 200) {
          console.log('搜索条件', this.searchForm);
          res.data.forEach((item) => {
            this.departokrList.push({
              typeName: '目标O',
              okrDetailObjectKr: item.okrDetailObjectKr,
              okrParentDetailId: item.objectId,
              checkFlag: false,
            });
            item.krList.forEach((krItem, index) => {
              this.departokrList.push({
                typeName: `KR${index}`,
                okrDetailObjectKr: krItem.krName,
                okrParentDetailId: krItem.krId,
                checkFlag: false,
              });
            });
          });
        }
      });
    },
    // 选择关联的okr
    selectDepartokr(index, row) {
      this.departokrList.forEach((item, i) => {
        this.departokrList[i].checkFlag = false;
      });
      this.departokrList[index].checkFlag = true;
      console.log(row);
      this.formData.okrInfoList[this.selectObject].okrParentDetailId = row.okrParentDetailId + row.okrDetailObjectKr;
    },
    // 选择关联的价值观
    selectphilosophy(index, row) {
      this.philosophyList.forEach((item, i) => {
        this.philosophyList[i].checkFlag = false;
      });
      this.philosophyList[index].checkFlag = true;
      console.log(row);
      this.formData.okrInfoList[this.selectObject].jiazhiguanId = row.philosophyid + row.philosophy;
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
            oitem.krInfoVoList.forEach((kitem) => {
              keypercent += kitem.okrWeight;
            });
          });
          if (opercent != 100) {
            this.$message('o权重相加不等100~');
          }
          if (keypercent != 100) {
            this.$message('kr权重相加不等100~');
          }
          this.formData.okrBelongType = 2;
          this.formData.periodId = 'periodId';
          this.formData.userId = 'user001';
          this.formData.tenantId = 'tenant001';
          console.log('提交结果', this.formData);
          // this.canWrite = false;
          this.server.addokr(this.formData).then((res) => {
            console.log(res.code);
          });
        }
      });
    },
  },
  watch: {
    'searchForm.time': {
      handler() {
        this.searchOkr();
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