<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :title="drawerTitle"
    :visible.sync="myokrDrawer"
    @closed="closed"
    :before-close="close"
    custom-class="update-progress"
    class="tl-dialog"
    width="620px"
  >
    <el-scrollbar>
      <div class="okr-info">
        <div class="tl-custom-timeline">
          <el-form :model="formData" ref="dataForm" class="tl-form">
            <dl class="timeline-list">
              <dd v-if="hasValue(historyFirst)">
                <div class="list-info">
                  <div class="list-title">
                    <em>上次更新时间：{{ historyFirst.createTime }}</em>
                    <div @click="openHistory">更多更新记录</div>
                  </div>
                  <div class="list-cont">
                    <div>
                      <em>操作人</em>
                      <span>
                        {{ historyFirst.userName }}
                      </span>
                    </div>
                    <div v-if="historyFirst.updateContents">
                      <em>更新前进度</em>
                      <span>
                        {{ historyFirst.updateContents.beforeProgress }} %
                      </span>
                    </div>
                    <div v-if="historyFirst.updateContents">
                      <em>更新后进度</em>
                      <span>
                        {{ historyFirst.updateContents.afterProgress }} %
                      </span>
                    </div>
                    <div v-if="historyFirst.updateContents">
                      <em>信心指数修改为</em>
                      <div class="state-grid">
                        <div
                          :class="{
                            'is-no-risk':
                              historyFirst.updateContents.afterConfidence == 1,
                            'is-risks':
                              historyFirst.updateContents.afterConfidence == 2,
                            'is-uncontrollable':
                              historyFirst.updateContents.afterConfidence == 3,
                          }"
                        ></div>
                        <div
                          :class="{
                            'is-risks':
                              historyFirst.updateContents.afterConfidence == 2,
                            'is-uncontrollable':
                              historyFirst.updateContents.afterConfidence == 3,
                          }"
                        ></div>
                        <div
                          :class="{
                            'is-uncontrollable':
                              historyFirst.updateContents.afterConfidence == 3,
                          }"
                        ></div>
                      </div>
                      <em>{{
                        CONST.CONFIDENCE_MAP[
                          historyFirst.updateContents.afterConfidence
                        ]
                      }}</em>
                    </div>
                    <div>
                      <em>更新说明</em>
                      <span>
                        {{ historyFirst.reason }}
                      </span>
                    </div>
                  </div>
                </div>
              </dd>
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
                    <div
                      class="okr-risk"
                      v-if="hasValue(formData.okrDetailConfidence)"
                    >
                      <span>信心指数</span>
                      <tl-confidence
                        v-model="formData.okrDetailConfidence"
                      ></tl-confidence>
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
                    :rows="3"
                    resize="none"
                    class="tl-textarea"
                  ></el-input>
                </el-form-item>
              </dd>
            </dl>
          </el-form>
        </div>
      </div>
    </el-scrollbar>
    <div slot="footer" class="dialog-footer">
      <el-button
        :disabled="!hasPower('okr-update')"
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="summitUpdate"
        :loading="loading"
        >确定</el-button
      >
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
    <tl-updatehistoy
      :exist.sync="histoyExist"
      v-if="hasValue(histoyExist)"
      ref="updatehistory"
      :okrDetailId="formData.okrDetailId"
      :krName="formData.okrDetailObjectKr"
    ></tl-updatehistoy>
  </el-dialog>
</template>

<script>
import confidenceSelect from '@/components/confidenceSelect';
import process from '@/components/process';
import { mapMutations } from 'vuex';
import updateHistoy from './updateHistoy';
import CONST from '../const';

export default {
  name: 'okrUpdate',
  components: {
    'tl-confidence': confidenceSelect,
    'tl-process': process,
    'tl-updatehistoy': updateHistoy,
  },
  data() {
    return {
      CONST,
      dialogTitle: '更新OKR', // 弹框标题
      dialogDetailVisible: false,
      formData: {
        updateexplain: '',
      },
      myokrDrawer: false,
      drawerTitle: '更新进度',
      loading: false,
      historyFirst: '',
      histoyExist: false,
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

  methods: {
    ...mapMutations('common', ['setMyokrDrawer']),
    // 控制弹窗
    showOkrDialog() {
      this.getokrDetail();
      this.getHistory();
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
    },
    getHistory() {
      const params = {
        currentPage: 1,
        okrDetailId: this.formData.okrDetailId,
        pageSize: 1,
      };
      this.server.getOkrUpdateHistory(params).then((res) => {
        if (res.code == 200) {
          if (res.data.length > 0) {
            this.historyFirst = res.data[0] || {};
            this.historyFirst.updateContents = JSON.parse(this.historyFirst.content);
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
  },
  watch: {
  },
};
</script>