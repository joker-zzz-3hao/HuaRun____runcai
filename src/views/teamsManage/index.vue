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
          <em>{{ baseInfo.orgParentName }}-{{ baseInfo.orgName }}</em>
        </dd>
        <dd>
          <span>团队负责人</span>
          <em>{{ baseInfo.orgLeader }}</em>
        </dd>
      </dl>
      <dl class="dl-card-panel">
        <dt class="card-title">
          <em>管理设置</em>
        </dt>
        <dd>
          <span>团队综合管理员</span>
          <em v-if="baseInfo.teamManager">{{ baseInfo.teamManager }}</em>
          <em v-else>未设置</em>
          <el-button plain @click="setManager" class="tl-btn btn-lineheight"
            >编辑团队综合管理员</el-button
          >
        </dd>
        <dd>
          <span>
            <em>周报是否开放</em>
            <span>(周报的查看权限)</span>
          </span>
          <el-switch
            v-model="weeklyOpen"
            @change="changeWeeklyOpen"
            class="tl-switch"
          ></el-switch>
          <p>
            <span>开放：整个公司的人,能够互相查看彼此的周报;</span>
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
        <dt class="card-title">
          <em>团队成员</em>
          <span>提示：点击头像可进行设置虚线汇报部门</span>
        </dt>
        <dd>
          <span>实体成员</span>
          <div class="img-list">
            <dl
              v-for="tItem in teamMemberList"
              :key="tItem.userId"
              @click="setFictitious(tItem)"
            >
              <dt class="user-info">
                <div class="user-name">
                  <!-- <img v-if="tItem.headerUrl" :src="tItem.headerUrl" alt /> -->
                  <em>{{ cutName(tItem.userName) }}</em>
                </div>
              </dt>
              <dd>{{ tItem.userName }}</dd>
            </dl>
          </div>
        </dd>
        <dd>
          <span>虚线汇报成员</span>
          <div v-if="fictitiousList.length > 0">
            <div class="img-list">
              <dl v-for="fItem in fictitiousList" :key="fItem.userId">
                <dt class="user-info">
                  <div class="user-name">
                    <img v-if="fItem.headerUrl" :src="fItem.headerUrl" alt />
                    <em>{{ cutName(fItem.userName) }}</em>
                  </div>
                  <i class="el-icon-close" @click="deleteFictitious(fItem)"></i>
                </dt>
                <dd>{{ fItem.userName }}</dd>
              </dl>
            </div>
            <span
              >提示：当前成员为虚线汇报成员，由成员所在部门负责人进行设置</span
            >
          </div>
          <span
            >当前无虚线汇报成员，如需设置虚线汇报成员请找成员所在部门负责人进行设置</span
          >
        </dd>
      </dl>
      <dl class="dl-card-panel">
        <dt class="card-title">
          <em>组织架构</em>
        </dt>
        <dd>
          <tl-svgtree
            fatherId="parentId"
            childId="orgId"
            :treeData="teamTreeData"
            direction="col"
          >
            <template slot="treecard" slot-scope="node">
              <tl-teamCard
                :node="node"
                @editTeam="editTeamFun"
                @deleteTeam="deleteTeam"
                @addTeam="addTeam"
              ></tl-teamCard>
            </template>
          </tl-svgtree>
        </dd>
      </dl>
    </div>
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
import svgtree from '@/components/svgtree';
import setManager from './component/setManager';
import setFictitious from './component/setFictitious';
import teamCard from './component/teamCard';
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
    'tl-teamCard': teamCard,
    'tl-svgtree': svgtree,
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
    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
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