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
            <span>{{formData.okrDetailObjectKr}}</span>
          </el-form-item>
          <el-form-item label="权重">
            <span>{{formData.okrWeight}}</span>
          </el-form-item>
          <el-form-item label="当前进度">
            <el-slider v-model="formData.okrDetailProgress" show-input :step="1"></el-slider>
          </el-form-item>
        </dd>
        <dd>
          <dl v-for="(kitem, kindex) in formData.krList" :key="kindex">
            <dt>关键结果{{kindex+1}}</dt>
            <dd class="objectdd">
              <el-form-item>
                <span>{{kitem.okrDetailObjectKr}}</span>
              </el-form-item>
              <el-form-item label="权重">
                <span>{{kitem.okrWeight}}</span>
              </el-form-item>
              <el-form-item label="当前进度">
                <el-slider v-model="kitem.okrDetailProgress" show-input :step="1"></el-slider>
              </el-form-item>
              <el-form-item label="信心指数">
                <el-popover placement="right" width="400" trigger="click">
                  <el-radio-group v-model="kitem.okrDetailConfidence">
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
        </dd>
      </dl>
      <dl>
        <dd>
          <el-form-item label="更新说明">
            <el-input v-model="formData.updateexplain"></el-input>
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
  name: 'okrUpdate',
  data() {
    return {
      CONST,
      dialogTitle: '更新OKR', // 弹框标题
      dialogDetailVisible: false,
      formData: {
        updateexplain: '',

      },
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
  },
  methods: {
    getokrDetail() {
      if (this.okrItem) {
        this.formData = JSON.parse(JSON.stringify(this.okrItem));
      }
    },
    summitUpdate() {
      this.summitForm = {
        oupdateProcessDto: {
          detailId: this.formData.detailId,
          okrDetailProgress: this.formData.okrDetailProgress,
        },
        remark: this.formData.updateexplain,
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
          this.$message('提交成功~');
          this.close();
        }
      });

      // 需刷新列表吗
    },
    // 控制弹窗
    showOkrDialog() {
      this.dialogDetailVisible = true;
      this.getokrDetail();
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