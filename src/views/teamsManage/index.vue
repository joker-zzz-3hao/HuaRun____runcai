<template>
  <div class="home">
    <!-- 基本信息 -->
    <div>
      <div class="display-flex">
        <div>所属部门：</div>
        <div>{{baseInfo.orgName}}</div>
      </div>
      <div class="display-flex">
        <div>团队负责人：</div>
        <div>{{baseInfo.orgLeader}}</div>
      </div>
      <div class="display-flex">
        <div>团队综合管理员：</div>
        <div v-if="baseInfo.teamManager">{{baseInfo.teamManager}}</div>
        <div v-else>未设置</div>
      </div>
    </div>
    <!-- 管理设置 -->
    <div>
      <div class="display-flex">
        <div>团队综合管理员：</div>
        <!-- <div v-if="baseInfo.teamManager">{{baseInfo.teamManager}}</div> -->
        <div>
          <div>未设置</div>
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
            :class="{'bg-select': item.orgFullId == teamSelect,'bg-unselect': item.orgFullId != teamSelect,}"
            v-for="item in circleList"
            class="circle"
            :key="item.orgFullId"
            @click="selectTeam(item)"
          >{{item.orgName}}</div>
        </div>
      </div>
      <!-- 实体成员 -->
      <div class="display-flex" style="width: 1200px;border: 1px solid;">
        <div class="team-class">
          <p>实体成员</p>
        </div>
        <div style="width: 1100px;height: 100px;align-items: center;display: flex;">
          <div style="width: 80%;display:flex;">
            <div
              style="margin-left: 10px;"
              v-for="tItem in teamMemberList"
              :key="tItem.userId"
              @click="setFictitious(tItem)"
            >
              <div>
                <el-avatar :src="tItem.headerUrl"></el-avatar>
              </div>
              <div>{{tItem.userName}}</div>
            </div>
          </div>
          <!-- TODO -->
          <div style="width: 20%" v-if="totalMemberList.length>30">
            <el-button @click="more">查看更多成员</el-button>
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
                :key="fItem.userId"
              >
                <div>
                  <el-avatar :src="fItem.headerUrl"></el-avatar>
                </div>
                <div>{{fItem.userName}}</div>
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
      <!-- 团队架构 -->
      <div>
        <tl-svgtree fatherId="parentId" childId="orgId" :treeData="teamTreeData">
          <template slot="treecard" slot-scope="node">
            <tl-teamCard :node="node" @editTeam="editTeamFun"></tl-teamCard>
          </template>
        </tl-svgtree>
      </div>
    </div>
    <tl-setManager
      v-if="setManagerExist"
      ref="setManager"
      :server="server"
      @closed="closedSetManager"
    ></tl-setManager>
    <tl-setFictitious
      v-if="setFictitiousExist"
      ref="setFictitious"
      :server="server"
      @closed="closedSetFictitious"
    ></tl-setFictitious>
    <tl-moreMembers
      v-if="moreMembersExist"
      ref="moreMembers"
      :server="server"
      @closed="closedSetMembers"
      :totalMemberList="totalMemberList"
      :setFictitious="setFictitious"
    ></tl-moreMembers>
    <tl-editTeam
      v-if="editTeamExist"
      ref="editTeam"
      :server="server"
      @success="closedEditTeam"
      :teamMembers="teamMembers"
    ></tl-editTeam>
  </div>
</template>

<script>
import svgtree from '@/components/svgtree';
import setManager from './component/setManager';
import setFictitious from './component/setFictitious';
import teamCard from './component/teamCard';
import editTeam from './component/editTeam';
import moreMembers from './component/moreMembers';
import Server from './server';

const server = new Server();

export default {
  name: 'teamsManage',
  data() {
    return {
      server,
      setManagerExist: false,
      setFictitiousExist: false,
      moreMembersExist: false,
      editTeamExist: false,
      weeklyOpen: false,
      openOkrApproval: false,
      teamData: {},
      baseInfo: {},
      weeklyMode: ['1'],
      teamSelect: '',
      circleList: [],
      teamTreeData: [],
      teamMemberList: [],
      totalMemberList: [],
      fictitiousList: [],
      teamMembers: [],
    };
  },
  components: {
    'tl-setManager': setManager,
    'tl-setFictitious': setFictitious,
    'tl-moreMembers': moreMembers,
    'tl-teamCard': teamCard,
    'tl-svgtree': svgtree,
    'tl-editTeam': editTeam,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const self = this;
      self.teamTreeData = [];
      self.server.queryTeamBaseInfo().then((res) => {
        if (res.code == '200') {
          self.baseInfo = res.data;
          res.data.parentId = null;
          self.teamTreeData.push(res.data);
          self.server.queryOrgParent({ orgFullId: res.data.orgFullId }).then((response) => {
            if (response.code == '200') {
              console.log(response);
              response.data.forEach((tItem) => {
                tItem.parentId = self.baseInfo.orgId;
                self.teamTreeData.push(tItem);
              });
              self.circleList = response.data.filter((item) => item.orgType == '0');
              if (self.circleList.length > 0) {
                self.teamSelect = self.circleList[0].orgFullId;
              }
            }
          });
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
    setFictitious(data) {
      const self = this;
      self.setFictitiousExist = true;
      self.$nextTick(() => {
        self.$refs.setFictitious.show(data);
      });
    },
    more() {
      const self = this;
      self.moreMembersExist = true;
      self.$nextTick(() => {
        self.$refs.moreMembers.show();
      });
    },
    editTeamFun(data) {
      const self = this;
      self.editTeamExist = true;
      self.$nextTick(() => {
        self.$refs.editTeam.show(data);
      });
    },
    closedSetManager() {
      this.setManagerExist = false;
    },
    closedSetMembers() {
      this.moreMembersExist = false;
    },
    closedEditTeam() {
      this.editTeamExist = false;
      this.init();
    },
    closedSetFictitious() {
      this.setFictitiousExist = false;
    },
    selectTeam(data) {
      this.teamSelect = data.orgFullId;
    },
    deleteFictitious(data) {
      this.$xconfirm({
        title: '删除确认',
        content: '是否确认删除该虚线汇报成员',

      }).then(() => {
        this.server.updateReportRelation({
          orgId: data.orgId,
          userId: data.userId,
        }).then((res) => {
          if (res.code == '200') {
            this.queryTeamMember(data.orgFullId);
          }
        });
      });
    },
    queryTeamMember(data) {
      this.teamMemberList = [];
      this.totalMemberList = [];
      this.fictitiousList = [];
      this.server.listOrgUserPage({ orgFullId: data }).then((res) => {
        this.teamMembers = res.data;
        res.data.forEach((item, index) => {
          // userType为0时是实体组织下的实体成员，为2时时实体组织下的虚拟汇报成员
          if (item.userType == '0') {
            if (index <= 30) {
              this.teamMemberList.push(item);
            }
            this.totalMemberList.push(item);
          } else if (item.userType == '2') {
            this.fictitiousList.push(item);
          }
        });
      });
    },
  },
  watch: {
    teamSelect: {
      handler(val) {
        if (val) {
          this.queryTeamMember(val);
        }
      },
      deep: true,
      immediate: true,
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