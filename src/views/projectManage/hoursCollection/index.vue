<template>
  <div class="project-info">
    <div class="project-description">
      <dl>
        <dt>
          <el-dropdown trigger="click" v-show="baseInfo.projectStatus == '0'">
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="closeProject"
                >结束项目</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </dt>
        <dd>
          <div>关于润才项目立项 <el-button type="text" @click="showhoursRecord">工时补录记录 >></el-button></div>

          <div class="toggle-state" v-if="pWidth == emWidth">
            <span @click="openFlag = !openFlag">{{
              openFlag ? "收起" : "展开"
            }}</span
            ><i></i>
          </div>
        </dd>
      </dl>
      <div class="dl-list">

        <dl class="dl-item">
          <dt><span>项目总预算</span></dt>
          <dd>
            <em v-money="{ value: baseInfo.projectBudget, precision: 2 }"></em
            ><span>元</span
            ><span>({{ baseInfo.projectCurrency || "人民币" }})</span>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>项目已确立人力成本</span></dt>
          <dd>
            <em>{{
              baseInfo.projectInputType || "--"
            }}</em>
          </dd>
        </dl>

        <dl class="dl-item">
          <dt><span>项目经理</span></dt>
          <dd>
            <em>{{ baseInfo.projectApplyDate || "--" }}</em>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>项目时间</span></dt>
          <dd>
            <em>{{ baseInfo.projectBeginDate || "--" }}</em
            ><span>至</span><em>{{ baseInfo.projectEndDate || "--" }}</em>
          </dd>
        </dl>
      </div>
    </div>
    <div class="dl-card-panel project-members">
      <dt class="card-title">
        <em>项目成员</em
        >
      </dt>
      <tl-crcloud-table :isPage="false">
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table">
            <el-table-column prop="userName" label="姓名" min-width="140">
              <template slot-scope="scope">
                <div class="user-info" @click="setManager(scope.row)">
                  <img
                    v-if="hasValue(scope.row.headUrl)"
                    :src="scope.row.headUrl"
                    alt
                  />
                  <div v-else-if="scope.row.userName" class="user-name">
                    <em>{{
                      scope.row.userName.substring(
                        scope.row.userName.length - 2
                      )
                    }}</em>
                  </div>
                </div>
                <div class="user-name-txt">
                  <em>{{ scope.row.userName }}</em>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="级别" min-width="120">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.projectUserType == '1'"
                  :class="{ 'is-focus': scope.row.projectUserType == '1' }"
                >
                  <i class="el-icon-medal"></i>
                  <span>项目经理</span>
                </div>
                <div
                  v-else-if="scope.row.projectUserType == '0'"
                  @click="setManager(scope.row)"
                >
                  <el-tooltip
                    effect="dark"
                    placement="top"
                    popper-class="tl-tooltip-popper"
                  >
                    <div slot="content">设置项目经理</div>
                    <span class="can-click">
                      <i class="el-icon-medal"></i>
                      <span>--</span>
                    </span>
                  </el-tooltip>
                </div>
                <div v-else>--</div>
              </template>
            </el-table-column>
            <el-table-column prop="userLevelName" label="职能" min-width="120">
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.userLevelName)">{{
                  scope.row.userLevelName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="orgName" label="所属公司" min-width="160">
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.orgName)">{{
                  scope.row.orgName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="userPostName" label="工时时间范围" min-width="180">
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.userPostName)">{{
                  scope.row.userPostName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="createDate" label="补录工时(天)" min-width="180">
              <template slot-scope="scope">
               <el-input style="width:50px"></el-input>
              </template>
            </el-table-column>
   <el-table-column prop="createDate" label="工时内容" min-width="180">
              <template slot-scope="scope">
               <el-input placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100"
              v-if="
                baseInfo.projectUserVoList &&
                baseInfo.projectUserVoList.length > 0
              "
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.projectUserType != '1'"
                  @click="deleteMember(scope.row)"
                  type="text"
                  class="tl-btn"
                  >移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button type="text" @click="addUser()">添加成员</el-button>
        </div>
      </tl-crcloud-table>
    </div>
  <div>
    <div>已选3位成员，工时11天  人力成本5000人民币</div>
    <div>
       <el-button

        type="primary"
        class="tl-btn amt-bg-slip"
        >确定</el-button
      >
      <el-button
        plain
        class="tl-btn amt-border-fadeout"
        >取消</el-button
      >
    </div>
  </div>
  <tl-hours-record ref="hoursRecord"></tl-hours-record>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import crcloudTable from '@/components/crcloudTable';
import hoursRecord from './components/hoursRecord';
import CONST from '../const';

export default {
  name: 'projectInfo',
  data() {
    return {
      CONST,
      total: 0,
      currentPage: 0,
      pageSize: 0,
      isTalentAdmin: false,
      showAddMember: false,
      checkManager: false,
      tableData: [{
        userName: '111',
      }],
      isManage: false,
      openFlag: false,
      codes: [],
      pWidth: '',
      emWidth: '',
      DisuserId: {},
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-hours-record': hoursRecord,
  },
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
    baseInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      listenerWidth: (state) => state.listenerWidth,
    }),
  },
  mounted() {
    if (this.baseInfo.projectUserVoList) {
      this.baseInfo.projectUserVoList.forEach((item) => {
        if (item.projectUserType == '1') {
          if (item.userId == this.userInfo.userId) {
            this.isManage = true;
          }
        }
      });
    }
    this.server.queryByCodes({
      codes: ['PROJECT_TECH_TYPE', 'PROJECT_EMPLOYEE_LEVEL', 'PROJECT_EMPLOYEE_COMPANY'],
    }).then((res) => {
      if (res.code == '200') {
        this.codes = res.data;
      }
    });
  },
  methods: {
    showhoursRecord() {
      this.$refs.hoursRecord.show();
    },
    addUser() {
      this.tableData.push({
        type: 1,
        userName: '11',
      });
    },
    deleteMember(data) {
      this.$xconfirm({
        title: '删除确认',
        content: '是否确认删除该数据，删除将无法恢复',

      }).then(() => {
        this.server.removeProjectUser({
          projectId: data.projectId,
          userId: data.userId,
        }).then((res) => {
          if (res.code == 200) {
            this.searchProject();
          }
        });
      });
    },
    closeProject() {
      this.$xconfirm({
        title: '结束项目',
        content: '确定结束该项目吗?结束后将不可进行管理。',
      }).then(() => {
        this.server.closeProject({
          projectId: this.$route.query.projectId || '',
        }).then((res) => {
          if (res.code == '200') {
            this.$router.push({
              name: 'projectManage',
            });
          }
        });
      });
    },
    setManager(data) {
      const self = this;
      if (data.projectUserType == '0') {
        let managerName = '';
        self.baseInfo.projectUserVoList.forEach((item) => {
          if (item.projectUserType == '1') {
            managerName = item.userName;
          }
        });
        let content = '';
        if (managerName == '') {
          content = `是否设置「${data.userName}」为项目经理?`;
        } else {
          content = `当前项目已设置「${managerName}」为项目经理，是否替换成「${data.userName}」?`;
        }
        self.$xconfirm({
          title: '设置项目经理',
          content,
        }).then(() => {
          self.server.setProjectManager({
            userId: data.userId,
            projectId: data.projectId,
          }).then((res) => {
            if (res.code == '200') {
              // 1，进入项目详情页优先检测项目经理信息是否完整，如果不完整就弹框提示，让其在弹框中完善项目经理信息，否则不弹框
              // 2，设置完项目经理后，如果自己不是项目经理或者租户管理员就跳转项目管理列表，否则还在当前页
              let isManager = false;
              self.userInfo.roleList.forEach((item) => {
                if (item.roleCode == 'TENANT_ADMIN') {
                  isManager = true;
                }
              });
              if (data.userId == self.userInfo.userId) {
                isManager = true;
              }
              if (isManager == true) {
                self.searchProject();
              } else {
                self.$router.push({
                  name: 'projectManage',
                });
              }
            }
          });
        });
      }
    },
    addMembers() {
      this.showAddMember = true;
      this.$nextTick(() => {
        this.$refs.addMember.show();
      });
    },
    addSuccess() {
      this.showAddMember = false;
      this.searchProject();
    },
    checkSuccess() {
      this.checkManager = false;
      this.searchProject();
    },
    searchProject() {
      this.server.projectDetail({
        projectId: this.$route.query.projectId || '',
      }).then((res) => {
        if (res.code == '200') {
          this.baseInfo = res.data;

          this.isManage = false;
          this.DisuserId = {};
          if (this.baseInfo.projectUserVoList) {
            this.baseInfo.projectUserVoList.forEach((item) => {
              this.DisuserId[item.userId] = true;
              if (item.projectUserType == '1') {
                if (item.userId == this.userInfo.userId) {
                  this.isManage = true;
                }
              }
            });
          }
        }
      });
    },
  },
  watch: {
    'baseInfo.projectDescription': {
      handler(val) {
        console.log(val);
        this.$nextTick(() => {
          this.pWidth = document.getElementById('projectDesc').clientWidth;
          this.emWidth = document.getElementById('projectDescInside').clientWidth;
        });
      },
    },
    'baseInfo.projectId': {
      handler() {
        let flag = false;
        if (this.baseInfo.projectUserVoList.length > 0) {
          console.log(this.baseInfo.projectUserVoList);
          this.DisuserId = {};
          this.baseInfo.projectUserVoList.forEach((item) => {
            this.DisuserId[item.userId] = true;
            if (this.baseInfo.projectManagerCode.toLocaleLowerCase() == item.userAccount.toLocaleLowerCase()) {
              if (this.hasValue(item.userCompany) && this.hasValue(item.userLevel)) {
                flag = true;
              }
            }
            if (item.projectUserType == '1') {
              if (item.userId == this.userInfo.userId) {
                this.isManage = true;
              }
            }
          });
        } else {
          flag = false;
        }
        if (flag == false) {
          this.checkManager = true;
          this.$nextTick(() => {
            this.$refs.checkManager.show();
          });
        }
      },
    },
    listenerWidth: {
      handler(val) {
        console.log(val);
        this.pWidth = document.getElementById('projectDesc').clientWidth;
        this.emWidth = document.getElementById('projectDescInside').clientWidth;
      },
      deep: true,
    },
  },
};
</script>