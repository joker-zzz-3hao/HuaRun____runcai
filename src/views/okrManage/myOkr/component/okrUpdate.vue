<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="myokrDrawer"
    @closed="closed"
    :before-close="close"
    custom-class="custom-drawer update-progress"
    class="tl-dialog"
    width="1000px"
  >
    <template slot="title">
      <!-- <span>更新进度</span>
      <span>更多更新记录</span> -->
    </template>
    <div>OKR记事本</div>
    <tl-tabs :current.sync="currentIndex" :tabMenuList="tabMenuList"> </tl-tabs>
    <div class="flex-up">
      <div class="okr-info">
        <el-scrollbar ref="detailscrollbar">
          <div class="tl-custom-timeline" v-if="currentIndex === 0">
            <div v-if="hasValue(historyFirst)">
              <div>
                <em>上次更新时间</em>
                <span>{{ historyFirst.createTime }}</span>
              </div>
              <div v-if="historyFirst.updateContents">
                <em>进度</em>
                <span>
                  由
                  {{ historyFirst.updateContents.beforeProgress }}%更新为
                  {{ historyFirst.updateContents.afterProgress }}%
                </span>
              </div>
              <div>
                <em>操作人</em>
                <span>
                  {{ historyFirst.userName }}
                </span>
              </div>
              <div>
                <em>更新说明</em>
                <span>
                  {{ historyFirst.reason }}
                </span>
              </div>
            </div>
            <el-form :model="formData" ref="dataForm" class="tl-form">
              <dl class="timeline-list">
                <dd>
                  <div class="list-info">
                    <div class="list-title">
                      <em>{{
                        formData.okrDetailType === 0 ? "目标O" : "关键结果"
                      }}</em>
                      <span>{{ formData.okrDetailObjectKr }}</span>
                    </div>
                    <div class="list-cont">
                      <div class="tl-progress-group">
                        <tl-process
                          :data="parseInt(formData.okrDetailProgress, 10)"
                          :showNumber="false"
                          :width="68"
                          :marginLeft="6"
                        ></tl-process>
                        <el-slider
                          v-model="formData.okrDetailProgress"
                          :step="1"
                          @change="changeProgress(formData)"
                          tooltip-class="slider-tooltip"
                        ></el-slider>
                        <el-input-number
                          v-model="formData.okrDetailProgress"
                          controls-position="right"
                          :min="0"
                          :max="100"
                          :step="1"
                          :precision="0"
                          class="tl-input-number"
                          @blur="progressChange"
                        ></el-input-number>
                        <span>%</span>
                      </div>
                      <div class="okr-risk">
                        <div class="add-progress" @click="addProgress(1)">
                          +1%
                        </div>
                        <div class="add-progress" @click="addProgress(5)">
                          +5%
                        </div>
                        <div class="add-progress" @click="addProgress(10)">
                          +10%
                        </div>
                      </div>
                      <div
                        class="okr-risk"
                        v-if="hasValue(formData.okrDetailConfidence)"
                      >
                        <span>信心指数</span>
                        <tl-confidence
                          v-model="formData.okrDetailConfidence"
                        ></tl-confidence>
                      </div>
                    </div>
                  </div>
                </dd>
              </dl>
              <dl class="change-reason">
                <!-- <dt>更新说明</dt> -->
                <dd>
                  <el-form-item
                    label="更新说明"
                    prop="updateexplain"
                    :rules="[
                      {
                        trigger: 'blur',
                        message: '请输入更新说明',
                        required: true,
                      },
                    ]"
                  >
                    <el-input
                      placeholder="请输入更新说明"
                      maxlength="200"
                      v-model="formData.updateexplain"
                      type="textarea"
                      :autosize="{ minRows: 1 }"
                      resize="none"
                      class="tl-textarea"
                    ></el-input>
                  </el-form-item>
                </dd>
              </dl>
            </el-form>
          </div>
          <div class="update-histoy" v-else>
            <div class="tl-custom-timeline">
              <dl class="timeline-list" v-if="historyList.length">
                <dd v-for="activity in historyList" :key="activity.id">
                  <div class="list-info">
                    <div class="list-title">{{ activity.createTime }}</div>
                    <div class="list-cont">
                      <div class="operate-type">
                        <em>{{ activity.userName }}</em>
                        <span>更新</span>
                      </div>
                      <ul class="operate-kind">
                        <li>
                          <div>
                            <span>关键结果</span>
                            <em>{{ formData.okrDetailObjectKr }}</em>
                          </div>
                          <div>
                            <span>进度由</span>
                            <em>{{
                              activity.updateContents.beforeProgress
                            }}</em>
                            <span>%</span>
                            <span>更新为</span>
                            <em>{{ activity.updateContents.afterProgress }}</em>
                            <span>%</span>
                          </div>
                          <div>
                            <span>信心指数修改为</span>
                            <div class="state-grid">
                              <div
                                :class="{
                                  'is-no-risk':
                                    activity.updateContents.afterConfidence ==
                                    1,
                                  'is-risks':
                                    activity.updateContents.afterConfidence ==
                                    2,
                                  'is-uncontrollable':
                                    activity.updateContents.afterConfidence ==
                                    3,
                                }"
                              ></div>
                              <div
                                :class="{
                                  'is-risks':
                                    activity.updateContents.afterConfidence ==
                                    2,
                                  'is-uncontrollable':
                                    activity.updateContents.afterConfidence ==
                                    3,
                                }"
                              ></div>
                              <div
                                :class="{
                                  'is-uncontrollable':
                                    activity.updateContents.afterConfidence ==
                                    3,
                                }"
                              ></div>
                            </div>
                            <em>{{
                              CONST.CONFIDENCE_MAP[
                                activity.updateContents.afterConfidence
                              ]
                            }}</em>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="note-book" :class="{ 'hide-input': showInput == false }">
        <div @click="showInput = true">
          <el-tiptap v-model="noteText" :extensions="extensions" />
        </div>
        <div>
          <span>更新于{{ noteCreateTime }}</span>
          <el-button
            v-if="showInput === true"
            plain
            class="tl-btn amt-border-fadeout"
            @click="updateNote"
            >保存笔记
          </el-button>
          <el-button
            v-else
            @click="showInput = true"
            plain
            class="tl-btn amt-border-fadeout"
            >编辑</el-button
          >
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        :disabled="!hasPower('okr-update')"
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="summitUpdate"
        :loading="loading"
        >更新进展</el-button
      >
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import {
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Bold,
  Underline,
  Italic,
  FontSize,
  TextColor,
  ListItem,
  OrderedList,
  TextHighlight,
  Image,
  Strike,
  TextAlign,
} from 'element-tiptap';
import confidenceSelect from '@/components/confidenceSelect';
import process from '@/components/process';
import tabs from '@/components/tabs';
import { mapMutations } from 'vuex';
import CONST from '../const';

export default {
  name: 'okrUpdate',
  components: {
    'tl-confidence': confidenceSelect,
    'tl-process': process,
    'tl-tabs': tabs,
  },
  data() {
    return {
      CONST,
      dialogDetailVisible: false,
      formData: {
        updateexplain: '',

      },
      noteText: '',
      myokrDrawer: false,
      drawerTitle: '更新进度',
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Bold(),
        new Underline(),
        new Italic(),
        new Strike(),
        new TextAlign(),
        new FontSize({ fontSizes: ['8', '10', '12', '14', '16', '18', '20'] }),
        new TextColor(),
        new TextHighlight(),
        new ListItem(),
        new OrderedList(),
        new Image({ }),
      ],
      loading: false,
      historyFirst: '',
      histoyExist: false,
      // tab
      currentIndex: 0,
      tabMenuList: [{
        menuName: '更新进展',
      },
      {
        menuName: '更多更新记录',
      }],
      pageSize: 10,
      status: 1,
      currentPage: 1,
      showInput: false,
      noteCreateTime: '',
    };
  },
  props: {
    server: {
      type: Object,
      required: true,
    },
    okrId: {
      type: String,
    },
    dialogExist: {
      type: Boolean,
      default: true,
    },
    okrItem: {
      type: Object,
      required: true,
    },
    periodId: {
      type: String,
      default: '',
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
    ...mapMutations('common', ['setMyokrDrawer']),
    // 控制弹窗
    showOkrDialog() {
      this.getokrDetail();
      this.getHistory();
      this.getOkrRemark();
      this.myokrDrawer = true;
    },

    closed() {
      this.$emit('update:exist', false);
    },
    close() {
      this.myokrDrawer = false;
    },
    getokrDetail() {
      if (this.okrItem) {
        this.formData = JSON.parse(JSON.stringify(this.okrItem));
      }
      this.noteText = `
        <h1>记录OKR进展相关的点点滴滴</h1>
        <div><img src="@/assets/images/user/user.jpg" alt /></div>
      `;
    },
    getHistory() {
      const params = {
        currentPage: 1,
        okrDetailId: this.formData.okrDetailId,
        pageSize: this.pageSize * this.currentPage,
      };
      this.server.getOkrUpdateHistory(params).then((res) => {
        if (res.code == 200) {
          if (res.data.length > 0) {
            this.historyFirst = res.data[0] || {};
            this.historyFirst.updateContents = JSON.parse(this.historyFirst.content);
            this.historyList = res.data;
            console.log(this.historyList.length);
            this.historyList.forEach((item) => {
              const content = JSON.parse(item.content);
              item.updateContents = content || {};
            });
            this.$forceUpdate();
            this.status = 1;
          }
        }
      });
    },
    summitUpdate() {
      if (!this.formData.updateexplain) {
        this.$message.error('请填写更新说明');
      }
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const summitForm = {
            detailId: this.formData.detailId,
            okrDetailConfidence: this.formData.okrDetailConfidence || 1,
            okrDetailId: this.formData.okrDetailId,
            okrDetailProgress: this.formData.okrDetailProgress,
            okrMainId: this.formData.okrMainId,
            periodId: this.periodId,
            remark: this.formData.updateexplain,
          };
          console.log(summitForm);
          this.loading = true;
          this.server.singleUpdate(summitForm).then((res) => {
            this.loading = false;
            if (res.code == 200) {
              this.$message('更新成功');
              this.$emit('success');
              this.close();
            }
          });
        }
      });
    },
    // 取整
    changeProgress(item) {
      item.okrDetailProgress = Math.round(item.okrDetailProgress);
    },
    // 进度默认值
    progressChange() {
      if (!this.formData.okrDetailProgress) {
        this.formData.okrDetailProgress = 0;
      }
    },
    // 加进度
    addProgress(num) {
      this.formData.okrDetailProgress += num;
    },
    openHistory() {
      this.histoyExist = true;
      this.$nextTick(() => {
        this.$refs.updatehistory.show();
      });
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
      console.log('滚动', this.getScrollTop() / this.getClientHeight());
      if (this.getScrollTop() / this.getClientHeight() >= this.currentPage * 5) {
        if (this.status === 1) {
          this.status = 0;
          // 页码，分页用，默认第一页
          this.currentPage += 1;
          // 调用请求函数
          this.getHistory();
        }
      }
    },
    updateNote() {
      console.log(this.noteText);
      this.server.saveOkrRemark({
        content: this.noteText,
        okrDetailId: this.formData.okrDetailId,
        okrMainId: this.formData.okrMainId,
      }).then((res) => {
        if (res.code == 200) {
          this.showInput = false;
          this.getOkrRemark();
        }
      });
    },
    getOkrRemark() {
      this.server.getOkrRemark({ okrDetailId: this.formData.okrDetailId }).then((res) => {
        if (res.code == 200 && res.data) {
          this.noteText = res.data.content;
          this.noteCreateTime = res.data.createTime;
        }
      });
    },
  },
  watch: {
    currentIndex: {
      handler(newVal) {
        if (newVal === 1) {
          this.pageSize = 10;
        } else {
          this.pageSize = 10;
        }
        // this.getHistory();
      },
    },
  },
};
</script>