<template>
  <div class="home">
    <!-- 基本信息 -->
    <div>
      <div class="display-flex">
        <div>所属部门：</div>
        <div>华润云-云门户</div>
      </div>
      <div class="display-flex">
        <div>团队负责人：</div>
        <div>张聪</div>
      </div>
      <div class="display-flex">
        <div>团队综合管理员：</div>
        <div>未设置</div>
      </div>
    </div>
    <!-- 管理设置 -->
    <div>
      <div class="display-flex">
        <div>团队综合管理员：</div>
        <div>李四</div>
        <div>
          <el-button @click="setManager">设置团队综合管理员</el-button>
        </div>
      </div>
      <div>
        <div class="display-flex">
          <div>周报是否开放 (周报的查看权限)</div>
          <div>
            <el-switch v-model="weeklyOpen" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </div>
        </div>
        <div>
          开户：整个公司的人，能够互相查看彼此的周报
          关闭：仅部门队友，能够互相查看彼此的周报
        </div>
      </div>
      <div class="display-flex">
        <div>写周报模式</div>
        <el-checkbox-group v-model="weeklyMode" :min="1">
          <el-checkbox label="1">标准模式</el-checkbox>
          <el-checkbox label="2">简单模式</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="display-flex">
        <div>是否开启OKR审核</div>
        <div>
          <el-switch v-model="openOkrApproval" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </div>
      </div>
    </div>
    <!-- 团队成员 -->
    <div>
      <!-- 实体团队 -->
      <div class="display-flex" style="width: 1200px;border: 1px solid;">
        <div class="team-class">
          <p>实体团队</p>
        </div>
        <div style="width: auto;height: 100px;align-items: center;display: flex;">
          <div
            :class="{'bg-select': item.select == teamSelect,'bg-unselect': item.select != teamSelect,}"
            v-for="item in circleList"
            class="circle"
            :key="item.id"
            @click="selectTeam(item)"
          >{{item.name}}</div>
        </div>
      </div>
      <!-- 实体成员 -->
      <div class="display-flex" style="width: 1200px;border: 1px solid;">
        <div class="team-class">
          <p>实体成员</p>
        </div>
        <div style="width: 1100px;height: 100px;align-items: center;display: flex;">
          <div style="width: 80%;display:flex;">
            <div style="margin-left: 10px;" v-for="tItem in teamMemberList" :key="tItem.id">
              <div>
                <el-avatar :src="tItem.headerUrl"></el-avatar>
              </div>
              <div>{{tItem.name}}</div>
            </div>
          </div>
          <div style="width: 20%">
            <el-button>查看更多成员</el-button>
            <p>提示：点击头像可进行设置虚线汇报部门</p>
          </div>
        </div>
      </div>
      <!-- 虚拟汇报成员 -->
      <div class="display-flex" style="width: 1200px;border: 1px solid;">
        <div class="team-class">
          <p>虚线汇报成员</p>
        </div>
        <div style="width: 1100px;height: 100px;align-items: center;display: flex;">
          <div style="width: 100%;">
            <div v-if="fictitiousList.length > 0" style="display:flex;">
              <div
                style="margin-left: 10px;position: relative;"
                v-for="fItem in fictitiousList"
                :key="fItem.id"
              >
                <div>
                  <el-avatar :src="fItem.headerUrl"></el-avatar>
                </div>
                <div>{{fItem.name}}</div>
                <div style="position: absolute;top: 0;right: 0;" @click="deleteFictitious(fItem)">
                  <i class="el-icon-close"></i>
                </div>
              </div>
              <div>提示：当前成员为虚线汇报成员，由成员所在部门负责人进行设置</div>
            </div>
            <div v-else>当前无虚线汇报成员，如需设置虚线汇报成员请找成员所在部门负责人进行设置</div>
          </div>
        </div>
      </div>
    </div>
    <tl-setManager
      v-if="setManagerExist"
      ref="setManager"
      :server="server"
      @closed="closedSetManager"
    ></tl-setManager>
  </div>
</template>

<script>
import setManager from './component/setManager';
import Server from './server';

const server = new Server();

export default {
  name: 'teamsManage',
  data() {
    return {
      server,
      setManagerExist: false,
      weeklyOpen: false,
      openOkrApproval: false,
      baseInfo: {},
      weeklyMode: ['1'],
      teamSelect: 'yunmenhu',
      circleList: [
        { id: 1, name: '云门户', select: 'yunmenhu' },
        { id: 2, name: '行云', select: 'xingyun' },
        { id: 3, name: '磐云', select: 'panyun' },
      ],
      teamMemberList: [
        { id: 1, name: '赵云', headerUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
        { id: 2, name: '马超', headerUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
        { id: 3, name: '魏延', headerUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
      ],
      fictitiousList: [
        { id: 1, name: '赵云', headerUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
        { id: 2, name: '马超', headerUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
        { id: 3, name: '魏延', headerUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
      ],
    };
  },
  components: {
    'tl-setManager': setManager,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const self = this;
      self.server.queryTeamBaseInfo().then((res) => {
        if (res.code == '200') {
          self.baseInfo = res.data;
        }
      });
    },
    setManager() {
      const self = this;
      self.setManagerExist = true;
      self.$nextTick(() => {
        self.$refs.setManager.show();
      });
    },
    closedSetManager() {
      this.setManagerExist = false;
    },
    selectTeam(data) {
      this.teamSelect = data.select;
    },
    deleteFictitious(data) {
      this.$xconfirm({
        title: '删除确认',
        content: '是否确认删除该虚线汇报成员',

      }).then(() => {
        console.log(data);
      });
    },
  },
};
</script>
<style scoped>
.display-flex {
  display: flex;
}
.team-class {
  width: 100px;
  height: 100px;
  border: 1px solid;
  display: flex;
  justify-content: center;
  align-items: center;
}
.circle {
  margin-left: 30px;
  margin-left: 30px;
  border: 1px solid;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bg-select {
  background-color: lightblue;
}
.bg-unselect {
  background-color: goldenrod;
}
</style>