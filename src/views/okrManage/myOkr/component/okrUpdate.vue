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
              <dt>
                <div class="list-info">
                  <div class="list-title">
                    <span>目标O</span>
                    <em>{{ formData.okrDetailObjectKr }}</em>
                  </div>
                  <div class="list-cont">
                    <div class="tl-progress-group">
                      <tl-process
                        :data="parseInt(formData.okrDetailProgress, 10)"
                        :showNumber="false"
                        :width="67"
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
                      ></el-input-number>
                      <span>%</span>
                    </div>
                  </div>
                </div>
              </dt>
              <dd v-for="(kitem, kindex) in formData.krList" :key="kindex">
                <div class="list-info">
                  <div class="list-title">
                    <span>关键结果{{ kindex + 1 }}</span>
                    <em>{{ kitem.okrDetailObjectKr }}</em>
                  </div>
                  <div class="list-cont">
                    <div class="tl-progress-group">
                      <tl-process
                        :data="parseInt(kitem.okrDetailProgress, 10)"
                        :showNumber="false"
                        :width="67"
                        :marginLeft="6"
                      ></tl-process>
                      <el-slider
                        v-model="kitem.okrDetailProgress"
                        :step="1"
                        @change="changeProgress(kitem)"
                        tooltip-class="slider-tooltip"
                      ></el-slider>
                      <el-input-number
                        v-model="kitem.okrDetailProgress"
                        controls-position="right"
                        :min="0"
                        :max="100"
                        :step="1"
                        :precision="0"
                        class="tl-input-number"
                      ></el-input-number>
                      <span>%</span>
                    </div>
                    <div class="okr-risk">
                      <span>信心指数</span>
                      <tl-confidence
                        v-model="kitem.okrDetailConfidence"
                      ></tl-confidence>
                    </div>
                  </div>
                </div>
              </dd>
            </dl>
            <dl class="change-reason">
              <dt>更新说明</dt>
              <dd>
                <el-form-item
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
                    type="textarea"
                    :rows="3"
                    resize="none"
                    v-model="formData.updateexplain"
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
  </el-dialog>
</template>

<script>
import confidenceSelect from '@/components/confidenceSelect';
import process from '@/components/process';
import { mapMutations } from 'vuex';

export default {
  name: 'okrUpdate',
  components: {
    'tl-confidence': confidenceSelect,
    'tl-process': process,
  },
  data() {
    return {
      dialogTitle: '更新OKR', // 弹框标题
      dialogDetailVisible: false,
      formData: {
        updateexplain: '',
      },
      myokrDrawer: false,
      drawerTitle: '更新进度',
      loading: false,
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
    summitUpdate() {
      if (!this.formData.updateexplain) {
        this.$message.error('请填写更新说明');
      }
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.summitForm = {
            oupdateProcessDto: {
              detailId: this.formData.detailId,
              okrDetailProgress: this.formData.okrDetailProgress,
            },
            remark: this.formData.updateexplain,
            periodId: this.periodId,
          };
          if (this.formData.krList && this.formData.krList.length > 0) {
            this.summitForm.krUpdateProcessDtos = [];
            this.formData.krList.forEach((item) => {
              this.summitForm.krUpdateProcessDtos.push({
                detailId: item.detailId,
                okrDetailConfidence: item.okrDetailConfidence,
                okrDetailProgress: item.okrDetailProgress,
              });
            });
          }
          this.loading = true;
          this.server.summitUpdate(this.summitForm).then((res) => {
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
  },
  watch: {
  },
};
</script>