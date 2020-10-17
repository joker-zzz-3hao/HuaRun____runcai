<template>
  <div v-loading="pageLoading" class="teams-weekly-detail">
    <div class="operating-area">
      <div class="page-title">团队周报</div>
      <div class="operating-box">
        <el-button plain class="tl-btn amt-border-slip" @click="goback"
          >返回<span class="lines"></span
        ></el-button>
      </div>
    </div>
    <div class="cont-area">
      <template v-if="openOrClose == 'OPEN'">
        <dl class="dl-card-panel weekly">
          <dd>
            <dl class="user-info">
              <dt>负责人</dt>
              <dd v-if="true">
                <img
                  v-if="$route.query.headerUrl"
                  :src="$route.query.headerUrl"
                  alt
                />
              </dd>
              <dd v-else-if="$route.query.userName" class="user-name">
                <em>{{
                  $route.query.userName.substring(
                    $route.query.userName.length - 2
                  )
                }}</em>
              </dd>
              <dd>{{ $route.query.userName }}</dd>
            </dl>
            <el-table ref="workTable" :data="weeklyWorkVoList" class="tl-table">
              <el-table-column
                label="序号"
                type="index"
                width="55"
              ></el-table-column>
              <el-table-column
                label="工作项"
                prop="workContent"
                min-width="150"
              >
                <template slot-scope="scope">
                  <em>{{ scope.row.workContent }}</em></template
                ></el-table-column
              >
              <el-table-column
                label="内容"
                prop="workDesc"
                v-if="weeklyType == '1'"
                min-width="150"
              >
                <template slot-scope="scope">
                  <em>{{ scope.row.workDesc }}</em>
                </template>
              </el-table-column>
              <el-table-column width="80" label="进度" prop="workProgress">
                <template slot-scope="scope">
                  <em>{{ scope.row.workProgress }}%</em>
                </template>
              </el-table-column>
              <el-table-column width="80" label="投入工时" prop="workTime">
                <template slot-scope="scope">
                  <em>{{ scope.row.workTime }}天</em>
                </template>
              </el-table-column>
              <el-table-column
                label="关联项目"
                prop="projectNameCn"
                min-width="120"
              >
                <template slot-scope="scope">
                  <div class="tag-group">
                    <ul class="tag-lists">
                      <li>
                        <el-tooltip
                          class="select-values"
                          effect="dark"
                          placement="top"
                          popper-class="tl-tooltip-popper"
                        >
                          <em slot="content">{{
                            scope.row.projectNameCn
                              ? scope.row.projectNameCn
                              : "临时项目"
                          }}</em>
                          <em>{{
                            scope.row.projectNameCn
                              ? scope.row.projectNameCn
                              : "临时项目"
                          }}</em>
                        </el-tooltip>
                      </li>
                    </ul>
                  </div>
                  <!-- <em>{{
                    scope.row.projectNameCn
                      ? scope.row.projectNameCn
                      : "临时项目"
                  }}</em> -->
                </template>
              </el-table-column>
              <el-table-column label="支持OKR/价值观" min-width="120">
                <template slot-scope="scope">
                  <div
                    class="tag-group"
                    v-if="
                      scope.row.okrCultureValueList.length > 0 ||
                      scope.row.workOkrList.length > 0
                    "
                  >
                    <ul class="tag-lists">
                      <li
                        v-for="value in scope.row.okrCultureValueList"
                        :key="value.id"
                      >
                        <el-tooltip
                          class="select-values"
                          effect="dark"
                          placement="top"
                          popper-class="tl-tooltip-popper"
                        >
                          <em slot="content">{{ value.cultureName }}</em>
                          <em>{{ setOkrStyle(value.cultureName) }}</em>
                        </el-tooltip>
                      </li>
                      <li
                        v-for="value in scope.row.workOkrList"
                        :key="value.id"
                      >
                        <el-tooltip
                          class="select-values"
                          effect="dark"
                          placement="top"
                          popper-class="tl-tooltip-popper"
                        >
                          <em slot="content">{{ value.okrDetailObjectKr }}</em>
                          <em>{{ setOkrStyle(value.okrDetailObjectKr) }}</em>
                        </el-tooltip>
                      </li>
                    </ul>
                  </div>
                  <div v-else>--</div>
                </template>
              </el-table-column>
            </el-table>
          </dd>
        </dl>
        <dl class="dl-card-panel weekly-thoughts" v-if="weeklyType == '1'">
          <dt class="card-title"><em>本周感想、建议、收获</em></dt>
          <dd v-for="item in weeklyThoughtList" :key="item.thoughtId">
            <div class="tag-group">
              <div
                v-if="item.thoughtType == 0"
                class="tag-kinds"
                @click="thoughtTypeChange(item, 0)"
                :class="{ 'is-thoughts': item.thoughtType == 0 }"
              >
                <span>感想</span>
              </div>
              <div
                v-if="item.thoughtType == 1"
                class="tag-kinds"
                @click="thoughtTypeChange(item, 1)"
                :class="{ 'is-suggest': item.thoughtType == 1 }"
              >
                <span>建议</span>
              </div>
              <div
                v-if="item.thoughtType == 2"
                class="tag-kinds"
                @click="thoughtTypeChange(item, 2)"
                :class="{ 'is-harvest': item.thoughtType == 2 }"
              >
                <span>收获</span>
              </div>
            </div>
            <em>{{ item.thoughtContent }}</em>
          </dd>
          <dd v-if="weeklyThoughtList.length < 1" class="no-data">
            <em>本周没有填写感想、建议或者收获！</em>
          </dd>
        </dl>
        <dl class="dl-card-panel week-plan" v-if="weeklyType == '1'">
          <dt class="card-title"><em>下周计划</em></dt>
          <dd>
            <el-table ref="workTable" :data="weeklyPlanList" class="tl-table">
              <el-table-column
                label="序号"
                type="index"
                width="55"
              ></el-table-column>
              <el-table-column
                label="工作项"
                prop="planContent"
              ></el-table-column>
            </el-table>
          </dd>
          <dd v-if="weeklyPlanList.length < 1" class="no-data">
            <em>您没有写下周计划</em>
          </dd>
        </dl>
        <dl class="dl-card-panel okr-completion">
          <dt class="card-title"><em>个人OKR完成度</em></dt>
          <dd
            class="undertake-okr-list"
            :class="
              item.parentOkrDetail && item.parentOkrDetail.okrDetailId
                ? 'is-kr'
                : 'is-o'
            "
            v-for="item in weeklyOkrVoList"
            :key="item.okrDetailId"
          >
            <div
              class="o-kr-group"
              v-if="item.parentOkrDetail && item.parentOkrDetail.okrDetailId"
            >
              <div class="tag-kind">
                <span class="kind-parent">目标</span>
                <el-tooltip
                  class="select-values"
                  effect="dark"
                  placement="top"
                  popper-class="tl-tooltip-popper"
                >
                  <em slot="content">{{
                    item.parentOkrDetail.okrDetailObjectKr
                  }}</em>
                  <em>{{ item.parentOkrDetail.okrDetailObjectKr }}</em>
                </el-tooltip>
              </div>
            </div>
            <div class="o-kr-group">
              <template
                v-if="item.parentOkrDetail && item.parentOkrDetail.okrDetailId"
              >
                <div class="tag-kind">
                  <span class="kind-child">KR</span>
                  <el-tooltip
                    class="select-values"
                    effect="dark"
                    placement="top"
                    popper-class="tl-tooltip-popper"
                  >
                    <em slot="content">{{
                      item.okrDetail.okrDetailObjectKr
                    }}</em>
                    <em>{{ item.okrDetail.okrDetailObjectKr }}</em>
                  </el-tooltip>
                  <span
                    >被工作项<em>{{ itemIndex(item) }}</em
                    >支撑</span
                  >
                </div>
              </template>
              <template v-else>
                <div class="tag-kind">
                  <span class="kind-parent">目标</span>
                  <el-tooltip
                    class="select-values"
                    effect="dark"
                    placement="top"
                    popper-class="tl-tooltip-popper"
                  >
                    <em slot="content">{{
                      item.okrDetail.okrDetailObjectKr
                    }}</em>
                    <em>{{ item.okrDetail.okrDetailObjectKr }}</em>
                  </el-tooltip>
                  <span
                    >被工作项<em>{{ itemIndex(item) }}</em
                    >支撑</span
                  >
                </div>
              </template>
              <div
                class="okr-risk"
                v-if="item.parentOkrDetail && item.parentOkrDetail.okrDetailId"
              >
                <span>信心指数</span>
                <div class="state-grid">
                  <div
                    :class="{
                      'is-no-risk': item.confidenceAfter == 1,
                      'is-risks': item.confidenceAfter == 2,
                      'is-uncontrollable': item.confidenceAfter == 3,
                    }"
                  ></div>
                  <div
                    :class="{
                      'is-risks': item.confidenceAfter == 2,
                      'is-uncontrollable': item.confidenceAfter == 3,
                    }"
                  ></div>
                  <div
                    :class="{
                      'is-uncontrollable': item.confidenceAfter == 3,
                    }"
                  ></div>
                </div>
                <div class="state-txt">
                  {{ riskMap[item.confidenceAfter] }}
                </div>
              </div>
              <div class="tl-progress-group">
                <span>当前进度</span>
                <tl-process
                  :data="parseInt(item.progressAfter, 10)"
                  :showNumber="false"
                  :width="30"
                  :marginLeft="2"
                ></tl-process>
                <el-slider
                  v-if="timeDisabled"
                  v-model="item.progressAfter"
                  :step="1"
                  @change="processChange(item)"
                  tooltip-class="slider-tooltip"
                ></el-slider>
                <em>{{ item.progressAfter }}</em>
                <span>%</span>
              </div>
              <div class="week-change">
                <span>本周变化</span
                ><em
                  >{{ item.progressAfter - item.progressBefor > 0 ? "+" : ""
                  }}{{ item.progressAfter - item.progressBefor }}%</em
                >
              </div>
            </div>
          </dd>
          <dd v-if="weeklyOkrVoList.length < 1" class="no-data">
            <em>周报暂无支撑OKR或价值观</em>
          </dd>
        </dl>
        <div class="current-user-info">
          <div>
            <!-- 本周工作项 -->
            <div></div>
            <!-- 本周感想、建议、收获 -->
            <!-- <div v-if="weeklyType == '1'" style="margintop: 50px">
              <h2>本周感想、建议、收获</h2>
              <div v-for="item in weeklyThoughtList" :key="item.thoughtId">
                <el-button
                  v-if="item.thoughtType == 0"
                  :class="{ 'is-thoughts': item.thoughtType == 0 }"
                  >感想</el-button
                >
                <el-button
                  v-if="item.thoughtType == 1"
                  :class="{ 'is-suggest': item.thoughtType == 1 }"
                  >建议</el-button
                >
                <el-button
                  v-if="item.thoughtType == 2"
                  :class="{ 'is-harvest': item.thoughtType == 2 }"
                  >收获</el-button
                >
                <span>{{ item.thoughtContent }}</span>
              </div>
            </div> -->
            <!-- 下周计划 -->
            <!-- <div v-if="weeklyType == '1'" style="margintop: 50px">
              <h2>下周计划</h2>
              <el-table ref="workTable" :data="weeklyPlanList">
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column
                  label="工作项"
                  prop="planContent"
                ></el-table-column>
              </el-table>
              <div v-if="weeklyPlanList.length < 1">您没有写下周计划</div>
            </div> -->
            <!-- 个人okr完成度 -->
            <!-- <div v-if="weeklyOkrVoList.length > 0" style="margintop: 50px">
              <h2>个人okr完成度</h2>
              <div v-for="item in weeklyOkrVoList" :key="item.okrDetailId">
                <div
                  v-if="
                    item.parentOkrDetail && item.parentOkrDetail.okrDetailId
                  "
                >
                  <el-row :gutter="20">
                    <el-col :span="20">
                      <div>
                        <span>目标</span>
                        <span style="marginleft: 15px">{{
                          item.parentOkrDetail.okrDetailObjectKr
                        }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="6">
                      <div>
                        <span>KR</span>
                        <span style="marginleft: 15px">{{
                          item.okrDetail.okrDetailObjectKr
                        }}</span>
                        <span style="marginleft: 15px"
                          >被工作项{{ itemIndex(item) }}支持</span
                        >
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div>
                        <span style="marginleft: 15px">
                          信心指数
                          <el-button
                            :class="{ 'no-risk': item.confidenceAfter == 1 }"
                          ></el-button>
                          <el-button
                            :class="{
                              'risk-is-controlled': item.confidenceAfter == 2,
                            }"
                          ></el-button>
                          <el-button
                            :class="{
                              'risk-cannot-be-controlled':
                                item.confidenceAfter == 3,
                            }"
                          ></el-button>
                          <span>{{ riskMap[item.confidenceAfter] }}</span>
                        </span>
                      </div>
                    </el-col>
                    <el-col :span="7">
                      <div>
                        <span style="marginleft: 15px">
                          当前进度
                          <el-progress
                            :percentage="item.progressAfter"
                            :format="format"
                          ></el-progress>
                        </span>
                      </div>
                    </el-col>
                    <el-col :span="2">
                      <div>
                        <span style="marginleft: 15px">
                          本周变化
                          <span
                            >{{
                              item.progressAfter - item.progressBefor
                            }}%</span
                          >
                        </span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div v-else>
                  <el-row :gutter="20">
                    <el-col :span="6">
                      <div>
                        目标
                        <span style="marginleft: 15px">{{
                          item.okrDetail.okrDetailObjectKr
                        }}</span>
                        <span style="marginleft: 15px"
                          >被工作项{{ itemIndex(item) }}支持</span
                        >
                      </div>
                    </el-col>

                    <el-col :span="7" :offset="6">
                      <div>
                        <span style="marginleft: 15px">
                          当前进度
                          <el-progress
                            :percentage="item.progressAfter"
                            :format="format"
                          ></el-progress>
                        </span>
                      </div>
                    </el-col>
                    <el-col :span="2">
                      <div>
                        <span style="marginleft: 15px">
                          本周变化
                          <span
                            >{{
                              item.progressAfter - item.progressBefor
                            }}%</span
                          >
                        </span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div> -->
            <!-- 谁浏览了 -->
            <div style="margintop: 50px">
              <h2>谁浏览了</h2>
              <span
                style="marginleft: 10px"
                v-for="user in visitUserNameList"
                :key="user"
              >
                <el-avatar
                  :size="30"
                  :src="user.headerUrl"
                  @error="errorHandler"
                >
                  <!-- <img src="@/assets/images/login-error.png" /> -->
                  <div v-if="user.userName" class="user-name">
                    <em>{{
                      user.userName.substring(user.userName.length - 2)
                    }}</em>
                  </div>
                </el-avatar>
                <span>{{ user.userName }}</span>
              </span>
            </div>
          </div>
          <!-- 点赞 -->
          <div style="margintop: 50px">
            <el-button @click="support(1)"
              >送金条({{ supportCount }})</el-button
            >
          </div>
        </div>
      </template>
      <template v-if="openOrClose == 'CLOSE'"
        >该用户所在团队未公开周报</template
      >
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Server from '../server';

const server = new Server();
export default {
  name: 'teamWeeklyInfo',
  components: {},
  props: {

  },
  data() {
    return {
      server,
      pageLoading: true,
      weeklyWorkVoList: [],
      weeklyThoughtList: [],
      weeklyPlanList: [],
      weeklyOkrVoList: [],
      visitUserNameList: [],
      weeklyType: '',
      openOrClose: '',
      supportCount: 0,
      weeklySupport: {},
      riskMap: {
        1: '高',
        2: '中',
        3: '低',
      },

    };
  },
  created() { this.init(); },
  mounted() {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
    setOkrStyle() {
      return (item) => {
        if (item && item.length > 5) {
          return `${item.slice(0, 5)}...`;
        }
        return item;
      };
    },
    itemIndex() {
      return (okr) => {
        const result = [];
        this.weeklyWorkVoList.forEach((item) => {
          item.workOkrList.forEach((element) => {
            if (okr.okrDetailId == element.okrDetailId) {
              result.push(this.weeklyWorkVoList.indexOf(item) + 1);
            }
          });
        });
        return result.join('、');
      };
    },
  },
  methods: {
    init() {
      this.judgePower();
    },
    judgePower() {
      // 是否是本部门
      if (!!this.$route.query.orgId && this.userInfo.orgId != this.$route.query.orgId) {
        // 该部门是否开放周报
        this.server.getTypeConfig({
          sourceId: this.$route.query.orgId, configType: 'WEEKLY', configTypeDetail: 'W-1', level: 'O',
        }).then((res) => {
          if (res.code == 200) {
            if (res.data.length > 0 && res.data[0].configItemCode == 'O') {
              this.queryWeekly();
            } else {
              this.openOrClose = 'CLOSE';
              this.pageLoading = false;
            }
          }
        });
      } else {
        this.queryWeekly();
      }
    },
    queryWeekly() {
      this.server.queryWeekly({ weeklyId: this.$route.query.weeklyId }).then((res) => {
        if (res.code == 200) {
          this.weeklyType = res.data.weeklyType;
          this.weeklyWorkVoList = res.data.weeklyWorkVoList;
          this.weeklyThoughtList = res.data.weeklyThoughtList;
          this.weeklyPlanList = res.data.weeklyPlanList;
          this.weeklyOkrVoList = res.data.weeklyOkrVoList;
          this.visitUserNameList = res.data.visitUserNameList;
          this.supportCount = res.data.supportCount;
          this.weeklySupport = res.data.weeklySupport || {};
        }
        this.openOrClose = 'OPEN';
        this.pageLoading = false;
      });
    },
    errorHandler() {
      return true;
    },
    support(type) {
      const params = {
        weeklyId: this.$route.query.weeklyId,
        supported: type,
        id: '', // 没点过赞
      };
      // 被点赞过
      if (this.weeklySupport && this.weeklySupport.id) {
        if (type == this.weeklySupport.supported) { // 已点赞，取消点赞
          params.supported = 0;
        }
        params.id = this.weeklySupport.id;
      }
      this.server.support(params).then((res) => {
        if (res.code == 200) {
          this.queryWeekly();
        }
      });
    },
    format(percentage) {
      return percentage === 100 ? '完成' : `${percentage}%`;
    },
    goback() {
      this.$router.go('-1');
    },

  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
<style lang="css">
.is-thoughts {
  background: rgb(123, 243, 197);
}
.is-suggest {
  background: rgb(228, 241, 151);
}
.is-harvest {
  background: rgb(95, 138, 218);
}
.no-risk {
  background: green;
}
.risk-is-controlled {
  background: yellow;
}
.risk-cannot-be-controlled {
  background: red;
}
.support-is-selected {
  color: red;
}
</style>
