<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :title="dialogTitle"
    :visible.sync="dialogDetailVisible"
    :before-close="close"
    @closed="closed"
    custom-class="update-progress"
    class="tl-dialog"
    width="600px"
  >
    <div class="okr-info">
      <div class="tl-custom-timeline">
        <el-form :model="formData" ref="dataForm" class="tl-form">
          <dl class="timeline-list">
            <dt>
              <div class="list-info">
                <div class="list-title">
                  <em>{{formData.okrDetailType === 0 ? '目标O' : '关键结果'}}</em>
                  <span>{{formData.okrDetailObjectKr}}</span>
                </div>
                <div class="list-cont">
                  <div class="tl-progress-group">
                    <tl-process
                      :data="parseInt(formData.okrDetailProgress,10)"
                      :showNumber="false"
                      :width="64"
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
                  <div class="okr-risk" v-if="formData.okrDetailConfidence">
                    <tl-confidence v-model="formData.okrDetailConfidence"></tl-confidence>
                  </div>
                </div>
              </div>
            </dt>
          </dl>
          <dl class="change-reason">
            <dt>更新说明</dt>
            <dd>
              <el-form-item
                label="更新说明"
                prop="updateexplain"
                :rules="[{trigger: 'blur',message:'请输入更新说明', required:true}]"
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
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="summitUpdate"
        :loading="loading"
      >更新</el-button>
      <el-button plain class="tl-btn amt-border-fadeout" @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import confidenceSelect from '@/components/confidenceSelect';
import process from '@/components/process';
import { mapState } from 'vuex';
import CONST from '../const';

export default {
  name: 'updateProgress',
  components: {
    'tl-confidence': confidenceSelect,
    'tl-process': process,
  },
  data() {
    return {
      CONST,
      dialogTitle: '更新进展', // 弹框标题
      dialogDetailVisible: false,
      updateexplain: '',
      formData: {},
      loading: false,
    };
  },
  props: {
    server: {
      type: Object,
      required: true,
    },
    okrForm: {
      type: Object,
    },
    dialogExist: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState('common', {
      undertakePeriodId: (state) => state.undertakePeriodId,
    }),
  },
  methods: {
    summitUpdate() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.summitForm = {
            detailId: this.formData.detailId,
            okrDetailConfidence: this.formData.okrDetailConfidence || null,
            okrDetailId: this.formData.okrDetailId,
            okrDetailProgress: this.formData.okrDetailProgress,
            okrMainId: this.formData.okrMainId,
            // TODO: 需要从vuex取
            periodId: this.undertakePeriodId,
            remark: this.formData.updateexplain,
          };
          this.loading = true;
          this.server.summitUpdate(this.summitForm).then((res) => {
            this.loading = false;
            if (res.code == 200) {
              this.$message('更新成功');
              this.close();
            }
          });
        }
      });
    },
    // 控制弹窗
    showOkrDialog() {
      this.dialogDetailVisible = true;
      if (this.okrForm) {
        this.formData = JSON.parse(JSON.stringify(this.okrForm));
      }
    },
    close() {
      this.dialogDetailVisible = false;
    },
    closed() {
      this.$emit('update:dialogExist', false);
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

<style>
</style>