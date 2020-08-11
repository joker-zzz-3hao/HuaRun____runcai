<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogDetailVisible"
    width="50%"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
  >
    <el-form :model="formData" ref="dataForm">
      <dl class="okuang">
        <dt>目标名称</dt>
        <dd class="objectdd">
          <el-form-item>
            <span>{{okrForm.okrDetailObjectKr}}</span>
          </el-form-item>
          <el-form-item label="权重">
            <span>{{okrForm.okrWeight}}</span>
          </el-form-item>
          <el-form-item label="当前进度">
            <el-slider v-model="okrForm.okrDetailProgress" show-input :step="1"></el-slider>
          </el-form-item>
          <el-form-item label="信心指数">
            <el-popover placement="right" width="400" trigger="click">
              <el-radio-group v-model="okrForm.okrDetailConfidence">
                <el-radio-button
                  v-for="citem in CONST.CONFIDENCE"
                  :key="citem.value"
                  :label="citem.value"
                >{{citem.label}}</el-radio-button>
              </el-radio-group>
              <el-button slot="reference">信息状态</el-button>
            </el-popover>
          </el-form-item>
        </dd>
      </dl>
      <dl>
        <dd>
          <el-form-item label="更新说明">
            <el-input v-model="updateexplain"></el-input>
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
import CONST from '../const';

export default {
  name: 'updateProgress',
  data() {
    return {
      CONST,
      dialogTitle: '更新OKR', // 弹框标题
      dialogDetailVisible: false,
      updateexplain: '',
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
  methods: {
    getokrDetail() {
      this.server.getokrDetail({ okrId: '111111222' }).then((res) => {
        console.log('detail', res);
        this.formData.tableList = res.data.okrDetails;
      });
    },
    summitUpdate() {
      this.$message('提交成功~');
      this.close();
      // 需刷新列表吗
    },
    // 控制弹窗
    showOkrDialog() {
      this.dialogDetailVisible = true;
      // this.getokrDetail();
    },
    close() {
      this.dialogDetailVisible = false;
    },
    closed() {
      this.$emit('update:dialogExist', false);
    },
  },
  watch: {
    // okrid: {
    //   handler() {
    //     this.getokrDetail();
    //   },
    //   deep: true,
    //   immediate: true,
    // },
  },
};
</script>

<style>
</style>