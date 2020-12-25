<template>
  <div class="teams-weekly">
    <div class="operating-area">
      <div class="operating-box">
        <dl class="dl-item">
          <dt>查看其他团队周报</dt>
          <dd>
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
          </dd>
        </dl>
        <!-- 按钮显示逻辑添加
        1、本周、上周的日历显示提醒写周报按钮，其余时间不显示
        2、当组织切换时不显示该按钮
        3、不是部门负责人不显示该按钮
          -->

        <el-button
          plain
          class="tl-btn btn-lineheight"
          v-show="showRemindBtn"
          @click="remindWriteWeekly"
          ><i class="icon-remind"></i><em>提醒写周报</em></el-button
        >
      </div>
    </div>
    <div
      class="cont-area"
      v-if="openOrClose == 'O' || formData.orgId == userInfo.orgId"
    >
      <tl-calendar
        :server="server"
        @setCalendarId="setCalendarId"
        @getWeeklyById="refreshPageList"
        :isFromTeam="true"
      ></tl-calendar>
      <div class="flex-sb">
        <dl class="dl-item">
          <dt>周报状态</dt>
          <dd>
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
          </dd>
        </dl>
        <dl class="dl-item">
          <dt>周报速看</dt>
          <dd>
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
          </dd>
        </dl>
      </div>
      <crcloud-table
        :total="total"
        :currentPage.sync="formData.currentPage"
        :pageSize.sync="formData.pageSize"
        @searchList="refreshPageList"
        v-if="tableLoading"
      >
        <div
          slot="tableContainer"
          class="table-container"
          :class="{ 'no-data-container': tableData.length < 1 }"
        >
          <ul v-if="!isQuickLook">
            <li
              v-for="weekly in tableData"
              :key="weekly.userId"
              @click="weeklyInfo(weekly)"
            >
              <!-- weekly.visitId 存在时  则是被查看的  否则是没被查看的TODO:待与炜哥沟通 -->
              <dl
                class="tl-card-list"
                :class="weekly.visitId ? 'is-visited' : 'un-visited'"
              >
                <dt>
                  <div class="user-info">
                    <img
                      v-if="hasValue(weekly.headerUrl)"
                      :src="weekly.headerUrl"
                      alt
                    />
                    <div v-else-if="weekly.userName" class="user-name">
                      <em>{{
                        weekly.userName.substring(weekly.userName.length - 2)
                      }}</em>
                    </div>
                  </div>
                  <div class="user-txt">
                    <p>
                      <em>{{ weekly.userName }}</em>
                      <!-- <span>{{
                        weekly.isadmin == "1" ? "(部门负责人)" : ""
                      }}</span> -->
                    </p>
                    <div class="user-from">
                      <em>{{ weekly.orgName }}</em>
                    </div>
                  </div>
                  <div
                    class="weekly-state"
                    :class="weekly.weeklyId ? 'is-submitted' : 'un-submitted'"
                  >
                    <i></i>
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
                      <em>--</em>
                    </template>
                  </div>
                </dd>
                <dd>
                  <span>时间</span>
                  <em>{{
                    weekly.updateTime
                      ? dateFormat("mm/dd HH:MM", weekly.updateTime)
                      : "--"
                  }}</em>
                </dd>
              </dl>
            </li>
            <li
              v-if="tableData.length < 1"
              :class="{ 'no-data': tableData.length < 1 }"
            >
              <div class="no-data-bg"></div>
              <div class="no-data-txt">暂无数据</div>
            </li>
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
                    <img
                      v-if="hasValue(weekly.headerUrl)"
                      :src="weekly.headerUrl"
                      alt
                    />
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
                    <dl
                      class="tag-kind"
                      v-for="(work, index) in weekly.contentList"
                      :key="work + index"
                    >
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
            </li>
            <li v-if="tableData.length < 1">
              <div class="no-data">
                <div class="no-data-bg"></div>
                <div class="no-data-txt">暂无数据</div>
              </div>
            </li>
          </ul>
        </div>
      </crcloud-table>
    </div>
    <div
      v-else
      class="cont-area"
      :class="{
        'not-opened': !(openOrClose == 'O' || formData.orgId == userInfo.orgId),
      }"
    >
      <div class="no-data">
        <div class="no-data-bg"></div>
        <div class="no-data-txt">该团队周报未开放</div>
      </div>
    </div>
  </div>
</template>

<script>
import list from './components/list';
import info from './components/teamWeeklyInfo';

export default {
  name: '',
  components: {
    'tl-list': list,
    'tl-info': info,
  },
  props: {},
  data() {
    return {
      isList: true,
      infoParams: {},
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    showInfo(params) {
      this.infoParams = params;
      this.isList = false;
    },
    showList() {
      this.isList = true;
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>