<!--
  功能：
  作者：王志任
  时间：2020年12月02日 15:22:31
  备注：
-->
<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @close="close"
    :title="title"
    :close-on-click-modal="false"
  >
    <div v-show="step == 1">
      <el-form ref="dicForm" :model="performanceData" label-width="90px">
        <el-form-item label="自定义名称" prop="ruleName">
          <el-input
            v-model.trim="performanceData.ruleName"
            maxlength="30"
            placeholder="请填写名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="自定义体系" prop="ruleName">
          <div
            v-for="(ruleItem, index) in performanceData.ruleDetailList"
            v-show="ruleItem.status != '1'"
            :key="ruleItem.detailRandomId"
          >
            <el-input v-model.trim="ruleItem.value" maxlength="30"></el-input>
            <el-input
              v-model.trim="ruleItem.unit"
              placeholder="如有单位，请填写"
            ></el-input>
            说明
            <el-input
              v-model="ruleItem.description"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 8 }"
              class="tl-textarea"
              placeholder="请填写说明"
              maxlength="500"
            ></el-input>
            <el-button
              type="text"
              v-show="performanceData.ruleDetailList.length - 1 == index"
              @click="addRuleItem(performanceData)"
              >添加</el-button
            >
            <el-button
              type="text"
              @click="
                performanceData.ruleDetailList.length > 1
                  ? deleteRuleItem(ruleItem)
                  : ''
              "
              >删除</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="step == 2">
      <dl>
        <dt>{{ performanceData.ruleName }}</dt>
        <dd
          v-for="ruleItem in performanceData.ruleDetailList"
          :key="ruleItem.detailRandomId"
        >
          <span>{{ ruleItem.value }}</span>
          <span>{{ ruleItem.unit }}</span>
          说明
          <span>{{ ruleItem.description }}</span>
        </dd>
      </dl>
    </div>
    <div class="operating-box">
      <el-button
        :loading="loading"
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="addEvaluate"
        >确认</el-button
      >
      <el-button
        :disabled="loading"
        plain
        class="tl-btn amt-border-fadeout"
        @click="cancel"
        >取消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'addOrEditEvaluate',
  components: {},
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
    // rowData: {
    //   type: Object,
    //   default() {
    //     return {};
    //   },
    // },
    // optionType: {
    //   type: String,
    //   default() {
    //     return 'add';
    //   },
    // },
  },
  data() {
    return {
      visible: false,
      loading: false,
      step: '1',
      performanceData: {},
      title: '设置绩效评定体系',
    };
  },
  created() { },
  mounted() {},
  computed: {},
  methods: {
    addRuleItem() {
      this.performanceData.ruleDetailList.push({
        unit: '',
        value: '',
        description: '',
        detailRandomId: this.getRandomId(),
      });
    },
    deleteRuleItem(ruleItem) {
      // 编辑时删除的数据需要传给后端
      if (ruleItem.ruleDetailId) {
        this.performanceData.ruleDetailList.forEach((detail) => {
          if (detail.detailRandomId == ruleItem.detailRandomId) {
            detail.status = '1';
          }
        });
      }
      // this.performanceData.ruleDetailList = this.performanceData.ruleDetailList.filter((detail) => detail.detailRandomId != ruleItem.detailRandomId);
    },
    addEvaluate() {
      if (this.step == 1) {
        this.title = '确认后部门将按照以下规则进行配置！';
        this.step = 2;
      } else {
        this.loading = true;
        let requestName = 'addEvaluate';
        if (this.performanceData.ruleId) {
          requestName = 'updateEvaluate';
        }
        // 添加level字段
        for (let i = 0; i < this.performanceData.ruleDetailList.length; i += 1) {
          this.performanceData.ruleDetailList[i].level = i + 1;
        }
        const params = [this.performanceData];
        this.server[requestName](params).then((res) => {
          this.loading = false;
          if (res.code == 200) {
            this.$message.success('成功');
            this.$emit('refreshPage');
            this.close();
          }
        });
      }
    },
    show(rowData) {
      if (rowData && rowData.ruleId) {
        this.performanceData = { ...rowData };
        this.performanceData.ruleDetailList.forEach((detail) => {
          detail.detailRandomId = this.getRandomId();
        });
      } else {
        this.performanceData = {
          ruleName: '',
          ruleDetailList: [{
            status: '0',
            unit: '',
            value: '',
            description: '',
            detailRandomId: this.getRandomId(),
          }],
        };
      }
      this.$nextTick(() => {
        this.visible = true;
      });
    },
    cancel() {
      if (this.step == 1) {
        this.close();
      } else {
        this.step = 1;
        this.title = '设置绩效评定体系';
      }
    },
    close() {
      this.visible = false;
      this.$emit('update:showDialog', false);
    },

  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>