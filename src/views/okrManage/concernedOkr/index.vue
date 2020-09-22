<template>
  <div class="home">
    <div v-if="!showReal" class="show-pic">
      <div class="pic-notice"></div>
    </div>
    <template v-if="showReal">
      <div>
        <div style="display: flex;justify-content: space-between;width: 300px;">
          <div>我的关注</div>
          <div @click="addFocus">
            <span>添加关注</span>
            <i class="el-icon-plus"></i>
          </div>
        </div>
        <div
          style="display: flex;justify-content: space-between;width: 300px;margin-top: 20px;"
          v-for="item in focusList"
          :key="item.id"
          :class="item.targetId == selectUserId ? 'red' : 'green'"
          @click="selectUser(item)"
        >
          <div style="display:flex;" class="user-info">
            <div v-if="item.headUrl">
              <el-avatar :src="item.headUrl"></el-avatar>
            </div>
            <div v-else-if="item.userName" class="user-name">
              <em>{{item.userName.substring(item.userName.length-2)}}</em>
            </div>
            <div>{{item.targetName}}</div>
            <div>{{`(${item.orgName})`}}</div>
          </div>
          <div @click="cancelFocus(item)">取消关注</div>
        </div>
      </div>
      <div v-for="item in tableList" :key="item.okrMain.okrId">
        <div class="card-panel-head">
          <div class="okr-title">{{item.okrMain.periodName}}</div>
          <dl class="okr-state">
            <dt>
              <i class="el-icon-set-up"></i>
              <em>状态</em>
            </dt>
            <dd>
              <i class="el-icon-sunny"></i>
              <em>{{CONST.STATUS_LIST_MAP[item.okrMain.status]}}</em>
            </dd>
          </dl>
          <dl class="okr-responsible">
            <dt>
              <i class="el-icon-user"></i>
              <em>负责人</em>
            </dt>
            <dd>{{item.okrMain.userName}}</dd>
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
      <tl-focus
        v-if="exist"
        ref="focus"
        :exist="exist"
        @success="success"
        @closed="closed"
        :focusList="this.focusList"
      ></tl-focus>
    </template>
  </div>
</template>

<script>
import okrTable from '@/components/okrTable';
import CONST from './const';
import focus from './components/focus';
import Server from './server';

const server = new Server();

export default {
  name: 'concernedOkr',
  components: {
    'tl-okr-table': okrTable,
    'tl-focus': focus,
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
      showReal: false, // 展示示例图片 false
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
      this.server.focusList().then((res) => {
        if (res.code == '200') {
          this.focusList = res.data;
          if (this.focusList.length > 0) {
            if (res.data.length > 0) {
              this.selectUserId = res.data[0].targetId;
              this.queryOKR();
            }
          }
        }
      });
    },
    addFocus() {
      this.exist = true;
      this.$nextTick(() => {
        this.$refs.focus.show();
      });
    },
    queryOKR() {
      this.tableList = [];
      this.server.queryFocusUserOkr({
        userId: this.selectUserId,
      }).then((response) => {
        if (response.code == '200') {
          response.data.forEach((item) => {
            this.tableList.push({
              okrMain: item.okrMain,
              tableList: item.okrDetails,
            });
          });
        }
      });
    },
    selectUser(data) {
      this.selectUserId = data.targetId;
      this.queryOKR();
    },
    cancelFocus(data) {
      this.param = [];
      this.param.push({
        focusType: 0,
        targetId: data.targetId,
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