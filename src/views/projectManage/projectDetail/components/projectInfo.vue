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
        </dt>
        <dd>
          <span>项目描述:</span
          ><em :class="openFlag ? 'unfold' : 'fold'">{{
            `${baseInfo.projectDescription || "--"}`
          }}</em>
          <div class="toggle-state">
            <span @click="openFlag = !openFlag">展开</span><i></i>
          </div>
        </dd>
      </dl>
      <div class="dl-list">
        <dl class="dl-item">
          <dt></dt>
          <dd></dd>
        </dl>
      </div>
      <!-- <div>
        <span v-if="baseInfo.projectNameCn">{{ baseInfo.projectNameCn }}</span>
        <span v-if="baseInfo.projectType">{{
          CONST.PROJECT_TYPE_MAP[baseInfo.projectType]
        }}</span>
        <span v-if="baseInfo.projectStatus">{{
          CONST.PROJECT_STATUS_MAP[baseInfo.projectStatus]
        }}</span>
      </div> -->
      <!-- <div>
        <div :class="openFlag ? 'open' : 'false'">
          项目描述：{{ `${baseInfo.projectDescription || "--"}` }}
        </div>
        <div @click="openFlag = !openFlag">展开</div>
      </div>
      <div>
        <span>项目经理：{{ `${baseInfo.projectManager || "--"}` }}</span>
        <span
          >项目所属部门：{{ `${baseInfo.projectApplyDepName || "--"}` }}</span
        >
        <span>项目总预算：{{ `${baseInfo.projectBudget || "0"}` }}元</span>
        <span>{{
          `(${CONST.CURRENCY_MAP[baseInfo.projectCurrencyCode] || "人民币"})`
        }}</span>
      </div> -->
      <!-- <div>
        <span
          >投入类型：{{
            `${CONST.THROW_TYPE_MAP[baseInfo.projectInputType] || "--"}`
          }}</span
        >
        <span>申请时间：{{ `${baseInfo.projectApplyDate || "--"}` }}</span>
        <span
          >项目时间：{{
            `${baseInfo.projectBeginDate || "--"}至${
              baseInfo.projectEndDate || "--"
            }`
          }}</span
        >
      </div>
      <div>
        <el-button plain class="tl-btn" @click="closeProject"
          >结束项目</el-button
        >
      </div> -->
    </div>
    <div class="dl-card-panel project-members">
      <dt class="card-title">
        <em>项目成员</em
        ><el-button plain class="tl-btn" @click="addMembers"
          ><i class="el-icon-plus"></i><em>添加成员</em></el-button
        >
      </dt>
      <!-- <div style="display: flex">
        <div>项目成员</div>
        <div>
          <el-button plain class="tl-btn" @click="addMembers"
            >添加成员</el-button
          >
        </div>
      </div> -->
      <div>
        <tl-crcloud-table
          :total="total"
          :currentPage.sync="currentPage"
          :pageSize.sync="pageSize"
          @searchList="searchProject"
        >
          <div slot="tableContainer" class="table-container">
            <el-table :data="baseInfo.projectUserVoList" class="tl-table">
              <el-table-column prop="userName" label="姓名" min-width="140">
                <template slot-scope="scope">
                  <div class="user-info" @click="setManager(scope.row)">
                    <img
                      v-if="scope.row.headUrl"
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
                  <div class="user-name-txt" @click="setManager(scope.row)">
                    <em>{{ scope.row.userName }}</em>
                  </div>
                  <template>
                    <span
                      v-if="scope.row.projectUserType == '1'"
                      @click="setManager(scope.row)"
                      >(项目经理)</span
                    >
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                prop="userLevel"
                label="项目经理"
                min-width="120"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.projectUserType == '1'">
                    <i class="el-icon-medal"></i>
                    <span>项目经理</span>
                  </div>
                  <div v-else-if="scope.row.projectUserType == '0'">
                    <i class="el-icon-medal"></i>
                    <span>设置项目经理</span>
                  </div>
                  <div v-else>--</div>
                </template>
              </el-table-column>
              <el-table-column prop="userLevel" label="级别" min-width="120">
                <template slot-scope="scope">
                  <span v-if="scope.row.userLevel">{{
                    scope.row.userLevel
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
              <el-table-column prop="userPost" label="职能" min-width="180">
                <template slot-scope="scope">
                  <span v-if="scope.row.userPost">{{
                    scope.row.userPost
                  }}</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
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
  watch: {},
};
</script>