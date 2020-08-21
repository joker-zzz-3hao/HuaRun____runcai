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
    <!-- 变更原因 -->
    <div></div>
    <okrCollapse
      ref="okrCollapse"
      :tableList="tableList"
      :canWrite="true"
      :showOKRInfoLabel="true"
      @openUndertake="openUndertake"
    >
      <template slot="addkr-bar" slot-scope="props">
        <div v-if="props.oitem.newkrList">
          <dl v-for="(newItem, kindex) in props.oitem.newkrList" :key="kindex">
            <dt>关键结果</dt>
            <dd class="objectdd">
              <el-form-item
                :prop="'newkrList.' + index + '.okrDetailObjectKr'"
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

    <el-dialog
      title="关联承接项"
      :visible.sync="dialogVisible"
      width="30%"
      :modal-append-to-body="false"
    >
      <undertake-table
        v-if="selectIndex !== ''"
        ref="undertake"
        :departokrList="tableList[selectIndex].departokrList"
        :showPhil="false"
      ></undertake-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="summitUndertake()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import okrCollapse from '@/components/okrCollapse';
import okrForm from './okrForm';
import undertakeTable from './undertakeTable';
import CONST from '../const';

export default {
  name: 'changeOKR',
  data() {
    return {
      CONST,
      tableList: [], // okr列表
      okrmain: {}, // 公共信息
      departokrList: [], // 可关联承接的okr
      philosophyList: [], // 价值观
      dialogStopVisible: false, // 终止弹窗
      tableData: [], // 终止确认表格
      deletedType: '', // 终止的类型
      deletedProgress: '', // 终止进度
      detailokrList: [], // 终止进度
      selectDeletedId: '',
      remark: '', // 终止原因
      modifyReason: '', // 变更原因
      formData: {}, // 提交表单
      dialogVisible: false, // 承接项弹窗
      selectDepartRow: {},
      selectIndex: '', // 当前选择的
      okrMainId: '',
      searchForm: {
        okrStatus: '1',
      },
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
    this.getokrDetail();
    this.searchOkr();
  },
  methods: {
    ...mapMutations('common', ['setMyokrDrawer']),
    // 查okr详情
    getokrDetail() {
      this.server.getokrDetail({ okrId: this.okrId }).then((res) => {
        console.log('detail', res.data.okrMain);
        this.tableList = res.data.okrDetails;
        this.okrmain = res.data.okrMain;
        this.okrMainId = res.data.okrMain.okrId;
        // this.voteUser = res.data.voteUser;
        this.tableList.forEach((item) => {
          if (item.parentUpdate) {
            this.searchOkr(item.detailId, item);
          }
        });
      });
    },
    // 查可关联承接的okr
    searchOkr(detailId, okritem) {
      this.server.getUndertakeOkr({ detailId }).then((res) => {
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
          okritem.departokrList = this.departokrList;
        }
      });
    },
    // 打开终止弹窗
    openStopDialog(row, type) {
      this.tableData = [];
      this.remark = '';
      this.selectDeletedId = row.detailId; // 即将终止的id
      this.deletedType = type;
      this.deletedProgress = row.okrDetailProgress;
      console.log('点了他', row);
      row.stopMark = 1; // 删除标记
      console.log('点了他', this.tableList);
      if (type == 'o') {
        row.krList.forEach((kritem) => {
          this.tableData.push({
            oTitle: row.okrDetailObjectKr,
            oProgress: row.okrDetailProgress,
            krTitle: kritem.okrDetailObjectKr,
            krProgress: kritem.okrDetailProgress,
            krWeight: kritem.okrWeight,
          });
        });
      } else if (type == 'kr') {
        this.tableData.push({
          // oTitle: row.okrDetailObjectKr,
          // oProgress: row.okrDetailProgress,
          krTitle: row.okrDetailObjectKr,
          krProgress: row.okrDetailProgress,
          krWeight: row.okrWeight,
        });
      }
      this.dialogStopVisible = true;
    },
    // 关闭终止弹窗
    closeStopDialog() {
      this.dialogStopVisible = false;
    },
    // 打开承接弹窗
    openUndertake(index) {
      this.selectIndex = index;
      //  需要重新查承接list,一进来就先查可承接的。打开对应弹窗再赋值？
      if (!this.tableList[this.selectIndex].undertakeOkrVo) {
        this.tableList[this.selectIndex].undertakeOkrVo = {
          undertakeOkrDetailId: '',
          undertakeOkrVersion: '',
        };
      }
      this.dialogVisible = true;
    },
    // 提交关联，给选中的o加上承接项
    summitUndertake() {
      this.selectDepartRow = this.$refs.undertake.selectDepartRow;
      // eslint-disable-next-line max-len
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrDetailId = this.selectDepartRow.checkFlag ? this.selectDepartRow.okrDetailId : '';
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrVersion = this.selectDepartRow.checkFlag ? this.selectDepartRow.okrDetailVersion : '';
      console.log('关联', this.tableList[this.selectIndex]);
      this.dialogVisible = false;
    },
    // 提交终止
    summitStop() {
      this.tableList.forEach((oitem) => {
        if (oitem.detailId == this.selectDeletedId) {
          oitem.stopMark = 1;
          return;
        }
        oitem.krList.forEach((kritem) => {
          if (kritem.detailId == this.selectDeletedId) {
            kritem.stopMark = 1;
          }
        });
      });
      if (this.detailokrList.length == 0) {
        this.detailokrList.push({
          okrId: this.selectDeletedId,
          remark: this.remark,
          fileIdList: [],
        });
      } else if (this.detailokrList.length > 0) {
        this.detailokrList.forEach((item) => {
          if (item.okrId != this.selectDeletedId) {
            this.detailokrList.push({
              okrId: this.selectDeletedId,
              remark: this.remark,
              fileIdList: ['item.okrId != this.selectDeletedId'],
            });
          } else {
            item.remark = this.remark;
            item.fileIdList = ['else'];
          }
        });
      }

      this.dialogStopVisible = false;
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
      console.log('删除的', this.detailokrList);
      console.log('原来的', this.tableList);
      console.log('新增的', this.$refs.okrform.formData);
      const addList = this.$refs.okrform.formData.okrInfoList;
      const okrInfoList = [];
      this.tableList.forEach((item, index) => {
        okrInfoList.push({
          detailId: item.detailId,
          okrDetailId: item.okrDetailId,
          okrDetailObjectKr: item.okrDetailObjectKr,
          okrWeight: item.okrWeight,
          okrDetailProgress: item.okrDetailProgress,
          undertakeOkr: { undertakeOkrId: item.okrParentId || '', undertakeOkrContent: '', undertakeOkrVersion: item.okrDetailParentVersion },
          krList: [],
        });
        item.krList.forEach((kritem) => {
          okrInfoList[index].krList.push({
            detailId: kritem.detailId,
            okrDetailObjectKr: kritem.okrDetailObjectKr,
            okrWeight: kritem.okrWeight,
            okrDetailProgress: kritem.okrDetailProgress,
            okrDetailConfidence: kritem.okrDetailConfidence,
            undertakeOkr: { undertakeOkrId: kritem.okrParentId || '', undertakeOkrContent: '', undertakeOkrVersion: kritem.okrDetailParentVersion },
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
};
</script>

<style>
</style>