<template>
  <el-drawer
    :modal="false"
    :wrapperClosable="false"
    :append-to-body="true"
    class="tl-drawer"
    custom-class="custom-drawer history-version"
    :visible.sync="historDrawer"
    @closed="closed"
    :before-close="close"
  >
    <div slot="title" class="flex-sb">
      <div class="drawer-title">历史版本</div>
    </div>
    <el-scrollbar>
      <div class="cont-box">
        <dl class="dl-list">
          <dt class="list-title">
            <em>{{okrmain.orgName}}{{okrmain.periodName}}</em>
          </dt>
          <dd
            v-for="(item) in historyOKRList"
            :key="item.okrDetailId"
            class="tag-kind"
            :class="{'has-reason': item.remark}"
          >
            <span v-if="item.okrDetailType == 0" class="kind-parent">目标</span>
            <span v-else class="kind-child">KR</span>
            <em>{{item.versionName}}</em>
            <div>
              <p>{{item.objectName}}</p>
              <p v-if="item.okrWeight">
                <span>分权重</span>
                <em>{{item.okrWeight}}%</em>
              </p>
              <p v-if="item.okrDetailType == 0">
                <span>关联父目标</span>
                <em>{{item.okrDetailParentObjectKr}}</em>
              </p>
              <p v-if="item.okrDetailType == 1">
                <span>考核指标</span>
                <em>{{item.checkQuota}}</em>
              </p>
              <p v-if="item.okrDetailType == 1">
                <span>衡量办法</span>
                <em>{{item.judgeMethod}}</em>
              </p>
              <p v-if="item.remark">变更原因：{{item.remark}}</p>
            </div>
          </dd>
        </dl>
      </div>
    </el-scrollbar>
  </el-drawer>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'okrHistory',
  props: {
    server: {
      type: Object,
      required: true,
    },
    okrId: {
      type: String,
      defualt: '',
    },
    okrDetailId: {
      type: String,
      defualt: '',
    },
    okrmain: {
      type: Object,
      defualt() {
        return {};
      },
    },

  },
  data() {
    return {
      historyOKRList: [], // 历史版本okr
      dialogTitle: '历史版本', // 弹框标题
      oldOKRList: [],
      historDrawer: false,
    };
  },
  created() {
  },
  methods: {
    ...mapMutations('common', ['setMyokrDrawer']),
    show() {
      this.historDrawer = true;
      this.searchOkr();
    },
    closed() {
      this.$emit('update:exist', false);
    },
    close() {
      this.historDrawer = false;
    },
    searchOkr() {
      this.server.selectOkrHistoryVersion({ okrDetailId: this.okrDetailId }).then((res) => {
        if (res.code == 200) {
          this.oldOKRList = res.data;
          this.oldOKRList.forEach((oitem) => {
            this.historyOKRList.push({
              okrDetailType: oitem.okrDetailType,
              objectName: oitem.okrDetailObjectKr,
              guanlianId: oitem.detailId,
              checkFlag: false,
              version: oitem.okrDetailVersion,
              versionName: oitem.isTrue === 1 ? '「最新版本」' : `「历史版本${oitem.okrDetailVersion}」`,
              isTrue: oitem.isTrue, // 是否为最新版本
              okrWeight: oitem.okrWeight, // 权重
              okrDetailParentObjectKr: oitem.okrDetailParentObjectKr || '暂无', // 承接的okr
              okrDetailParentVersion: oitem.okrDetailParentVersion, // 承接的版本
              remark: oitem.remark,
              checkQuota: oitem.checkQuota || '暂无',
              judgeMethod: oitem.judgeMethod || '暂无',
            });
          });
        }
      });
    },
  },
  watch: {
  },
};
</script>

<style>
</style>