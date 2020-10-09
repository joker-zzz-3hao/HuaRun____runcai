<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      @close="close"
      :title="info.projectName"
      :close-on-click-modal="false"
    >
      <div v-for="item in info.list" :key="item.id">
        <div>
          <span>工作项:</span>
          <span>{{ item.workContent }}</span>
        </div>
        <div>
          <span>状态:</span>
          <span>{{ item.status }}%</span>
        </div>
        <div>
          <span>时间:</span>
          <span>{{ item.startDate }}至{{ item.endDate }}</span>
        </div>
        <div>
          <span>填报工时:</span>
          <span>投入{{ item.totalTime }}天</span>
        </div>
        <div>
          <span>确认工时:</span>
          <el-popover placement="top" width="160" v-model="item.visible">
            <el-input
              maxlength="64"
              v-model="item.times"
              class="tl-input-search"
            />
            <div style="text-align: right; margin: 0">
              <el-button type="primary" size="mini" @click="hideDom(item)"
                >确定</el-button
              >
            </div>
            <el-button slot="reference" @click="test(item)"
              >如需修改,请确认</el-button
            >
          </el-popover>
          <span v-if="item.remark">修改原因：{{ item.remark }}</span>
        </div>
        <div>
          <span>内容:</span>
          <span>{{ item.content }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="approval">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CONST from '../../const';

export default {
  name: 'approval',
  data() {
    return {
      CONST,
      visible: false,
      loading: false,
      info: {},
    };
  },
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
  computed: {},
  mounted() {},
  methods: {
    show(data) {
      this.info = data;
      this.info.list.forEach((item) => {
        item.visible = false;
      });
      this.visible = true;
    },
    approval() {},
    close() {
      this.visible = false;
    },
    test(data) {
      console.log(data);
    },
    hideDom(data) {
      this.info.list.forEach((item) => {
        if (item.id == data.id) {
          item.visible = false;
        }
      });
    },
  },
  watch: {},
};
</script>