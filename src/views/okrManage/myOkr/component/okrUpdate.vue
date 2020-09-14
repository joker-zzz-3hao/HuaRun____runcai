<template>
  <div>
    <el-drawer
      :title="drawerTitle"
      :visible.sync="myokrDrawer"
      :wrapperClosable="false"
      :append-to-body="true"
      :modal-append-to-body="true"
      custom-class="custom-drawer"
      class="tl-drawer"
      @closed="closed"
      :before-close="close"
    >
      <div slot="title" class="flex-sb">
        <div class="drawer-title">{{drawerTitle}}</div>
      </div>
      <el-scrollbar>
        <div class="okr-info">
          <div class="tl-custom-timeline">
            <el-form :model="formData" ref="dataForm" class="tl-form">
              <dl class="timeline-list">
                <dt>
                  <div class="list-info">
                    <div class="list-title">目标</div>
                    <div class="list-cont">{{formData.okrDetailObjectKr}}</div>
                    <div class="list-cont">
                      <el-form-item>
                        <el-slider
                          v-model="formData.okrDetailProgress"
                          show-input
                          :step="1"
                          @change="changeProgress(formData)"
                          style="width:300px"
                        ></el-slider>
                        <span>%</span>
                      </el-form-item>
                    </div>
                  </div>
                </dt>
                <dd v-for="(kitem, kindex) in formData.krList" :key="kindex">
                  <div class="list-info">
                    <div class="list-title">关键结果</div>
                    <div class="list-cont">{{kitem.okrDetailObjectKr}}</div>
                    <div class="list-cont">
                      <el-form-item label="当前进度">
                        <el-slider
                          v-model="kitem.okrDetailProgress"
                          show-input
                          :step="1"
                          @change="changeProgress(kitem)"
                          style="width:300px"
                        ></el-slider>
                        <span>%</span>
                      </el-form-item>
                      <el-form-item label="风险状态">
                        <tl-confidence v-model="kitem.okrDetailConfidence"></tl-confidence>
                      </el-form-item>
                    </div>
                  </div>
                </dd>
              </dl>
              <dl class="change-reason">
                <dt>更新说明</dt>
                <dd>
                  <el-form-item>
                    <el-input
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
      <div class="operating-box">
        <el-button type="primary" class="tl-btn amt-bg-slip" @click="summitUpdate">确定</el-button>
        <el-button plain class="tl-btn amt-border-fadeout" @click="close">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import confidenceSelect from '@/components/confidenceSelect';
import { mapMutations } from 'vuex';

export default {
  name: 'okrUpdate',
  components: {
    'tl-confidence': confidenceSelect,
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
        console.log('periodId', this.periodId);
      }
    },
    summitUpdate() {
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

      this.server.summitUpdate(this.summitForm).then((res) => {
        console.log('detail', res.code);
        if (res.code == 200) {
          this.$message('更新成功');
          this.$emit('success');
          this.close();
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