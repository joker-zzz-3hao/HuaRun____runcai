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
      title="自定义任务过程"
    >
      <el-form ref="form" :model="addProcess">
        <el-form-item label="任务过程名称">
          <el-input placeholder="请输入任务标题" v-model="addProcess.name"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="display:flex;flex-direction: column;">
            <el-checkbox v-model="teamUser">
              团队申请
              <span>(组织下的成员可以使用)</span>
            </el-checkbox>
            <el-checkbox v-model="localUser">
              小范围使用
              <span>(组织下的成员不可使用，需要加入到该团队)</span>
            </el-checkbox>
            <span>添加成员</span>
            <i style="cursor:pointer" @click="addMember" class="el-icon-plus"></i>
            <el-checkbox v-model="personalUser">个人使用</el-checkbox>
          </div>
        </el-form-item>
      </el-form>
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
      teamUser: '',
      localUser: '',
      personalUser: '',
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
      addProcess: {},
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
    addMember() {
      debugger;
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>