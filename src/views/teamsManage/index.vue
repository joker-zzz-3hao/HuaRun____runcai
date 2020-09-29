<template>
  <div class="teams-manage">
    <div class="operating-area">
      <div class="page-title">团队管理</div>
    </div>
    <div class="cont-area">
      <dl class="dl-card-panel">
        <dt class="card-title">
          <em>基本信息</em>
        </dt>
        <dd>
          <span>所属部门</span>
          <em>{{baseInfo.orgName}}</em>
        </dd>
        <dd>
          <span>团队负责人</span>
          <em>{{baseInfo.orgLeader}}</em>
        </dd>
      </dl>
      <dl class="dl-card-panel">
        <dt class="card-title">
          <em>管理设置</em>
        </dt>
        <dd>
          <span>团队综合管理员</span>
          <em v-if="baseInfo.teamManager">{{baseInfo.teamManager}}</em>
          <em v-else>未设置</em>
          <el-button @click="setManager">编辑团队综合管理员</el-button>
        </dd>
        <dd>
          <span>
            <em>周报是否开放</em>
            <span>(周报的查看权限)</span>
          </span>
          <el-switch v-model="weeklyOpen" @change="changeWeeklyOpen" class="tl-switch"></el-switch>
          <p>
            <span>开户：整个公司的人,能够互相查看彼此的周报;</span>
            <span>关闭：仅部门队友,能够互相查看彼此的周报</span>
          </p>
        </dd>
        <dd>
          <span>写周报模式</span>
          <el-checkbox-group
            v-model="weeklyMode"
            :min="1"
            @change="changeWeeklyMode"
            class="tl-radio-group"
          >
            <el-checkbox label="1" class="tl-checkbox">标准模式</el-checkbox>
            <el-checkbox label="2" class="tl-checkbox">简单模式</el-checkbox>
          </el-checkbox-group>
        </dd>
      </dl>
      <dl class="dl-card-panel">
        <dt></dt>
        <dd></dd>
      </dl>
    </div>
    <!--
    <div>
      <div class="display-flex">
        <div>团队综合管理员：</div>
        <div v-if="baseInfo.teamManager">{{baseInfo.teamManager}}</div>
        <div v-else>
          <div>未设置</div>
        </div>
        <el-button @click="setManager">编辑团队综合管理员</el-button>
      </div>
      <div>
        <div class="display-flex">
          <div>周报是否开放 (周报的查看权限)</div>
          <div>
            <el-switch
              v-model="weeklyOpen"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeWeeklyOpen"
            ></el-switch>
          </div>
        </div>
        <div>
          开户：整个公司的人，能够互相查看彼此的周报
          关闭：仅部门队友，能够互相查看彼此的周报
        </div>
      </div>
      <div class="display-flex">
        <div>写周报模式</div>
        <el-checkbox-group v-model="weeklyMode" :min="1" @change="changeWeeklyMode">
          <el-checkbox label="1">标准模式</el-checkbox>
          <el-checkbox label="2">简单模式</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div>
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
          <div style="width: 20%" v-if="totalMemberList.length>30">
            <el-button @click="more">查看更多成员</el-button>
            <p>提示：点击头像可进行设置虚线汇报部门</p>
          </div>
        </div>
      </div>
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
      <div>
        <tl-svgtree fatherId="parentId" childId="orgId" :treeData="teamTreeData">
          <template slot="treecard" slot-scope="node">
            <tl-teamCard
              :node="node"
              @editTeam="editTeamFun"
              @deleteTeam="deleteTeam"
              @addTeam="addTeam"
            ></tl-teamCard>
          </template>
        </tl-svgtree>
      </div>
    </div>-->
    <tl-setManager
      v-if="setManagerExist"
      ref="setManager"
      :server="server"
      @closed="closedSetManager"
      :teamMembers="teamMembers"
      :baseInfo="baseInfo"
      @setSuccess="setSuccess"
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
    <tl-addTeam
      v-if="addTeamExist"
      ref="addTeam"
      :server="server"
      @success="closedAddTeam"
      :teamMembers="teamMembers"
    ></tl-addTeam>
  </div>
</template>

<script>
// import svgtree from '@/components/svgtree';
import setManager from './component/setManager';
import setFictitious from './component/setFictitious';
// import teamCard from './component/teamCard';
import editTeam from './component/editTeam';
import addTeam from './component/addTeam';
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
      addTeamExist: false,
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
      teamOrgId: '',
    };
  },
  components: {
    'tl-setManager': setManager,
    'tl-setFictitious': setFictitious,
    'tl-moreMembers': moreMembers,
    // 'tl-teamCard': teamCard,
    // 'tl-svgtree': svgtree,
    'tl-editTeam': editTeam,
    'tl-addTeam': addTeam,
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
          if (self.baseInfo.weeklySee == 'O') {
            self.weeklyOpen = true;
          }
          if (self.baseInfo.openOkrExamine == 'O') {
            self.openOkrApproval = true;
          }
          if (self.baseInfo.weeklyPattern) {
            self.weeklyMode = self.baseInfo.weeklyPattern.split(',');
          }
          res.data.parentId = null;
          self.teamTreeData.push(res.data);
          self.server.queryOrgParent({ orgFullId: res.data.orgFullId }).then((response) => {
            if (response.code == '200') {
              console.log(response);
              response.data.forEach((tItem) => {
                tItem.parentId = self.baseInfo.orgId;
                self.teamTreeData.push(tItem);
              });
              // 手动添加最后一个添加虚拟组织的按钮
              self.teamTreeData.push({
                parentId: self.baseInfo.orgId,
                orgId: 'add',
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
        self.$refs.setManager.show(this.baseInfo);
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
    addTeam() {
      const self = this;
      self.addTeamExist = true;
      self.$nextTick(() => {
        self.$refs.addTeam.show(this.baseInfo);
      });
    },
    deleteTeam(data) {
      this.$xconfirm({
        title: '删除确认',
        content: '该数据删除将无法恢复，确认要删除吗？',

      }).then(() => {
        this.server.delVirtualOrg({
          orgId: data.orgId,
        }).then((res) => {
          if (res.code == '200') {
            this.init();
          }
        });
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
    closedAddTeam() {
      this.addTeamExist = false;
      this.init();
    },
    setSuccess() {
      this.setManagerExist = false;
      this.init();
    },
    closedSetFictitious() {
      this.setFictitiousExist = false;
    },
    selectTeam(data) {
      this.teamOrgId = data.orgId;
      this.teamSelect = data.orgFullId;
    },
    changeWeeklyMode(data) {
      this.updateOrgConfig(this.baseInfo.weeklyPatternId, data.join(','));
      // this.$xconfirm({
      //   title: '确认',
      //   content: '是否确认修改写周报模式',

      // }).then(() => {
      //   this.updateOrgConfig(this.baseInfo.weeklyPatternId, data);
      // });
    },
    changeWeeklyOpen(data) {
      this.updateOrgConfig(this.baseInfo.weeklySeeId, data ? 'O' : 'S');
      // this.$xconfirm({
      //   title: '确认',
      //   content: '是否确认修改写周报模式',

      // }).then(() => {
      //   this.updateOrgConfig(this.baseInfo.weeklySeeId, data);
      // });
    },
    changeOkrExamine(data) {
      this.updateOrgConfig(this.baseInfo.openOkrExamineId, data ? 'O' : 'S');
      // this.$xconfirm({
      //   title: '确认',
      //   content: '是否确认修改写周报模式',

      // }).then(() => {
      //   this.updateOrgConfig(this.baseInfo.openOkrExamineId, data);
      // });
    },
    updateOrgConfig(configId, configItemCode) {
      this.server.updateOrgConfig({
        configId,
        configItemCode,
      }).then((res) => {
        if (res.code == '200') {
          this.$message.success(res.msg);
        }
        this.init();
      });
    },
    deleteFictitious(data) {
      this.$xconfirm({
        title: '删除确认',
        content: '是否确认删除该虚线汇报成员',

      }).then(() => {
        this.server.updateReportRelation({
          orgId: this.teamOrgId,
          userId: data.userId,
        }).then((res) => {
          if (res.code == '200') {
            this.queryTeamMember(this.teamSelect);
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