<!--
  功能：
  作者：王志任
  时间：2020年09月24日 13:57:15
  备注：
-->
<template>
  <div>
    <el-dialog
      :before-close="close"
      @closed="closed"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="visible"
      title="移动到..."
    >
      <div>
        <span>当前任务过程：</span>
        <span>{{}}</span>
      </div>
      <div>
        <span>当前任务过程节点</span>
        <span>{{}}</span>
      </div>
      <div>
        <span>移动任务过程节点</span>
        <el-select v-model="process">
          <el-option v-for="item in processList" :key="item.code"></el-option>
        </el-select>
      </div>
      <div class="operating-box">
        <el-button type="primary" class="tl-btn amt-bg-slip" :loading="loading" @click="move">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      visible: false,
      loading: false,

      process: 1,
      processList: [
        {
          code: '1',
          name: '待处理',
        },
        {
          code: '2',
          name: '处理中',
        },
        {
          code: '3',
          name: '已完成',
        },
      ],
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    close() {
      this.visible = false;
    },
    show() {
      this.visible = true;
    },
    closed() {
      this.$emit('update:showMove', false);
    },
    move() {

    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>