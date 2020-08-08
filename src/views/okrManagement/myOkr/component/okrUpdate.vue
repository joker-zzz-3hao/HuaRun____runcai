<template>
  <div>
    <el-form :model="formData" ref="dataForm">
      <dl class="okuang" v-for="(oitem,index) in formData.tableList" :key="oitem.detailId+index">
        <dt>目标名称</dt>
        <dd class="objectdd">
          <el-form-item>
            <span>{{oitem.okrDetailObjectKr}}</span>
          </el-form-item>
          <el-form-item label="权重">
            <span>{{oitem.okrDetailProgress}}</span>
          </el-form-item>
          <el-form-item label="当前进度">
            <el-slider v-model="oitem.okrDetailProgress" show-input :step="1"></el-slider>
          </el-form-item>
        </dd>
        <dd>
          <dl v-for="(kitem, kindex) in oitem.krInfoVoList" :key="kindex">
            <dt>关键结果{{kindex}}</dt>
            <dd class="objectdd">
              <el-form-item>
                <span>{{kitem.okrDetailObjectKr}}</span>
              </el-form-item>
              <el-form-item label="权重">
                <span>{{kitem.okrDetailProgress}}</span>
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
        <dd>
          <el-button @click="summitUpdate">更新</el-button>
        </dd>
      </dl>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'okrUpdate',
  data() {
    return {
      formData: {
        tableList: [], // okr列表
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
      this.$emit('closeDialog');
    },
  },
  watch: {
    okrid: {
      handler() {
        this.getokrDetail();
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style>
</style>