<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @close="close"
    :before-close="close"
    :title="info.projectNameCn"
    :close-on-click-modal="false"
    custom-class="approval-detail"
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
            <em>{{ info.startTime }}</em
            ><span>至</span><em>{{ info.endTime }}</em>
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
          <span>确认工时</span> <em>{{ info.timeSheet }}</em
          ><span>天</span>
        </div>
        <div>
          <span>原因</span><em>{{ info.remark }}</em>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import process from '@/components/process';
import CONST from '../../const';

export default {
  name: 'approvalDetail',
  data() {
    return {
      CONST,
      visible: false,
      loading: false,
      timeSheet: 0,
      info: {},
      remark: '',
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
    close() {
      this.visible = false;
    },
  },
  watch: {},
};
</script>