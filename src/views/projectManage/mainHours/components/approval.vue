<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      @close="close"
      :title="info.projectNameCn"
      :close-on-click-modal="false"
    >
      <div v-for="item in info.weeklyItemList" :key="item.id">
        <div>
          <span>工作项:</span>
          <span>{{ item.workContent }}</span>
        </div>
        <div>
          <span>进度:</span>
          <tl-process :data="item.workProgress"></tl-process>
          <span>{{ item.workProgress }}%</span>
        </div>
        <div>
          <span>时间:</span>
          <span>{{ item.startTime }}至{{ item.endTime }}</span>
        </div>
        <div>
          <span>填报工时:</span>
          <span>投入{{ item.workTime }}天</span>
        </div>
        <div>
          <span>内容:</span>
          <span>{{ item.workDesc }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span>共投入工时{{ timeSheet }}天</span>
        <span v-if="remark">原因：{{ remark }}</span>
        <el-popover placement="top" width="160" v-model="popoverVisible">
          <el-input-number
            v-model="confirmSheet"
            :precision="1"
            :step="0.5"
            :min="0.5"
          ></el-input-number>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="editRemark"
          >
          </el-input>
          <div style="text-align: right; margin: 0">
            <!-- <el-button size="mini" type="text" @click="popoverVisible = false"
              >取消</el-button
            > -->
            <el-button type="primary" size="mini" @click="confirmTimeSheet"
              >确定</el-button
            >
          </div>
          <el-button slot="reference">点击修改</el-button>
        </el-popover>

        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="approval">提交</el-button>
      </span>
    </el-dialog>
  </div>
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