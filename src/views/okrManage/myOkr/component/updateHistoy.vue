<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    :before-close="close"
    @closed="closed"
    class="tl-dialog check-judge"
    width="600px"
  >
    <div slot="title" class="check-title">更新记录</div>
    <div class="tl-custom-timeline">
      <dl class="timeline-list" v-if="historyList.length">
        <dd v-for="activity in historyList" :key="activity.id">
          <div class="list-info">
            <div class="list-title">{{ activity.createTime }}</div>
            <div class="list-cont">
              <div class="operate-type">
                <em>{{ activity.userName }}</em>
                <span>更新</span>
              </div>
              <ul class="operate-kind">
                <li>
                  <div>
                    <span>关键结果</span>
                    <em>{{ krName }}</em>
                  </div>
                  <div>
                    <span>进度由</span>
                    <em>{{ activity.updateContents.beforeProgress }}</em>
                    <span>%</span>
                    <span>更新为</span>
                    <em>{{ activity.updateContents.afterProgress }}</em>
                    <span>%</span>
                  </div>
                  <div>
                    <span>信心指数修改为</span>
                    <!-- <em>{{ activity.updateContents.afterProgress }}</em> -->
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </dd>
      </dl>
    </div>
  </el-dialog>
</template>

<script>

import Server from '../server';

const server = new Server();

export default {
  name: 'updateHistoy',
  props: {
    okrDetailId: {
      type: String,
      required: true,
    },
    krName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      server,
      dialogVisible: false,
      historyList: [],
    };
  },
  methods: {
    show() {
      this.dialogVisible = true;
      this.getHistory();
    },
    closed() {
      this.$emit('update:exist', false);
    },
    close() {
      this.dialogVisible = false;
    },
    getHistory() {
      const params = {
        currentPage: 1,
        okrDetailId: this.okrDetailId,
        pageSize: 10,
      };
      this.server.getOkrUpdateHistory(params).then((res) => {
        if (res.code == 200) {
          if (res.data) {
            this.historyList = res.data;
            this.historyList.forEach((item) => {
              const content = JSON.parse(item.content);
              item.updateContents = content || {};
            });
          }
        }
      });
    },
  },
};
</script>

<style>
</style>