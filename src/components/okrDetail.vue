<template>
  <el-drawer
    :visible.sync="myokrDrawer"
    :wrapperClosable="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    custom-class="custom-drawer okr-detail"
    class="tl-drawer"
    @closed="closed"
    :before-close="close"
  >
    <div slot="title" class="flex-sb">
      <div class="drawer-title">{{drawerTitle}}</div>
    </div>
    <el-scrollbar ref="detailscrollbar">
      <div class="cont-box">
        <tl-tabs :current.sync="currentIndex" :tabMenuList="tabMenuList">
          <template slot="tab-cont">
            <div v-if="currentIndex===0 && showSupport" class="tab-cont">
              <div class="dl-list">
                <dl>
                  <dt>
                    <i class="el-icon-s-flag"></i>
                    <em>OKR类型</em>
                  </dt>
                  <dd>{{CONST.OKR_TYPE_MAP[okrmain.okrBelongType]}}</dd>
                </dl>
                <dl>
                  <dt>
                    <i class="el-icon-s-custom"></i>
                    <em>负责人</em>
                  </dt>
                  <dd>{{okrmain.userName}}</dd>
                </dl>
                <dl>
                  <dt>
                    <i class="el-icon-timer"></i>
                    <em>更新时间</em>
                  </dt>
                  <dd>{{okrmain.updateTime || okrmain.createTime}}</dd>
                </dl>
                <dl>
                  <dt>
                    <i class="el-icon-odometer"></i>
                    <em>进度</em>
                  </dt>
                  <dd>
                    <tl-process :data="okrmain.okrProgress"></tl-process>
                  </dd>
                </dl>
              </div>
              <tl-okr-collapse :tableList="tableList">
                <template slot="head-bar" slot-scope="props">
                  <el-tooltip
                    v-if="props.okritem.versionCount > 1"
                    class="history-version"
                    effect="dark"
                    content="历史版本"
                    placement="top"
                    popper-class="tl-tooltip-popper"
                    @click.native="openHistory(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
                  >
                    <i class="el-icon-time"></i>
                  </el-tooltip>
                </template>
                <template slot="body-bar" slot-scope="props">
                  <el-tooltip
                    v-if="props.okritem.versionCount > 1"
                    class="history-version"
                    effect="dark"
                    content="历史版本"
                    placement="top"
                    popper-class="tl-tooltip-popper"
                    @click.native="openHistory(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
                  >
                    <i class="el-icon-time"></i>
                  </el-tooltip>
                </template>
              </tl-okr-collapse>
            </div>
            <div v-else class="tab-cont tl-custom-timeline">
              <dl class="timeline-list">
                <dt>
                  <div class="list-info">
                    <div class="list-title">{{cycleFirst.createTime}}</div>
                    <div class="list-cont">
                      <div
                        class="operate-type"
                        :class="{
                        'is-create':cycleFirst.operateType == 'add',
                        'is-modify':cycleFirst.operateType == 'modify',
                        'is-update':cycleFirst.operateType == 'update',
                        }"
                      >
                        <em>{{userName}}</em>
                        <span>{{cycleFirst.operateTypeCn}}</span>
                        <span v-if="cycleFirst.operateType == 'add'">OKR</span>
                      </div>
                      <!-- 更新进度操作记录 -->
                      <ul v-if="cycleFirst.operateType == 'update'" class="operate-kind">
                        <li v-for="uitem in cycleFirst.okrDetailId" :key="uitem.id">
                          <div>
                            <span>{{CONST.OKR_KIND_MAP[uitem.type || 0]}}</span>
                            <em>{{uitem.okrDetailObjectKr}}</em>
                          </div>
                          <div v-if="uitem.updateContents.afterProgress">
                            <span>进度更新为</span>
                            <em>{{uitem.updateContents.afterProgress}}</em>
                            <span>%</span>
                          </div>
                          <div v-if="uitem.updateContents.afterConfidence">
                            <span>风险状态为</span>
                            <div class="state-grid">
                              <div
                                :class="{
                                'is-no-risk': uitem.updateContents.afterConfidence == 1,
                                'is-risks': uitem.updateContents.afterConfidence == 2,
                                'is-uncontrollable': uitem.updateContents.afterConfidence == 3}"
                              ></div>
                              <div
                                :class="{
                                'is-risks': uitem.updateContents.afterConfidence == 2,
                                'is-uncontrollable': uitem.updateContents.afterConfidence == 3}"
                              ></div>
                              <div
                                :class="{'is-uncontrollable': uitem.updateContents.afterConfidence == 3}"
                              ></div>
                            </div>
                            <em>{{CONST.CONFIDENCE_MAP[uitem.updateContents.afterConfidence]}}</em>
                          </div>
                        </li>
                      </ul>
                      <!-- 新增操作记录 -->
                      <ul v-else-if="cycleFirst.operateType == 'add'" class="operate-kind">
                        <li>
                          <div>
                            <span>OKR</span>
                            <em>{{periodName}}</em>
                          </div>
                        </li>
                      </ul>
                      <!-- 变更操作记录 -->
                      <ul v-else-if="cycleFirst.operateType == 'modify'" class="operate-kind">
                        <li v-for="uitem in cycleFirst.okrDetailId" :key="uitem.id">
                          <!-- o或kr名称 -->
                          <div>
                            <span
                              v-if="JSON.stringify(uitem.updateContents)=='{}'"
                            >新增{{CONST.OKR_KIND_MAP[uitem.type || 0]}}</span>
                            <span v-else>{{CONST.OKR_KIND_MAP[uitem.type || 0]}}</span>
                            <em
                              v-if="uitem.updateContents.beforeName"
                            >{{uitem.updateContents.beforeName}}</em>
                            <em v-else>{{uitem.okrDetailObjectKr}}</em>
                          </div>
                          <div v-if="uitem.updateContents.afterName">
                            <span>名称变更为</span>
                            <em>{{uitem.updateContents.afterName}}</em>
                          </div>
                          <div v-if="uitem.updateContents.beforeWeight">
                            <span>权重由</span>
                            <em>{{uitem.updateContents.beforeWeight}}</em>
                            <span>%</span>
                            <span>变更为</span>
                            <em>{{uitem.updateContents.afterWeight}}</em>
                            <span>%</span>
                          </div>
                          <div v-if="uitem.updateContents.beforeCheckQuota">
                            <span>考核指标由</span>
                            <em>{{uitem.updateContents.beforeCheckQuota}}</em>
                            <span>变更为</span>
                            <em>{{uitem.updateContents.afterCheckQuota}}</em>
                          </div>
                          <div v-if="uitem.updateContents.beforeJudgeMethod">
                            <span>衡量办法由</span>
                            <em>{{uitem.updateContents.beforeJudgeMethod}}</em>
                            <span>变更为</span>
                            <em>{{uitem.updateContents.afterJudgeMethod}}</em>
                          </div>
                          <div v-if="uitem.updateContents.beforeUndertakeName">
                            <span>关联父目标由</span>
                            <em>{{uitem.updateContents.beforeUndertakeName}}</em>
                            <span>变更为</span>
                            <em>{{uitem.updateContents.afterUndertakeName}}</em>
                          </div>
                          <div v-else-if="uitem.updateContents.afterUndertakeName">
                            <span>关联父目标</span>
                            <em>{{uitem.updateContents.afterUndertakeName}}</em>
                          </div>
                        </li>
                      </ul>
                      <div class="operate-reason" v-if="cycleFirst.remark">
                        <span>说明：</span>
                        <em>{{cycleFirst.remark}}</em>
                      </div>
                    </div>
                  </div>
                </dt>
                <dd v-for="activity in cycleList" :key="activity.id">
                  <div class="list-info">
                    <div class="list-title">{{activity.createTime}}</div>
                    <div class="list-cont">
                      <div class="operate-type">
                        <em>{{userName}}</em>
                        <span>{{activity.operateTypeCn}}</span>
                      </div>
                      <!-- 更新进度操作记录 -->
                      <ul v-if="activity.operateType == 'update'" class="operate-kind">
                        <li v-for="uitem in activity.okrDetailId" :key="uitem.id">
                          <div>
                            <span>{{CONST.OKR_KIND_MAP[uitem.type || 0]}}</span>
                            <em>{{uitem.okrDetailObjectKr}}</em>
                          </div>
                          <div v-if="uitem.updateContents.afterProgress">
                            <span>进度更新为</span>
                            <em>{{uitem.updateContents.afterProgress}}</em>
                            <span>%</span>
                          </div>
                          <div v-if="uitem.updateContents.afterConfidence">
                            <span>风险状态修改为</span>
                            <div class="state-grid">
                              <div
                                :class="{
                                'is-no-risk': uitem.updateContents.afterConfidence == 1,
                                'is-risks': uitem.updateContents.afterConfidence == 2,
                                'is-uncontrollable': uitem.updateContents.afterConfidence == 3}"
                              ></div>
                              <div
                                :class="{
                                'is-risks': uitem.updateContents.afterConfidence == 2,
                                'is-uncontrollable': uitem.updateContents.afterConfidence == 3}"
                              ></div>
                              <div
                                :class="{'is-uncontrollable': uitem.updateContents.afterConfidence == 3}"
                              ></div>
                            </div>
                            <em>{{CONST.CONFIDENCE_MAP[uitem.updateContents.afterConfidence]}}</em>
                          </div>
                        </li>
                      </ul>
                      <!-- 新增操作记录 -->
                      <ul v-else-if="activity.operateType == 'add'" class="operate-kind">
                        <li>
                          <div>
                            <span>OKR</span>
                            <em>{{periodName}}</em>
                          </div>
                        </li>
                      </ul>
                      <!-- 变更操作记录 -->
                      <ul v-else-if="activity.operateType == 'modify'" class="operate-kind">
                        <li v-for="uitem in activity.okrDetailId" :key="uitem.id">
                          <div>
                            <span
                              v-if="JSON.stringify(uitem.updateContents)=='{}'"
                            >新增{{CONST.OKR_KIND_MAP[uitem.type || 0]}}</span>
                            <span v-else>{{CONST.OKR_KIND_MAP[uitem.type || 0]}}</span>
                            <em
                              v-if="uitem.updateContents.beforeName"
                            >{{uitem.updateContents.beforeName}}</em>
                            <em v-else>{{uitem.okrDetailObjectKr}}</em>
                          </div>
                          <div v-if="uitem.updateContents.afterName">
                            <span>名称变更为</span>
                            <em>{{uitem.updateContents.afterName}}</em>
                          </div>
                          <div v-if="uitem.updateContents.beforeWeight">
                            <span>权重由</span>
                            <em>{{uitem.updateContents.beforeWeight}}</em>
                            <span>%</span>
                            <span>变更为</span>
                            <em>{{uitem.updateContents.afterWeight}}</em>
                            <span>%</span>
                          </div>
                          <div v-if="uitem.updateContents.beforeUndertakeName">
                            <span>关联父目标由</span>
                            <em>{{uitem.updateContents.beforeUndertakeName}}</em>
                            <span>变更为</span>
                            <em>{{uitem.updateContents.afterUndertakeName}}</em>
                          </div>
                          <div v-else-if="uitem.updateContents.afterUndertakeName">
                            <span>关联父目标</span>
                            <em>{{uitem.updateContents.afterUndertakeName}}</em>
                          </div>
                        </li>
                      </ul>
                      <div class="operate-reason" v-if="activity.remark">
                        <span>说明：</span>
                        <em>{{activity.remark}}</em>
                      </div>
                    </div>
                  </div>
                </dd>
              </dl>
            </div>
          </template>
        </tl-tabs>
      </div>
    </el-scrollbar>
    <!-- 点赞要一直浮着 -->
    <div v-if="showSupport" class="img-list">
      <dl>
        <dt class="user-info" @click="like()">
          <div class="user-name">
            <em class="el-icon-star-on"></em>
          </div>
        </dt>
        <dd v-if="!supportType">点赞</dd>
        <dd v-else>取消</dd>
      </dl>
      <template v-if="showMore">
        <dl v-for="(item,index) in cutVoteList" :key="item.userId+index">
          <dt class="user-info">
            <div class="user-name">
              <em>{{cutName(item.userName)}}</em>
            </div>
          </dt>
          <dd>{{item.userName}}</dd>
        </dl>
        <dl v-if="voteLength > 10 && showMore" class="show-more">
          <dt class="user-info">
            <div class="user-name">
              <em @click="showMore=!showMore">{{voteLength}}+</em>
            </div>
          </dt>
          <dd>更多</dd>
        </dl>
      </template>
      <template v-else>
        <dl v-for="(item,index) in voteUser" :key="item.userId+index">
          <dt class="user-info">
            <div class="user-name">
              <em>{{cutName(item.userName)}}</em>
            </div>
            <!-- <img src="@/assets/images/user/user3.jpg" alt /> -->
          </dt>
          <dd>{{item.userName}}</dd>
        </dl>
        <dl>
          <dt class="user-info">
            <!-- <img v-if="userInfo.headUrl" :src="userInfo.headUrl" alt /> -->
            <img src="@/assets/images/user/user3.jpg" alt />
            <!-- <div class="user-name">娜丽</div> -->
          </dt>
          <dd>欧阳娜丽</dd>
        </dl>
        <dl class="is-fold">
          <dt class="user-info">
            <div class="user-name">
              <em @click="showMore=!showMore" class="el-icon-d-arrow-left"></em>
            </div>
          </dt>
          <dd>收起</dd>
        </dl>
      </template>
    </div>

    <tl-okr-history
      :exist.sync="innerDrawer"
      v-if="innerDrawer"
      ref="okrhistory"
      :server="server"
      :okrDetailId="okrDetailId"
      :okrmain="okrmain"
    ></tl-okr-history>
  </el-drawer>
</template>

<script>
import { mapState } from 'vuex';
import process from '@/components/process';
import okrCollapse from '@/components/okrCollapse';
import tabs from '@/components/tabs';
import okrHistory from './okrHistory';

export default {
  name: 'okrDetail',
  data() {
    return {
      tableList: [], // okr列表
      voteUser: [], // 点赞人列表
      okrmain: {}, // 公共信息
      dialogTitle: 'OKR详情', // 弹框标题
      cycleList: [], // 操作历史
      supportType: 0, // 点赞1 取消赞0
      innerDrawer: false,
      activeName: 'detail',
      okrDetailId: '',
      userName: '张三',
      myokrDrawer: false,
      showMore: true,
      cutVoteList: [],
      voteLength: 0,
      currentIndex: 0,
      cycleFirst: {},
      periodName: '',
      currentPage: 1,
      status: 1,

    };
  },
  components: {
    'tl-okr-history': okrHistory,
    'tl-okr-collapse': okrCollapse,
    'tl-process': process,
    'tl-tabs': tabs,
  },
  props: {
    dialogExist: {
      type: Boolean,
      default: true,
    },
    server: {
      type: Object,
      required: true,
    },
    okrId: {
      type: String,
      defualt: '',
    },
    CONST: {
      type: Object,
      default() {
        return {};
      },
    },
    okrItem: {
      type: Object,
      default() {
        return {};
      },
    },
    // 是否点赞
    showSupport: {
      type: Boolean,
      default: false,
    },
    drawerTitle: {
      type: String,
      defualt: 'OKR详情',
    },
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
    tabMenuList() {
      if (this.showSupport) {
        return [
          {
            menuName: '详情',
          },
          {
            menuName: '操作历史',
          },
        ];
      }
      return [{
        menuName: '操作历史',
      }];
    },
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('scroll', this.onScroll, true);
    });
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll, true);
  },
  methods: {
    showOkrDialog() {
      this.getokrDetail();
      this.getSupportList();
      this.getOperationHistory();
      this.myokrDrawer = true;
    },
    closed() {
      this.$emit('update:exist', false);
    },
    close() {
      this.myokrDrawer = false;
    },
    // 查okr详情
    getokrDetail() {
      if (this.okrId) {
        this.server.getokrDetail({ okrId: this.okrId }).then((res) => {
          if (res.code == 200) {
            this.tableList = res.data.okrDetails || [];
            this.okrmain = res.data.okrMain || {};
          }
        });
      } else if (this.okrItem) {
        this.formData = JSON.parse(JSON.stringify(this.okrItem));
        this.tableList = this.formData.tableList || [];
        this.okrmain = this.formData.okrMain || {};
        // this.okrId = this.formData.okrMain.okrMainId;
      }
    },
    // 点赞
    like() {
      this.supportType = this.supportType === 1 ? 0 : 1;
      this.server.okrSupport({
        okrId: this.okrId,
        supportType: this.supportType,
      }).then((res) => {
        if (res.code == 200) {
          this.getSupportList();
        }
      });
    },
    // 查点赞列表
    getSupportList() {
      const self = this;
      if (self.okrId) {
        self.server.getSupportList({ okrId: self.okrId }).then((res) => {
          if (res.code == 200) {
            self.voteUser = res.data.supportUserList || [];
            self.voteLength = self.voteUser.length;
            // 如果已经点赞过就显示取消
            self.voteUser.forEach((item) => {
              if (item.userId == self.userInfo.userId) {
                self.supportType = 1;
              }
            });
            if (self.voteLength > 10) {
              self.cutVoteList = self.voteUser.slice(0, 9);
            } else {
              self.cutVoteList = self.voteUser.slice(0, self.voteLength);
            }
          }
        });
      }
    },

    getOperationHistory() {
      if (this.okrId) {
        this.server.okrOperationHistory({
          currentPage: 1,
          okrMainId: this.okrId,
          pageSize: 10 * this.currentPage,
        }).then((res) => {
          if (res.code == 200) {
            this.userName = res.data.userName || '';
            this.periodName = res.data.periodName || '';
            this.cycleList = res.data.contentVoList || [];

            this.cycleList.forEach((item) => {
              if (item.okrDetailId && item.okrDetailId.length > 0) {
                item.okrDetailId.forEach((uitem) => {
                  const contents = JSON.parse(uitem.updateJsonStr);
                  uitem.updateContents = contents || {};
                });
              }
            });
            this.cycleFirst = this.cycleList.splice(0, 1)[0] || {};
            this.status = 1;
          }
        });
      }
    },

    // 打开历史版本
    openHistory(id, name) {
      console.log(name);
      this.okrDetailId = id;
      this.innerDrawer = true;
      this.$nextTick(() => {
        this.$refs.okrhistory.show();
      });
    },
    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
    },
    splitContent(content) {
      if (content) {
        return content.split(';');
      }
      return '';
    },
    // 获取滚动条当前的位置
    getScrollTop() {
      let scrollTop = 0;
      scrollTop = this.$refs.detailscrollbar.wrap.scrollTop;

      return scrollTop;
    },
    // 获取当前可视范围的高度
    getClientHeight() {
      let clientHeight = 0;

      clientHeight = this.$refs.detailscrollbar.$el.offsetWidth;
      return clientHeight;
    },

    // 滚动事件触发下拉加载
    onScroll() {
      if (this.getScrollTop() / this.getClientHeight() >= this.currentPage) {
        if (this.status === 1) {
          this.status = 0;
          // 页码，分页用，默认第一页
          this.currentPage += 1;
          // 调用请求函数
          this.getOperationHistory();
        }
      }
    },

  },
  watch: {

  },
};
</script>

<style>
/* .collapse span,
.collapsetitle span {
  margin-left: 10px;
}

.collapsetitle {
  margin-left: 250px;
}
.progresswidth {
  width: 150px;
  display: inline-block;
}
.detail {
  display: flex;
}
.ulclass li:nth-child(n) {
  float: left;
  display: inline;
}
.ulclass li:nth-child(10n + 1) {
  clear: both;
}
 */
.show-more {
  display: none;
}
</style>