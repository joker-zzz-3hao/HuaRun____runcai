<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogDetailVisible"
    width="50%"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
  >
    <el-form :model="okrForm" ref="dataForm">
      <dl class="okuang">
        <dt>{{okrForm.okrDetailType === 0 ? '目标名称' : '关键结果'}}</dt>
        <dd class="objectdd">
          <el-form-item>
            <span>{{okrForm.okrDetailObjectKr}}</span>
          </el-form-item>
          <el-form-item label="权重">
            <span>{{okrForm.okrWeight}}</span>
          </el-form-item>
          <el-form-item label="当前进度">
            <el-slider
              v-model="okrForm.okrDetailProgress"
              show-input
              :step="1"
              @change="changeProgress(okrForm)"
            ></el-slider>
          </el-form-item>
          <el-form-item label="风险状态" v-if="okrForm.okrDetailConfidence">
            <el-popover placement="right" width="400" trigger="click" :append-to-body="false">
              <el-radio-group v-model="okrForm.okrDetailConfidence">
                <el-radio-button
                  v-for="citem in CONST.CONFIDENCE"
                  :key="citem.value"
                  :label="citem.value"
                >{{citem.label}}</el-radio-button>
              </el-radio-group>
              <el-button slot="reference">{{CONST.CONFIDENCE_MAP[okrForm.okrDetailConfidence||'1']}}</el-button>
            </el-popover>
          </el-form-item>
        </dd>
      </dl>
      <dl>
        <dd>
          <el-form-item label="更新说明">
            <el-input maxlength="200" v-model="okrForm.updateexplain"></el-input>
          </el-form-item>
        </dd>
      </dl>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="summitUpdate">更新</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import CONST from '../const';

export default {
  name: 'updateProgress',
  data() {
    return {
      CONST,
      dialogTitle: '更新OKR', // 弹框标题
      dialogDetailVisible: false,
      updateexplain: '',
      formData: {},
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
      console.log('this.okrForm', this.okrForm);
      this.summitForm = {
        detailId: this.okrForm.detailId,
        okrDetailConfidence: this.okrForm.okrDetailConfidence || null,
        okrDetailId: this.okrForm.okrDetailId,
        okrDetailProgress: this.okrForm.okrDetailProgress,
        okrMainId: this.okrForm.okrMainId,
        // TODO: 需要从vuex取
        periodId: this.undertakePeriodId,
        remark: this.okrForm.updateexplain,
      };
      console.log('detail', this.summitForm);
      this.server.summitUpdate(this.summitForm).then((res) => {
        console.log('detail', res.code);
        this.$message('提交成功~');
        this.close();
      });

      // 需刷新列表吗
    },
    // 控制弹窗
    showOkrDialog() {
      console.log('dakai ');
      this.dialogDetailVisible = true;
      // this.getokrDetail();
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