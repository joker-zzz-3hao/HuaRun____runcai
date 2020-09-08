<template>
  <div>
    <el-drawer
      :title="drawerTitle"
      :visible.sync="myokrDrawer"
      :wrapperClosable="false"
      :append-to-body="true"
      :modal-append-to-body="true"
      class="tl-drawer"
      @closed="closed"
      :before-close="close"
    >
      <!-- 公共信息 -->
      <div>
        <ul>
          <li>
            <span>目标类型</span>
            <span>{{CONST.OKR_TYPE_MAP[okrmain.okrBelongType]}}</span>
          </li>
          <li>
            <span>负责人</span>
            <span>{{okrmain.userName}}</span>
          </li>
          <li>
            <span>更新时间</span>
            <span>{{okrmain.updateTime||okrmain.createTime}}</span>
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
      <tl-okrcollapse
        ref="okrCollapse"
        :tableList="tableList"
        :canWrite="true"
        @openUndertake="openUndertakepage"
      ></tl-okrcollapse>
      <!-- 新增okr -->
      <tl-okrform
        ref="okrform"
        :searchForm="searchForm"
        :server="server"
        :canWrite="true"
        :isnew="false"
        :periodId="searchForm.periodId"
      ></tl-okrform>
      <!-- 变更原因 -->
      <div>
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
      <!-- 提交 -->
      <div>
        <el-button @click="validateForm">提交</el-button>
        <el-button @click="close">取消</el-button>
      </div>

      <el-drawer
        :visible.sync="innerDrawer"
        :modal="false"
        :wrapperClosable="false"
        :append-to-body="true"
        custom-class="diy-drawer associated-undertaking"
        class="tl-drawer"
      >
        <div slot="title" class="flex-sb">
          <div class="drawer-title">关联承接项</div>
        </div>
        <tl-undertaketable
          v-if="selectIndex !== ''"
          ref="undertake"
          :departokrList="tableList[this.selectIndex].departokrList"
          :philosophyList="tableList[this.selectIndex].philosophyList"
          :showPhil="undertakeType=='new'"
          :selectRadioDepart.sync="selectRadioDepart"
          :selectRadioPhil.sync="tableList[this.selectIndex].cultureId"
          :periodName="okrPeriod.periodName"
        ></tl-undertaketable>
        <div class="operating-box">
          <el-button type="primary" @click="summitUndertake()">确 定</el-button>
          <el-button v-if="undertakeType=='change'" type="primary" @click="summitIgnore()">忽 略</el-button>
          <el-button @click="innerDrawer = false">取 消</el-button>
        </div>
      </el-drawer>
    </el-drawer>
  </div>
</template>

<script>
import validateMixin from '@/mixin/validateMixin';
import { mapMutations } from 'vuex';
import okrCollapse from '@/components/okrCollapse';
import okrForm from './writeOkr/component/okrForm';
import undertakeTable from './writeOkr/component/undertakeTable';
import CONST from '../const';
import Server from '../server';

const server = new Server();

export default {
  name: 'changeOKR',
  mixins: [validateMixin],
  data() {
    return {
      CONST,
      server,
      tableList: [], // okr列表
      okrmain: {}, // 公共信息
      departokrList: [], // 可关联承接的okr
      departokrObject: '',
      philosophyList: [], // 价值观
      philosophyObject: {},
      selectDeletedId: '',
      reason: {
        modifyReason: '', // 变更原因
      },
      formData: {}, // 提交表单
      innerDrawer: false, // 承接项抽屉
      selectDepartRow: {},
      selectIndex: '', // 当前选择的
      okrMainId: '',
      searchForm: {
        okrStatus: '1',
        periodId: '',
      },
      undertakeType: 'new', // 关联承接类型 new 新加关联 change 变更关联
      okrPeriod: {},
      selectRadioDepart: '',
      myokrDrawer: false,
    };
  },
  components: {
    'tl-okrcollapse': okrCollapse,
    'tl-undertaketable': undertakeTable,
    'tl-okrform': okrForm,
  },
  props: {
    writeInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    drawerTitle: {
      type: String,
      defualt: 'OKR变更',
    },
  },
  mounted() {
    this.searchForm.okrId = this.writeInfo.okrId || '';
    this.searchForm.periodId = this.writeInfo.periodId;
    console.log('this.writeInfo', this.writeInfo);
  },
  created() {
  },
  methods: {
    ...mapMutations('common', ['setMyokrDrawer']),
    showOkrDialog() {
      this.searchForm.okrId = this.writeInfo.okrId || '';
      this.searchForm.periodId = this.writeInfo.periodId;
      this.getokrDetail();
      this.myokrDrawer = true;
    },
    closed() {
      this.$emit('update:exist', false);
    },
    close() {
      this.myokrDrawer = false;
    },
    // 按周期查可关联承接的okr
    searchOkr() {
      if (this.searchForm.periodId) {
        this.server.getUndertakeOkr({ periodId: this.searchForm.periodId }).then((res) => {
          if (res.code == 200) {
            if (res.data.parentUndertakeOkrInfoResult) {
              this.okrPeriod = res.data.parentUndertakeOkrInfoResult.okrPeriodEntity;
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
                      typeName: `KR${index}`,
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
          }
        });
      }
    },
    // 查公司价值观
    getCultureList() {
      this.server.queryCultureList().then((res) => {
        if (res.code == 200) {
          this.philosophyList = res.data;
          this.philosophyList.forEach((item) => {
            item.checkFlag = false;
          });
          // 将价值观列表转换成字符串
          this.philosophyObject = JSON.stringify(this.philosophyList);
        }
      });
    },
    // 查okr详情
    getokrDetail() {
      const detialP = new Promise(((resolve) => {
        this.getCultureList();
        resolve('p1 data');
      }));

      const undertakeP = new Promise(((resolve) => {
        this.searchOkr();
        resolve('p2 data');
      }));

      Promise.all([detialP, undertakeP]).then((results) => {
        console.log(results); // ["p1 data", ""p2 data""]

        this.server.getokrDetail({ okrId: this.searchForm.okrId }).then((res) => {
          if (res.code == 200) {
            this.tableList = res.data.okrDetails;
            this.okrmain = res.data.okrMain;
            this.okrMainId = res.data.okrMain.okrId;
            // this.voteUser = res.data.voteUser;
            this.tableList.forEach((item) => {
              item.departokrList = JSON.parse(this.departokrObject) || [];
              item.philosophyList = JSON.parse(this.philosophyObject) || [];
              if (item.parentUpdate) {
                // 关联承接变更接口
                this.getOkrModifyUndertakeOkrList(item);
              }
            });
          }
        });
      });
    },
    // 可变更的关联承接项
    getOkrModifyUndertakeOkrList(okritem) {
      const formData = {
        periodId: this.searchForm.periodId,
        detailId: okritem.detailId,
        okrDetailId: okritem.okrDetailId,
        okrParentId: okritem.okrParentId,
        okrDetailParentVersion: okritem.okrDetailParentVersion,
      };
      this.server.getOkrModifyUndertakeOkrList(formData).then((res) => {
        if (res.code == 200) {
          const modifyUndertakeList = res.data.modifyUndertakeList || [];
          modifyUndertakeList.forEach((item) => {
            item.typeName = item.okrDetailType === 1 ? 'KR' : '目标O';
            item.okrKind = item.okrDetailType === 1 ? 'k' : 'o';
            // 是否为当前选中
            if (item.currentOption) {
              // okritem.undertakeOkrVo = {};
              // okritem.undertakeOkrVo.undertakeOkrDetailId = item.okrDetailId;
              // okritem.undertakeOkrVo.undertakeOkrContent = item.okrDetailId;
              // okritem.undertakeOkrVo.undertakeOkrVersion = item.okrDetailId;
              okritem.currentOption = item.okrDetailId + item.okrDetailVersion;
              console.log('选中', item);
            }
          });
          // 将承接项添加到列表里
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
      if (!this.tableList[this.selectIndex].undertakeOkrVo) {
        this.tableList[this.selectIndex].undertakeOkrVo = {
          undertakeOkrDetailId: '',
          undertakeOkrVersion: '',
        };
      }
      this.selectRadioDepart = this.undertakeType == 'new'
        ? this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrDetailId
        : this.tableList[this.selectIndex].currentOption;
      this.innerDrawer = true;
    },
    // 忽略
    summitIgnore() {
      // 选择原承接的
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrDetailId = this.tableList[this.selectIndex].okrParentId || '';
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrContent = this.tableList[this.selectIndex].parentObjectKr || '';
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrVersion = this.tableList[this.selectIndex].okrDetailParentVersion || '';
      // 清除小叹号
      this.tableList[this.selectIndex].hasUpdate = true;
      // 选中
      this.tableList[this.selectIndex].currentOption = this.tableList[this.selectIndex].okrParentId
      + this.tableList[this.selectIndex].okrDetailParentVersion;
      // 关闭关联承接抽屉并刷新

      this.innerDrawer = false;
      this.$refs.okrCollapse.updateokrCollapse();
    },
    // 提交关联，给选中的o加上承接项
    summitUndertake() {
      this.selectDepartRow = this.$refs.undertake.selectDepartRow;
      this.selectPhilRow = this.$refs.undertake.selectPhilRow;
      // eslint-disable-next-line max-len
      // 承接项id、版本、名称
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrDetailId = this.selectDepartRow.okrDetailId || '';
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrContent = this.selectDepartRow.okrDetailObjectKr || '';
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrVersion = this.selectDepartRow.okrDetailVersion || '';

      this.tableList[this.selectIndex].cultureId = this.selectPhilRow.id || '';
      this.tableList[this.selectIndex].cultureName = this.selectPhilRow.cultureDesc || '';
      // 清除小叹号
      this.tableList[this.selectIndex].hasUpdate = true;
      // 选中
      this.tableList[this.selectIndex].currentOption = this.selectDepartRow.okrDetailId
      + this.selectDepartRow.okrDetailVersion;
      console.log('关联', this.selectDepartRow);
      // 关闭关联承接抽屉并刷新
      this.innerDrawer = false;
      this.$refs.okrCollapse.updateokrCollapse();
    },

    validateForm() {
      // 校验表单
      const okrformValid = this.$refs.okrform.$refs.dataForm;
      const okrCollapseValid = this.$refs.okrCollapse.$refs.changeForm;
      const reasonValid = this.$refs.reasonForm;
      Promise.all([okrformValid, okrCollapseValid, reasonValid].map(this.getFormPromise)).then((res) => {
        const validateResult = res.every((item) => !!item);
        if (validateResult) {
          console.log('表单都校验通过', validateResult);
          this.summit();
        } else {
          console.log('表单未校验通过');
        }
      });
    },
    getFormPromise(form) {
      return new Promise((resolve) => {
        form.validate((res) => {
          resolve(res);
        });
      });
    },
    // 提交更改
    summit() {
      console.log('原来的', this.tableList);
      console.log('新增的', this.$refs.okrform.formData);
      const addList = this.$refs.okrform.formData.okrInfoList;
      const okrInfoList = [];
      this.tableList.forEach((item, index) => {
        let undertakeOkr = {};
        // 新增或变更承接项
        if (item.undertakeOkrVo) {
          undertakeOkr = item.undertakeOkrVo;
          // 原有承接不改变
        } else if (item.okrParentId) {
          undertakeOkr = {
            undertakeOkrDetailId: item.okrParentId,
            undertakeOkrContent: item.parentObjectKr,
            undertakeOkrVersion: item.okrDetailParentVersion,
          };
          console.log('原有承接', undertakeOkr);
          // 无承接
        } else {
          undertakeOkr = null;
        }
        // 整理入参
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
          });
        });
        // 合并新增kr
        if (item.newkrList && item.newkrList.length > 0) {
          okrInfoList[index].krList = okrInfoList[index].krList.concat(item.newkrList);
        }
      });
      // 新增的okr中的支撑项
      addList.forEach((additem) => {
        if (additem.undertakeOkrVo && additem.undertakeOkrVo.undertakeOkrDetailId) {
          additem.undertakeOkrDto = additem.undertakeOkrVo;
        } else {
          additem.undertakeOkrDto = null;
        }
        delete additem.undertakeOkrVo;
      });
      // 拼入参
      this.formData = {
        okrInfoList: okrInfoList.concat(addList),
        periodId: this.searchForm.periodId,
        okrProgress: this.okrmain.okrProgress,
        modifyReason: this.reason.modifyReason,
        okrMainId: this.okrMainId,
        okrBelongType: this.okrmain.okrBelongType,
      };
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

      console.log('拼起来后', this.formData);
      this.server.modifyOkrInfo(this.formData).then((res) => {
        if (res.code == 200) {
          this.$message.success('提交成功');
          this.close();
          this.$emit('success');
        } else if (res.code === 30000) {
          this.$message.warning('变更申请正在审批中，请勿重复提交');
        }
      });
    },
  },
  watch: {
    // tableList: {
    //   handler(newVal) {
    //     // 添加承接列表
    //     if (newVal) {
    //       this.tableList.forEach((item) => {
    //         item.departokrList = JSON.parse(this.departokrObject) || [];
    //         item.philosophyList = JSON.parse(this.philosophyObject) || [];
    //       });
    //     }
    //   },
    //   deep: true,
    // },
  },
};
</script>

<style>
</style>