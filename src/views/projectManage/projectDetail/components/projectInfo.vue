<template>
  <div class="project-info">
    <div class="project-description">
      <dl>
        <dt>
          <span
            v-if="baseInfo.projectStatus"
            :class="{
              'is-ongoing': baseInfo.projectStatus == '0',
              'is-over': baseInfo.projectStatus == '1',
            }"
            >{{ CONST.PROJECT_STATUS_MAP[baseInfo.projectStatus] }}</span
          >
          <em>{{ `${baseInfo.projectNameCn || "--"}` }}</em>
          <el-dropdown trigger="click">
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
          <span>项目描述:</span>
          <p
            ref="projectDesc"
            id="projectDesc"
            :class="openFlag ? 'unfold' : 'fold'"
          >
            <em id="projectDescInside">{{
              `${baseInfo.projectDescription || "--"}`
            }}</em>
          </p>
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
          <dt><span>项目经理</span></dt>
          <dd>
            <div class="user-info">
              <img v-if="baseInfo.headUrl" :src="baseInfo.headUrl" alt />
              <div v-else-if="baseInfo.projectManager" class="user-name">
                <em>{{
                  baseInfo.projectManager.substring(
                    baseInfo.projectManager.length - 2
                  )
                }}</em>
              </div>
            </div>
            <div class="user-name-txt">
              <em>{{ baseInfo.projectManager }}</em>
            </div>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>项目所属部门</span></dt>
          <dd>
            <em v-if="baseInfo.parentOrgName">{{
              `${baseInfo.parentOrgName}-`
            }}</em>
            <em>{{ baseInfo.orgName }}</em>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>项目总预算</span></dt>
          <dd>
            <em v-money="{ value: baseInfo.projectBudget, precision: 0 }"></em
            ><span>元</span
            ><span
              >({{
                CONST.CURRENCY_MAP[baseInfo.projectCurrencyCode] || "人民币"
              }})</span
            >
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>投入类型</span></dt>
          <dd>
            <em>{{
              CONST.THROW_TYPE_MAP[baseInfo.projectInputType] || "--"
            }}</em>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>项目类型</span></dt>
          <dd>
            <em>{{ baseInfo.projectType || "--" }}</em
            ><span v-if="baseInfo.projectSourceSystem == 'TENANT'"
              >虚拟项目</span
            >
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>申请时间</span></dt>
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
        ><el-button plain class="tl-btn" @click="addMembers"
          ><i class="el-icon-plus"></i><em>添加成员</em></el-button
        >
      </dt>
      <tl-crcloud-table :isPage="false">
        <div slot="tableContainer" class="table-container">
          <el-table :data="baseInfo.projectUserVoList" class="tl-table">
            <el-table-column prop="userName" label="姓名" min-width="140">
              <template slot-scope="scope">
                <div class="user-info" @click="setManager(scope.row)">
                  <img v-if="scope.row.headUrl" :src="scope.row.headUrl" alt />
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
            <el-table-column label="项目经理" min-width="120">
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
                  <i class="el-icon-medal"></i>
                  <span>设置项目经理</span>
                </div>
                <div v-else>--</div>
              </template>
            </el-table-column>
            <el-table-column prop="userLevelName" label="级别" min-width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.userLevelName">{{
                  scope.row.userLevelName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="orgName" label="所属部门" min-width="160">
              <template slot-scope="scope">
                <span v-if="scope.row.orgName">{{ scope.row.orgName }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="userPostName" label="职能" min-width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.userPostName">{{
                  scope.row.userPostName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="userCompanyName"
              label="所属公司"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.userCompanyName">{{
                  scope.row.userCompanyName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100"
              v-if="baseInfo.projectUserVoList.length > 0"
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
        </div>
      </tl-crcloud-table>
    </div>
    <tl-add-member
      ref="addMember"
      v-if="showAddMember"
      :server="server"
      :codes="codes"
      @addSuccess="addSuccess"
    ></tl-add-member>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import crcloudTable from '@/components/crcloudTable';
import addMember from './addMember';
import CONST from '../../const';

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
      tableData: [],
      isManage: false,
      openFlag: false,
      codes: [],
      pWidth: '',
      emWidth: '',
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-add-member': addMember,
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
      if (data.projectUserType == '0') {
        let managerName = '';
        this.baseInfo.projectUserVoList.forEach((item) => {
          if (item.projectUserType == '1') {
            managerName = item.userName;
          }
        });
        this.$xconfirm({
          title: '设置项目经理',
          content: `当前项目已设置「${managerName}」为项目经理，是否替换成「${data.userName}」?`,
        }).then(() => {
          this.server.setProjectManager({
            userId: data.userId,
            projectId: data.projectId,
          }).then((res) => {
            if (res.code == '200') {
              this.$router.push({
                name: 'projectManage',
              });
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
    searchProject() {
      this.server.projectDetail({
        projectId: this.$route.query.projectId || '',
      }).then((res) => {
        if (res.code == '200') {
          this.baseInfo = res.data;
          this.isManage = false;
          if (this.baseInfo.projectUserVoList) {
            this.baseInfo.projectUserVoList.forEach((item) => {
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