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
    <okrCollapse :tableList="tableList" :canWrite="true" :showOKRInfoLabel="true">
      <template slot="head-bar" slot-scope="props">
        <el-button @click.native.stop="openDialog(props.okritem,'o')">终止</el-button>
      </template>
      <template slot="body-bar" slot-scope="props">
        <el-button @click.native.stop="openDialog(props.okritem,'kr')">终止</el-button>
      </template>
      <template slot="addkr-bar" slot-scope="props">
        <div v-if="props.oitem.newkrList">
          <dl v-for="(newItem, kindex) in props.oitem.newkrList" :key="kindex">
            <dt>关键结果</dt>
            <dd class="objectdd">
              <el-form-item
                prop="okrDetailObjectKr"
                :rules="[{trigger: 'blur' , message: '请填写目标名称'}]"
              >
                <input v-model="newItem.okrDetailObjectKr" />
              </el-form-item>
              <el-form-item label="权重">
                <el-input-number
                  v-model="newItem.okrWeight"
                  controls-position="right"
                  :min="0"
                  :max="100"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="当前进度">
                <el-input-number
                  v-model="newItem.okrDetailProgress"
                  controls-position="right"
                  :min="0"
                  :max="100"
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
        <el-button @click.native.stop="addkr(props.oitem,'kr')">增加kr</el-button>
      </template>
    </okrCollapse>
    <!-- 新增 -->
    <okr-form ref="okrform" :server="server" :canWrite="true" :isnew="false"></okr-form>
    <!-- 提交 -->
    <div>
      <el-button @click="summit">提交</el-button>
    </div>
    <!-- 终止弹窗 -->
    <el-dialog
      title="终止"
      :visible.sync="dialogDetailVisible"
      width="50%"
      :modal-append-to-body="false"
      :before-close="close"
    >
      <div>还未完成！进度为{{deletedProgress}}%确认要终止吗？</div>
      <!-- 表格 -->
      <el-table :data="tableData">
        <el-table-column
          v-if="deletedType=='o'"
          align="left"
          width="150"
          label="目标（O）"
          prop="oTitle"
        ></el-table-column>
        <el-table-column
          v-if="deletedType=='o'"
          align="left"
          width="150"
          label="目标进度"
          prop="oProgress"
        ></el-table-column>
        <el-table-column align="left" width="150" label="关键结果（KR）" prop="krTitle"></el-table-column>
        <el-table-column align="left" width="150" label="KR进度" prop="krProgress"></el-table-column>
        <el-table-column align="left" width="150" label="权重" prop="krWeight"></el-table-column>
      </el-table>
      <!-- 结束原因 -->
      <!-- 附件 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">终止</el-button>
      </span>
    </el-dialog>
    <!-- <undertake-table
      :departokrList="departokrList"
      :philosophyList="philosophyList"
      @selectDepart="changeDepart"
      @selectPhil="changePhil"
    ></undertake-table>-->
  </div>
</template>

<script>
import okrCollapse from '@/components/okrCollapse';
import okrForm from './okrForm';
// import undertakeTable from './undertakeTable';
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
      dialogDetailVisible: false,
      tableData: [], // 终止确认表格
      deletedType: '', // 终止的类型
      deletedProgress: '', // 终止进度
    };
  },
  components: {
    okrCollapse,
    // 'undertake-table': undertakeTable,
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
  },
  created() {
    this.getokrDetail();
  },
  methods: {
    // 查okr详情
    getokrDetail() {
      this.server.getokrDetail({ okrId: this.okrId }).then((res) => {
        console.log('detail', res);
        this.tableList = res.data.okrDetails;
        this.okrmain = res.data.okrMain;
        // this.voteUser = res.data.voteUser;
      });
    },
    // 选择关联的okr
    changeDepart(row) {
      this.tableList.okrInfoList[this.selectObject].undertakeOkrVo.undertakeOkrDetailId = row.okrDetailId;
      this.tableList.okrInfoList[this.selectObject].undertakeOkrVo.undertakeOkrVersion = row.okrDetailVersion;
    },
    // 选择关联的价值观
    changePhil(row) {
      this.tableList.okrInfoList[this.selectObject].cultureId = row.id || '1162020375644299264';
      console.log('关联', row);
    },
    openDialog(row, type) {
      this.tableData = [];
      this.deletedType = type;
      this.deletedProgress = row.okrDetailProgress;
      console.log('点了他', row);
      row.stopokr = 1; //
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

      this.dialogDetailVisible = true;
    },
    close() {
      this.dialogDetailVisible = false;
    },
    // 增加kr
    addkr(okritem) {
      console.log('newkrList', okritem.newkrList);
      if (!okritem.newkrList) {
        okritem.newkrList = [];
        console.log('newkrList', okritem.newkrList);
      }
      okritem.newkrList.push({
        // id: this.formData.okrInfoList[oindex].krList.length,
        okrDetailObjectKr: '',
        okrWeight: 0,
        okrDetailProgress: 0,
        okrDetailConfidence: '',
      });
      this.$forceUpdate();
      console.log('okritem', okritem);
    },
    // 删除kr
    deletekr(okritem, krindex) {
      okritem.newkrList.splice(krindex, 1);
      this.$forceUpdate();
    },
    summit() {
      console.log('新增的', this.$refs.okrform.formData);
      console.log('原来的', this.tableList);
      console.log('拼起来');
    },
  },
};
</script>

<style>
</style>