<template>
  <div class="home">
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
        <div style="display:flex;">
          <div>
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
          </div>
          <div>{{item.userName}}</div>
          <div>{{`(${item.orgName})`}}</div>
        </div>
        <div @click="cancelFocus(item)">取消关注</div>
      </div>
    </div>
    <div>
      <tl-okrCollapse :tableList="tableList"></tl-okrCollapse>
    </div>
    <tl-focus
      v-if="exist"
      ref="focus"
      :exist="exist"
      @success="success"
      @closed="closed"
      :focusList="this.focusList"
    ></tl-focus>
  </div>
</template>

<script>
import okrCollapse from '@/components/okrCollapse';
import focus from './components/focus';
import Server from './server';

const server = new Server();

export default {
  name: 'concernedOkr',
  components: {
    'tl-okrCollapse': okrCollapse,
    'tl-focus': focus,
  },
  data() {
    return {
      server,
      focusList: [],
      exist: false,
      param: [],
      selectUserId: '',
      tableList: [],
    };
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
      this.server.queryFocusUserOkr({
        userId: this.selectUserId,
      }).then((response) => {
        if (response.code == '200') {
          console.log(response);
          this.tableList = response.data;
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
</style>