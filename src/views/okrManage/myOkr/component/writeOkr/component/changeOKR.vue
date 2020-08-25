<template>
  <div>
    <!-- 公共信息 -->
    <div>
      <ul>
        <li>
          <span>目标类型</span>
          <span>{{okrmain.okrBelongType}}</span>
        </li>
        <li>
          <span>负责人</span>
          <span>{{okrmain.userName}}</span>
        </li>
        <li>
          <span>更新时间</span>
          <span>{{okrmain.updateTime}}</span>
        </li>
        <li>
          <span>进度</span>
          <span>
            <el-progress :stroke-width="10" :percentage="parseInt(okrmain.okrProgress, 10)"></el-progress>
          </span>
        </li>
      </ul>
    </div>
    <!-- okr折叠面板 -->
    <okrCollapse
      ref="okrCollapse"
      :tableList="tableList"
      :canWrite="true"
      :showOKRInfoLabel="true"
      @openUndertake="openUndertakepage"
    >
      <!-- 在o下新增kr -->
      <template slot="addkr-bar" slot-scope="props">
        <form :model="props.oitem">
          <div v-if="props.oitem.newkrList">
            <dl v-for="(newItem, kindex) in props.oitem.newkrList" :key="kindex">
              <dt>KR</dt>
              <dd class="objectdd">
                <el-form-item
                  :prop="'newkrList.' + kindex + '.okrDetailObjectKr'"
                  :rules="[{trigger: 'blur', message: '请填写目标O名称',required:true}]"
                >
                  <input v-model="newItem.okrDetailObjectKr" />
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
                <el-form-item label="信心指数">
                  <el-popover placement="right" width="400" trigger="click" :append-to-body="false">
                    <el-radio-group v-model="newItem.okrDetailConfidence">
                      <el-radio-button
                        v-for="citem in CONST.CONFIDENCE"
                        :key="citem.value"
                        :label="citem.value"
                      >{{citem.label}}</el-radio-button>
                    </el-radio-group>
                    <el-button slot="reference">信息状态</el-button>
                  </el-popover>
                </el-form-item>
                <el-button @click="deletekr(props.oitem,kindex)">删kr</el-button>
              </dd>
            </dl>
          </div>
          <div style="display:none">{{props.oitem.newkrList}}</div>
          <el-button @click="addkr(props.oitem,'kr')">增加kr</el-button>
        </form>
      </template>
    </okrCollapse>
    <!-- 新增okr -->
    <okr-form
      ref="okrform"
      :searchForm="searchForm"
      :server="server"
      :canWrite="true"
      :isnew="false"
    ></okr-form>
    <!-- 变更原因 -->
    <div>
      <span>变更原因</span>
      <el-input type="textarea" v-model="modifyReason"></el-input>
    </div>
    <!-- 提交 -->
    <div>
      <el-button @click="summit">提交</el-button>
      <el-button @click="goback">取消</el-button>
    </div>

    <el-drawer title="关联承接项" :modal="false" :visible.sync="innerDrawer">
      <undertake-table
        v-if="selectIndex !== ''"
        ref="undertake"
        :departokrList="tableList[this.selectIndex].departokrList"
        :philosophyList="tableList[this.selectIndex].philosophyList"
        :showPhil="undertakeType=='new'"
      ></undertake-table>
      <el-button type="primary" @click="summitUndertake()">确 定</el-button>
      <el-button @click="innerDrawer = false">取 消</el-button>
    </el-drawer>
  </div>
</template>

<script>
import validateMixin from '@/mixin/validateMixin';
import { mapMutations } from 'vuex';
import okrCollapse from '@/components/okrCollapse';
import okrForm from './okrForm';
import undertakeTable from './undertakeTable';
import CONST from '../const';

export default {
  name: 'changeOKR',
  mixins: [validateMixin],
  data() {
    return {
      CONST,
      tableList: [], // okr列表
      okrmain: {}, // 公共信息
      departokrList: [], // 可关联承接的okr
      departokrObject: '',
      philosophyList: [], // 价值观
      philosophyObject: {},
      dialogStopVisible: false, // 终止弹窗
      tableData: [], // 终止确认表格
      deletedType: '', // 终止的类型

      selectDeletedId: '',
      remark: '', // 终止原因
      modifyReason: '', // 变更原因
      formData: {}, // 提交表单
      innerDrawer: false, // 承接项抽屉
      selectDepartRow: {},
      selectIndex: '', // 当前选择的
      okrMainId: '',
      searchForm: {
        okrStatus: '1',
      },
      undertakeType: true, //
    };
  },
  components: {
    okrCollapse,
    'undertake-table': undertakeTable,
    'okr-form': okrForm,
  },
  props: {
    server: {
      type: Object,
      required: true,
    },
    canWrite: {
      type: Boolean,
      default: true,
    },
    okrId: {
      type: String,
      default: '',
    },
    periodId: {
      type: String,
      default: '',
    },
  },
  created() {
    this.searchOkr();
    this.getCultureList();
    this.$nextTick(() => {
      this.getokrDetail();
      this.searchForm.periodId = this.periodId;
    });
  },
  methods: {
    ...mapMutations('common', ['setMyokrDrawer']),
    // 按周期查可关联承接的okr
    searchOkr() {
      if (this.periodId) {
        this.server.getUndertakeOkr({ periodId: this.periodId }).then((res) => {
          console.log('searchOkr', res);
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
          }
        });
      }
    },
    // 查公司价值观
    getCultureList() {
      this.server.queryCultureList().then((res) => {
        console.log('getCultureList', res);
        if (res.code == 200) {
          this.philosophyList = res.data;
          // 将价值观列表转换成字符串
          this.philosophyObject = JSON.stringify(this.philosophyList);
        }
      });
    },
    // 查okr详情
    getokrDetail() {
      console.log('查okr详情');
      this.server.getokrDetail({ okrId: this.okrId }).then((res) => {
        console.log('detail', res.data.okrDetails);
        this.tableList = res.data.okrDetails;
        this.okrmain = res.data.okrMain;
        this.okrMainId = res.data.okrMain.okrId;
        // this.voteUser = res.data.voteUser;
        this.tableList.forEach((item) => {
          // item.departokrList = JSON.parse(this.departokrObject);
          if (item.parentUpdate) {
            // 关联承接变更接口
            console.log('关联承接变更接口', item);
            this.getOkrModifyUndertakeOkrList(item);
          }
        });
      });
    },
    // 可变更
    getOkrModifyUndertakeOkrList(okritem) {
      const formData = {
        periodId: this.periodId,
        detailId: okritem.detailId,
        okrDetailId: okritem.okrDetailId,
        okrParentId: okritem.okrParentId,
        okrDetailParentVersion: okritem.okrDetailParentVersion,
      };
      this.server.getOkrModifyUndertakeOkrList(formData).then((res) => {
        if (res.code == 200) {
          const modifyUndertakeList = res.data.modifyUndertakeList || [];
          modifyUndertakeList.forEach((item) => {
            item.typeName = item.okrDetailType === 1 ? '关键结果KR' : '目标O';
          });
          okritem.departokrList = res.data.modifyUndertakeList;
        }
      });
    },
    // 打开承接弹窗
    openUndertakepage(data) {
      console.log('打开承接弹窗', data);
      // 选择o的序号，打开关联承接弹框
      this.selectIndex = parseInt(data.num, 10);
      this.undertakeType = data.type;
      //  需要重新查承接list,一进来就先查可承接的。打开对应弹窗再赋值？
      if (!this.tableList[this.selectIndex].undertakeOkrVo) {
        this.tableList[this.selectIndex].undertakeOkrVo = {
          undertakeOkrDetailId: '',
          undertakeOkrVersion: '',
        };
      }
      this.innerDrawer = true;
    },
    // 提交关联，给选中的o加上承接项
    summitUndertake() {
      this.selectDepartRow = this.$refs.undertake.selectDepartRow;
      this.selectPhilRow = this.$refs.undertake.selectPhilRow;
      // eslint-disable-next-line max-len
      // 承接项id、版本、名称
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrDetailId = this.selectDepartRow.checkFlag ? this.selectDepartRow.okrDetailId : '';
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrContent = this.selectDepartRow.checkFlag ? this.selectDepartRow.okrDetailObjectKr : '';
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrVersion = this.selectDepartRow.checkFlag ? this.selectDepartRow.okrDetailVersion : '';

      // TODO:价值观的id
      this.tableList[this.selectIndex].cultureId = this.selectPhilRow.checkFlag ? this.selectPhilRow.id : '';
      this.tableList[this.selectIndex].cultureName = this.selectPhilRow.checkFlag ? this.selectPhilRow.cultureDesc : '';
      console.log('关联', this.selectDepartRow);
      this.innerDrawer = false;
      this.$refs.okrCollapse.updateokrCollapse();
    },
    // 增加kr
    addkr(okritem) {
      if (!okritem.newkrList) {
        okritem.newkrList = [];
      }
      okritem.newkrList.push({
        // id: this.formData.okrInfoList[oindex].krList.length,
        okrDetailObjectKr: '',
        okrWeight: 0,
        okrDetailProgress: 0,
        okrDetailConfidence: 1,
      });
      this.$forceUpdate();
      this.$refs.okrCollapse.updateokrCollapse();
      console.log('okritem', okritem);
    },
    // 删除kr
    deletekr(okritem, krindex) {
      okritem.newkrList.splice(krindex, 1);
      this.$forceUpdate();
      this.$refs.okrCollapse.updateokrCollapse();
    },
    // 提交更改
    summit() {
      // 校验okrForm的
      // 校验
      console.log('原来的', this.tableList);
      console.log('新增的', this.$refs.okrform.formData);
      const addList = this.$refs.okrform.formData.okrInfoList;
      const okrInfoList = [];
      this.tableList.forEach((item, index) => {
        let undertakeOkr = {};
        if (item.undertakeOkrVo) {
          undertakeOkr = item.undertakeOkrVo;
        } else {
          undertakeOkr = {
            undertakeOkrDetailId: item.okrParentId,
            undertakeOkrContent: item.parentObjectKr,
            undertakeOkrVersion: item.okrDetailParentVersion,
          };
        }
        okrInfoList.push({
          detailId: item.detailId,
          okrDetailId: item.okrDetailId,
          okrDetailObjectKr: item.okrDetailObjectKr,
          okrWeight: item.okrWeight,
          okrDetailProgress: item.okrDetailProgress,
          cultureId: item.cultureId,
          undertakeOkrDto: undertakeOkr,
          krList: [],
        });
        item.krList.forEach((kritem) => {
          okrInfoList[index].krList.push({
            detailId: kritem.detailId,
            okrDetailObjectKr: kritem.okrDetailObjectKr,
            okrWeight: kritem.okrWeight,
            okrDetailProgress: kritem.okrDetailProgress,
            okrDetailConfidence: kritem.okrDetailConfidence,
            // undertakeOkr: {
            //   undertakeOkrId: kritem.okrParentId || '',
            //   undertakeOkrContent: '',
            //   undertakeOkrVersion: kritem.okrDetailParentVersion,
            // },
          });
        });
        if (item.newkrList && item.newkrList.length > 0) {
          console.log('newkrList', item.newkrList);
          console.log('okrInfoList[index]', okrInfoList[index].krList);
          okrInfoList[index].krList = okrInfoList[index].krList.concat(item.newkrList);
        }
      });
      this.formData = {
        okrInfoList: okrInfoList.concat(addList),
        // detailokrList: this.detailokrList,
        periodId: this.periodId,
        okrProgress: this.okrmain.okrProgress,
        modifyReason: this.modifyReason,
        okrMainId: this.okrMainId,
      };
      console.log('拼起来后', this.formData);
      this.server.modifyOkrInfo(this.formData).then((res) => {
        if (res.code == 200) {
          this.$message('提交成功');
          this.setMyokrDrawer(false);
        }
      });
    },
    goback() {
      this.setMyokrDrawer(false);
      // this.$router.push({ name: 'myOkr', params: { activeName: 'myokr' } });
    },

  },
  watch: {
    'tableList.length': {
      handler() {
        // 添加承接列表
        this.tableList.forEach((item) => {
          item.departokrList = JSON.parse(this.departokrObject) || [];
          item.philosophyList = JSON.parse(this.philosophyObject) || [];
        });
      },
    },
  },
};
</script>

<style>
</style>