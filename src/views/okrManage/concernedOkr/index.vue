<template>
  <div class="concerned-okr">
    <!-- <div>
      <div>
        <div>我的关注</div>
        <div @click="addFocus" v-if="hasPower('okr-focus-add')">
          <span>添加关注</span>
          <i class="el-icon-plus"></i>
        </div>
      </div>
      <div
        v-for="item in focusList"
        :key="item.id"
        :class="item.targetId == selectUserId ? 'red' : 'green'"
        @click="selectUser(item)"
      >
        <div style="display: flex" class="user-info">
          <div v-if="item.headUrl">
            <el-avatar :src="item.headUrl"></el-avatar>
          </div>
          <div v-else-if="item.userName" class="user-name">
            <em>{{ item.userName.substring(item.userName.length - 2) }}</em>
          </div>
          <div>{{ item.targetName }}</div>
          <div>{{ `(${item.orgName})` }}</div>
        </div>
        <div v-if="hasPower('okr-focus-add')" @click="cancelFocus(item)">取消关注</div>
      </div>
    </div> -->
    <div v-for="item in tableList" :key="item.okrMain.okrId">
      <div class="card-panel-head">
        <div class="okr-title">{{ item.okrMain.periodName }}</div>
        <dl class="okr-state">
          <dt>
            <i class="el-icon-set-up"></i>
            <em>状态</em>
          </dt>
          <dd>
            <i class="el-icon-sunny"></i>
            <em>{{ CONST.STATUS_LIST_MAP[item.okrMain.status] }}</em>
          </dd>
        </dl>
        <dl class="okr-responsible">
          <dt>
            <i class="el-icon-user"></i>
            <em>负责人</em>
          </dt>
          <dd>{{ item.okrMain.userName }}</dd>
        </dl>
        <dl class="okr-responsible">
          <dd v-if="item.supported" @click="addFocus(item)">关注</dd>
          <dd v-else @click="cancelFocus(item)">取消关注</dd>
        </dl>
        <dl class="okr-progress">
          <dt>
            <i class="el-icon-odometer"></i>
            <em>OKR进度</em>
          </dt>
          <dd>
            <el-progress
              type="circle"
              :percentage="parseInt(item.okrMain.okrProgress, 10) || 0"
              :width="70"
              :stroke-width="5"
              color="#4ccd79"
              class="tl-progress-circle"
            ></el-progress>
          </dd>
        </dl>
      </div>
      <tl-okr-table
        :overview="true"
        :tableList="item.tableList"
        :disabled="false"
        :showOKRInfoLabel="true"
        :expands="expands"
      ></tl-okr-table>
    </div>
  </div>
</template>

<script>
import okrTableLittle from '@/components/okrTableLittle';
import CONST from './const';
import Server from './server';

const server = new Server();

export default {
  name: 'concernedOkr',
  components: {
    'tl-okr-table': okrTableLittle,
  },
  data() {
    return {
      server,
      CONST,
      focusList: [],
      exist: false,
      param: [],
      selectUserId: '',
      tableList: [],
    };
  },
  computed: {
    expands() {
      if (this.tableList.length > 0) {
        return [this.tableList[0].okrDetailId];
      }
      return [];
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.hasPower('okr-foucs-list')) {
        this.queryOKR();
      }
    },
    addFocus(data) {
      this.param = [];
      this.param.push({
        focusType: 0,
        targetId: data.okrMain.okrId,
        supported: 1,
      });
      this.server.addFocus(
        this.param,
      ).then((res) => {
        if (res.code == '200') {
          console.log(res);
          this.init();
        }
      });
    },
    queryOKR() {
      if (this.hasPower('okr-focus-user-detail')) {
        this.tableList = [];
        this.server.queryFocusUserOkr().then((response) => {
          if (response.code == '200') {
            response.data.forEach((item) => {
              this.tableList.push({
                okrMain: item.okrMain,
                tableList: item.okrDetails,
              });
            });
          }
        });
      }
    },
    cancelFocus(data) {
      this.param = [];
      this.param.push({
        focusType: 0,
        targetId: data.okrMain.okrId,
        supported: 0,
      });
      this.server.addFocus(
        this.param,
      ).then((res) => {
        if (res.code == '200') {
          console.log(res);
          this.init();
        }
      });
    },
    success() {
      this.exist = false;
      this.init();
    },
    closed() {
      this.exist = false;
    },
  },
};
</script>
<style scoped>
.red {
  background-color: red;
}
.green {
  background-color: green;
}
.pic-notice {
  background: url("~@/assets/images/demoPic/noticeOkr.png") no-repeat;
  background-size: 100%;
  /* background-size: cover; */
  height: calc(80vh);
}
</style>