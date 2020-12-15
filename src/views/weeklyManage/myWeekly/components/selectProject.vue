<template>
  <el-drawer
    :wrapperClosable="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    :before-close="close"
    @closed="closed"
    :visible.sync="visible"
    custom-class="custom-drawer supporting-values"
    class="tl-drawer"
  >
    <div slot="title" class="flex-sb">
      <div class="drawer-title">关联项目</div>
    </div>
    <el-scrollbar>
      <div class="cont-box">
        <dl class="dl-list">
          <dd>
            <el-radio-group v-model="selectData">
              <el-radio
                class="tl-radio"
                v-for="(project, index) in projectList"
                :label="project.projectId"
                :key="project.projectId"
                @click.native="projectChange($event, index, project)"
              >
                <em>{{ project.projectNameCn }}</em>
                <em v-if="project.projectManager"
                  > ( 项目经理：{{ project.projectManager }} )</em
                >
              </el-radio>
            </el-radio-group>
          </dd>
        </dl>
      </div>
    </el-scrollbar>
    <div class="operating-box">
      <el-button type="primary" class="tl-btn amt-bg-slip" @click="confirm"
        >确认</el-button
      >
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
  </el-drawer>
</template>

<script>
import mixin from '../mixin';

export default {
  name: '',
  mixins: [mixin],
  components: {},
  props: {
    currenItemRandomId: {
      type: String,
      default() {
        return '';
      },
    },
    selectedPro: {
      type: Object,
      default() {
        return {
          projectId: '',
          projectNameCn: '',
        };
      },
    },
  },
  data() {
    return {
      visible: false,
      selectData: '',
      selectProIndex: undefined,
      projectObj: {},
    };
  },
  created() { },
  mounted() { this.init(); },
  computed: {},
  methods: {
    init() {
      this.visible = true;
      this.projectObj = { ...this.selectedPro };
      this.selectData = this.selectedPro.projectId;
    },
    projectChange(e, index, project) {
      // 原生click会执行两次，第一次在label等，第二次在input
      if (e.target.tagName != 'INPUT') return;
      if (this.selectProIndex === index) {
        this.selectProIndex = undefined;
        this.selectData = '';
        this.projectObj = {
          projectId: '',
          projectNameCn: '',
        };
      } else {
        this.selectData = project.projectId;// 单选控制
        this.projectObj = {
          projectId: project.projectId,
          projectNameCn: project.projectNameCn,
        };
        this.selectProIndex = index;
      }
    },
    confirm() {
      this.$emit('closeProjectDialog', {
        projectObj: this.projectObj,
        currenItemRandomId: this.currenItemRandomId,
      });
      this.visible = false;
    },
    close() {
      this.visible = false;
    },
    closed() {
      this.$emit('update:showProject', false);
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
