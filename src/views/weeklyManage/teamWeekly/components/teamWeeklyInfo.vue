<!--
  功能：
  作者：王志任
  时间：2020年09月04日 10:26:49
  备注：
-->
<template>
  <div>
    <h1>团队周报</h1>
    <div>
      <el-button @click="goback">返回</el-button>
    </div>
    <div>
      <span>当前周报</span>
      <!-- 返回 -->

      <span>
        <el-avatar :size="30" :src="$route.query.headerUrl" @error="errorHandler">
          <img src="@/assets/images/login-error.png" />
        </el-avatar>
      </span>
      <span>{{$route.query.userName}}</span>
    </div>
    <div>
      <!-- 本周工作项 -->
      <div>
        <el-table ref="workTable" :data="weeklyWorkVoList">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="工作项" prop="workContent"></el-table-column>-
          <el-table-column label="内容" prop="workDesc" v-if="weeklyType == '1'"></el-table-column>
          <el-table-column width="100" label="进度" prop="workProgress">
            <template slot-scope="scope">
              <span>{{scope.row.workProgress}}%</span>
            </template>
          </el-table-column>
          <el-table-column width="100" label="投入工时" prop="workTime">
            <template slot-scope="scope">
              <span>{{scope.row.workTime}}h</span>
            </template>
          </el-table-column>
          <el-table-column label="关联项目" prop="projectNameCn"></el-table-column>
          <el-table-column label="支持OKR/价值观">
            <template slot-scope="scope">
              <span
                style="marginLeft:8px"
                v-for="value in scope.row.okrCultureValueList"
                :key="value.id"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="value.cultureName"
                  placement="top-end"
                >
                  <span>{{setOkrStyle(value.cultureName)}}</span>
                </el-tooltip>
              </span>
              <span style="marginLeft:8px" v-for="value in scope.row.workOkrList" :key="value.id">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="value.okrDetailObjectKr"
                  placement="top-end"
                >
                  <span>{{setOkrStyle(value.okrDetailObjectKr)}}</span>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 本周感想、建议、收获 -->
      <div v-if="weeklyType == '1'" style="marginTop:50px">
        <h2>本周感想、建议、收获</h2>
        <div v-for="(item) in weeklyThoughtList" :key="item.thoughtId">
          <el-button v-if="item.thoughtType == 0" :class="{'is-thoughts': item.thoughtType == 0}">感想</el-button>
          <el-button v-if="item.thoughtType == 1" :class="{'is-suggest': item.thoughtType == 1}">建议</el-button>
          <el-button v-if="item.thoughtType == 2" :class="{'is-harvest': item.thoughtType == 2}">收获</el-button>
          <span>{{item.thoughtContent}}</span>
        </div>
      </div>
      <!-- 下周计划 -->
      <div v-if="weeklyType == '1'" style="marginTop:50px">
        <h2>下周计划</h2>
        <el-table ref="workTable" :data="weeklyPlanList">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="工作项" prop="planContent"></el-table-column>-
        </el-table>
      </div>
      <!-- 个人okr完成度 -->
      <div v-if="weeklyOkrVoList.length > 0" style="marginTop:50px">
        <h2>个人okr完成度</h2>
        <div v-for="item in weeklyOkrVoList" :key="item.okrDetailId">
          <!-- 目标+KR -->
          <div v-if="item.parentOkrDetail&&item.parentOkrDetail.okrDetailId">
            <el-row :gutter="20">
              <el-col :span="20">
                <div>
                  <span>目标</span>
                  <span style="marginLeft:15px">{{item.parentOkrDetail.okrDetailObjectKr}}</span>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <div>
                  <span>KR</span>
                  <span style="marginLeft:15px">{{item.okrDetail.okrDetailObjectKr}}</span>
                  <span style="marginLeft:15px">被工作项{{itemIndex(item)}}支持</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <span style="marginLeft:15px">
                    风险状态
                    <el-button :class="{'no-risk':item.confidenceAfter == 1}"></el-button>
                    <el-button :class="{'risk-is-controlled':item.confidenceAfter == 2}"></el-button>
                    <el-button :class="{'risk-cannot-be-controlled':item.confidenceAfter == 3}"></el-button>
                    <span>{{riskMap[item.confidenceAfter]}}</span>
                  </span>
                </div>
              </el-col>
              <el-col :span="7">
                <div>
                  <span style="marginLeft:15px">
                    当前进度
                    <el-progress :percentage="item.progressAfter" :format="format"></el-progress>
                  </span>
                </div>
              </el-col>
              <el-col :span="2">
                <div>
                  <span style="marginLeft:15px">
                    本周变化
                    <span>{{item.progressAfter-item.progressBefor}}%</span>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- 目标 -->
          <div v-else>
            <el-row :gutter="20">
              <el-col :span="6">
                <div>
                  目标
                  <span style="marginLeft:15px">{{item.okrDetail.okrDetailObjectKr}}</span>
                  <span style="marginLeft:15px">被工作项{{itemIndex(item)}}支持</span>
                </div>
              </el-col>

              <el-col :span="7" :offset="6">
                <div>
                  <span style="marginLeft:15px">
                    当前进度
                    <el-progress :percentage="item.progressAfter" :format="format"></el-progress>
                  </span>
                </div>
              </el-col>
              <el-col :span="2">
                <div>
                  <span style="marginLeft:15px">
                    本周变化
                    <span>{{item.progressAfter-item.progressBefor}}%</span>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <!-- 谁浏览了 -->
      <div style="marginTop:50px">
        <h2>谁浏览了</h2>
        <span style="marginLeft:10px" v-for="user in visitUserNameList" :key="user">
          <el-avatar :size="30" :src="user.headerUrl" @error="errorHandler">
            <img src="@/assets/images/login-error.png" />
          </el-avatar>
          <span>{{user.userName}}</span>
        </span>
      </div>
    </div>
    <!-- 点赞 -->
    <div style="marginTop:50px">
      <div v-show="showOptions">
        <span
          :class="{'support-is-selected': weeklySupport.supported == 1}"
          style="marginLeft:10px"
          @click="support(1)"
        >点赞</span>
        <span
          :class="{'support-is-selected': weeklySupport.supported == 2}"
          style="marginLeft:10px"
          @click="support(2)"
        >加油</span>
        <span
          :class="{'support-is-selected': weeklySupport.supported == 3}"
          style="marginLeft:10px"
          @click="support(3)"
        >祝贺</span>
        <span
          :class="{'support-is-selected': weeklySupport.supported == 4}"
          style="marginLeft:10px"
          @click="support(4)"
        >赞同</span>
        <span
          :class="{'support-is-selected': weeklySupport.supported == 5}"
          style="marginLeft:10px"
          @click="support(5)"
        >比心</span>
      </div>
      <el-button @mouseenter.native="showOptionsDia" @click="support(1)">点赞({{supportCount}})</el-button>
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
  props: {},
  data() {
    return {
      server,
      weeklyWorkVoList: [],
      weeklyThoughtList: [],
      weeklyPlanList: [],
      weeklyOkrVoList: [],
      visitUserNameList: [],
      weeklyType: '',
      showOptions: false,
      supportCount: 0,
      weeklySupport: {},
      riskMap: {
        1: '无风险',
        2: '风险可控',
        3: '失控',
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
      // 查询周报
      this.queryWeekly();
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
          this.showOptions = false;
          this.queryWeekly();
        }
      });
    },
    supportDefault() {},
    showOptionsDia() {
      this.showOptions = true;
    },
    // closeOptionsDia() {
    //   setTimeout(() => {
    //     this.showOptions = false;
    //   }, 1000);
    // },
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
