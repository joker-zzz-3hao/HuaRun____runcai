<template>
  <div>
    <!-- 填写表单&详情 -->
    <div>
      <el-form>
        <dl class="okuang" v-for="(oitem,index) in formData.okrList" :key="index">
          <dt>目标名称</dt>
          <dd class="objectdd">
            <el-form-item>
              <el-input v-if="canWrite" v-model="oitem.objectName"></el-input>
              <span v-else>{{oitem.objectName}}</span>
            </el-form-item>
            <el-form-item label="权重">
              <el-input-number
                v-if="canWrite"
                v-model="oitem.percent"
                controls-position="right"
                :min="0"
                :max="100"
              ></el-input-number>
              <span v-else>{{oitem.percent}}</span>
            </el-form-item>
            <el-form-item label="当前进度">
              <el-input-number
                v-if="canWrite"
                v-model="oitem.progress"
                controls-position="right"
                :min="0"
                :max="100"
              ></el-input-number>
              <span v-else>{{oitem.progress}}</span>
            </el-form-item>
            <el-form-item label="关联承接项">
              <el-button @click="guanlian(index)">关联承接项</el-button>
              <span></span>
              <!-- <el-popover placement="right" width="400" trigger="click">
                <el-table :data="departokrList">
                  <el-table-column width="150" property="typeName"></el-table-column>
                  <el-table-column width="100" property="objectName"></el-table-column>
                  <el-table-column width="300" property="guanlianId"></el-table-column>
                </el-table>
                <el-button slot="reference">关联承接项</el-button>
              </el-popover>-->
            </el-form-item>
          </dd>
          <dd>
            <dl v-for="(kitem, kindex) in oitem.keyList" :key="kindex">
              <dt>关键结果</dt>
              <dd class="objectdd">
                <el-form-item>
                  <el-input v-if="canWrite" v-model="kitem.keyName"></el-input>
                  <span v-else>{{kitem.keyName}}</span>
                </el-form-item>
                <el-form-item label="权重">
                  <el-input-number
                    v-if="canWrite"
                    v-model="kitem.percent"
                    controls-position="right"
                    :min="0"
                    :max="100"
                  ></el-input-number>
                  <span v-else>{{kitem.percent}}</span>
                </el-form-item>
                <el-form-item label="当前进度">
                  <el-input-number
                    v-if="canWrite"
                    v-model="kitem.progress"
                    controls-position="right"
                    :min="0"
                    :max="100"
                  ></el-input-number>
                  <span v-else>{{kitem.progress}}</span>
                </el-form-item>
                <el-form-item label="信心指数">
                  <el-rate
                    v-if="canWrite"
                    v-model="kitem.rate"
                    :icon-classes="['el-icon-house','el-icon-house','el-icon-house']"
                    void-icon-class="el-icon-house"
                  ></el-rate>
                  <span v-else>{{kitem.rate}}</span>
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
        <el-table-column prop="objectName"></el-table-column>
        <el-table-column width="300">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.checkFlag"
              @change="selectDepartokr(scope.$index, scope.row)"
            ></el-checkbox>关联
          </template>
        </el-table-column>
        <!-- <el-table-column width="300" property="guanlianId"></el-table-column> -->
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
const TIME_INTERVAL = 60 * 1000;

export default {
  name: 'orkForm',
  data() {
    return {
      formData: {
        okrList: [{
          id: 0,
          objectName: '',
          percent: 0,
          progress: 0,
          keyList: [{
            id: 0,
            keyName: '',
            percent: 0,
            progress: 0,
            rate: 0,
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
      console.log(this.formData.okrList);
      this.formData.okrList[oindex].keyList.push({
        id: this.formData.okrList[oindex].keyList.length,
        keyName: '',
        percent: 0,
        progress: 0,
      });
    },
    // 删除kr
    deletekr(oindex, krindex) {
      this.formData.okrList[oindex].keyList.splice(krindex, 1);
    },
    // 增加o
    addobject() {
      this.formData.okrList.push({
        id: this.formData.okrList.length,
        objectName: '',
        percent: 0,
        progress: 0,
        guanlianId: '',
        jiazhiguanId: '',
        keyList: [{
          keyName: '',
          percent: 0,
          progress: 0,
        }],
      });
      console.log(this.formData.okrList);
    },
    // 删除o
    deleteobject(oindex) {
      this.formData.okrList.splice(oindex, 1);
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
              objectName: item.objectName,
              guanlianId: item.objectId,
              checkFlag: false,
            });
            item.krList.forEach((krItem, index) => {
              this.departokrList.push({
                typeName: `KR${index}`,
                objectName: krItem.krName,
                guanlianId: krItem.krId,
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
      this.formData.okrList[this.selectObject].guanlianId = row.guanlianId + row.objectName;
    },
    // 选择关联的价值观
    selectphilosophy(index, row) {
      this.philosophyList.forEach((item, i) => {
        this.philosophyList[i].checkFlag = false;
      });
      this.philosophyList[index].checkFlag = true;
      console.log(row);
      this.formData.okrList[this.selectObject].jiazhiguanId = row.philosophyid + row.philosophy;
    },
    // 提交关联
    summitguanlian() {
      this.dialogVisible = false;
    },
    // 提交表单
    summit() {
      // 校验权重比例
      console.log('提交结果', this.formData);
      // this.canWrite = false;
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