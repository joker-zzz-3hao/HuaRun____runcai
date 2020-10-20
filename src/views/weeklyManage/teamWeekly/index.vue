<template>
  <div class="teams-weekly">
    <div class="operating-area">
      <div class="page-title">团队周报</div>
      <div class="operating-box">
        <el-cascader
          v-model="orgIdList"
          ref="cascader"
          :options="treeData"
          :show-all-levels="false"
          :props="{
            checkStrictly: true,
            value: 'orgId',
            label: 'orgName',
            children: 'sonTree',
          }"
          @change="selectIdChange"
          popper-class="tl-cascader-popper"
          class="tl-cascader"
        ></el-cascader>
        <!-- 按钮显示逻辑添加
        1、本周、上周的日历显示提醒写周报按钮，其余时间不显示
        2、当组织切换时不显示该按钮
        3、不是部门负责人不显示该按钮
          -->

        <el-button
          plain
          class="tl-btn btn-lineheight"
          icon="el-icon-phone"
          v-show="showRemindBtn"
          @click="remindWriteWeekly"
          >提醒写周报</el-button
        >
      </div>
    </div>
    <div
      class="cont-area"
      v-if="openOrClose == 'O' || formData.orgId == userInfo.orgId"
    >
      <tl-calendar
        @setCalendarId="setCalendarId"
        @getWeeklyById="refreshPageList"
        :isFromTeam="true"
      ></tl-calendar>
      <div class="flex-sb">
        <el-select
          v-model="formData.queryType"
          @change="lookChange"
          placeholder="周报速看"
          clearable
          @clear="clear"
          :popper-append-to-body="false"
          popper-class="tl-select-dropdown"
          class="tl-select el-icon-view"
        >
          <el-option
            v-for="item in lookItemList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <!-- <span>周报状态：</span> -->
        <el-select
          v-model="submitedOrLooked"
          @change="submitedOrLookedChange"
          placeholder="周报状态"
          clearable
          @clear="clearSubmitOrLooked"
          :disabled="!!formData.queryType"
          popper-class="tl-select-dropdown"
          class="tl-select"
        >
          <el-option
            v-for="item in submitedOrLookedList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <crcloud-table
        :total="total"
        :currentPage.sync="formData.currentPage"
        :pageSize.sync="formData.pageSize"
        @searchList="refreshPageList"
        v-if="tableLoading"
      >
        <div slot="tableContainer" class="table-container">
          <ul v-if="!isQuickLook">
            <li
              v-for="weekly in tableData"
              :key="weekly.userId"
              @click="weeklyInfo(weekly)"
            >
              <!-- weekly.visitId 存在时  则是被查看的  否则是没被查看的TODO:待与炜哥沟通 -->
              <dl class="tl-card-list">
                <dt>
                  <div class="user-info">
                    <img v-if="weekly.headerUrl" :src="weekly.headerUrl" alt />
                    <div v-else-if="weekly.userName" class="user-name">
                      <em>{{
                        weekly.userName.substring(weekly.userName.length - 2)
                      }}</em>
                    </div>
                  </div>
                  <div class="user-txt">
                    <p>
                      <em>{{ weekly.userName }}</em
                      ><span>{{
                        weekly.isadmin == "1" ? "(部门负责人)" : ""
                      }}</span>
                    </p>
                    <div class="user-from">
                      <em>{{ weekly.orgName }}</em>
                    </div>
                  </div>
                  <div
                    class="weekly-state"
                    :class="weekly.weeklyId ? 'is-submitted' : 'un-submitted'"
                  >
                    <div class="icon-bg">
                      <i
                        :class="
                          weekly.weeklyId
                            ? 'el-icon-circle-check'
                            : 'el-icon-warning-outline'
                        "
                      ></i>
                    </div>
                    <p>{{ weekly.weeklyId ? "已提交" : "未提交" }}</p>
                  </div>
                </dt>
                <dd>
                  <span>本周心情</span>
                  <div
                    class="mood-state"
                    :class="{
                      'has-mood': weekly.weeklyEmotion == 100,
                      'is-ok': weekly.weeklyEmotion == 50,
                      'want-quietly': weekly.weeklyEmotion == 0,
                    }"
                  >
                    <template v-if="weekly.weeklyEmotion == 100">
                      <i></i>
                      <em>有收获</em>
                    </template>
                    <template v-else-if="weekly.weeklyEmotion == 50">
                      <i></i>
                      <em>还行吧</em>
                    </template>
                    <template v-else-if="weekly.weeklyEmotion == 0">
                      <i></i>
                      <em>我想静静</em>
                    </template>
                    <template v-else>
                      <i></i>
                      <em>--</em>
                    </template>
                  </div>
                </dd>
                <dd>
                  <span>更新时间</span>
                  <em>{{
                    weekly.updateTime
                      ? dateFormat(
                          "YYYY-mm-dd HH:MM:SS",
                          new Date(weekly.updateTime)
                        )
                      : "--"
                  }}</em>
                </dd>
              </dl>
              <!-- <el-card>
                <div>
                  <el-avatar
                    :size="30"
                    :src="weekly.headerUrl"
                    @error="errorHandler"
                  >
                    <div v-if="weekly.userName" class="user-name">
                      <em>{{
                        weekly.userName.substring(weekly.userName.length - 2)
                      }}</em>
                    </div>
                  </el-avatar>
                  <span
                    >{{ weekly.userName
                    }}{{ weekly.isadmin == "1" ? "(部门负责人)" : "" }}</span
                  >
                  <span v-if="weekly.weeklyId">
                    <i class="el-icon-circle-check"></i>已提交
                  </span>
                  <span v-else>
                    <i class="el-icon-warning-outline"></i>未提交
                  </span>
                  <div>{{ weekly.orgName }}</div>
                </div>
                <div>
                  <div>
                    本周心情
                    <span v-if="weekly.weeklyEmotion == 0">
                      <i class="el-icon-user"></i> 沮丧
                    </span>
                    <span v-else-if="weekly.weeklyEmotion == 50">
                      <i class="el-icon-user"></i>平常
                    </span>
                    <span v-else-if="weekly.weeklyEmotion == 100">
                      <i class="el-icon-user"></i>开心
                    </span>
                    <span v-else>--</span>
                  </div>
                  <div>
                    更新时间
                    <span>
                      {{
                        weekly.updateTime
                          ? dateFormat(
                              "YYYY-mm-dd HH:MM:SS",
                              new Date(weekly.updateTime)
                            )
                          : "--"
                      }}
                    </span>
                  </div>
                </div>
              </el-card> -->
            </li>
            <li v-if="tableData.length < 1">暂无数据</li>
          </ul>
          <ul v-else class="quick-look">
            <li
              v-for="weekly in tableData"
              :key="weekly.userId"
              @click="weeklyInfo(weekly)"
            >
              <dl class="tl-card-list">
                <dt>
                  <div class="user-info">
                    <img v-if="weekly.headerUrl" :src="weekly.headerUrl" alt />
                    <div v-else-if="weekly.userName" class="user-name">
                      <em>{{
                        weekly.userName.substring(weekly.userName.length - 2)
                      }}</em>
                    </div>
                  </div>
                  <div class="user-txt">
                    <p>
                      <em>{{ weekly.userName }}</em
                      ><span>{{
                        weekly.isadmin == "1" ? "(部门负责人)" : ""
                      }}</span>
                    </p>
                    <div class="user-from">
                      <em>{{ weekly.orgName }}</em>
                    </div>
                  </div>
                </dt>
                <dd>
                  <dl class="dl-list">
                    <!-- 工作项 -->
                    <template v-if="formData.queryType == '0'">
                      <!-- 循环这个dd（weekly.contentList） -->
                      <dd
                        v-for="(work, index) in weekly.contentList"
                        :key="work + index"
                      >
                        <span>#工作项{{ index + 1 }}#</span>
                        <em>{{ work.workContent }}</em>
                      </dd>
                    </template>
                    <!-- 感想 -->
                    <template v-if="formData.queryType == '1'">
                      <!-- 循环这个dd（weekly.contentList） -->
                      <dd
                        v-for="(work, index) in weekly.contentList"
                        :key="work + index"
                      >
                        <span>#{{ getThoughtName(work.thoughtType) }}#</span>
                        <em>{{ work.thoughtContent }}</em>
                      </dd>
                      <!-- <dd>
                        <span>#建议#</span>
                        <em
                          >撒大法大法的风格和大法好大法撒大法阿斯顿发去玩儿去玩儿童也儿人太温柔太温柔太温柔太温柔太我很快就会开花阿斯顿发送到发送发达的撒是否vv在持续啊撒发撒大法啊的说法</em
                        >
                      </dd> -->
                    </template>
                    <!-- 工作项 -->
                    <template v-if="formData.queryType == '2'">
                      <!-- 循环这个dd（weekly.contentList） -->
                      <dd
                        v-for="(work, index) in weekly.contentList"
                        :key="work + index"
                      >
                        <span>#下周计划#</span>
                        <em>{{ work.planContent }}</em>
                      </dd>
                    </template>
                  </dl>
                  <!-- 有进度的OKR -->
                  <template v-if="formData.queryType == '3'">
                    <!-- 循环这个dl（weekly.contentList） -->
                    <dl class="tag-kind">
                      <dd class="update-progress">
                        <span>本次更新进度</span
                        ><em
                          >{{
                            work.progressAfter - work.progressBefor > 0
                              ? "+"
                              : ""
                          }}
                          {{ work.progressAfter - work.progressBefor }}%</em
                        >
                      </dd>
                      <dt v-if="work.okrDetailType == 0">
                        <span class="kind-parent">目标</span
                        ><em>{{ work.okrDetailObjectKr }}</em>
                      </dt>
                      <dt v-if="work.okrDetailType == 1">
                        <span class="kind-parent">目标</span
                        ><em>{{ work.pokrDetailObjectKr }}</em>
                      </dt>
                      <dd v-if="work.okrDetailType == 1">
                        <span class="kind-child">KR</span
                        ><em>{{ work.okrDetailObjectKr }}</em>
                      </dd>
                    </dl>
                  </template>
                </dd>
              </dl>
              <!-- <span>
                  <el-avatar
                    :size="30"
                    :src="weekly.headerUrl"
                    @error="errorHandler"
                  >
                    <div v-if="weekly.userName" class="user-name">
                      <em>{{
                        weekly.userName.substring(weekly.userName.length - 2)
                      }}</em>
                    </div>
                  </el-avatar>
                  <span>{{ weekly.userName }}</span>
                  <span>{{ weekly.orgName }}</span>
                </span> -->
              <!-- 任务项 -->
              <!-- <span v-if="formData.queryType == '0'">
                  <ul>
                    <li v-for="work in weekly.contentList" :key="work">
                      {{ work.workContent }}
                    </li>
                  </ul>
                </span> -->
              <!-- 感想 -->
              <!-- <span v-if="formData.queryType == '1'">
                  <ul>
                    <li v-for="work in weekly.contentList" :key="work">
                      {{ work.thoughtContent }}
                    </li>
                  </ul>
                </span> -->
              <!-- 下周计划 -->
              <!-- <span v-if="formData.queryType == '2'">
                  <ul>
                    <li v-for="work in weekly.contentList" :key="work">
                      {{ work.planContent }}
                    </li>
                  </ul>
                </span> -->
              <!-- 有进度的okr -->
              <!-- <span v-if="formData.queryType == '3'">
                  <ul>
                    <li v-for="work in weekly.contentList" :key="work">
                      <span v-if="work.okrDetailType == 0">
                        <span>目标</span>
                        <span>{{ work.okrDetailObjectKr }}</span>
                        <span>
                          本次更新进度
                          {{
                            work.progressAfter - work.progressBefor > 0
                              ? "+"
                              : ""
                          }}
                          {{ work.progressAfter - work.progressBefor }}%
                        </span>
                      </span>
                      <span v-else>
                        <ul>
                          <li>
                            <span>目标</span>
                            <span>{{ work.pokrDetailObjectKr }}</span>
                          </li>
                          <li>
                            <span>KR</span>
                            <span>{{ work.okrDetailObjectKr }}</span>
                            <span>
                              本次更新进度
                              {{
                                work.progressAfter - work.progressBefor > 0
                                  ? "+"
                                  : ""
                              }}
                              {{ work.progressAfter - work.progressBefor }}%
                            </span>
                          </li>
                        </ul>
                      </span>
                    </li>
                  </ul>
                </span> -->
            </li>
            <li v-if="tableData.length < 1">暂无数据</li>
          </ul>
        </div>
      </crcloud-table>
    </div>
    <div v-else>该团队周报未开放</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import calendar from '../myWeekly/components/calendar';
import Server from './server';

const server = new Server();
export default {
  name: 'teamWeekly',
  components: {
    'tl-calendar': calendar,
  },
  data() {
    return {
      server,
      tableData: [],
      orgIdList: [],
      treeData: [],
      userList: [],
      canEdit: false,
      showRemindBtn: false,
      tableLoading: false,
      isQuickLook: false,
      openOrClose: '',
      formData: {
        calendarId: '',
        looked: '',
        orgId: '',
        projectName: '',
        queryType: '',
        submited: '',
        queryUserId: '',
        pageSize: 10,
        currentPage: 1,
      },
      total: 0,
      exist: false,
      tenantId: null,
      lookItemList: [
        {
          value: '0',
          label: '工作项',
        },
        {
          value: '1',
          label: '感想',
        },
        {
          value: '2',
          label: '下周计划',
        },
        {
          value: '3',
          label: 'OKR',
        },
      ],
      submitedOrLookedList: [
        // {
        //   value: '',
        //   label: '全部',
        // },
        {
          value: '1',
          label: '已查看',
        },
        {
          value: '2',
          label: '未查看',
        },
        {
          value: '3',
          label: '已提交',
        },
        {
          value: '4',
          label: '未提交',
        },
      ],
      submitedOrLooked: '',
      changeweek: true,
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),

    severalData() {
      let isLeader = false;
      this.userInfo.roleList.forEach((role) => {
        if (role.roleCode == 'ORG_ADMIN') {
          isLeader = true;
        }
      });
      return {
        canEdit: this.canEdit,
        orgId: this.formData.orgId,
        isLeader,
      };
    },
  },
  methods: {
    init() {
      // 自己团队还要判断是否开发周报么?
      this.formData.orgId = this.userInfo.orgId;
      // 查询列表数据（默认查询当前用户所在团队数据）
      // this.refreshPageList();
      // 查询组织树
      this.getOrgTree();
      // 查询该组织的周报是否开放
      this.getTypeConfig();
    },
    getTypeConfig() {
      this.server.getTypeConfig({
        sourceId: this.formData.orgId, configType: 'WEEKLY', configTypeDetail: 'W-1', level: 'O',
      }).then((res) => {
        if (res.code == 200) {
          if (res.data.length > 0) {
            this.openOrClose = res.data[0].configItemCode;
          } else {
            this.openOrClose = 'O';
          }
        }
      });
    },
    getTeamWeekly() {
      this.tableLoading = false;
      const params = {
        ...this.formData,
      };
      if (this.hasPower('weekly-list')) {
        this.server.queryTeamWeeklyList(params).then((res) => {
          if (res.code == 200) {
            this.tableData = res.data.content;
            this.total = res.data.total;
            this.formData.currentPage = res.data.currentPage;
            this.formData.pageSize = res.data.pageSize;
          } else {
            this.$message.error(res.msg);
          }
          this.tableLoading = true;
          this.isQuickLook = false;
        });
      }
    },
    weeklyInfo(weekly) {
      if (weekly.weeklyId) {
        this.go('teamWeeklyInfo', { query: { weeklyId: weekly.weeklyId, userName: weekly.userName, headerUrl: weekly.headerUrl } });
      }
      //  else {
      //   this.$message.warning('该用户周报还未提交');
      // }
    },
    setInitOrg() {
      // 遍历嵌套数组，转换为一维数组
      const queue = [...this.treeData];
      const result = [];
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const next = queue.shift();
        if (!next) {
          break;
        }
        result.push({
          orgId: next.orgId,
          orgName: next.orgName,
          orgFullId: next.orgFullId,
        });
        if (Array.isArray(next.sonTree)) {
          queue.push(...next.sonTree);
        }
      }
      // 找到该用户所在组织树对应的orgFullId
      result.forEach((element) => {
        if (element.orgId == this.formData.orgId) {
          // 定位到了该组织
          this.orgIdList = element.orgFullId.split(':');
          this.orgIdList.pop();
        }
      });
    },
    selectIdChange(data) {
      // 清空其他查询条件
      this.formData.looked = '';
      this.formData.submited = '';
      this.formData.queryUserId = '';
      this.submitedOrLooked = '';
      this.formData.queryType = '';
      // 根据组织查数据
      this.formData.orgId = data[data.length - 1];
      this.orgIdList = data;
      this.getTeamWeekly();
      this.$refs.cascader.dropDownVisible = false;
      // 更换组织部门后需要重新查询该部门是否开发周报
      this.getTypeConfig();
    },
    getOrgTree() {
      this.server.getOrg({}).then((res) => {
        if (res.code == 200) {
          this.treeData = res.data;
          // 将用户所属组织初始化给组织树下拉框
          this.setInitOrg();
          // 初始化下拉框用户列表
          this.remoteMethod();
        }
      });
    },
    setCalendarId(id) {
      this.formData.calendarId = id;
    },
    remindWriteWeekly() {
      this.server.remindWriteWeekly({ calendarId: this.formData.calendarId }).then((res) => {
        if (res.code == 200) {
          this.$message({ type: 'success', message: '周报提醒已发送，相关团队成员已收到', duration: 4000 });
        }
      });
    },
    lookChange(queryType) {
      this.tableLoading = false;
      this.formData.queryType = queryType;
      if (queryType) {
        this.server.lookQuickly(this.formData).then((res) => {
          if (res.code == 200) {
            this.tableData = res.data.content;
            this.total = res.data.total;
            this.formData.currentPage = res.data.currentPage;
            this.formData.pageSize = res.data.pageSize;
          }
          this.tableLoading = true;
          this.isQuickLook = true;
        });
      } else {
        this.getTeamWeekly();
      }
    },
    clear() {
      this.formData.queryType = '';
      this.getTeamWeekly();
    },
    submitedOrLookedChange(item) {
      if (item) {
        switch (item) {
          case '1':
            this.formData.looked = true;
            this.formData.submited = '';
            break;
          case '2':
            this.formData.looked = false;
            this.formData.submited = '';
            break;
          case '3':
            this.formData.submited = true;
            this.formData.looked = '';
            break;
          case '4':
            this.formData.submited = false;
            this.formData.looked = '';
            break;
          default:
            break;
        }
        this.refreshPageList();
      }
    },
    clearSubmitOrLooked() {
      this.formData.submited = '';
      this.formData.looked = '';
      this.refreshPageList();
    },
    refreshPageList(calender) {
      this.tableLoading = false;
      if (calender && calender.calendarId) {
        this.canEdit = calender.canEdit;
      }
      if (this.formData.queryType) {
        if (this.hasPower('weekly-look')) {
          this.server.lookQuickly(this.formData).then((res) => {
            if (res.code == 200) {
              this.tableData = res.data.content;
              this.total = res.data.total;
              this.formData.currentPage = res.data.currentPage;
              this.formData.pageSize = res.data.pageSize;
            }
            this.tableLoading = true;
          });
        }
      } else {
        this.getTeamWeekly();
      }
    },
    remoteMethod(name) {
      this.server.getUserListByOrgId({
        currentPage: 1,
        pageSize: 20,
        orgFullId: this.treeData[0].orgId,
        userName: name ? name.trim() : '',
      }).then((res) => {
        if (res.code == 200) {
          this.userList = res.data.content;
        }
      });
    },
    visibleChange(name) {
      if (!name) {
        this.remoteMethod();
      }
    },
    nameChange(userId) {
      if (userId) {
      // 将该用户所属部门初始化到组织树里面
        this.userList.forEach((user) => {
          if (userId == user.userId) {
            this.formData.orgId = user.orgId;
            this.setInitOrg();
          }
        });
      } else {
        this.formData.orgId = this.userInfo.orgId;
        this.setInitOrg();
      }
      // 刷新周报列表数据;
      this.refreshPageList();
    },
    errorHandler() {
      return true;
    },
    getThoughtName(thoughtType) {
      if (thoughtType == 0) {
        return '感想';
      } if (thoughtType == 1) {
        return '建议';
      } if (thoughtType == 0) {
        return '收获';
      }
    },
  },
  watch: {
    severalData: {
      handler(val) {
        if (val) {
          //  1、本周、上周的日历显示提醒写周报按钮，其余时间不显示
          // 2、当组织切换至别的部门时不显示该按钮:
          // 3、不是部门负责人不显示该按钮:
          this.showRemindBtn = val.canEdit && val.orgId == this.userInfo.orgId && val.isLeader && this.hasPower('weekly-notice');
        }
      },
    },
    // openOrClose: {
    //   handler(val) {
    //     if (val == 'S') {
    //       this.tableData = [];
    //     }
    //   },
    // },
  },

};
</script>