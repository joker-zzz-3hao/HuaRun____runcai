<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible.sync="visible"
      :before-close="close"
      @closed="closed"
      title="确认指派"
      :close-on-click-modal="false"
    >
      <div></div>
      <el-form-item label="归属项目" prop="projectVal">
        <el-select v-model="formData.projectVal" placeholder="请选择归属项目">
          <el-option
            v-for="item in CONST.TASK_PROCESS_LIST"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="归属任务过程" prop="processVal">
        <el-select v-model="formData.processVal" placeholder="请选择任务过程">
          <el-option
            v-for="item in CONST.TASK_PROCESS_LIST"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="归属OKR" prop="okrVal">
        <el-select v-model="formData.okrVal" placeholder="请选择归属OKR">
          <el-option
            v-for="item in CONST.TASK_PROCESS_LIST"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指派执行人">
        <el-select v-model="formData.executor" filterable placeholder="请选择指派执行人">
          <el-option
            v-for="item in executorList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <!-- 头像 -->
            <span style="float: left">{{ item.label }}</span>
            <!-- 姓名 -->
            <span style="float: right">{{ item.value }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <div>
        <el-button @click="confirm">确认</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CONST from '../const';

export default {
  name: 'assignment',
  components: {
  },
  props: {

  },
  data() {
    return {
      CONST,
      formData: {},
      executorList: [],
      visible: false,
    };
  },
  created() {

  },
  mounted() {
    this.init();
  },
  computed: {

  },
  methods: {
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    closed() {
      this.$emit('update:existAssignment', false);
    },
  },
  watch: {
  },
  updated() {},
  beforeDestroy() {},
};
</script>