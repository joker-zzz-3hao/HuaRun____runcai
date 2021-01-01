<!--
  功能：
  作者：王志任
  时间：2020年08月04日 15:38:15
  备注：
-->
<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      @close="close"
      :title="diaTitle"
      :close-on-click-modal="false"
      width="30%"
    >
      <div>
        <el-form ref="dicForm" :model="formData" label-width="120px">
          <el-form-item
            label="租户群组名称"
            :rules="[{ required: true, message: '请填写群组名称' }]"
          >
            <el-input v-model="formData.groupName"></el-input
          ></el-form-item>
        </el-form>
        <div class="operating-box">
          <el-button
            :loading="loading"
            type="primary"
            class="tl-btn amt-bg-slip"
            @click="save"
            >确认</el-button
          >
          <el-button
            :disabled="loading"
            plain
            class="tl-btn amt-border-fadeout"
            @click="cancel"
            >取消</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'createdic',
  components: {
  },
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
      diaTitle: '',
      formData: {

        groupName: '',
      },
      optionType: 'add',
    };
  },
  created() {
  },
  mounted() {},
  computed: {},
  methods: {
    show(group) {
      if (group) {
        this.diaTitle = '编辑租户群组';
        this.optionType = 'edit';
      } else {
        this.diaTitle = '添加租户群组';
        this.optionType = 'add';
      }
      this.visible = true;
    },
    close(status) {
      this.visible = false;
      this.$emit('closeAddEditDialog', { refreshPage: status == 'refreshPage' });
    },
    save() {
      let successTip = '新增成功';
      if (this.optionType == 'edit') {
        successTip = '编辑成功';
      }
      this.$refs.dataForm.validat((valid) => {
        if (valid) {
          this.loading = true;
          this.server.addOrUpdate(this.formData).then((res) => {
            if (res.code == 200) {
              this.$message.success(successTip);
              this.close('refreshPage');
            }
            this.loading = false;
          });
        }
      });
    },
    cancel() {
      this.close();
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>