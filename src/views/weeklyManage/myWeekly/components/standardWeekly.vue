<template>
  <div class="write-weekly">
    <!-- <div class="operating-box">
      <div
        class="tl-custom-btn"
        v-for="item in thisPageWeeklyTypeList"
        :key="item.randomId"
        :class="{
          'is-select': weeklyType == item,
        }"
        @click="setWeeklyType(item)"
      >
        <em>{{ item == "1" ? "标准版" : "简单版" }}</em>
      </div>
    </div> -->
    <!-- <div class="weekly-title">{{ getWeekItem() }}</div> -->
    <div class="weekly-cont" v-if="refreshForm">
      <!-- `week_status 状态( 0 未同步： 1 已同步 ：2 已审批 : 50 失效作废 ) -->
      <el-form
        ref="work"
        :model="workForm"
        :key="workForm.randomId"
        v-for="(workForm, index) in weeklyWorkVoSaveList"
        label-width="70px"
        class="tl-form"
        :class="{ 'is-edit': canUpdate && workForm.noCheck }"
      >
        <div class="flex-sb">
          <div class="item-title">
            <i></i><span>工作项</span><em>{{ index + 1 }}</em>
          </div>
          <span v-if="hasChecked(workForm)" class="has-approval">已审批</span>
          <el-tooltip
            v-else
            v-show="canUpdate && workForm.noCheck"
            :class="{
              'is-disabled': weeklyWorkVoSaveList.length == 1,
            }"
            effect="dark"
            :content="
              weeklyWorkVoSaveList.length > 1 ? '删除' : '至少有一条工作项'
            "
            placement="top"
            popper-class="tl-tooltip-popper"
            @click.native="
              weeklyWorkVoSaveList.length > 1 && deleteWork(workForm)
            "
          >
            <div class="icon-clear"><i></i><em>删除</em></div>
          </el-tooltip>
        </div>
        <div class="form-item">
          <!-- <div
          class="form-item"
          :class="{ 'is-standard-version': weeklyType == 1 }"
        > -->
          <div class="form-item-group">
            <el-form-item
              prop="workContent"
              label="工作项"
              :rules="
                canUpdate && workForm.noCheck
                  ? [
                      {
                        required: true,
                        validator: validateWorkContent,
                        trigger: 'blur',
                      },
                    ]
                  : []
              "
            >
              <el-input
                :autosize="{ minRows: 1, maxRows: 8 }"
                maxlength="50"
                v-if="canUpdate && workForm.noCheck"
                clearable
                placeholder="简短概括工作项"
                class="tl-textarea"
                v-model.trim="workForm.workContent"
              ></el-input>
              <em v-else> {{ workForm.workContent }}</em>
            </el-form-item>
            <el-form-item label="内容">
              <el-input
                v-model="workForm.workDesc"
                :autosize="{ minRows: 2 }"
                type="textarea"
                v-if="canUpdate && workForm.noCheck"
                placeholder="请描述工作项内容"
                class="tl-textarea"
                maxlength="500"
                clearable
              ></el-input>
              <pre v-else class="font-normal">{{ workForm.workDesc }}</pre>
            </el-form-item>
          </div>
          <div class="form-item-group">
            <el-form-item
              label="进度"
              prop="workProgress"
              :rules="
                canUpdate && workForm.noCheck
                  ? [
                      {
                        required: true,
                        validator: validateProcess,
                        trigger: 'change',
                      },
                    ]
                  : []
              "
            >
              <div class="tl-progress-group">
                <tl-process
                  :data="parseInt(Number(workForm.workProgress), 10)"
                  :showNumber="!canUpdate || !workForm.noCheck"
                ></tl-process>
                <!-- kr支持更改进度 -->
                <el-slider
                  v-if="canUpdate && workForm.noCheck"
                  v-model.number="workForm.workProgress"
                  :step="1"
                  @change="processChange(workForm)"
                  tooltip-class="slider-tooltip"
                ></el-slider>
                <el-input-number
                  v-if="canUpdate && workForm.noCheck"
                  v-model.number="workForm.workProgress"
                  controls-position="right"
                  :min="0"
                  :max="100"
                  :step="1"
                  :precision="0"
                  class="tl-input-number"
                  @blur="progressAfterBlur(item)"
                ></el-input-number>
                <span v-if="canUpdate && workForm.noCheck">%</span>
              </div>
            </el-form-item>
            <el-form-item
              label="工时"
              class="time-cascader"
              prop="timeList"
              :rules="
                canUpdate && workForm.noCheck
                  ? [
                      {
                        required: true,
                        validator: validateTime,
                        trigger: 'change',
                      },
                    ]
                  : []
              "
            >
              <div class="working-hours-cont">
                <div class="add-working-hours">
                  <el-button
                    type="text"
                    class="tl-btn"
                    v-if="canUpdate && workForm.noCheck"
                    >添加工时</el-button
                  >
                  <el-cascader
                    v-show="canUpdate && workForm.noCheck"
                    :ref="workForm.randomId"
                    v-model="workForm.timeList"
                    :options="weekDataList"
                    :props="props"
                    placeholder="添加工时"
                    collapse-tags
                    @visible-change="visibleChange(workForm)"
                    @change="selectWeekData(workForm)"
                    popper-class="tl-cascader-popper working-hours-cascader"
                    class="tl-cascader"
                  ></el-cascader>
                </div>
                <!-- 当未审批时 展示原始数据  审批之后展示修改后的数据 -->
                <em>{{
                  getTimes(
                    workForm,
                    hasChecked(workForm) ? "updated" : "original",
                    "days"
                  )
                }}</em>
                <div class="working-hours-info">
                  <span>{{
                    getTimes(
                      workForm,
                      hasChecked(workForm) ? "updated" : "original",
                      "info"
                    )
                  }}</span>
                  <el-popover
                    placement="top-start"
                    title=""
                    width="200"
                    trigger="hover"
                    content=""
                    popper-class="popper-working-hours"
                  >
                    <ul>
                      <li>
                        <span>填入工时：</span>
                        <span>{{
                          getTimes(workForm, "original", "days")
                        }}</span>
                        <span>{{
                          getTimes(workForm, "original", "info")
                        }}</span>
                      </li>
                      <li>
                        <span>修改后工时：</span>
                        <span>{{ getTimes(workForm, "updated", "days") }}</span>
                        <span>{{ getTimes(workForm, "updated", "info") }}</span>
                      </li>
                      <li>
                        <span>修改原因：</span
                        ><span>{{
                          workForm.weekList.length > 0
                            ? workForm.weekList[0].remark
                            : ""
                        }}</span>
                      </li>
                    </ul>
                    <div
                      v-show="
                        workForm.weekList.length > 0 &&
                        workForm.weekList[0].remark
                      "
                      slot="reference"
                    >
                      <i class="icon-remind"></i>
                      <span>工时已被项目经理修改</span>
                    </div>
                  </el-popover>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="项目"
              prop="projectId"
              :rules="
                canUpdate && workForm.noCheck
                  ? [
                      {
                        required: true,
                        message: '请选择项目',
                        trigger: 'change',
                      },
                    ]
                  : []
              "
            >
              <el-input v-model="workForm.projectId" v-show="false"></el-input>
              <div class="tag-group">
                <ul class="tag-lists">
                  <li v-if="workForm.projectNameCn">
                    <!-- <el-tooltip
                      v-if="workForm.projectId != 'DEFAULT_PROJECT'"
                      class="select-values"
                      effect="dark"
                      placement="top"
                      popper-class="tl-tooltip-popper"
                    > -->
                    <!-- <em slot="content">{{ workForm.projectNameCn }}</em> -->
                    <em
                      @click="
                        canUpdate && workForm.noCheck
                          ? selectProject(workForm)
                          : ''
                      "
                      >{{ workForm.projectNameCn }}</em
                    >
                    <!-- </el-tooltip>
                    <div v-else>
                      <em
                        @click="
                          canUpdate && workForm.noCheck
                            ? selectProject(workForm)
                            : ''
                        "
                        >{{ workForm.projectNameCn }}</em
                      >
                    </div> -->
                  </li>
                  <li
                    v-if="!workForm.projectNameCn"
                    @click="selectProject(workForm)"
                    class="is-init"
                  >
                    <i class="el-icon-plus"></i>
                    <em>关联项目</em>
                  </li>
                </ul>
              </div>
            </el-form-item>
            <el-form-item
              label="支撑OKR/价值观"
              prop="valueOrOkrIds"
              :rules="
                canUpdate && workForm.noCheck
                  ? [
                      {
                        required: true,
                        validator: validateOkr,
                        trigger: 'change',
                      },
                    ]
                  : []
              "
            >
              <el-input
                v-model="workForm.valueOrOkrIds"
                v-show="false"
              ></el-input>
              <div class="tag-group">
                <ul class="tag-lists">
                  <li
                    v-for="item in workForm.selectedOkr"
                    :key="item.okrDetailId"
                  >
                    <!-- <el-tooltip
                      v-if="item.okrDetailObjectKr != '不关联任何OKR'"
                      class="select-values"
                      effect="dark"
                      placement="top"
                      popper-class="tl-tooltip-popper"
                    > -->
                    <!-- <em slot="content">{{ item.okrDetailObjectKr }}</em> -->
                    <em
                      v-if="canUpdate && workForm.noCheck"
                      @click="addSupportOkr(workForm)"
                      >{{ item.okrDetailObjectKr }}</em
                    >
                    <em v-else>{{ item.okrDetailObjectKr }}</em>
                    <!-- </el-tooltip>
                    <div v-else>
                      <em
                        v-if="canUpdate && workForm.noCheck"
                        @click="addSupportOkr(workForm)"
                        >{{ item.okrDetailObjectKr }}</em
                      >
                      <em v-else>{{ item.okrDetailObjectKr }}</em>
                    </div> -->
                  </li>
                  <li
                    v-if="
                      workForm.selectedOkr.length < 1 &&
                      canUpdate &&
                      workForm.noCheck
                    "
                    @click="addSupportOkr(workForm)"
                    class="is-init"
                  >
                    <i class="el-icon-plus"></i>
                    <em>支撑OKR/价值观</em>
                  </li>
                </ul>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="btn-box" v-if="canUpdate">
        <el-button
          type="text"
          @click="addWork"
          class="tl-btn dotted-line list-add"
        >
          <i class="el-icon-plus"></i>添加
        </el-button>
      </div>
    </div>
    <!-- 本周感想、建议、收获 -->
    <dl class="dl-card-panel weekly-thoughts" :class="{ 'is-edit': canUpdate }">
      <dt class="card-title"><em>本周感想、建议、收获</em></dt>
      <dd v-if="weeklyThoughtSaveList.length < 1" class="no-data">
        <em>本周未填写感想、建议、收获</em>
      </dd>
      <dd v-for="(item, index) in weeklyThoughtSaveList" :key="item.randomId">
        <div class="tag-group">
          <div
            class="tag-kinds"
            @click="thoughtTypeChange(item, 0)"
            :class="{ 'is-thoughts': item.thoughtType == 0 }"
            v-if="canUpdate || item.thoughtType == 0"
          >
            <span>感想</span>
          </div>
          <div
            class="tag-kinds"
            @click="thoughtTypeChange(item, 1)"
            :class="{ 'is-suggest': item.thoughtType == 1 }"
            v-if="canUpdate || item.thoughtType == 1"
          >
            <span>建议</span>
          </div>
          <div
            class="tag-kinds"
            @click="thoughtTypeChange(item, 2)"
            :class="{ 'is-harvest': item.thoughtType == 2 }"
            v-if="canUpdate || item.thoughtType == 2"
          >
            <span>收获</span>
          </div>
        </div>
        <el-input
          :autosize="{ minRows: 1, maxRows: 8 }"
          type="textarea"
          v-if="canUpdate"
          v-model="item.thoughtContent"
          maxlength="500"
          :placeholder="getPlaceholder(item.thoughtType)"
          class="tl-textarea"
          @click.native="updateThought(item)"
          @blur="noUpdateThought(item)"
          :class="{ 'has-edit': item.isUpdating }"
        ></el-input>
        <pre v-else>{{ item.thoughtContent }}</pre>
        <!-- <el-tooltip
          v-if="canUpdate && index == weeklyThoughtSaveList.length - 1"
          :class="{
            'is-disabled': weeklyThoughtSaveList.length == 1,
          }"
          effect="dark"
          :content="'添加'"
          placement="top"
          popper-class="tl-tooltip-popper"
          @click.native="addThought(item.randomId)"
        >
          <div class="icon-bg">
            <i class="icon-add"></i>
          </div>
        </el-tooltip> -->
        <div
          @click="addThought(item.randomId)"
          class="icon-bg"
          v-if="canUpdate && index == weeklyThoughtSaveList.length - 1"
        >
          <i class="icon-add"></i>
        </div>
        <el-tooltip
          v-if="canUpdate && weeklyThoughtSaveList.length == 1"
          :class="{
            'is-disabled': weeklyThoughtSaveList.length == 1,
          }"
          effect="dark"
          content="至少保留一条数据"
          placement="top"
          popper-class="tl-tooltip-popper"
        >
          <div class="icon-bg">
            <i class="icon-reduce"></i>
          </div>
        </el-tooltip>
        <div
          @click="deleteThoughts(item.randomId)"
          class="icon-bg"
          v-if="canUpdate && weeklyThoughtSaveList.length > 1"
        >
          <i class="icon-reduce"></i>
        </div>
      </dd>
    </dl>
    <!-- 下周计划-->
    <dl class="dl-card-panel week-plan" :class="{ 'is-edit': canUpdate }">
      <dt class="card-title"><em>下周计划</em></dt>
      <dd v-if="weeklyPlanSaveList.length < 1" class="no-data">
        <em>本周未填写下周计划</em>
      </dd>
      <dd v-for="(item, index) in weeklyPlanSaveList" :key="item.randomId">
        <div>
          <em>{{ index + 1 }}</em>
        </div>
        <el-input
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 8 }"
          v-if="canUpdate"
          v-model="item.planContent"
          maxlength="100"
          clearable
          placeholder="建议添加多条作为下周计划项，显得计划比较详实"
          class="tl-textarea"
          @click.native="updatePlan(item)"
          @blur="noUpdatePlan(item)"
          :class="{ 'has-edit': item.isUpdating }"
        ></el-input>
        <pre v-else>{{ item.planContent }}</pre>
        <!-- <el-tooltip
          v-if="canUpdate && index == weeklyPlanSaveList.length - 1"
          :class="{
            'is-disabled': weeklyPlanSaveList.length == 1,
          }"
          effect="dark"
          :content="'添加'"
          placement="top"
          popper-class="tl-tooltip-popper"
          @click.native="addNextWeekWork"
        >
        </el-tooltip> -->
        <div
          class="icon-bg"
          v-if="canUpdate && index == weeklyPlanSaveList.length - 1"
          @click="addNextWeekWork"
        >
          <i class="icon-add"></i>
        </div>
        <el-tooltip
          v-if="canUpdate && weeklyPlanSaveList.length == 1"
          :class="{
            'is-disabled': weeklyPlanSaveList.length == 1,
          }"
          effect="dark"
          content="至少保留一条数据"
          placement="top"
          popper-class="tl-tooltip-popper"
        >
          <div class="icon-bg">
            <i class="icon-reduce"></i>
          </div>
        </el-tooltip>
        <div
          class="icon-bg"
          v-if="canUpdate && weeklyPlanSaveList.length > 1"
          @click="deletePlanItem(item)"
        >
          <i class="icon-reduce"></i>
        </div>
      </dd>
    </dl>
    <!-- 个人OKR完成度   refreshForm为了解决样式不刷新问题-->
    <dl
      class="dl-card-panel okr-completion"
      :class="{ 'is-edit': canUpdate }"
      v-if="configItemCodeOKR == 'O' && refreshForm"
    >
      <dt class="card-title"><em>个人OKR完成度</em></dt>
      <!-- 这里循环 dd 每一条支撑周报的 O 或者 是  KR  如果是O ？is-o：is-kr -->
      <dd v-if="weeklyOkrSaveList.length < 1" class="no-data">
        <span>当工作项中的任务支撑个人OKR，才能修改相关OKR完成度</span>
      </dd>
      <dd
        class="undertake-okr-list"
        :class="item.kr ? 'is-kr' : 'is-o'"
        v-for="item in weeklyOkrSaveList"
        :key="item.o.okrdetailId"
      >
        <div class="o-kr-group" v-if="hasValue(item.kr)">
          <div class="tag-kind">
            <span class="kind-parent">目标</span>
            <!-- <el-tooltip
              class="select-values"
              effect="dark"
              placement="top"
              popper-class="tl-tooltip-popper"
            > -->
            <!-- <em slot="content">{{ item.o.okrDetailObjectKr }}</em> -->
            <em>{{ item.o.okrDetailObjectKr }}</em>
            <!-- </el-tooltip> -->
          </div>
        </div>
        <div class="o-kr-group">
          <template v-if="hasValue(item.kr)">
            <div class="tag-kind">
              <span class="kind-child">KR</span>
              <!-- <el-tooltip
                class="select-values"
                effect="dark"
                placement="top"
                popper-class="tl-tooltip-popper"
              > -->
              <!-- <em slot="content">{{ item.kr.okrDetailObjectKr }}</em> -->
              <em>{{ item.kr.okrDetailObjectKr }}</em>
              <!-- </el-tooltip> -->
              <span
                >被工作项<em>{{ itemIndex(item.kr) }}</em
                >支撑</span
              >
            </div>
          </template>
          <template v-else>
            <div class="tag-kind">
              <span class="kind-parent">目标</span>
              <!-- <el-tooltip
                class="select-values"
                effect="dark"
                placement="top"
                popper-class="tl-tooltip-popper"
              >
                <em slot="content">{{ item.o.okrDetailObjectKr }}</em> -->
              <em>{{ item.o.okrDetailObjectKr }}</em>
              <!-- </el-tooltip> -->
              <span
                >被工作项<em>{{ itemIndex(item.o) }}</em
                >支撑</span
              >
            </div>
          </template>
          <div class="okr-risk" v-if="hasValue(item.kr)">
            <span>信心指数</span>
            <template v-if="canUpdate">
              <tl-confidence v-model="item.confidenceAfter"></tl-confidence>
            </template>
            <template v-else>
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
                    'is-no-risk': item.confidenceAfter == 1,
                    'is-risks': item.confidenceAfter == 2,
                  }"
                ></div>
                <div
                  :class="{
                    'is-no-risk': item.confidenceAfter == 1,
                  }"
                ></div>
              </div>
              <div class="state-txt">
                {{ CONST.CONFIDENCE_MAP[item.confidenceAfter] }}
              </div>
            </template>
          </div>
          <div class="tl-progress-group">
            <span>当前进度</span>
            <tl-process
              :data="parseInt(Number(item.progressAfter), 10)"
              :showNumber="false"
              :width="30"
              :marginLeft="2"
            ></tl-process>
            <!-- kr支持更改进度 -->
            <el-slider
              v-if="canUpdate && item.kr"
              v-model="item.progressAfter"
              :step="1"
              @change="processChange(item)"
              tooltip-class="slider-tooltip"
            ></el-slider>
            <el-input-number
              v-if="canUpdate && item.kr"
              v-model="item.progressAfter"
              controls-position="right"
              :min="0"
              :max="100"
              :step="1"
              :precision="0"
              class="tl-input-number"
              @blur="progressAfterBlur(item)"
            ></el-input-number>
            <em v-else>{{ item.progressAfter }}</em>
            <span>%</span>
          </div>
          <div class="week-change">
            <span>本次变化</span
            ><em
              >{{ item.progressAfter - item.progressBefor > 0 ? "+" : ""
              }}{{ item.progressAfter - item.progressBefor }}%</em
            >
          </div>
        </div>
      </dd>
    </dl>

    <div class="footer-panel" v-if="hasPower('weekly-submit')">
      <!-- 本周心情 -->
      <dl class="dl-card-panel mood" :class="{ 'is-edit': canUpdate }">
        <dd>
          <ul>
            <li>本周心情</li>
            <li
              v-show="canUpdate || weeklyEmotion === 100"
              class="has-harvest"
              :class="{ 'is-selected': weeklyEmotion === 100 }"
              @click="canUpdate ? setEmotion(100) : ''"
            >
              <i></i><i></i>
            </li>
            <li
              v-show="canUpdate || weeklyEmotion === 50"
              class="not-too-bad"
              :class="{ 'is-selected': weeklyEmotion === 50 }"
              @click="canUpdate ? setEmotion(50) : ''"
            >
              <i></i><i></i>
            </li>
            <li
              v-show="canUpdate || weeklyEmotion === 0"
              class="let-quiet"
              :class="{ 'is-selected': weeklyEmotion === 0 }"
              @click="canUpdate ? setEmotion(0) : ''"
            >
              <i></i><i></i>
            </li>
          </ul>
          <span v-if="showEmotionError">请选择本周心情</span>
        </dd>
      </dl>
      <el-button
        :loading="submitLoading"
        v-if="canEdit && canUpdate"
        type="primary"
        @click="submitWeekly"
        class="tl-btn amt-bg-slip"
        >保存</el-button
      >
      <el-button
        v-if="canEdit && !canUpdate"
        type="primary"
        @click="updateWeekly"
        class="tl-btn amt-bg-slip"
        >编辑</el-button
      >
      <span v-if="!canEdit"
        >不好意思同学，历史周报不能编辑（补写），让往事随风吧，向前看</span
      >
    </div>
    <!-- 添加支撑项 -->
    <add-okr
      ref="addOkr"
      v-if="showAddOkr"
      :showAddOkr.sync="showAddOkr"
      :currenItemRandomId="currenItemRandomId"
      :selectedOkr="selectedOkr"
      :server="server"
      @closeOkrDialog="closeOkrDialog"
    ></add-okr>
    <!-- 添加支撑项 -->
    <tl-select-project
      ref="selectProject"
      v-if="showProject"
      :showProject.sync="showProject"
      :currenItemRandomId="currenItemRandomId"
      :selectedPro="selectedPro"
      @closeProjectDialog="closeProjectDialog"
    ></tl-select-project>
  </div>
</template>

<script>

import tlProcess from '@/components/process';
import confidenceSelect from '@/components/confidenceSelect';
import merge from 'webpack-merge';
import CONST from '@/components/const';

import { mapState } from 'vuex';
import Server from '../server';
import addOkr from './addOkr';
import selectProject from './selectProject';
import mixin from '../mixin';

const server = new Server();
export default {
  name: 'standardWeekly',
  mixins: [mixin],
  components: {
    'add-okr': addOkr,
    'tl-process': tlProcess,
    'tl-confidence': confidenceSelect,
    'tl-select-project': selectProject,
  },
  props: {
    week: {
      type: Object,
      default() {
        return {};
      },
    },

  },
  data() {
    return {
      server,
      CONST,
      weeklyData: {},
      canUpdate: false, // 本周、上周可编辑；
      weeklyEmotion: '',
      showEmotionError: false,
      weeklyId: '',
      tableLoading: false,
      currenItemRandomId: '',
      showAddOkr: false,
      showProject: false,
      submitLoading: false,
      weeklyThoughtSaveList: [],
      weeklyPlanSaveList: [],
      weeklyWorkVoSaveList: [],
      selectedOkr: [],
      selectedPro: '',
      tempResult: [],
      weeklyOkrSaveList: [],
      riskList: [
        {
          value: 1,
          label: '高',
        },
        {
          value: 2,
          label: '中',
        },
        {
          value: 3,
          label: '低',
        },
      ],
      textarea: '',
      showTaskProcess: false,
      weeklyDataCopy: {},
      props: { multiple: true },
      weeklyType: '',
      refreshForm: false,
    };
  },
  created() {
    this.$busOn('refreshPage', () => {
      // 清除表单
      this.refreshForm = false;
      this.$nextTick(() => {
        // 重新渲染表单  校验才会生效
        this.refreshForm = true;
      });
      this.$forceUpdate();
    });
    // this.$busOn('refreshWeekly', () => {
    //   this.setThisWeekStatus();
    // });
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapState('weekly', {
      selectedMonth: (state) => state.selectedMonth,
    }),
  },
  methods: {
    init() {
      if (this.week.weeklyId) {
        this.weeklyId = this.week.weeklyId;
        this.server.queryWeekly({ weeklyId: this.week.weeklyId }).then((res) => {
          if (res.code == 200) {
            // 将所有数据保存
            this.weeklyData = res.data;
            this.weeklyType = res.data.weeklyType;
            this.weeklyDataCopy = { ...this.weeklyData };
            this.initPage();
            this.refreshForm = true;
          }
        });
      } else if (!this.week.weeklyId) {
        this.canUpdate = true;
        // eslint-disable-next-line prefer-destructuring
        this.weeklyDataCopy = {};
        if (!(this.$route.params && this.$route.params.weeklySumParams)) {
          // 本周任务初始化数据
          this.addWork();
          // 下周计划初始化数据
          this.addNextWeekWork();
        }
        // 本周感想初始化数据
        this.addThought();
        this.initPage();
        this.refreshForm = true;
      }
    },
    updateThought(thought) {
      this.weeklyThoughtSaveList.forEach((item) => {
        item.isUpdating = false;
        if (thought.randomId == item.randomId) {
          item.isUpdating = true;
        }
      });
      this.$forceUpdate();
    },
    noUpdateThought() {
      this.weeklyThoughtSaveList.forEach((item) => {
        item.isUpdating = false;
      });
      this.$forceUpdate();
    },
    updatePlan(plan) {
      this.weeklyPlanSaveList.forEach((item) => {
        item.isUpdating = false;
        if (plan.randomId == item.randomId) {
          item.isUpdating = true;
        }
      });
      this.$forceUpdate();
    },
    noUpdatePlan() {
      this.weeklyPlanSaveList.forEach((item) => {
        item.isUpdating = false;
      });
      this.$forceUpdate();
    },
    setOkrProcess(weeklyOkrVoList) {
      // 将上次保存的o、kr找出来，多行支撑项
      const supportList = [];
      for (const okr of weeklyOkrVoList) {
        let supportObj = {};
        for (const o of this.originalMyOkrList) {
          if (okr.okrDetailId == o.okrDetailId) {
            o.id = okr.id;
            o.weeklyId = okr.weeklyId;
            supportObj = { o };
          }
          for (const kr of o.krList) {
            if (kr.okrDetailId == okr.okrDetailId) {
              kr.id = okr.id;
              kr.weeklyId = okr.weeklyId;
              supportObj = { o, kr };
            }
          }
        }
        // 每行数据的支撑项整理好了
        if (supportObj.o) {
          supportList.push(supportObj);
        }
      }
      // 将支撑项塞到列表对应行中，监听到到表格数据变化侯，会将个人okr进度反显出来
      this.weeklyWorkVoSaveList.forEach((tableItem) => { // 列表行数据
        tableItem.workOkrList.forEach((workOkr) => { // 行数据中的支撑项
          // 遍历整理好的数据
          supportList.forEach((supportItem) => {
            // 如果仅仅是个人目标
            if (workOkr.okrDetailId == supportItem.o.okrDetailId) {
              this.$set(tableItem, 'supportMyOkrObj', supportItem);
            }
            // 如果是个人KR
            if (
              supportItem.kr
                && tableItem.workOkrList.length > 0
                && workOkr.okrDetailId == supportItem.kr.okrDetailId) {
              this.$set(tableItem, 'supportMyOkrObj', supportItem);
            }
          });
        });
      });
    },
    setWorkTableData() {
      this.weeklyEmotion = this.weeklyDataCopy.weeklyEmotion;// 心情
      if (this.weeklyWorkVoSaveList && this.weeklyWorkVoSaveList.length > 0) {
        this.weeklyWorkVoSaveList.forEach((element) => {
          this.$set(element, 'randomId', Math.random().toString(36).substr(3));
          const valueIdList = [];
          const okrIdList = [];
          element.okrCultureValueList.forEach((item) => { // 将价值观数据添加与okr一样的字段
            item.okrDetailId = item.id;
            item.okrDetailObjectKr = item.cultureName;
            this.$set(item, 'randomId', Math.random().toString(36).substr(3));
            valueIdList.push(item.id);
          });

          element.workOkrList.forEach((item) => {
            this.$set(item, 'randomId', Math.random().toString(36).substr(3));
            okrIdList.push(item.okrDetailId);
          });
          // 后端取回的数据，如果没支撑项，则加上‘不关联任何okr’
          if ([...element.okrCultureValueList, ...element.workOkrList].length < 1 && element.workId) {
            element.okrCultureValueList = [{
              okrDetailId: 'noOkr',
              okrDetailObjectKr: '不关联任何OKR',
              randomId: Math.random().toString(36).substr(3),

            }];
            valueIdList.push('noOkr');
          }
          this.$set(element, 'noCheck', true);
          this.$set(element, 'okrIdList', okrIdList);// 将已选okr设置在行数据中
          this.$set(element, 'valueIdList', valueIdList);// 将已选价值观设置在行数据中
          this.$set(element, 'selectedOkr', [...element.okrCultureValueList, ...element.workOkrList]);// 反显已勾选的价值观、okr
          this.$set(element, 'valueOrOkrIds', valueIdList.join(',') + okrIdList.join(','));// 校验支撑项
          this.$set(element, 'okrCultureValueIds', valueIdList.join(','));// 存到后端的价值观
          this.$set(element, 'okrIds', okrIdList.join(','));// 存到后端的okr
          this.$set(element, 'timeList', this.setTimeList(element.weekList));// 存到后端的okr
          this.$set(element, 'weekListCopy', element.weekList);// 存到后端的okr
          this.$nextTick(() => {
            this.$set(element, 'selectedNodeList', this.selectedNodes(element));
          });
        });
      }
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    setThoughts() {
      this.weeklyThoughtSaveList = this.weeklyDataCopy.weeklyThoughtList || [];
      if (!!this.weeklyThoughtSaveList && this.weeklyThoughtSaveList.length > 0) {
        this.weeklyThoughtSaveList.forEach((thought) => {
          thought.randomId = Math.random().toString(36).substr(3);
          thought.isUpdating = false;
        });
      } else {
        // this.addThought();
      }
    },
    setNextWeekPlan() {
      this.weeklyPlanSaveList = this.weeklyDataCopy.weeklyPlanList || [];
      if (!!this.weeklyPlanSaveList && this.weeklyPlanSaveList.length > 0) {
        this.weeklyPlanSaveList.forEach((plan) => {
          plan.randomId = Math.random().toString(36).substr(3);
        });
      } else {
        // this.addNextWeekWork();
      }
    },
    setTimeList(weekList) {
      const result = [];
      if (weekList && weekList.length > 0) {
        weekList.forEach((day) => {
          const dateTemp = day.weekDate.split(' ')[0];
          const whichDay = new Date(dateTemp).getDay();
          if (day.weekTimeAfter !== '0') {
            result.push([whichDay, day.weekTimeType]);
          }
        });
      }
      return result;
    },

    selectedNodes(workItem) {
      let selectedList = [];
      const self = this;
      self.weeklyWorkVoSaveList.forEach((element) => {
        if (element.randomId == workItem.randomId && self.$refs[element.randomId]) {
          selectedList = self.$refs[element.randomId][0].getCheckedNodes(false);
        }
      });
      return selectedList;
    },
    setWeeklyType(data) {
      this.weeklyType = data;
    },
    // getWeekItem() {
    //   const beg = this.week.weekBegin.split('-').splice(1, 2).join('/');
    //   const end = this.week.weekEnd.split('-').splice(1, 2).join('/');
    //   return `第${this.weekList.indexOf(this.week) + 1}周(${beg}-${end})`;
    // },
    addWork() {
      this.weeklyWorkVoSaveList.push({
        workContent: '',
        workDesc: '',
        projectId: '',
        projectNameCn: '',
        workProgress: '',
        selectedOkr: [],
        timeList: [],
        weekList: [],
        workOkrList: [],
        okrCultureValueList: [],
        okrCultureValueIds: '',
        okrIds: '',
        valueOrOkrIds: '',
        workIndex: 0,
        noCheck: true,
        randomId: Math.random().toString(36).substr(3), // 添加随机id，用于删除环节
      });
      if (this.weeklyWorkVoSaveList.length > 1) {
        this.$message.success(`新增工作项 ${this.weeklyWorkVoSaveList.length}`);
      }
    },
    addThought() {
      this.weeklyThoughtSaveList.push({
        thoughtContent: '',
        thoughtId: '',
        thoughtType: 0,
        weeklyId: '',
        isUpdating: false,
        randomId: Math.random().toString(36).substr(3),
      });
    },
    addNextWeekWork() {
      this.weeklyPlanSaveList.push({
        planContent: '',
        planId: '',
        weeklyId: '',
        randomId: Math.random().toString(36).substr(3),
      });
    },
    deleteWork(item) {
    // 本地数据
      this.weeklyWorkVoSaveList = this.weeklyWorkVoSaveList.filter(
        (thisWeek) => thisWeek.randomId != item.randomId,
      );
      this.visibleChange(item);
    },
    deletePlanItem(item) {
    // 本地数据
      this.weeklyPlanSaveList = this.weeklyPlanSaveList.filter(
        (nextWeek) => nextWeek.randomId != item.randomId,
      );
    },
    deleteThoughts(randomId) {
      for (const item of this.weeklyThoughtSaveList) {
        if (item.randomId == randomId) {
          this.weeklyThoughtSaveList = this.weeklyThoughtSaveList.filter(
            (element) => element.randomId != randomId,
          );
        }
      }
    },
    addSupportOkr(data) {
      this.currenItemRandomId = data.randomId;
      this.selectedOkr = data.selectedOkr;
      this.showAddOkr = true;
    },
    selectProject(workForm) {
      this.currenItemRandomId = workForm.randomId;
      this.selectedPro = {
        projectId: workForm.projectId,
        projectNameCn: workForm.projectNameCn,
      };
      this.showProject = true;
    },
    closeOkrDialog(selectedData) {
      for (const item of this.weeklyWorkVoSaveList) {
        const valueIdList = [];
        const okrIdList = [];
        if (item.randomId == selectedData.currenItemRandomId) {
        // 给列表赋值，价值观、任务项，用于提交
          selectedData.selectedCulture.forEach((value) => {
            valueIdList.push(value.okrDetailId);
          });
          selectedData.selectedOkr.forEach((okr) => {
            okrIdList.push(okr.okrDetailId);
          });
          item.okrCultureValueIds = valueIdList.join(',');
          item.okrIds = okrIdList.join(',');
          this.$set(item, 'valueIdList', valueIdList);
          this.$set(item, 'okrIdList', okrIdList);
          // 添加该字段用于校验支撑项
          this.$set(item, 'valueOrOkrIds', item.okrCultureValueIds + item.okrIds);
          // 给列表赋值，价值观、任务项，用于展示
          item.selectedOkr = selectedData.selectedOkrAndCulture;
          item.supportMyOkrObj = selectedData.supportMyOkrObj;
        }
      }
      this.$forceUpdate();
    },
    closeProjectDialog(data) {
      this.weeklyWorkVoSaveList.forEach((workItem) => {
        if (workItem.randomId == data.currenItemRandomId) {
          workItem.projectId = data.projectObj.projectId;
          workItem.projectNameCn = data.projectObj.projectNameCn;
        }
      });
      this.$forceUpdate();
    },

    thoughtTypeChange(thoughts, type) {
      thoughts.thoughtType = type;
      this.$forceUpdate();
    },
    updateWeekly() {
      // 感想、计划如果没有数据，默认添加一条
      if (this.weeklyThoughtSaveList.length < 1) {
        this.addThought();
      }
      if (this.weeklyPlanSaveList.length < 1) {
        this.addNextWeekWork();
      }
      this.canUpdate = true;
      // 清除表单
      this.refreshForm = false;
      this.$nextTick(() => {
        // 重新渲染表单  校验才会生效
        this.refreshForm = true;
      });
      this.$nextTick(() => {
        this.weeklyWorkVoSaveList.forEach((workItem) => {
          this.$nextTick(() => {
            this.$set(workItem, 'selectedNodeList', this.selectedNodes(workItem));
          });
        });
      });
      this.$forceUpdate();
    },
    submitWeekly() {
      const self = this;
      if (!this.hasValue(self.weeklyEmotion)) {
        self.showEmotionError = true;
      }
      // 多表单校验
      if (self.$refs.work instanceof Array && self.$refs.work.length > 0) {
        let result = true;
        for (let i = 0; i < self.$refs.work.length; i += 1) {
        // eslint-disable-next-line no-loop-func
          self.$refs.work[i].validate((valid) => {
            result = result && valid;
          });
        }
        if (!result || self.showEmotionError) {
          self.$message.error('您有必填项未填写，请填写后重试！');
          return;
        }
        // 提交周报
        self.submitData();
      }
    },
    submitData() {
    // 将下周计划、感想有未填写的内容的数据删除
      this.weeklyThoughtSaveList = this.weeklyThoughtSaveList.filter(
        (thought) => !!thought.thoughtContent.trim(),
      );
      this.weeklyPlanSaveList = this.weeklyPlanSaveList.filter(
        (plan) => !!plan.planContent.trim(),
      );
      // 删除冗余字段
      const tempList = [...this.weeklyWorkVoSaveList];
      tempList.forEach((workItem) => {
        delete workItem.selectedNodeList;
      });
      // 提交前将后端返回的数据的weekId放回去
      tempList.forEach((item) => {
        if (item.weekListCopy && item.weekListCopy.length > 0) {
          item.weekList.forEach((week) => {
            item.weekListCopy.forEach((weekCopy) => {
              if (week.weekDate == weekCopy.weekDate && week.weekTimeType == weekCopy.weekTimeType) {
                week.weekId = weekCopy.weekId;
              }
            });
          });
        }
      });
      const params = {
        calendarId: this.week.calendarId,
        weeklyEmotion: this.weeklyEmotion,
        weeklyId: this.weeklyId,
        weeklyType: '1', // 暂时写死标准版
        weeklyOkrSaveList: this.weeklyOkrSaveList,
        weeklyPlanSaveList: this.weeklyPlanSaveList,
        weeklyThoughtSaveList: this.weeklyThoughtSaveList,
        weeklyWorkVoSaveList: tempList,
      };
      this.submitLoading = true;
      this.server.submitWeekly(params).then((res) => {
        if (res.code == 200) {
          this.canUpdate = false;
          this.$message.success('保存成功');
          // 新增周报，刷新日历数据，不要请求日历查询接口，只要更改本周的数据即可
          // 更新个人okr数据,取到最新数据
          this.$busEmit('refreshMyOkr');
          // 延时一秒再查询周报数据，防止okr数据请求未结束
          const timer = setTimeout(() => {
            this.setThisWeekStatus();
          }, 1000);
          timer();
          clearTimeout(timer);
          // 清空params中的参数  防止再次将参数中的数据插入到任务列表中
          this.$router.push({
            query: merge({}, { params: 'clear' }),
          });
        } else {
          this.submitLoading = false;
          this.$nextTick(() => {
            this.weeklyWorkVoSaveList.forEach((workItem) => {
              this.$nextTick(() => {
                this.$set(workItem, 'selectedNodeList', this.selectedNodes(workItem));
              });
            });
          });
          // 清除表单
          this.refreshForm = false;
          this.$nextTick(() => {
            // 重新渲染表单  校验才会生效
            this.refreshForm = true;
          });
          this.$forceUpdate();
        }
      });
    },
    refresh() {
      if (this.week.weeklyId) {
        this.refreshForm = false;
        this.weeklyId = this.week.weeklyId;
        this.server.queryWeekly({ weeklyId: this.week.weeklyId }).then((res) => {
          this.submitLoading = false;
          if (res.code == 200) {
            // 将所有数据保存
            this.weeklyData = res.data;
            this.weeklyDataCopy = { ...this.weeklyData };
            this.initPage();
            // // 清除表单
            this.refreshForm = false;
            this.$nextTick(() => {
              // 重新渲染表单  校验才会生效
              this.refreshForm = true;
            });
            this.$forceUpdate();
          }
        });
      }
    },
    processChange(item) {
      item.progressAfter = Math.round(item.progressAfter);
    },
    getPlaceholder(type) {
      if (type == 0) {
        return '本周有什么感想，工作的个人的都可以, 记录成长点滴';
      } if (type == 1) {
        return '对团队对公司对眼前事有什么建议吗';
      } if (type == 2) {
        return '做版本更好的自己，希望你本周有收获，记下来吧';
      }
    },
    projectChange(work) {
      this.weeklyWorkVoSaveList.forEach((element) => {
        if (work.randomId == element.randomId) {
          this.projectList.forEach((project) => {
            if (project.projectId == work.projectId) {
              work.projectNameCn = project.projectNameCn;
            }
          });
        }
      });
    },
    progressAfterBlur(okrItem) {
      if (okrItem.progressAfter == undefined) {
        this.weeklyOkrSaveList.forEach((okr) => {
          if (okrItem.okrDetailId == okr.okrDetailId) {
            okr.progressAfter = 0;
          }
        });
      }
    },
    setEmotion(emotion) {
      this.weeklyEmotion = emotion;
      this.showEmotionError = false;
    },
    setDisabledSelectedData(list) {
      // 1、先将所有数据disabled状态置为false
      this.weekDataList.forEach((day) => {
        day.disabled = false;
        if (day.children && day.children.length > 0) {
          day.children.forEach((dayChild) => {
            dayChild.disabled = false;
          });
        }
      });
      // 将上下午都选过的数据的父节点禁用(有的场景不支持父节点被选中，在此做兼容)
      const parantIdList = [];
      const willBeDisabledParentNodeList = [];
      list.forEach((selectedData) => {
        if (selectedData.data.parentId) {
          parantIdList.push(selectedData.data.parentId);
        }
      });
      // 去重
      const newParentIdList = [...new Set(parantIdList)];
      newParentIdList.forEach((parentId) => {
        const obj = {
          parentId,
          childList: [],
        };

        list.forEach((data) => {
          if (data.parent && parentId == data.parent.data.id) {
            obj.childList.push(parentId);
          }
        });
        if (obj.childList.length == 2) {
          willBeDisabledParentNodeList.push(obj.parentId);
        }
      });
      // 将被选中的数据禁用
      list.forEach((selectedData) => {
        this.weekDataList.forEach((day) => {
          if (day.children && day.children.length > 0) {
            day.children.forEach((dayChild) => {
              dayChild.disabled = false;
              this.$nextTick(() => {
                if (selectedData.data.id == dayChild.id) {
                  dayChild.disabled = true;
                }
              });
            });
          }
          day.disabled = false;
          this.$nextTick(() => {
            if (selectedData.data.id == day.id && day.children[0].disabled && day.children[1].disabled) {
              day.disabled = true;
            }
          });
        });
      });
      // 禁用父节点(不同工作项只选择一个上午或下午，累计该天全被选中时，父节点不能禁用)
      willBeDisabledParentNodeList.forEach((parentNodeId) => {
        this.weekDataList.forEach((weekData) => {
          weekData.disabled = false;
          this.$nextTick(() => {
            if (parentNodeId == weekData.id) {
              weekData.disabled = true;
            }
          });
        });
      });
      this.$forceUpdate();
    },
    // 禁用已选时间（除了当前工作项）
    visibleChange(workForm) {
      let selectedList = [];
      const self = this;
      // 1、找出被选中的数据
      this.$nextTick(() => {
        self.weeklyWorkVoSaveList.forEach((item) => {
          if (item.randomId != workForm.randomId) {
            if (item.selectedNodeList) {
              selectedList = [...selectedList, ...item.selectedNodeList];
            }
          }
        });
        // 遍历级联框数据，将整理好的数据禁用
        self.setDisabledSelectedData(selectedList);
      });
    },
    selectWeekData(workItem) {
      workItem.weekList = [];
      workItem.timeList.forEach((day) => {
        const begindate = new Date(this.week.weekBegin);
        begindate.setDate(begindate.getDate() + Number(day[0]) - 1);// 周日兼容
        if (day[0] == 0) {
          begindate.setDate(begindate.getDate() + 7);
        }
        workItem.weekList.push({
          weekDate: this.dateFormat('YYYY-mm-dd', begindate),
          weekTimeType: day[1],
          weekId: day[2] || '',
        });
      });
      this.$set(workItem, 'selectedNodeList', this.selectedNodes(workItem));
    },
    hasChecked(workItem) {
      if (workItem && workItem.weekList && workItem.weekList.length > 0) {
        if (workItem.weekList[0].weekStatus && workItem.weekList[0].weekStatus == '2') {
          return true;
        }
        return false;
      }
      return false;
    },
    setThisWeekStatus() {
      let newWeekList = [];
      const tempList = [...this.weekList];
      this.server.getCalendar({ date: this.selectedMonth }).then((res) => {
        if (res.code == 200) {
          newWeekList = res.data;
          newWeekList.forEach((newWeek) => {
            if (newWeek.calendarId == this.week.calendarId) {
              this.weeklyId = newWeek.weeklyId;
            }
          });
          // 周报提交成功了，将该周的状态改为已提交
          tempList.forEach((week) => {
            if (week.calendarId == this.week.calendarId) {
              week.weeklyId = this.weeklyId;
            }
          });

          this.setWeekList(tempList);
          // 刷新当前页周报数据
          this.refresh();
        }
      });
    },

  },

  watch: {
    week: {
      handler(newVal) {
        // 提交成功后返回最新weekLyId,防止编辑时传参weeklyId丢失，保存周报失败
        this.weeklyId = newVal.weeklyId || '';
      },
    },
    canUpdate: {
      handler(newVal) {
        if (newVal) {
          if (this.weeklyPlanSaveList.length < 1) {
            this.addNextWeekWork();
          }
          if (this.weeklyThoughtSaveList.length < 1) {
            this.addThought();
          }
        }
      },
    },
    weeklyWorkVoSaveList: {
      handler(tableData) {
        // *****************将本周未完成任务自动同步至下周计划*************
        // 先清空本周未完成任务同步至下周任务数据(周边那你编辑时不需要)
        if (!this.weeklyDataCopy.weeklyId) {
          for (const data of this.tempResult) {
            this.weeklyPlanSaveList = this.weeklyPlanSaveList.filter(
              (element) => element.randomId != data.randomId,
            );
          }
          // 清空临时数据
          this.tempResult = [];
          for (const item of tableData) {
            // 将未完成的任务自动同步至下周
            if (item.workProgress < 100 && item.workContent) {
              this.tempResult.push({
                planContent: item.workContent,
                planId: '',
                weeklyId: '',
                randomId: item.randomId,
              });
            }
          }
          // 合并数组;
          this.weeklyPlanSaveList = [...this.tempResult, ...this.weeklyPlanSaveList];
        }
        // *****************将本周关联的个人目标、okr同步至个人okr完成度*************
        // 将weeklyWorkVoSaveList中的支撑项读出来,放入个人okr完成度中
        this.weeklyOkrSaveList = [];
        this.showTaskProcess = false;
        const tempWeeklyOkrSaveList = [];
        for (const data of tableData) {
          if (data.supportMyOkrObj && data.supportMyOkrObj.o) {
            if (data.supportMyOkrObj.kr) { // kr
              this.$set(data.supportMyOkrObj, 'okrDetailId', data.supportMyOkrObj.kr.okrDetailId);
              this.$set(data.supportMyOkrObj, 'confidenceAfter', data.supportMyOkrObj.kr.okrDetailConfidence);
              this.$set(data.supportMyOkrObj, 'progressAfter', data.supportMyOkrObj.kr.okrDetailProgress);
              if (data.supportMyOkrObj.kr.id
              && this.weeklyDataCopy.weeklyOkrVoList
              && this.weeklyDataCopy.weeklyOkrVoList.length > 0) { // 判断是不是前端临时数据、还是后端返回的数据
                // 后端数据中匹配
                this.weeklyDataCopy.weeklyOkrVoList.forEach((element) => {
                  if (element.okrDetailId == data.supportMyOkrObj.kr.okrDetailId) {
                    this.$set(data.supportMyOkrObj, 'confidenceBefor', element.confidenceBefor);
                    this.$set(data.supportMyOkrObj, 'progressBefor', element.progressBefor);
                  }
                });
              } else {
                this.$set(data.supportMyOkrObj, 'confidenceBefor', data.supportMyOkrObj.kr.okrDetailConfidence);
                this.$set(data.supportMyOkrObj, 'progressBefor', data.supportMyOkrObj.kr.okrDetailProgress);
              }
            } else { // o
              this.$set(data.supportMyOkrObj, 'okrDetailId', data.supportMyOkrObj.o.okrDetailId);
              this.$set(data.supportMyOkrObj, 'progressAfter', data.supportMyOkrObj.o.okrDetailProgress);
              // 如果是详情则从详情中取值
              if (data.supportMyOkrObj.o.id) {
                // 后端数据中匹配
                this.weeklyDataCopy.weeklyOkrVoList.forEach((element) => {
                  if (element.okrDetailId == data.supportMyOkrObj.o.okrDetailId) {
                    this.$set(data.supportMyOkrObj, 'progressBefor', element.progressBefor);
                  }
                });
              } else {
                this.$set(data.supportMyOkrObj, 'progressBefor', data.supportMyOkrObj.o.okrDetailProgress);
              }
            }
            tempWeeklyOkrSaveList.push({
              id: data.supportMyOkrObj.kr ? data.supportMyOkrObj.kr.id : '',
              weeklyId: data.supportMyOkrObj.kr ? data.supportMyOkrObj.kr.weeklyId : '',
              ...data.supportMyOkrObj,
            });
          }
        }
        // 去重
        const result = [];
        const obj = {};
        for (let i = 0; i < tempWeeklyOkrSaveList.length; i += 1) {
          if (!obj[tempWeeklyOkrSaveList[i].okrDetailId]) {
            result.push(tempWeeklyOkrSaveList[i]);
            obj[tempWeeklyOkrSaveList[i].okrDetailId] = true;
          }
        }
        this.weeklyOkrSaveList = result;
        if (this.weeklyOkrSaveList.length > 0) {
          this.$nextTick(() => {
            this.showTaskProcess = true;
          });
        }
        // 工作项可编辑状态
        tableData.forEach((workItem) => {
          if (workItem && workItem.weekList.length > 0) {
            if (this.hasValue(workItem.weekList[0].weekStatus) && workItem.weekList[0].weekStatus == '2') {
              workItem.noCheck = false;
            } else {
              workItem.noCheck = true;
            }
          } else {
            workItem.noCheck = true;
          }
        });
        this.$forceUpdate();
      },
      deep: true,
    },
  },
};
</script>