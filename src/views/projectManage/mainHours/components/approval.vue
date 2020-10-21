<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @close="close"
    :before-close="close"
    :title="info.projectNameCn"
    :close-on-click-modal="false"
    custom-class="approval"
    class="tl-dialog"
    width="620px"
  >
    <el-scrollbar>
      <div class="dl-list" v-for="item in info.weeklyItemList" :key="item.id">
        <dl class="dl-item">
          <dt><span>工作项</span></dt>
          <dd>
            {{ item.workContent }}
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>进度</span></dt>
          <dd>
            <tl-process :data="item.workProgress"></tl-process>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>时间</span></dt>
          <dd>
            <em>{{ item.startTime }}</em
            ><span>至</span><em>{{ item.endTime }}</em>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>填报工时</span></dt>
          <dd>
            <span>投入</span><em>{{ item.workTime }}</em
            ><span>天</span>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>内容</span></dt>
          <dd>
            <em>{{ item.workDesc }}</em>
          </dd>
        </dl>
      </div>
    </el-scrollbar>
    <div slot="footer" class="dialog-footer flex-sb">
      <div class="dialog-footer-l">
        <div>
          <span>共投入工时</span> <em>{{ timeSheet }}</em
          ><span>天</span>
          <el-popover
            placement="top"
            width="300"
            v-model="popoverVisible"
            popper-class="approval-pop"
          >
            <el-button plain slot="reference" class="tl-btn btn-lineheight"
              >点击修改</el-button
            >
            <el-input-number
              v-model="confirmSheet"
              controls-position="right"
              :precision="1"
              :step="0.5"
              :min="0.5"
              class="tl-input-number"
            ></el-input-number>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="editRemark"
              class="tl-textarea"
            >
            </el-input>
            <div class="flex-end">
              <el-button
                type="primary"
                class="tl-btn amt-bg-slip"
                @click="confirmTimeSheet"
                >确定</el-button
              >
            </div>
          </el-popover>
        </div>
        <div v-if="remark">
          <span>修改原因</span><em>{{ remark }}</em>
        </div>
      </div>
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
      <el-button type="primary" class="tl-btn amt-bg-slip" @click="approval"
        >提交</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import process from '@/components/process';
import CONST from '../../const';

export default {
  name: 'approval',
  data() {
    return {
      CONST,
      visible: false,
      popoverVisible: false,
      loading: false,
      timeSheet: 0.5,
      confirmSheet: 0.5,
      info: {},
      remark: '',
      editRemark: '',
    };
  },
  components: {
    'tl-process': process,
  },
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {},
  mounted() {},
  methods: {
    show(data) {
      this.server.approvalTimeSheetList({
        projectApprovalId: data.projectApprovalId,
      }).then((res) => {
        if (res.code == '200') {
          console.log(res);
          this.info = res.data;
          this.timeSheet = this.info.timeSheet;
        }
      });
      this.visible = true;
    },
    confirmTimeSheet() {
      this.popoverVisible = false;
      this.timeSheet = this.confirmSheet;
      this.remark = this.editRemark;
    },
    approval() {
      this.$xconfirm({
        title: '工时确认后将不可再更改，请确认',
        content: '',
      }).then(() => {
        this.server.approvaledTimeSheetList({
          projectId: this.info.projectId,
          timeSheet: this.timeSheet,
          remark: this.remark,
          sourceId: this.info.sourceId,
          sourceType: this.info.sourceType,
          projectApprovalId: this.info.projectApprovalId,
        }).then((res) => {
          if (res.code == '200') {
            this.$emit('success');
            this.close();
          }
        });
      });
    },
    close() {
      this.visible = false;
    },
  },
  watch: {},
};
</script>